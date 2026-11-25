import { Children, isValidElement } from "react";

/** Centered 690px column with dashed side borders. */
export function Row({
  className = "",
  children,
  as: Tag = "div",
}: {
  className?: string;
  children?: React.ReactNode;
  as?: "div" | "header" | "footer" | "nav";
}) {
  return <Tag className={`max-w-[690px] mx-2 sm:mx-8 md:mx-auto md:w-full relative frame-x ${className}`}>{children}</Tag>;
}

/** Dashed horizontal line spanning the full screen width. */
export function HLine({ className = "" }: { className?: string }) {
  return <div aria-hidden className={`w-full h-px dash-h ${className}`} />;
}

/** Gap-less 2-column grid divided by dashed lines. */
export function DashedGrid({ children }: { children: React.ReactNode }) {
  const items = Children.toArray(children);
  const rows = Math.ceil(items.length / 2);
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2">
      {items.map((child, i) => {
        const lastMobile = i === items.length - 1;
        const lastRowSm = Math.floor(i / 2) === rows - 1;
        const hasRightNeighbor = i % 2 === 0 && i + 1 < items.length;
        return (
          <div key={isValidElement(child) ? (child.key ?? i) : i} className="relative">
            {hasRightNeighbor && (
              <div aria-hidden className="absolute right-0 top-0 h-full w-px dash-v translate-x-1/2 hidden sm:block" />
            )}
            <div
              aria-hidden
              className={`absolute left-0 bottom-0 w-full h-px dash-h ${lastMobile ? "hidden" : "block"} ${lastRowSm ? "sm:hidden" : "sm:block"}`}
            />
            <div className="p-3 h-full">{child}</div>
          </div>
        );
      })}
    </div>
  );
}

/** Vertical list with dashed lines between items. */
export function DashedList({ children }: { children: React.ReactNode }) {
  const items = Children.toArray(children);
  return (
    <div className="flex flex-col">
      {items.map((child, i) => (
        <div key={isValidElement(child) ? (child.key ?? i) : i}>
          {i > 0 && <HLine />}
          <div className="p-3">{child}</div>
        </div>
      ))}
    </div>
  );
}
