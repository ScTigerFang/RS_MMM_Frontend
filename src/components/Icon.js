const paths = {
  arrow: "M5 12h14m-5-5 5 5-5 5",
  external:
    "M14 4h6v6m0-6L10 14M10 4H5a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-5",
  mail: "M4 5h16v14H4zM4 6l8 7 8-7",
  phone:
    "M7 3H4a1 1 0 0 0-1 1c0 9.4 7.6 17 17 17a1 1 0 0 0 1-1v-3l-5-2-2 2a15 15 0 0 1-7-7l2-2-2-5Z",
  pin: "M20 10c0 6-8 11-8 11S4 16 4 10a8 8 0 1 1 16 0ZM15 10a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z",
  print: "M7 8V3h10v5M7 17H4V8h16v9h-3M7 14h10v7H7zM17 11h.01",
  code: "m8 7-5 5 5 5m8-10 5 5-5 5M14 4l-4 16",
  rune: "m12 2 8 5v10l-8 5-8-5V7l8-5Zm0 4v12m0-12 5 4-5 3-5-3",
  coins:
    "M18 8c0 2.2-3.6 4-8 4S2 10.2 2 8s3.6-4 8-4 8 1.8 8 4ZM2 8v5c0 2.2 3.6 4 8 4 1.4 0 2.8-.2 4-.5M2 13v4c0 2.2 3.6 4 8 4 1.4 0 2.8-.2 4-.5M18 8v4m0 1v8m-3-3 3 3 3-3",
  document: "M14 3H5v18h14V8l-5-5Zm0 0v5h5M8 12h8m-8 4h6",
  plus: "M12 5v14M5 12h14",
  close: "m6 6 12 12M6 18 18 6",
  refresh: "M20 7v5h-5M4 17v-5h5m11 0a8 8 0 0 0-14-5M4 12a8 8 0 0 0 14 5",
  alert: "M12 3 2 21h20L12 3Zm0 6v5m0 3h.01",
  sort: "M8 4v16m-4-4 4 4 4-4M16 20V4m-4 4 4-4 4 4",
  check: "m5 12 4 4L19 6",
};

export default function Icon({ name, className = "" }) {
  return (
    <svg
      className={"icon " + className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d={paths[name] || paths.arrow} />
    </svg>
  );
}
