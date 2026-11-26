/**
 * Small tooltip below its trigger, shown on hover (after a short delay) and on
 * keyboard focus. CSS only. `align="end"` anchors it to the right edge, for
 * triggers near the right side of the screen.
 */
export function Tooltip({
  label,
  align = "center",
  children,
}: {
  label: string;
  align?: "center" | "end";
  children: React.ReactNode;
}) {
  return (
    <span className="group/tip relative inline-flex">
      {children}
      <span
        role="tooltip"
        className={`pointer-events-none absolute top-full z-[70] mt-1.5 whitespace-nowrap rounded-[8px] border border-border bg-background px-2 py-1 text-xs font-medium text-foreground shadow-md opacity-0 -translate-y-0.5 transition-[opacity,translate] duration-150 group-hover/tip:opacity-100 group-hover/tip:translate-y-0 group-hover/tip:delay-300 group-has-focus-visible/tip:opacity-100 group-has-focus-visible/tip:translate-y-0 ${
          align === "end" ? "right-0" : "left-1/2 -translate-x-1/2"
        }`}
      >
        {label}
      </span>
    </span>
  );
}
