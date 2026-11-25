export default [
  {
    files: ["public/*.js"],
    languageOptions: {
      globals: Object.fromEntries(
        [
          "document",
          "window",
          "Intl",
          "Date",
          "matchMedia",
          "IntersectionObserver",
          "requestAnimationFrame",
          "Number",
          "Math",
          "FormData",
          "fetch",
          "URL",
          "URLSearchParams",
          "history",
          "location",
          "setInterval",
        ].map((name) => [name, "readonly"]),
      ),
    },
    rules: {
      "no-undef": "error",
      "no-unused-vars": "error",
      "no-unreachable": "error",
      "no-debugger": "error",
    },
  },
];
