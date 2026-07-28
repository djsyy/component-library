import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, describe, expect, it, vi } from "vitest";

import { Button } from "./Button/Button";
import { ButtonSize, ButtonVariant } from "./Button/button.types";
import { Card } from "./Card/Card";
import { Checkbox, CheckboxState } from "./Checkbox/Checkbox";
import { Menu, MenuItem } from "./Menu/Menu";
import { Select } from "./Select/Select";
import { TextInput } from "./TextInput/TextInput";

let roots: Root[] = [];

const render = (element: React.ReactNode) => {
  const container = document.createElement("div");
  const root = createRoot(container);

  document.body.append(container);
  roots.push(root);

  act(() => {
    root.render(element);
  });

  return container;
};

const click = (element: Element) => {
  act(() => {
    element.dispatchEvent(new MouseEvent("click", { bubbles: true }));
  });
};

afterEach(() => {
  act(() => {
    roots.forEach((root) => root.unmount());
  });
  roots = [];
  document.body.replaceChildren();
});

describe("Button", () => {
  it("applies its defaults and prevents interaction while loading", () => {
    const onClick = vi.fn();
    const container = render(
      <Button loading onClick={onClick}>
        Save
      </Button>,
    );
    const button = container.querySelector("button");

    expect(button?.type).toBe("button");
    expect(button?.className).toContain("button--primary");
    expect(button?.className).toContain("button--md");
    expect(button?.disabled).toBe(true);
    expect(button?.getAttribute("aria-busy")).toBe("true");

    click(button!);
    expect(onClick).not.toHaveBeenCalled();
  });

  it("supports explicit variants and sizes", () => {
    const container = render(
      <Button size={ButtonSize.Small} variant={ButtonVariant.Danger}>
        Delete
      </Button>,
    );
    const button = container.querySelector("button");

    expect(button?.className).toContain("button--danger");
    expect(button?.className).toContain("button--sm");
  });
});

describe("Card", () => {
  it("renders a semantic article with the selected surface variant", () => {
    const container = render(
      <Card variant="outlined">
        <h2>Project update</h2>
      </Card>,
    );
    const card = container.querySelector("article");

    expect(card?.className).toContain("card--outlined");
    expect(card?.querySelector("h2")?.textContent).toBe("Project update");
  });
});

describe("Checkbox", () => {
  it("exposes its indeterminate state and calls onChange with the next value", () => {
    const onChange = vi.fn();
    const container = render(
      <Checkbox
        label="Select all"
        onChange={onChange}
        state={CheckboxState.Indeterminate}
      />,
    );
    const checkbox = container.querySelector<HTMLInputElement>(
      'input[type="checkbox"]',
    );

    expect(checkbox?.indeterminate).toBe(true);
    expect(checkbox?.getAttribute("aria-checked")).toBe("mixed");

    click(checkbox!);
    expect(onChange).toHaveBeenCalledWith(false);
  });
});

describe("TextInput and Select", () => {
  it("connects text-input errors to their control", () => {
    const container = render(
      <TextInput
        error
        errorMessage="Enter a valid email address."
        label="Email address"
      />,
    );
    const input = container.querySelector("input");
    const error = container.querySelector('[role="alert"]');

    expect(input?.getAttribute("aria-invalid")).toBe("true");
    expect(input?.getAttribute("aria-errormessage")).toBe(error?.id);
    expect(error?.textContent).toBe("Enter a valid email address.");
  });

  it("keeps the select label and error message associated", () => {
    const container = render(
      <Select error errorMessage="Choose a team." label="Team">
        <option value="">Choose an option</option>
      </Select>,
    );
    const select = container.querySelector("select");
    const label = container.querySelector("label");
    const error = container.querySelector('[role="alert"]');

    expect(label?.htmlFor).toBe(select?.id);
    expect(select?.getAttribute("aria-errormessage")).toBe(error?.id);
  });
});

describe("Menu", () => {
  it("opens, focuses the first action, and closes after selection", () => {
    const container = render(
      <Menu label="Actions">
        <MenuItem>Rename</MenuItem>
        <MenuItem>Archive</MenuItem>
      </Menu>,
    );
    const trigger = container.querySelector("button");

    click(trigger!);

    const menu = container.querySelector('[role="menu"]');
    const firstItem = container.querySelector('[role="menuitem"]');
    expect(trigger?.getAttribute("aria-expanded")).toBe("true");
    expect(document.activeElement).toBe(firstItem);

    click(firstItem!);
    expect(menu?.isConnected).toBe(false);
    expect(trigger?.getAttribute("aria-expanded")).toBe("false");
  });
});
