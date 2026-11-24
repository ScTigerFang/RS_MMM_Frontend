import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import axios from "axios";
import { readFileSync } from "fs";
import { join } from "path";
import App from "./App";
import { resumeRequestHref } from "./config/contact";

jest.mock("axios", () => ({ get: jest.fn(), post: jest.fn(), put: jest.fn() }));

const originalClientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
let googleCredentialCallback;

async function signInAsOwner() {
  userEvent.click(screen.getByRole("button", { name: "Owner sign in" }));
  userEvent.click(await screen.findByRole("button", { name: "Sign in with Google" }));
  await screen.findByText("Owner editing enabled");
}

const userEvent = {
  click: fireEvent.click,
  clear: (element) => fireEvent.change(element, { target: { value: "" } }),
  selectOptions: (element, value) =>
    fireEvent.change(element, { target: { value } }),
  type: (element, text) => {
    fireEvent.change(element, {
      target: { value: element.value + text.replace("{enter}", "") },
    });
    if (text.includes("{enter}"))
      fireEvent.keyDown(element, { key: "Enter", code: "Enter" });
  },
};

const intensities = [
  {
    intensityId: 1,
    shortDescription: "Super AFK",
    longDescription: "Low attention",
  },
  {
    intensityId: 4,
    shortDescription: "Focused",
    longDescription: "Active play",
  },
];
const methods = [
  {
    methodId: "dragon",
    method: "Dragon hunting",
    hourlyProfit: 12000000,
    skillOrArea: "Bossing",
    intensity: 4,
    notes: "Bring supplies",
    videoLink: "https://example.com/guide",
    createdDatetime: "2025-04-01T00:00:00",
  },
  {
    methodId: "herbs",
    method: "Herb farming",
    hourlyProfit: 4000000,
    skillOrArea: "Skilling/Farming",
    intensity: 1,
    notes: "Check your patches",
    videoLink: "EDIT LATER",
    createdDatetime: "2025-03-01T00:00:00",
  },
];

function renderSite() {
  const root = document.createElement("div");
  root.id = "root";
  document.body.appendChild(root);
  return render(<App />, { container: root });
}

beforeEach(() => {
  jest.clearAllMocks();
  localStorage.clear();
  window.history.replaceState({}, "", "/");
  window.scrollTo = jest.fn();
  window.print = jest.fn();
  process.env.REACT_APP_GOOGLE_CLIENT_ID = "test-client.apps.googleusercontent.com";
  window.google = {
    accounts: {
      id: {
        initialize: jest.fn(({ callback }) => { googleCredentialCallback = callback; }),
        renderButton: jest.fn((container) => {
          const button = document.createElement("button");
          button.textContent = "Sign in with Google";
          button.onclick = () => googleCredentialCallback({ credential: "owner-token" });
          container.replaceChildren(button);
        }),
        disableAutoSelect: jest.fn(),
      },
    },
  };
  axios.get.mockImplementation((url) =>
    Promise.resolve({
      data: url.endsWith("/auth/session")
        ? { canEdit: true, expiresAt: Math.floor(Date.now() / 1000) + 3600 }
        : url.endsWith("/Intensity") ? intensities : methods,
    }),
  );
  axios.post.mockResolvedValue({ data: {} });
  axios.put.mockResolvedValue({});
  jest.spyOn(console, "log").mockImplementation(() => {});
});

afterEach(() => {
  jest.restoreAllMocks();
  delete window.google;
  if (originalClientId === undefined) delete process.env.REACT_APP_GOOGLE_CLIENT_ID;
  else process.env.REACT_APP_GOOGLE_CLIENT_ID = originalClientId;
});

test("loading waits for methods and intensity data before enabling the table", async () => {
  let resolveMethods;
  let resolveIntensities;
  axios.get.mockImplementation(
    (url) =>
      new Promise((resolve) => {
        if (url.endsWith("/Intensity")) resolveIntensities = resolve;
        else resolveMethods = resolve;
      }),
  );
  window.history.replaceState({}, "", "/rs_MMM");
  renderSite();
  expect(screen.getByRole("status")).toHaveTextContent("Loading methods");
  expect(screen.queryByRole("button", { name: "Add method" })).not.toBeInTheDocument();
  await act(async () => resolveMethods({ data: methods }));
  expect(screen.getByRole("status")).toHaveTextContent("Loading methods");
  await act(async () => resolveIntensities({ data: intensities }));
  await screen.findByRole("searchbox", { name: "Filter Method" });
  expect(screen.queryByText("Loading methods…")).not.toBeInTheDocument();
  expect(screen.queryByRole("button", { name: "Add method" })).not.toBeInTheDocument();
});

function expectNoPublicResume() {
  expect(
    screen.queryByRole("heading", {
      name: /^(education|experience|professional overview)$/i,
    }),
  ).not.toBeInTheDocument();
  expect(
    screen.queryByRole("button", { name: /print|save PDF/i }),
  ).not.toBeInTheDocument();
  expect(
    document.querySelector(
      'article[aria-label*="resume"], a[href^="/resume"], a[href^="tel:"], a[href*="linkedin.com"], a[download]',
    ),
  ).not.toBeInTheDocument();
}

test("home offers email requests without publishing the resume", () => {
  renderSite();
  expect(
    screen.getByRole("heading", { name: /developer by trade/i }),
  ).toBeInTheDocument();
  expect(screen.getByRole("link", { name: "TigerFang, home" })).toHaveTextContent(
    /^TigerFang$/,
  );
  const requestLinks = screen.getAllByRole("link", { name: /request résumé/i });
  requestLinks.forEach((link) => {
    expect(link).toHaveAttribute("href", resumeRequestHref);
  });
  const requestUrl = new URL(resumeRequestHref);
  expect(requestUrl.protocol).toBe("mailto:");
  expect(requestUrl.searchParams.get("subject")).toBe("Resume request");
  expectNoPublicResume();
  expect(window.print).not.toHaveBeenCalled();
  expect(axios.post).not.toHaveBeenCalled();
  expect(axios.put).not.toHaveBeenCalled();
});

test.each(["/resume", "/resume/", "/resume/anything?x=1#experience"])(
  "legacy resume URL %s redirects home without exposing resume content",
  async (legacyUrl) => {
    window.history.replaceState({}, "", legacyUrl);
    renderSite();
    expect(
      await screen.findByRole("heading", { name: /developer by trade/i }),
    ).toBeInTheDocument();
    expect(window.location.pathname).toBe("/");
    expect(window.location.search).toBe("");
    expect(window.location.hash).toBe("");
    expectNoPublicResume();
    expect(axios.get).not.toHaveBeenCalled();
  },
);

test("public page metadata and installed app use the TigerFang identity", () => {
  const template = new DOMParser().parseFromString(
    readFileSync(join(__dirname, "../public/index.html"), "utf8"),
    "text/html",
  );
  const manifest = JSON.parse(
    readFileSync(join(__dirname, "../public/manifest.json"), "utf8"),
  );
  expect(template.title).toBe("TigerFang | Developer & Adventurer");
  expect(template.querySelector('meta[name="description"]').getAttribute("content")).toBe(
    "TigerFang — developer and RuneScape adventurer. Explore RuneScape money making methods and request a résumé.",
  );
  expect(manifest.name).toBe("TigerFang");
  expect(manifest.short_name).toBe("TigerFang");
});

test("returning home from the game page keeps scenery isolated and offers resume requests", async () => {
  window.history.replaceState({}, "", "/rs_MMM");
  renderSite();
  await screen.findByRole("searchbox", { name: "Filter Method" });
  expect(
    screen.queryByText(/side quest|your kind of grind/i),
  ).not.toBeInTheDocument();
  expect(document.body.style.backgroundImage).toBe("");
  userEvent.click(
    within(
      screen.getByRole("navigation", { name: "Main navigation" }),
    ).getByRole("link", { name: "Home" }),
  );
  expect(
    screen.getByRole("heading", { name: /developer by trade/i }),
  ).toBeInTheDocument();
  expect(document.body.style.backgroundImage).toBe("");
  expect(
    within(screen.getByRole("navigation", { name: "Main navigation" })).getByRole(
      "link",
      { name: "Request résumé" },
    ),
  ).toHaveAttribute("href", resumeRequestHref);
  expectNoPublicResume();
});

test("methods can be filtered, sorted, and edited with the existing intensity selected", async () => {
  window.history.replaceState({}, "", "/rs_MMM");
  renderSite();
  const filter = await screen.findByRole("searchbox", {
    name: "Filter Method",
  });
  userEvent.type(filter, "Dragon");
  expect(screen.queryByText("Herb farming")).not.toBeInTheDocument();
  expect(screen.getByText("1 of 2 methods")).toBeInTheDocument();
  userEvent.click(screen.getByRole("button", { name: /clear filters/i }));
  expect(screen.getByText("Herb farming")).toBeInTheDocument();
  userEvent.click(
    screen.getByRole("button", { name: "Sort by Hourly profit" }),
  );
  expect(
    within(screen.getAllByRole("row")[1]).getByText("Herb farming"),
  ).toBeInTheDocument();
  expect(screen.queryByRole("button", { name: /Edit Dragon/ })).not.toBeInTheDocument();
  await signInAsOwner();
  userEvent.click(screen.getByRole("button", { name: "Edit Dragon hunting" }));
  expect(
    screen.getByRole("dialog", { name: "Edit method" }),
  ).toBeInTheDocument();
  expect(screen.getByRole("combobox", { name: /Intensity/ })).toHaveValue("4");
  const profit = screen.getByRole("textbox", { name: "Hourly profit" });
  userEvent.clear(profit);
  userEvent.type(profit, "15M");
  userEvent.click(screen.getByRole("button", { name: "Save method" }));
  await waitFor(() =>
    expect(axios.put).toHaveBeenCalledWith(
      "https://rsmmmapi.azurewebsites.net/MoneyMakingMethod/dragon",
      expect.objectContaining({
        methodId: "dragon",
        hourlyProfit: 15000000,
        intensity: 4,
        createdDatetime: methods[0].createdDatetime,
      }),
      { headers: { Authorization: "Bearer owner-token" } },
    ),
  );
  await waitFor(() =>
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument(),
  );
  userEvent.click(screen.getByRole("button", { name: "Edit Herb farming" }));
  expect(screen.getByRole("button", { name: "Farming" })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  userEvent.click(screen.getByRole("button", { name: "Cancel" }));
});

test("a failed save keeps the method form open and preserves a custom skill", async () => {
  window.history.replaceState({}, "", "/rs_MMM");
  axios.post.mockRejectedValueOnce(new Error("Unavailable"));
  renderSite();
  await screen.findByRole("searchbox", { name: "Filter Method" });
  await signInAsOwner();
  userEvent.click(screen.getByRole("button", { name: "Add method" }));
  userEvent.type(
    screen.getByRole("textbox", { name: /Method name/ }),
    "A new method",
  );
  userEvent.selectOptions(
    screen.getByRole("combobox", { name: /Intensity/ }),
    "1",
  );
  userEvent.type(
    screen.getByRole("textbox", { name: "Add a custom skill or area" }),
    "Farming{enter}",
  );
  expect(axios.post).not.toHaveBeenCalled();
  expect(screen.getByRole("button", { name: "Farming" })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  userEvent.click(screen.getByRole("button", { name: "Save method" }));
  expect(await screen.findByRole("alert")).toHaveTextContent(
    "We couldn't save this method",
  );
  expect(
    screen.getByRole("dialog", { name: "Add a method" }),
  ).toBeInTheDocument();
  expect(axios.post).toHaveBeenCalledWith(
    "https://rsmmmapi.azurewebsites.net/MoneyMakingMethod",
    expect.objectContaining({
      method: "A new method",
      intensity: 1,
      skillOrArea: "Farming",
    }),
    { headers: { Authorization: "Bearer owner-token" } },
  );
  userEvent.click(screen.getByRole("button", { name: "Cancel" }));
  await waitFor(() =>
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument(),
  );
});

test("public visitors can browse but cannot add or edit, even with stored owner flags", async () => {
  localStorage.setItem("canEdit", "true");
  localStorage.setItem("token", "forged-token");
  window.history.replaceState({}, "", "/rs_MMM");
  renderSite();
  await screen.findByRole("searchbox", { name: "Filter Method" });
  expect(screen.queryByRole("button", { name: /^(Add method|Edit )/ })).not.toBeInTheDocument();
  expect(screen.queryByRole("columnheader", { name: "Edit" })).not.toBeInTheDocument();
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  expect(window.google.accounts.id.initialize).not.toHaveBeenCalled();
  expect(axios.post).not.toHaveBeenCalled();
  expect(axios.put).not.toHaveBeenCalled();
});

test("a nonowner Google account stays read-only", async () => {
  const fetch = axios.get.getMockImplementation();
  axios.get.mockImplementation((url, config) => url.endsWith("/auth/session")
    ? Promise.reject({ response: { status: 403 } })
    : fetch(url, config));
  window.history.replaceState({}, "", "/rs_MMM");
  renderSite();
  await screen.findByRole("searchbox", { name: "Filter Method" });
  userEvent.click(screen.getByRole("button", { name: "Owner sign in" }));
  userEvent.click(await screen.findByRole("button", { name: "Sign in with Google" }));
  expect(await screen.findByRole("alert")).toHaveTextContent("does not have editing access");
  expect(screen.queryByRole("button", { name: "Add method" })).not.toBeInTheDocument();
  expect(screen.queryByRole("columnheader", { name: "Edit" })).not.toBeInTheDocument();
});

test("signing out removes editing controls and signing in again restores them", async () => {
  window.history.replaceState({}, "", "/rs_MMM");
  renderSite();
  await screen.findByRole("searchbox", { name: "Filter Method" });
  await signInAsOwner();
  userEvent.click(screen.getByRole("button", { name: "Sign out" }));
  expect(screen.queryByRole("button", { name: "Add method" })).not.toBeInTheDocument();
  expect(screen.queryByRole("columnheader", { name: "Edit" })).not.toBeInTheDocument();
  userEvent.click(await screen.findByRole("button", { name: "Sign in with Google" }));
  expect(await screen.findByRole("button", { name: "Add method" })).toBeEnabled();
});

test.each([401, 403])("an API %s during save clears owner editing access", async (status) => {
  axios.put.mockRejectedValueOnce({ response: { status } });
  window.history.replaceState({}, "", "/rs_MMM");
  renderSite();
  await screen.findByRole("searchbox", { name: "Filter Method" });
  await signInAsOwner();
  userEvent.click(screen.getByRole("button", { name: "Edit Dragon hunting" }));
  userEvent.click(screen.getByRole("button", { name: "Save method" }));
  await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
  expect(screen.queryByRole("button", { name: "Add method" })).not.toBeInTheDocument();
  expect(screen.queryByRole("columnheader", { name: "Edit" })).not.toBeInTheDocument();
});
