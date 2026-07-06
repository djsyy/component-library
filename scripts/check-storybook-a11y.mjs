import { JSDOM } from "jsdom";
import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { createServer } from "vite";
import axe from "axe-core";

const axeConfig = {
  rules: {
    // jsdom cannot compute real visual contrast reliably.
    "color-contrast": { enabled: false },
  },
  runOnly: {
    type: "tag",
    values: ["wcag2a", "wcag2aa"],
  },
};

const waitForRender = async () => {
  await new Promise((resolve) => setTimeout(resolve, 0));
};

const withDomGlobals = async (dom, run) => {
  const previousGlobals = new Map();
  const nextGlobals = {
    Document: dom.window.Document,
    Element: dom.window.Element,
    HTMLElement: dom.window.HTMLElement,
    HTMLInputElement: dom.window.HTMLInputElement,
    HTMLSelectElement: dom.window.HTMLSelectElement,
    IS_REACT_ACT_ENVIRONMENT: true,
    MutationObserver: dom.window.MutationObserver,
    Node: dom.window.Node,
    SVGElement: dom.window.SVGElement,
    document: dom.window.document,
    getComputedStyle: dom.window.getComputedStyle.bind(dom.window),
    navigator: dom.window.navigator,
    requestAnimationFrame: dom.window.requestAnimationFrame.bind(dom.window),
    window: dom.window,
  };

  for (const [key, value] of Object.entries(nextGlobals)) {
    previousGlobals.set(key, globalThis[key]);
    Object.defineProperty(globalThis, key, {
      configurable: true,
      value,
      writable: true,
    });
  }

  try {
    return await run();
  } finally {
    for (const [key, value] of previousGlobals.entries()) {
      if (value === undefined) {
        delete globalThis[key];
        continue;
      }

      Object.defineProperty(globalThis, key, {
        configurable: true,
        value,
        writable: true,
      });
    }
  }
};

const vite = await createServer({
  appType: "custom",
  configFile: false,
  server: {
    hmr: false,
    middlewareMode: true,
  },
});

try {
  const [{ Button }, buttonTypes, { Checkbox, CheckboxState }, { TextInput }, { Select }] =
    await Promise.all([
      vite.ssrLoadModule("/src/components/Button/Button.tsx"),
      vite.ssrLoadModule("/src/components/Button/button.types.ts"),
      vite.ssrLoadModule("/src/components/Checkbox/Checkbox.tsx"),
      vite.ssrLoadModule("/src/components/TextInput/TextInput.tsx"),
      vite.ssrLoadModule("/src/components/Select/Select.tsx"),
    ]);

  const { ButtonSize, ButtonVariant } = buttonTypes;
  const selectOptions = [
    { value: "", label: "Choose an option", disabled: true },
    { value: "design", label: "Design" },
    { value: "engineering", label: "Engineering" },
    { value: "product", label: "Product" },
  ];

  const testCases = [
    {
      id: "button-medium",
      element: React.createElement(
        Button,
        {
          onClick: () => {},
          size: ButtonSize.Medium,
          variant: ButtonVariant.Primary,
        },
        "Medium",
      ),
    },
    {
      id: "button-loading",
      element: React.createElement(
        Button,
        {
          loading: true,
          onClick: () => {},
        },
        "Loading",
      ),
    },
    {
      id: "checkbox-standard",
      element: React.createElement(Checkbox, {
        label: "Default label",
        onChange: () => {},
        state: CheckboxState.Unchecked,
        subLabel: "Test SubLabel",
      }),
    },
    {
      id: "checkbox-required",
      element: React.createElement(Checkbox, {
        errorMessage: "This check is required",
        label: "Default label",
        onChange: () => {},
        required: true,
        state: CheckboxState.Unchecked,
        subLabel: "Test SubLabel",
      }),
    },
    {
      id: "text-input-standard",
      element: React.createElement(TextInput, {
        label: "Email address",
        onChange: () => {},
        placeholder: "name@example.com",
        type: "text",
        value: "hello@example.com",
      }),
    },
    {
      id: "text-input-error",
      element: React.createElement(TextInput, {
        details: "Only lowercase letters, numbers, and hyphens.",
        error: true,
        errorMessage: "Remove spaces and uppercase characters.",
        label: "Username",
        onChange: () => {},
        type: "text",
        value: "invalid username",
      }),
    },
    {
      id: "select-standard",
      element: React.createElement(
        Select,
        {
          details: "Used to group your account access.",
          label: "Team",
          onChange: () => {},
          value: "engineering",
        },
        selectOptions.map((option) =>
          React.createElement(
            "option",
            {
              disabled: option.disabled,
              key: option.value,
              value: option.value,
            },
            option.label,
          ),
        ),
      ),
    },
    {
      id: "select-error",
      element: React.createElement(
        Select,
        {
          details: "A team is required before continuing.",
          error: true,
          errorMessage: "Please choose a team.",
          label: "Team",
          onChange: () => {},
          value: "",
        },
        selectOptions.map((option) =>
          React.createElement(
            "option",
            {
              disabled: option.disabled,
              key: option.value,
              value: option.value,
            },
            option.label,
          ),
        ),
      ),
    },
  ];

  const failures = [];

  for (const testCase of testCases) {
    const dom = new JSDOM(
      "<!doctype html><html lang=\"en\"><head><title>Accessibility check</title></head><body><div id=\"root\"></div></body></html>",
      {
        pretendToBeVisual: true,
      },
    );

    try {
      const violations = await withDomGlobals(dom, async () => {
        const container = dom.window.document.getElementById("root");

        if (!container) {
          throw new Error("Missing render container.");
        }

        const root = createRoot(container);

        await act(async () => {
          root.render(testCase.element);
          await waitForRender();
        });

        dom.window.eval(axe.source);
        const results = await dom.window.axe.run(dom.window.document, axeConfig);

        await act(async () => {
          root.unmount();
          await waitForRender();
        });

        return results.violations.map((violation) => ({
          description: violation.description,
          id: violation.id,
          impact: violation.impact,
          nodes: violation.nodes.length,
        }));
      });

      if (violations.length > 0) {
        failures.push({
          id: testCase.id,
          violations,
        });
      }
    } finally {
      dom.window.close();
    }
  }

  if (failures.length > 0) {
    console.error(JSON.stringify(failures, null, 2));
    process.exit(1);
  }

  console.log(`Axe passed for ${testCases.length} rendered component states.`);
} finally {
  await vite.close();
}
