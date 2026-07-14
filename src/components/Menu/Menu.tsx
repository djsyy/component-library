import type React from "react";
import {
  createContext,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";

import "./Menu.css";

export interface MenuContextValue {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const MenuContext = createContext<MenuContextValue | undefined>(undefined);

const MENU_ITEM_SELECTOR = '[role="menuitem"]:not(:disabled)';

const getMenuItemElements = (container: HTMLElement | null) => {
  if (!container) {
    return [];
  }

  return Array.from(
    container.querySelectorAll<HTMLButtonElement>(MENU_ITEM_SELECTOR),
  );
};

const focusMenuItem = (container: HTMLElement | null, index: number) => {
  const items = getMenuItemElements(container);

  if (!items.length) {
    return;
  }

  const nextIndex = (index + items.length) % items.length;
  items[nextIndex]?.focus();
};

interface MenuBaseProps extends React.ComponentPropsWithoutRef<"div"> {
  /** Controls the alignment of the menu surface relative to the trigger. */
  align?: "left" | "center" | "right";
  /** Content rendered inside the menu surface. */
  children?: React.ReactNode;
  /** Additional class name for custom styling. */
  className?: string;
  /** Sets the initial open state for uncontrolled usage. */
  defaultOpen?: boolean;
  /** Visible text used for the trigger button. */
  label?: string;
  /** Accessible name used when the trigger has no visible label. */
  ariaLabel?: string;
  /** Optional icon rendered before the trigger label. */
  triggerIcon?: React.ReactNode;
}

// A trigger must have either visible text or an explicit accessible name.
type MenuAccessibleNameProps =
  | { label: string; ariaLabel?: string }
  | { label?: string; ariaLabel: string };

export type MenuProps = MenuBaseProps & MenuAccessibleNameProps;

export interface MenuItemProps extends Omit<
  React.ComponentPropsWithoutRef<"button">,
  "type"
> {
  /** Closes the menu after the item is activated. */
  closeOnSelect?: boolean;
}

export type MenuSeparatorProps = React.ComponentPropsWithoutRef<"hr">;

export function Menu({
  align = "left",
  children,
  className,
  defaultOpen = false,
  label,
  ariaLabel,
  triggerIcon,
  ...props
}: MenuProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const menuId = useId();
  const triggerId = useId();
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handlePointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      focusMenuItem(menuRef.current, 0);
    }
  }, [isOpen]);

  const handleTriggerKeyDown = (
    event: React.KeyboardEvent<HTMLButtonElement>,
  ) => {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();

      if (!isOpen) {
        setIsOpen(true);
        return;
      }

      focusMenuItem(menuRef.current, event.key === "ArrowDown" ? 0 : -1);
    }
  };

  const handleMenuKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const items = getMenuItemElements(menuRef.current);
    const currentIndex = items.findIndex(
      (item) => item === document.activeElement,
    );

    if (event.key === "ArrowDown") {
      event.preventDefault();
      focusMenuItem(menuRef.current, currentIndex + 1);
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      focusMenuItem(menuRef.current, currentIndex - 1);
    }

    if (event.key === "Home") {
      event.preventDefault();
      focusMenuItem(menuRef.current, 0);
    }

    if (event.key === "End") {
      event.preventDefault();
      focusMenuItem(menuRef.current, items.length - 1);
    }

    if (event.key === "Tab") {
      setIsOpen(false);
    }
  };

  const rootClassName = ["menu", `menu--align-${align}`, className ?? ""]
    .filter(Boolean)
    .join(" ");

  return (
    <MenuContext.Provider value={{ isOpen, setIsOpen }}>
      <div {...props} className={rootClassName} ref={rootRef}>
        <button
          aria-controls={menuId}
          aria-expanded={isOpen}
          aria-haspopup="menu"
          aria-label={label ? undefined : ariaLabel}
          className="menu__trigger"
          id={triggerId}
          onClick={() => setIsOpen(!isOpen)}
          onKeyDown={handleTriggerKeyDown}
          ref={triggerRef}
          type="button"
        >
          <span className="menu__trigger-content">
            {triggerIcon ? (
              <span className="menu__trigger-icon" aria-hidden="true">
                {triggerIcon}
              </span>
            ) : null}
            {label ? <span>{label}</span> : null}
          </span>
        </button>
        {isOpen ? (
          <div
            className="menu__surface"
            aria-labelledby={triggerId}
            id={menuId}
            onKeyDown={handleMenuKeyDown}
            ref={menuRef}
            role="menu"
          >
            {children}
          </div>
        ) : null}
      </div>
    </MenuContext.Provider>
  );
}

export function MenuItem({
  children,
  className,
  closeOnSelect = true,
  disabled = false,
  onClick,
  ...props
}: MenuItemProps) {
  const context = useContext(MenuContext);

  if (!context) {
    throw new Error("MenuItem must be used within a Menu.");
  }

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(event);

    if (!event.defaultPrevented && closeOnSelect && !disabled) {
      context.setIsOpen(false);
    }
  };

  const itemClassName = ["menu__item", className ?? ""]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      {...props}
      className={itemClassName}
      disabled={disabled}
      onClick={handleClick}
      role="menuitem"
      type="button"
    >
      {children}
    </button>
  );
}

export function MenuSeparator({ className, ...props }: MenuSeparatorProps) {
  const separatorClassName = ["menu__separator", className ?? ""]
    .filter(Boolean)
    .join(" ");

  return <hr {...props} className={separatorClassName} role="separator" />;
}
