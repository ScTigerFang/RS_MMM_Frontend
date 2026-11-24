import { act, renderHook } from "@testing-library/react";
import axios from "axios";
import { apiBaseUrl } from "../config/api";
import { OwnerAuthProvider, useOwnerAuth } from "./OwnerAuthContext";

jest.mock("axios", () => ({ get: jest.fn() }));

function renderAuth(clientId = "test-client.apps.googleusercontent.com") {
  return renderHook(() => useOwnerAuth(), {
    wrapper: ({ children }) => (
      <OwnerAuthProvider clientId={clientId}>{children}</OwnerAuthProvider>
    ),
  });
}

function verifiedSession(seconds = 60) {
  return { data: { canEdit: true, expiresAt: Math.floor(Date.now() / 1000) + seconds } };
}

beforeEach(() => {
  jest.clearAllMocks();
  localStorage.clear();
  sessionStorage.clear();
  delete window.google;
});

afterEach(() => {
  jest.useRealTimers();
});

test("editing stays locked until the API verifies the owner", async () => {
  let resolveSession;
  axios.get.mockImplementation(() => new Promise((resolve) => { resolveSession = resolve; }));
  const { result } = renderAuth();
  let pending;

  expect(result.current.canEdit).toBe(false);
  expect(() => result.current.getRequestConfig()).toThrow(/sign in as the owner/i);
  act(() => { pending = result.current.signIn("google-credential"); });
  expect(result.current.isChecking).toBe(true);
  expect(result.current.canEdit).toBe(false);
  expect(result.current.token).toBeNull();
  expect(axios.get).toHaveBeenCalledWith(`${apiBaseUrl}/auth/session`, {
    headers: { Authorization: "Bearer google-credential" },
  });

  await act(async () => {
    resolveSession(verifiedSession());
    await pending;
  });

  expect(result.current.canEdit).toBe(true);
  expect(result.current.isChecking).toBe(false);
  expect(result.current.getRequestConfig()).toEqual({
    headers: { Authorization: "Bearer google-credential" },
  });
  expect(localStorage.length).toBe(0);
  expect(sessionStorage.length).toBe(0);
});

test.each([401, 403, 500])("an API %s keeps editing locked", async (status) => {
  axios.get.mockRejectedValue({ response: { status } });
  const { result } = renderAuth();
  await act(async () => { await result.current.signIn("unapproved-credential"); });
  expect(result.current.canEdit).toBe(false);
  expect(result.current.token).toBeNull();
  expect(result.current.isChecking).toBe(false);
  expect(result.current.error).not.toBe("");
  expect(() => result.current.getRequestConfig()).toThrow();
});

test.each([
  { canEdit: false, expiresAt: 9999999999 },
  { canEdit: true },
  { canEdit: true, expiresAt: 1 },
])("invalid session responses never grant editing: %j", async (data) => {
  axios.get.mockResolvedValue({ data });
  const { result } = renderAuth();
  await act(async () => { await result.current.signIn("credential"); });
  expect(result.current.canEdit).toBe(false);
  expect(result.current.token).toBeNull();
  expect(() => result.current.getRequestConfig()).toThrow();
});

test("missing client configuration fails closed without contacting the API", async () => {
  const { result } = renderAuth("");
  await act(async () => { await result.current.signIn("credential"); });
  expect(result.current.isConfigured).toBe(false);
  expect(result.current.canEdit).toBe(false);
  expect(axios.get).not.toHaveBeenCalled();
});

test("sign-out immediately invalidates request access and ignores a pending sign-in", async () => {
  let resolveSession;
  axios.get.mockResolvedValueOnce(verifiedSession());
  axios.get.mockImplementationOnce(() => new Promise((resolve) => { resolveSession = resolve; }));
  window.google = { accounts: { id: { disableAutoSelect: jest.fn() } } };
  const { result } = renderAuth();
  await act(async () => { await result.current.signIn("first-credential"); });
  const getRequestConfig = result.current.getRequestConfig;
  expect(getRequestConfig()).toBeDefined();

  let pending;
  act(() => { pending = result.current.signIn("second-credential"); });
  act(() => { result.current.signOut(); });
  expect(() => getRequestConfig()).toThrow();
  await act(async () => {
    resolveSession(verifiedSession());
    await pending;
  });
  expect(result.current.canEdit).toBe(false);
  expect(result.current.token).toBeNull();
  expect(window.google.accounts.id.disableAutoSelect).toHaveBeenCalled();
});

test("a previous account's delayed response cannot override a newer denied sign-in", async () => {
  let resolvePrevious;
  axios.get.mockImplementationOnce(() => new Promise((resolve) => { resolvePrevious = resolve; }));
  axios.get.mockRejectedValueOnce({ response: { status: 403 } });
  const { result } = renderAuth();
  let previous;
  act(() => { previous = result.current.signIn("previous-account"); });
  await act(async () => { await result.current.signIn("new-account"); });
  await act(async () => {
    resolvePrevious(verifiedSession());
    await previous;
  });
  expect(result.current.canEdit).toBe(false);
  expect(result.current.error).toMatch(/does not have editing access/i);
});

test("expired sessions lose edit controls and old request callbacks cannot send the token", async () => {
  jest.useFakeTimers();
  axios.get.mockResolvedValue(verifiedSession(10));
  const { result } = renderAuth();
  await act(async () => { await result.current.signIn("short-lived-credential"); });
  const getRequestConfig = result.current.getRequestConfig;
  expect(result.current.canEdit).toBe(true);
  act(() => { jest.advanceTimersByTime(11000); });
  expect(result.current.canEdit).toBe(false);
  expect(result.current.token).toBeNull();
  expect(result.current.error).toMatch(/expired/i);
  expect(() => getRequestConfig()).toThrow();
});

test("server revocation immediately removes editing access", async () => {
  axios.get.mockResolvedValue(verifiedSession());
  const { result } = renderAuth();
  await act(async () => { await result.current.signIn("credential"); });
  act(() => { result.current.invalidateSession("Editing access is no longer available."); });
  expect(result.current.canEdit).toBe(false);
  expect(result.current.error).toMatch(/no longer available/i);
  expect(() => result.current.getRequestConfig()).toThrow();
});
