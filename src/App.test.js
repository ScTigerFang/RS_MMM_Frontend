import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import axios from "axios";
import App from "./App";

jest.mock("axios", () => ({ get: jest.fn(), post: jest.fn(), put: jest.fn() }));

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
  axios.get.mockImplementation((url) =>
    Promise.resolve({
      data: url.endsWith("/Intensity") ? intensities : methods,
    }),
  );
  axios.post.mockResolvedValue({ data: {} });
  axios.put.mockResolvedValue({});
  jest.spyOn(console, "log").mockImplementation(() => {});
});

afterEach(() => jest.restoreAllMocks());

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
  expect(screen.getByRole("button", { name: "Add method" })).toBeDisabled();
  await act(async () => resolveMethods({ data: methods }));
  expect(screen.getByRole("status")).toHaveTextContent("Loading methods");
  await act(async () => resolveIntensities({ data: intensities }));
  await screen.findByRole("searchbox", { name: "Filter Method" });
  expect(screen.queryByText("Loading methods…")).not.toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Add method" })).toBeEnabled();
});

test("home links to the professional resume and its print action", async () => {
  renderSite();
  expect(
    screen.getByRole("heading", { name: /developer by trade/i }),
  ).toBeInTheDocument();
  userEvent.click(screen.getByRole("link", { name: /view my resume/i }));
  expect(
    screen.getByRole("heading", { name: /Daniel Beals/ }),
  ).toBeInTheDocument();
  expect(document.title).toBe("Daniel Beals - Resume");
  expect(
    screen.getByRole("link", {
      name: "linkedin.com/in/daniel-beals-470682155",
    }),
  ).toHaveAttribute(
    "href",
    "https://www.linkedin.com/in/daniel-beals-470682155/",
  );
  expect(
    screen.getByRole("link", { name: "danielbealsprofemail@gmail.com" }),
  ).toHaveAttribute("href", "mailto:danielbealsprofemail@gmail.com");
  expect(
    screen.getByRole("heading", { name: "Education" }),
  ).toBeInTheDocument();
  userEvent.click(screen.getByRole("button", { name: /print.*save PDF/i }));
  expect(window.print).toHaveBeenCalledTimes(1);
  expect(axios.post).not.toHaveBeenCalled();
  expect(axios.put).not.toHaveBeenCalled();
});

test("visiting the game page does not leave scenery behind the resume", async () => {
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
    ).getByRole("link", { name: "Resume" }),
  );
  expect(
    screen.getByRole("heading", { name: /Daniel Beals/ }),
  ).toBeInTheDocument();
  expect(document.body.style.backgroundImage).toBe("");
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
  );
  userEvent.click(screen.getByRole("button", { name: "Cancel" }));
  await waitFor(() =>
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument(),
  );
});
