import { useRef, useEffect, type ReactNode, type PointerEvent } from "react";

// Helper to separate outer layout/sizing/grid classes from inner card padding/content-flow classes
function splitCardClasses(className: string) {
  const outer: string[] = [];
  const inner: string[] = [];

  const tokens = className.trim().split(/\s+/).filter(Boolean);

  for (const token of tokens) {
    // Content layout & padding classes that belong inside the visual card
    const isInner =
      token.startsWith("p-") ||
      token.includes(":p-") ||
      token.startsWith("px-") ||
      token.includes(":px-") ||
      token.startsWith("py-") ||
      token.includes(":py-") ||
      token.startsWith("pt-") ||
      token.startsWith("pb-") ||
      token.startsWith("pl-") ||
      token.startsWith("pr-") ||
      token.startsWith("space-") ||
      token.startsWith("gap-") ||
      token === "flex" ||
      token === "flex-col" ||
      token === "flex-row" ||
      token.startsWith("justify-") ||
      token.startsWith("items-") ||
      token === "overflow-hidden";

    if (isInner) {
      inner.push(token);
    } else {
      outer.push(token);
    }

    // Interactive classes relevant to both layers
    if (token === "cursor-pointer" || token === "select-none") {
      if (!inner.includes(token)) inner.push(token);
    }
  }

  return {
    outerClass: outer.join(" "),
    innerClass: inner.join(" "),
  };
}

export default function GlassCard({
  children,
  className = "",
  tilt = 7,
}: {
  children: ReactNode;
  className?: string;
  tilt?: number;
}) {
  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const rafId = useRef<number | null>(null);

  const { outerClass, innerClass } = splitCardClasses(className);

  const reset = () => {
    if (rafId.current !== null) {
      cancelAnimationFrame(rafId.current);
      rafId.current = null;
    }
    const innerEl = innerRef.current;
    if (!innerEl) return;
    innerEl.style.setProperty("--rx", "0deg");
    innerEl.style.setProperty("--ry", "0deg");
    innerEl.style.removeProperty("--mx");
    innerEl.style.removeProperty("--my");
  };

  useEffect(() => {
    const handleScrollOrBlur = () => {
      reset();
    };

    window.addEventListener("scroll", handleScrollOrBlur, { passive: true });
    window.addEventListener("blur", handleScrollOrBlur);

    return () => {
      if (rafId.current !== null) {
        cancelAnimationFrame(rafId.current);
      }
      window.removeEventListener("scroll", handleScrollOrBlur);
      window.removeEventListener("blur", handleScrollOrBlur);
    };
  }, []);

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse") return;
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const outerEl = outerRef.current;
    const innerEl = innerRef.current;
    if (!outerEl || !innerEl) return;

    const clientX = e.clientX;
    const clientY = e.clientY;

    if (rafId.current !== null) {
      cancelAnimationFrame(rafId.current);
    }

    rafId.current = requestAnimationFrame(() => {
      if (!outerEl || !innerEl) return;
      // Compute pointer position from OUTER element's getBoundingClientRect() (stable, never transforms)
      const r = outerEl.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) return;

      // Clamp px and py to 0..1
      const px = Math.max(0, Math.min(1, (clientX - r.left) / r.width));
      const py = Math.max(0, Math.min(1, (clientY - r.top) / r.height));

      const rx = (0.5 - py) * tilt * 2;
      const ry = (px - 0.5) * tilt * 2;

      // Set --mx, --my, --rx and --ry on the INNER element
      innerEl.style.setProperty("--rx", `${rx.toFixed(2)}deg`);
      innerEl.style.setProperty("--ry", `${ry.toFixed(2)}deg`);
      innerEl.style.setProperty("--mx", `${(clientX - r.left).toFixed(1)}px`);
      innerEl.style.setProperty("--my", `${(clientY - r.top).toFixed(1)}px`);
      rafId.current = null;
    });
  };

  const onLeave = () => {
    reset();
  };

  return (
    <div
      ref={outerRef}
      onPointerEnter={onMove}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      onPointerCancel={onLeave}
      className={`glass-card-hit ${outerClass}`}
    >
      <div
        ref={innerRef}
        className={`glass-card ${innerClass}`}
        style={{ height: "100%" }}
      >
        {children}
      </div>
    </div>
  );
}
