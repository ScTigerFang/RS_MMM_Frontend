import { StrictMode } from "react";
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import GoogleSignInButton from "./GoogleSignInButton";
import { useOwnerAuth } from "./OwnerAuthContext";

jest.mock("./OwnerAuthContext", () => ({ useOwnerAuth: jest.fn() }));

const scriptSelector = 'script[src="https://accounts.google.com/gsi/client"]';

beforeEach(() => {
  jest.clearAllMocks();
  delete window.google;
  useOwnerAuth.mockReturnValue({
    clientId: "test-client.apps.googleusercontent.com",
    isConfigured: true,
    signIn: jest.fn(),
  });
});

afterEach(() => {
  document.querySelectorAll(scriptSelector).forEach((script) => script.remove());
  delete window.google;
});

test("missing configuration does not load Google or show a broken button", () => {
  useOwnerAuth.mockReturnValue({ isConfigured: false });
  const { container } = render(<GoogleSignInButton />);
  expect(container).toBeEmptyDOMElement();
  expect(document.querySelector(scriptSelector)).toBeNull();
});

test("the Google callback verifies the credential and is ignored after unmount", async () => {
  const identity = { initialize: jest.fn(), renderButton: jest.fn(), prompt: jest.fn() };
  window.google = { accounts: { id: identity } };
  const signIn = useOwnerAuth().signIn;
  const { unmount } = render(
    <StrictMode><GoogleSignInButton /></StrictMode>,
  );
  await waitFor(() => expect(identity.renderButton).toHaveBeenCalledTimes(1));
  const options = identity.initialize.mock.calls[0][0];
  expect(options.client_id).toBe("test-client.apps.googleusercontent.com");
  expect(options.auto_select).toBe(false);
  expect(identity.prompt).not.toHaveBeenCalled();

  act(() => options.callback({ credential: "google-credential" }));
  expect(signIn).toHaveBeenCalledWith("google-credential");
  unmount();
  act(() => options.callback({ credential: "stale-credential" }));
  expect(signIn).toHaveBeenCalledTimes(1);
});

test("a blocked Google script shows a retry without granting access", async () => {
  render(<GoogleSignInButton />);
  const firstScript = document.querySelector(scriptSelector);
  expect(firstScript).not.toBeNull();
  fireEvent.error(firstScript);
  expect(await screen.findByRole("alert")).toHaveTextContent("couldn't load");
  fireEvent.click(screen.getByRole("button", { name: "Retry sign-in" }));
  const retryScript = document.querySelector(scriptSelector);
  expect(retryScript).not.toBeNull();
  expect(retryScript).not.toBe(firstScript);
  fireEvent.error(retryScript);
  await screen.findByRole("alert");
  expect(useOwnerAuth().signIn).not.toHaveBeenCalled();
});
