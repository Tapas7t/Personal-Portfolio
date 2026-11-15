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

export const NAV_OFFSET = 96;

let isNavScrolling = false;
let holdTimer: ReturnType<typeof setTimeout> | null = null;
let masterSafetyTimer: ReturnType<typeof setTimeout> | null = null;
let activeRafId: number | null = null;
let currentRunId = 0;

type NavScrollListener = (targetId: string, status: 'start' | 'end') => void;
const navScrollListeners = new Set<NavScrollListener>();

export function getIsNavScrolling(): boolean {
  return isNavScrolling;
}

export function subscribeNavScroll(listener: NavScrollListener): () => void {
  navScrollListeners.add(listener);
  return () => {
    navScrollListeners.delete(listener);
  };
}

// ---------------------------------------------------------------------------
// Input blockers: prevent wheel, touchmove, and scroll keys from cancelling native scroll
// ---------------------------------------------------------------------------
const SCROLL_KEYS = new Set([
  ' ',
  'Space',
  'ArrowUp',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'PageUp',
  'PageDown',
  'Home',
  'End',
]);

const preventScrollEvent = (e: Event) => {
  if (e.cancelable) {
    e.preventDefault();
  }
};

const preventKeyScroll = (e: KeyboardEvent) => {
  if (SCROLL_KEYS.has(e.key) || SCROLL_KEYS.has(e.code)) {
    const target = e.target as HTMLElement | null;
    if (
      target &&
      (target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable)
    ) {
      return;
    }
    if (e.cancelable) {
      e.preventDefault();
    }
  }
};

let blockersAttached = false;
function attachBlockers() {
  if (blockersAttached || typeof window === 'undefined') return;
  blockersAttached = true;
  window.addEventListener('wheel', preventScrollEvent, { passive: false, capture: true });
  window.addEventListener('touchmove', preventScrollEvent, { passive: false, capture: true });
  window.addEventListener('keydown', preventKeyScroll, { passive: false, capture: true });
}

function removeBlockers() {
  if (!blockersAttached || typeof window === 'undefined') return;
  blockersAttached = false;
  window.removeEventListener('wheel', preventScrollEvent, { capture: true });
  window.removeEventListener('touchmove', preventScrollEvent, { capture: true });
  window.removeEventListener('keydown', preventKeyScroll, { capture: true });
}

function setNavScrollActive(active: boolean) {
  if (typeof document === 'undefined') return;
  if (active) {
    document.documentElement.dataset.navScroll = '1';
    try {
      document.querySelectorAll('svg').forEach((svg) => {
        if (typeof (svg as SVGSVGElement).pauseAnimations === 'function') {
          (svg as SVGSVGElement).pauseAnimations();
        }
      });
    } catch {}
  } else {
    delete document.documentElement.dataset.navScroll;
    try {
      document.querySelectorAll('svg').forEach((svg) => {
        if (typeof (svg as SVGSVGElement).unpauseAnimations === 'function') {
          (svg as SVGSVGElement).unpauseAnimations();
        }
      });
    } catch {}
  }
}

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
      if (isNavScrolling) return;
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

export function scrollToSection(
  target: string | number | HTMLElement,
  options?: { offset?: number; duration?: number; immediate?: boolean }
) {
  if (typeof window === 'undefined') return;

  // 1. Each click increments runId and cancels any prior run
  const runId = ++currentRunId;

  if (activeRafId !== null) {
    cancelAnimationFrame(activeRafId);
    activeRafId = null;
  }
  if (holdTimer) {
    clearTimeout(holdTimer);
    holdTimer = null;
  }
  if (masterSafetyTimer) {
    clearTimeout(masterSafetyTimer);
    masterSafetyTimer = null;
  }

  // 2. Determine target element and raw id
  let rawId = '';
  if (typeof target === 'string') {
    rawId = target.startsWith('#') ? target.slice(1) : target;
  } else if (target instanceof HTMLElement) {
    rawId = target.id;
  }
  if (rawId === 'connect') rawId = 'resume';

  let targetEl: HTMLElement | null = null;
  if (typeof target === 'string') {
    if (rawId === 'resume') {
      targetEl = document.getElementById('resume') || document.getElementById('connect');
    } else {
      targetEl = document.getElementById(rawId);
    }
  } else if (target instanceof HTMLElement) {
    targetEl = target;
  }

  // Measure fresh at click time:
  // y = max(0, el.getBoundingClientRect().top + window.scrollY - NAV_OFFSET)
  const fromY = window.scrollY || window.pageYOffset || 0;
  const effectiveOffset = options?.offset ?? NAV_OFFSET;
  let y = 0;

  if (rawId === 'hero' || rawId === 'top') {
    y = 0;
  } else if (targetEl) {
    const rect = targetEl.getBoundingClientRect();
    y = Math.max(0, rect.top + fromY - effectiveOffset);
  } else if (typeof target === 'number') {
    y = Math.max(0, target);
  }

  const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
  y = Math.min(y, maxScroll);

  // 3. Pause Lenis and use NATIVE scrolling for the nav jump
  lenisInstance?.stop();
  (lenisInstance as any)?.reset?.();
  document.documentElement.dataset.navScroll = '1';
  setNavScrollActive(true);

  // Set the clicked link active immediately
  isNavScrolling = true;
  navScrollListeners.forEach((fn) => fn(rawId || (y === 0 ? 'hero' : 'unknown'), 'start'));

  // 4. Make it uncancellable: add capture listeners on wheel, touchmove and keydown
  attachBlockers();

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const behavior: ScrollBehavior = options?.immediate || prefersReducedMotion ? 'auto' : 'smooth';

  window.scrollTo({ top: y, behavior });

  // 8. Safety: 2.5s master timer that always restores Lenis, removes blockers and unlocks
  masterSafetyTimer = setTimeout(() => {
    if (runId === currentRunId) {
      cleanupAndRestore('timeout');
    }
  }, 2500);

  // Helper: Cleanup and restore state
  let isRestored = false;
  const cleanupAndRestore = (result: string) => {
    if (isRestored || runId !== currentRunId) return;
    isRestored = true;

    if (activeRafId !== null) {
      cancelAnimationFrame(activeRafId);
      activeRafId = null;
    }
    if (masterSafetyTimer) {
      clearTimeout(masterSafetyTimer);
      masterSafetyTimer = null;
    }

    const endY = window.scrollY || window.pageYOffset || 0;

    // Remove input blockers
    removeBlockers();

    // Delete data-nav-scroll
    if (typeof document !== 'undefined') {
      delete document.documentElement.dataset.navScroll;
      setNavScrollActive(false);
    }

    // Restart Lenis and sync to new position
    if (lenisInstance) {
      (lenisInstance as any).reset?.();
      lenisInstance.start();
      lenisInstance.scrollTo(endY, { immediate: true, force: true });
    }

    // Update URL hash ONCE with history.replaceState
    const targetHashId = rawId || (y === 0 ? 'hero' : '');
    if (targetHashId && targetHashId !== 'hero' && targetHashId !== 'top') {
      if (window.location.hash !== `#${targetHashId}`) {
        window.history.replaceState(null, '', `#${targetHashId}`);
      }
    } else {
      if (window.location.hash) {
        window.history.replaceState(null, '', window.location.pathname + window.location.search);
      }
    }

    // Hold clicked link active for 600ms, then let scroll-spy take over
    if (holdTimer) clearTimeout(holdTimer);
    holdTimer = setTimeout(() => {
      if (runId === currentRunId) {
        isNavScrolling = false;
        navScrollListeners.forEach((fn) => fn(targetHashId || 'hero', 'end'));
      }
    }, 600);
  };

  // 6. Force the final position & verify up to 3 times
  let correctionsCount = 0;
  const forceAndVerify = (initialReason: 'ok' | 'timeout') => {
    if (runId !== currentRunId) return;

    const currentScrollY = window.scrollY || window.pageYOffset || 0;
    if (Math.abs(currentScrollY - y) > 2) {
      window.scrollTo({ top: y, behavior: 'auto' });
    }

    // Re-measure the target after 2 more frames
    activeRafId = requestAnimationFrame(() => {
      activeRafId = requestAnimationFrame(() => {
        if (runId !== currentRunId) return;

        if (targetEl && rawId !== 'hero' && rawId !== 'top') {
          const freshRect = targetEl.getBoundingClientRect();
          const error = freshRect.top - effectiveOffset;

          if (Math.abs(error) > 2 && correctionsCount < 3) {
            correctionsCount++;
            y = Math.max(0, y + error);
            window.scrollTo({ top: y, behavior: 'auto' });
            forceAndVerify(initialReason);
            return;
          }
        } else if (rawId === 'hero' || rawId === 'top') {
          const topError = window.scrollY || window.pageYOffset || 0;
          if (topError > 2 && correctionsCount < 3) {
            correctionsCount++;
            window.scrollTo({ top: 0, behavior: 'auto' });
            forceAndVerify(initialReason);
            return;
          }
        }

        const finalResult =
          correctionsCount > 0 ? `corrected(${correctionsCount})` : initialReason;
        cleanupAndRestore(finalResult);
      });
    });
  };

  // 5. Detect completion with requestAnimationFrame loop
  const startTime = performance.now();
  let nearTargetCount = 0;
  let lastY = window.scrollY || window.pageYOffset || 0;
  let unchangedFrames = 0;

  const monitorCompletion = () => {
    activeRafId = requestAnimationFrame(() => {
      if (runId !== currentRunId) return;

      const now = performance.now();
      const currentScrollY = window.scrollY || window.pageYOffset || 0;

      // Timeout after 1800ms
      if (now - startTime >= 1800) {
        forceAndVerify('timeout');
        return;
      }

      // Check |window.scrollY - y| < 2 for 3 frames in a row
      if (Math.abs(currentScrollY - y) < 2) {
        nearTargetCount++;
        if (nearTargetCount >= 3) {
          forceAndVerify('ok');
          return;
        }
      } else {
        nearTargetCount = 0;
      }

      // Check scrollY unchanged (< 1px) for 10 frames (after 250ms movement threshold)
      if (now - startTime > 250 && Math.abs(currentScrollY - lastY) < 1) {
        unchangedFrames++;
        if (unchangedFrames >= 10) {
          forceAndVerify('ok');
          return;
        }
      } else {
        unchangedFrames = 0;
      }

      lastY = currentScrollY;
      monitorCompletion();
    });
  };

  monitorCompletion();
}

export function scrollToTarget(
  target: string | number | HTMLElement,
  options?: { offset?: number; duration?: number; immediate?: boolean }
) {
  scrollToSection(target, options);
}

export function stopScroll() {
  lenisInstance?.stop();
}

export function startScroll() {
  lenisInstance?.start();
}
