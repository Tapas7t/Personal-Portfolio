import Lenis from 'lenis';
import { frame, cancelFrame } from 'motion/react';

declare global {
  interface Window {
    __lenis?: Lenis | null;
  }
}

let lenisInstance: Lenis | null = null;
let frameCallback: ((data: { timestamp: number }) => void) | null = null;
let cleanupMotionListener: (() => void) | null = null;

export function getLenis(): Lenis | null {
  return lenisInstance;
}

export function initSmoothScroll(): () => void {
  if (typeof window === 'undefined') return () => {};

  // Respect user preference for reduced motion
  const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

  const start = () => {
    if (lenisInstance) return;

    // Natural, snappy smooth scroll without heavy inertia lag
    const lenis = new Lenis({
      duration: 0.9,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      syncTouch: false, // Maintain native touch responsiveness on mobile/trackpads
      touchMultiplier: 1,
      wheelMultiplier: 1,
      autoRaf: false, // Frame driven directly by Motion's frame.update
    });

    lenisInstance = lenis;
    window.__lenis = lenis;

    // Synchronize frame-by-frame with Motion's render loop
    const onFrameUpdate = (data: { timestamp: number }) => {
      const time = typeof data?.timestamp === 'number' ? data.timestamp : performance.now();
      lenis.raf(time);
    };

    frameCallback = onFrameUpdate;
    frame.update(onFrameUpdate, true);

    // Initial hash landing with floating navbar offset
    if (window.location.hash) {
      setTimeout(() => {
        if (window.location.hash && lenisInstance) {
          lenisInstance.scrollTo(window.location.hash, { offset: -85, immediate: true });
        }
      }, 60);
    }
  };

  const stop = () => {
    if (frameCallback) {
      cancelFrame(frameCallback);
      frameCallback = null;
    }
    if (lenisInstance) {
      lenisInstance.destroy();
      lenisInstance = null;
      window.__lenis = null;
    }
  };

  if (!motionQuery.matches) {
    start();
  }

  const handleMotionChange = (e: MediaQueryListEvent) => {
    if (e.matches) {
      stop();
    } else {
      start();
    }
  };

  motionQuery.addEventListener('change', handleMotionChange);
  cleanupMotionListener = () => motionQuery.removeEventListener('change', handleMotionChange);

  return () => {
    if (cleanupMotionListener) {
      cleanupMotionListener();
      cleanupMotionListener = null;
    }
    stop();
  };
}

export function scrollToTarget(
  target: string | number | HTMLElement,
  options?: { offset?: number; duration?: number; immediate?: boolean }
) {
  const offset = options?.offset ?? -85;
  const duration = options?.duration ?? 0.9;
  const immediate = options?.immediate ?? false;

  if (lenisInstance) {
    lenisInstance.scrollTo(target, {
      offset,
      duration,
      immediate,
    });
  } else {
    // Native fallback when Lenis is disabled (e.g. prefers-reduced-motion)
    if (typeof target === 'number') {
      window.scrollTo({
        top: Math.max(0, target),
        behavior: immediate ? 'auto' : 'smooth',
      });
    } else if (typeof target === 'string') {
      const id = target.startsWith('#') ? target.slice(1) : target;
      const el = document.getElementById(id);
      if (el) {
        const rect = el.getBoundingClientRect();
        const top = rect.top + window.scrollY + offset;
        window.scrollTo({
          top: Math.max(0, top),
          behavior: immediate ? 'auto' : 'smooth',
        });
      }
    } else if (target instanceof HTMLElement) {
      const rect = target.getBoundingClientRect();
      const top = rect.top + window.scrollY + offset;
      window.scrollTo({
        top: Math.max(0, top),
        behavior: immediate ? 'auto' : 'smooth',
      });
    }
  }
}

export function stopScroll() {
  lenisInstance?.stop();
}

export function startScroll() {
  lenisInstance?.start();
}
