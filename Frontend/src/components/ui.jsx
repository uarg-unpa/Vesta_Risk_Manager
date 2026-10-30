import { cloneElement, createContext, useContext, useEffect, useId, useRef, useState } from "react";

const cx = (...classes) => classes.filter(Boolean).join(" ");

const buttonVariants = {
  primary: "border border-blue-600 bg-blue-600 text-white hover:border-blue-700 hover:bg-blue-700 focus-visible:ring-blue-500",
  secondary: "border border-slate-500 bg-slate-500 text-white hover:border-slate-600 hover:bg-slate-600 focus-visible:ring-slate-500",
  success: "border border-emerald-600 bg-emerald-600 text-white hover:border-emerald-700 hover:bg-emerald-700 focus-visible:ring-emerald-500",
  danger: "border border-red-600 bg-red-600 text-white hover:border-red-700 hover:bg-red-700 focus-visible:ring-red-500",
  warning: "border border-yellow-400 bg-yellow-400 text-black hover:border-yellow-500 hover:bg-yellow-500 focus-visible:ring-yellow-400",
  light: "border border-slate-200 bg-slate-100 text-slate-900 hover:border-slate-300 hover:bg-slate-200 focus-visible:ring-slate-400",
  dark: "border border-slate-800 bg-slate-800 text-white hover:border-slate-900 hover:bg-slate-900 focus-visible:ring-slate-500",
  "outline-primary": "border border-blue-600 bg-transparent text-blue-600 hover:bg-blue-600 hover:text-white focus-visible:ring-blue-500",
  "outline-success": "border border-emerald-600 bg-transparent text-emerald-600 hover:bg-emerald-600 hover:text-white focus-visible:ring-emerald-500",
  "outline-danger": "border border-red-600 bg-transparent text-red-600 hover:bg-red-600 hover:text-white focus-visible:ring-red-500",
  "outline-warning": "border border-yellow-400 bg-transparent text-yellow-600 hover:bg-yellow-400 hover:text-black focus-visible:ring-yellow-400",
  "outline-secondary": "border border-slate-500 bg-transparent text-slate-600 hover:bg-slate-500 hover:text-white focus-visible:ring-slate-500",
};

export function Button({ variant = "primary", size, className, children, href, ...props }) {
  const Component = href ? "a" : "button";
  return (
    <Component
      className={cx(
        "inline-flex items-center justify-center gap-2 rounded-md px-3 py-1.5 text-base font-normal leading-6 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-65",
        size === "sm" && "rounded px-2 py-1 text-sm leading-5",
        size === "lg" && "rounded-lg px-4 py-2 text-xl leading-7",
        buttonVariants[variant] ?? buttonVariants.primary,
        className
      )}
      href={href}
      {...props}
    >
      {children}
    </Component>
  );
}

export function Alert({ variant = "primary", className, children, ...props }) {
  const variants = {
    primary: "border-blue-200 bg-blue-100 text-blue-900",
    success: "border-emerald-200 bg-emerald-100 text-emerald-900",
    danger: "border-red-200 bg-red-100 text-red-900",
    warning: "border-yellow-200 bg-yellow-100 text-yellow-950",
  };
  return <div role="alert" className={cx("mb-4 rounded-md border px-4 py-3", variants[variant], className)} {...props}>{children}</div>;
}

function CardRoot({ className, children, ...props }) {
  return <section className={cx("overflow-hidden rounded-md border border-slate-300 bg-white", className)} {...props}>{children}</section>;
}
CardRoot.Header = ({ className, children, ...props }) => <header className={cx("border-b border-slate-300 bg-black/[.03] px-4 py-3 font-normal", className)} {...props}>{children}</header>;
CardRoot.Body = ({ className, children, ...props }) => <div className={cx("p-4", className)} {...props}>{children}</div>;
CardRoot.Footer = ({ className, children, ...props }) => <footer className={cx("border-t border-slate-300 bg-black/[.03] px-4 py-3", className)} {...props}>{children}</footer>;
export function CardTitle({ className, children, as: Component = "h5", size = "card", ...props }) {
  return <Component className={cx(size === "page" ? "mb-2 text-[1.75rem] font-medium leading-tight text-slate-900" : "mb-2 text-xl font-medium leading-tight text-slate-900", className)} {...props}>{children}</Component>;
}
export function CardSubtitle({ className, children, as: Component = "h6", ...props }) {
  return <Component className={cx("mb-2 text-base font-normal leading-tight text-slate-600", className)} {...props}>{children}</Component>;
}
CardRoot.Title = CardTitle;
CardRoot.Subtitle = CardSubtitle;
CardRoot.Text = ({ className, children, ...props }) => <p className={cx("text-slate-900", className)} {...props}>{children}</p>;
export const Card = CardRoot;

export function Container({ className, children, ...props }) {
  return <div className={cx("mx-auto w-full px-3 sm:max-w-[540px] md:max-w-[720px] lg:max-w-[960px] xl:max-w-[1140px] 2xl:max-w-[1320px]", className)} {...props}>{children}</div>;
}

export function Row({ className, children, ...props }) {
  return <div className={cx("-mx-3 flex flex-wrap", className)} {...props}>{children}</div>;
}

export function Col({ xs, className, children, ...props }) {
  const width = xs === 3 ? "w-1/4 flex-none" : xs === 4 ? "w-1/3 flex-none" : xs === 5 ? "w-5/12 flex-none" : xs === 6 ? "w-1/2 flex-none" : xs === 9 ? "w-3/4 flex-none" : "min-w-0 flex-1";
  return <div className={cx("relative min-h-px px-3", width, className)} {...props}>{children}</div>;
}

export function ProjectRow({ className, children, ...props }) {
  return <div className={cx("mb-2 flex w-full items-center justify-between rounded px-2 py-3 text-white", className)} {...props}>{children}</div>;
}

function FormRoot({ className, children, ...props }) {
  return <form className={cx(className)} {...props}>{children}</form>;
}
FormRoot.Group = ({ className, children, ...props }) => <div className={cx("mb-3", className)} {...props}>{children}</div>;
FormRoot.Label = ({ className, children, ...props }) => <label className={cx("mb-1 block text-base font-normal leading-6 text-slate-900", className)} {...props}>{children}</label>;
FormRoot.Text = ({ className, children, ...props }) => <p className={cx("mt-1 text-sm text-slate-600", className)} {...props}>{children}</p>;
FormRoot.Control = ({ as: Component = "input", className, ...props }) => <Component className={cx("block w-full rounded-md border border-slate-400 bg-white px-3 py-1.5 text-base font-normal leading-6 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200 disabled:bg-slate-200", className)} {...props} />;
FormRoot.Select = ({ className, children, ...props }) => <select className={cx("block w-full rounded-md border border-slate-400 bg-white px-3 py-1.5 text-base font-normal leading-6 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 disabled:bg-slate-200", className)} {...props}>{children}</select>;
FormRoot.Check = ({ className, label, id, isInvalid, ...props }) => <label className={cx("flex items-center gap-2 text-sm text-slate-700", className)}><input id={id} type={props.type ?? "checkbox"} className={cx("h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500", isInvalid && "border-red-500")} {...props} />{label && <span>{label}</span>}</label>;
export const Form = FormRoot;

export function Table({ className, children, striped, bordered, hover, size, responsive, ...props }) {
  return <div className="w-full overflow-x-auto"><table className={cx("mb-4 w-full border-collapse align-top text-base text-slate-900", bordered && "border border-slate-300", striped && "[&_tbody_tr:nth-child(odd)]:bg-slate-50", hover && "[&_tbody_tr:hover]:bg-slate-100", "[&_th]:border-b [&_td]:border-b [&_th]:border-slate-300 [&_td]:border-slate-300", size === "sm" ? "[&_th]:px-1 [&_td]:px-1 [&_th]:py-1 [&_td]:py-1" : "[&_th]:px-2 [&_td]:px-2 [&_th]:py-2 [&_td]:py-2", className)} {...props}>{children}</table></div>;
}

export function Figure({ className, children, ...props }) { return <figure className={className} {...props}>{children}</figure>; }
Figure.Image = ({ className, ...props }) => <img className={cx("max-w-full", className)} {...props} />;

export function InputGroup({ className, children, ...props }) { return <div className={cx("flex items-stretch", className)} {...props}>{children}</div>; }

const ModalContext = createContext(null);
function ModalRoot({ show, onHide, className, children, size, placement = "center", ...props }) {
  const [mounted, setMounted] = useState(Boolean(show));
  const [visible, setVisible] = useState(Boolean(show));
  useEffect(() => {
    if (show) {
      setMounted(true);
      const frame = window.requestAnimationFrame(() => setVisible(true));
      return () => window.cancelAnimationFrame(frame);
    }
    setVisible(false);
    const timeout = window.setTimeout(() => setMounted(false), 200);
    return () => window.clearTimeout(timeout);
  }, [show]);
  useEffect(() => {
    if (!mounted) return undefined;
    const close = (event) => event.key === "Escape" && onHide?.();
    document.addEventListener("keydown", close);
    return () => document.removeEventListener("keydown", close);
  }, [mounted, onHide]);
  if (!mounted) return null;
  const modalWidth = size === "xl" ? "max-w-[1140px]" : size === "lg" ? "max-w-[800px]" : size === "sm" ? "max-w-[300px]" : "max-w-[500px]";
  return <div className={cx("fixed inset-0 z-50 flex justify-center overflow-y-auto bg-black/50 p-3 transition-opacity duration-200", placement === "top" ? "items-start pt-5" : "items-center", visible ? "opacity-100" : "opacity-0")} role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onHide?.()}><ModalContext.Provider value={{ onHide }}><div className={cx("w-full rounded-md border border-black/20 bg-white shadow-lg transition-all duration-200", modalWidth, visible ? "translate-y-0 scale-100 opacity-100" : "translate-y-2 scale-95 opacity-0", className)} role="dialog" aria-modal="true" {...props}>{children}</div></ModalContext.Provider></div>;
}
ModalRoot.Header = ({ closeButton, onHide, className, children, ...props }) => { const modal = useContext(ModalContext); return <header className={cx("flex items-center justify-between border-b border-slate-200 px-4 py-3", className)} {...props}>{children}{closeButton && <button type="button" aria-label="Cerrar" className="rounded-md border-0 bg-transparent px-2 text-2xl font-normal leading-none text-black/55 hover:text-black" onClick={onHide ?? modal?.onHide}>×</button>}</header>; };
ModalRoot.Title = ({ className, children, ...props }) => <h2 className={cx("text-lg font-semibold text-slate-900", className)} {...props}>{children}</h2>;
ModalRoot.Body = ({ className, children, ...props }) => <div className={cx("px-4 py-4", className)} {...props}>{children}</div>;
ModalRoot.Footer = ({ className, children, ...props }) => <footer className={cx("flex flex-wrap justify-between gap-2 border-t border-slate-200 px-4 py-3", className)} {...props}>{children}</footer>;
export const Modal = ModalRoot;

const DropdownContext = createContext(null);
function DropdownRoot({ className, children, ...props }) {
  const [open, setOpen] = useState(false);
  const [menuPlacement, setMenuPlacement] = useState("bottom");
  const rootRef = useRef(null);
  const menuRef = useRef(null);
  useEffect(() => {
    if (!open) return undefined;
    const frame = window.requestAnimationFrame(() => {
      const rootRect = rootRef.current?.getBoundingClientRect();
      const menuRect = menuRef.current?.getBoundingClientRect();
      if (!rootRect || !menuRect) return;
      const spaceBelow = window.innerHeight - rootRect.bottom;
      const spaceAbove = rootRect.top;
      setMenuPlacement(spaceBelow < menuRect.height && spaceAbove > spaceBelow ? "top" : "bottom");
    });
    return () => window.cancelAnimationFrame(frame);
  }, [open]);
  return <DropdownContext.Provider value={{ open, setOpen, menuPlacement, rootRef, menuRef }}><div ref={rootRef} className={cx("relative inline-block", className)} {...props}>{children}</div></DropdownContext.Provider>;
}
DropdownRoot.Toggle = ({ children, variant = "primary", className, ...props }) => { const { open, setOpen } = useContext(DropdownContext); return <Button variant={variant} aria-expanded={open} onClick={() => setOpen(!open)} className={className} {...props}>{children}<span aria-hidden="true">▾</span></Button>; };
DropdownRoot.Menu = ({ className, children, ...props }) => { const { open, menuPlacement, menuRef } = useContext(DropdownContext); return open ? <div ref={menuRef} className={cx("absolute right-0 z-30 min-w-40 rounded-md border border-black/15 bg-white py-2 shadow-lg", menuPlacement === "top" ? "bottom-full mb-1" : "mt-1", className)} role="menu" {...props}>{children}</div> : null; };
DropdownRoot.Item = ({ className, children, onClick, href, ...props }) => { const { setOpen } = useContext(DropdownContext); const Component = href ? "a" : "button"; return <Component type={href ? undefined : "button"} href={href} role="menuitem" className={cx("block w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-100", className)} onClick={(event) => { onClick?.(event); setOpen(false); }} {...props}>{children}</Component>; };
export const Dropdown = DropdownRoot;
export function DropdownButton({ title, children, menuClassName, ...props }) { return <Dropdown><Dropdown.Toggle {...props}>{title}</Dropdown.Toggle><Dropdown.Menu className={menuClassName}>{children}</Dropdown.Menu></Dropdown>; }

export function OverlayTrigger({ overlay, children, placement = "top" }) {
  const [visible, setVisible] = useState(false);
  const tooltipId = useId();
  const placementClass = {
    top: "bottom-full left-1/2 mb-2 -translate-x-1/2",
    bottom: "left-1/2 top-full mt-2 -translate-x-1/2",
    start: "right-full top-1/2 mr-2 -translate-y-1/2",
    end: "left-full top-1/2 ml-2 -translate-y-1/2",
  }[placement] ?? "bottom-full left-1/2 mb-2 -translate-x-1/2";
  const tooltipContent = overlay?.props?.children ?? overlay;
  const trigger = cloneElement(children, {
    "aria-describedby": visible ? tooltipId : undefined,
  });

  return (
    <span
      className="relative inline-flex"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onFocus={() => setVisible(true)}
      onBlur={() => setVisible(false)}
    >
      {trigger}
      <span
        id={tooltipId}
        role="tooltip"
        className={cx(
          "pointer-events-none absolute z-50 whitespace-nowrap rounded bg-slate-900 px-2 py-1 text-xs font-normal text-white shadow-sm transition-opacity duration-200",
          placementClass,
          visible ? "opacity-100" : "opacity-0"
        )}
      >
        {tooltipContent}
      </span>
    </span>
  );
}
export function Tooltip({ children, ...props }) { return <span role="tooltip" {...props}>{children}</span>; }

const NavbarContext = createContext(null);
function NavbarRoot({ className, children, bg, variant, expand, ...props }) {
  const [open, setOpen] = useState(false);
  return <NavbarContext.Provider value={{ open, setOpen }}><nav className={cx("w-full py-4", bg === "dark" && "bg-[#212529]", variant === "dark" && "text-white", className)} {...props}>{children}</nav></NavbarContext.Provider>;
}
NavbarRoot.Brand = ({ className, children, ...props }) => <a className={cx("flex shrink-0 items-center whitespace-nowrap text-xl font-normal leading-6 text-white no-underline", className)} {...props}>{children}</a>;
NavbarRoot.Toggle = ({ className, ...props }) => { const { open, setOpen } = useContext(NavbarContext); return <button type="button" aria-label="Abrir menú" aria-expanded={open} className={cx("rounded border border-slate-500 px-3 py-2 text-white lg:hidden", className)} onClick={() => setOpen(!open)} {...props}>☰</button>; };
NavbarRoot.Collapse = ({ className, children, ...props }) => { const { open } = useContext(NavbarContext); return <div className={cx(open ? "block" : "hidden", "w-full lg:block", className)} {...props}>{children}</div>; };
export const Navbar = NavbarRoot;
export function Nav({ className, children, ...props }) { return <div className={cx("flex flex-col gap-1 lg:flex-row lg:items-center", className)} {...props}>{children}</div>; }
Nav.Link = ({ className, children, ...props }) => <a className={cx("rounded px-4 py-2 text-base text-white/55 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white", className)} {...props}>{children}</a>;
function NavDropdownRoot({ title, className, children, menuVariant, id, menuClassName, ...props }) { return <DropdownButton title={title} className={className} menuClassName={menuClassName} {...props}>{children}</DropdownButton>; }
NavDropdownRoot.Item = ({ children, ...props }) => <Dropdown.Item {...props}>{children}</Dropdown.Item>;
export const NavDropdown = NavDropdownRoot;

function PaginationRoot({ className, children, ...props }) { return <nav aria-label="Paginación" className={cx("flex justify-center", className)} {...props}><div className="flex items-center gap-1">{children}</div></nav>; }
const pageButton = "rounded border border-slate-300 px-3 py-1.5 text-sm hover:bg-slate-100 disabled:opacity-50";
PaginationRoot.First = ({ disabled, onClick }) => <button type="button" className={pageButton} disabled={disabled} onClick={onClick} aria-label="Primera página">«</button>;
PaginationRoot.Prev = ({ disabled, onClick }) => <button type="button" className={pageButton} disabled={disabled} onClick={onClick} aria-label="Página anterior">‹</button>;
PaginationRoot.Next = ({ disabled, onClick }) => <button type="button" className={pageButton} disabled={disabled} onClick={onClick} aria-label="Página siguiente">›</button>;
PaginationRoot.Last = ({ disabled, onClick }) => <button type="button" className={pageButton} disabled={disabled} onClick={onClick} aria-label="Última página">»</button>;
PaginationRoot.Item = ({ active, children, onClick }) => <button type="button" className={cx(pageButton, active && "bg-blue-600 text-white")} aria-current={active ? "page" : undefined} onClick={onClick}>{children}</button>;
export const Pagination = PaginationRoot;
