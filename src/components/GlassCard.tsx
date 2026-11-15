import { useRef, useEffect, type ReactNode, type PointerEvent } from "react";

export default function GlassCard({
  children,
  className = "",
  tilt = 7,
}: {
  children: ReactNode;
  className?: string;
  tilt?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const rafId = useRef<number | null>(null);

  const reset = () => {
    if (rafId.current !== null) {
      cancelAnimationFrame(rafId.current);
      rafId.current = null;
    }
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
    el.style.removeProperty("--mx");
    el.style.removeProperty("--my");
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

    const el = ref.current;
    if (!el) return;

    const clientX = e.clientX;
    const clientY = e.clientY;

    if (rafId.current !== null) {
      cancelAnimationFrame(rafId.current);
    }

    rafId.current = requestAnimationFrame(() => {
      if (!el) return;
      const r = el.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) return;

      const px = Math.max(0, Math.min(1, (clientX - r.left) / r.width));
      const py = Math.max(0, Math.min(1, (clientY - r.top) / r.height));

      const rx = (0.5 - py) * tilt * 2;
      const ry = (px - 0.5) * tilt * 2;

      el.style.setProperty("--rx", `${rx.toFixed(2)}deg`);
      el.style.setProperty("--ry", `${ry.toFixed(2)}deg`);
      el.style.setProperty("--mx", `${clientX - r.left}px`);
      el.style.setProperty("--my", `${clientY - r.top}px`);
      rafId.current = null;
    });
  };

  const onLeave = () => {
    reset();
  };

  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      onPointerCancel={onLeave}
      className={`glass-card ${className}`}
    >
      {children}
    </div>
  );
}
