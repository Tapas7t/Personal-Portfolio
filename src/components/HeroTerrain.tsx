import React, { useEffect, useRef, useState } from 'react';

interface HeroTerrainProps {
  heroRef?: React.RefObject<HTMLElement | null>;
}

interface Tile {
  c: number;
  r: number;
  depth: number;
  baseH: number;
}

const COLS = 10;
const ROWS = 8;

export const HeroTerrain: React.FC<HeroTerrainProps> = ({ heroRef }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [isInView, setIsInView] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Mouse parallax tracking
  const targetMouseX = useRef(0.5);
  const targetMouseY = useRef(0.5);
  const currentMouseX = useRef(0.5);
  const currentMouseY = useRef(0.5);

  // Precompute sorted 80 tiles for deterministic back-to-front occlusion
  const tilesRef = useRef<Tile[]>([]);

  useEffect(() => {
    if (tilesRef.current.length === 0) {
      const list: Tile[] = [];
      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          const baseH =
            22 +
            Math.sin(c * 0.65 + r * 0.5) * 14 +
            Math.cos(c * 0.4 - r * 0.7) * 10;
          list.push({ c, r, depth: c + r, baseH });
        }
      }
      // Painter's algorithm: sort ascending by depth (c + r)
      list.sort((a, b) => a.depth - b.depth);
      tilesRef.current = list;
    }
  }, []);

  // Responsive & reduced motion detection
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(motionQuery.matches);

    const onMotionChange = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    motionQuery.addEventListener('change', onMotionChange);
    window.addEventListener('resize', checkMobile);

    return () => {
      motionQuery.removeEventListener('change', onMotionChange);
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  // Track hero visibility to pause RAF when off-screen
  useEffect(() => {
    const target = heroRef?.current || containerRef.current;
    if (!target || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0 }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [heroRef]);

  // Window mouse tracking for smooth parallax
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const onMouseMove = (e: MouseEvent) => {
      targetMouseX.current = e.clientX / window.innerWidth;
      targetMouseY.current = e.clientY / window.innerHeight;
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMouseMove);
  }, []);

  // Main canvas render & drift loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let startTime = performance.now();
    const isLowEnd =
      typeof navigator !== 'undefined' &&
      navigator.hardwareConcurrency != null &&
      navigator.hardwareConcurrency <= 4;
    const isStatic = isMobile || prefersReducedMotion;

    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, isLowEnd || isMobile ? 1.5 : 2);

      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const render = (now: number) => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const width = parent.clientWidth;
      const height = parent.clientHeight;

      ctx.clearRect(0, 0, width, height);

      // Smooth mouse interpolation (lerp)
      currentMouseX.current += (targetMouseX.current - currentMouseX.current) * 0.06;
      currentMouseY.current += (targetMouseY.current - currentMouseY.current) * 0.06;

      const parallaxX = isStatic ? 0 : (currentMouseX.current - 0.5) * 28;
      const parallaxY = isStatic ? 0 : (currentMouseY.current - 0.5) * 18;

      // Base origin of the isometric grid (anchored on the left-center)
      const originX = width * 0.30 + parallaxX;
      const originY = height * 0.42 + parallaxY;

      // Scale tile dimensions to viewport width
      const tileW = Math.max(50, Math.min(84, width * 0.065));
      const tileD = tileW * 0.52;
      const halfW = tileW * 0.5;
      const halfD = tileD * 0.5;

      const elapsed = now - startTime;
      const tiles = tilesRef.current;

      // Render 80 blocks in back-to-front depth order
      for (let i = 0; i < tiles.length; i++) {
        const { c, r, baseH } = tiles[i];

        const groundX = originX + (c - r) * halfW;
        const groundY = originY + (c + r) * halfD;

        // Slow ambient wave drift
        const drift = isStatic
          ? 0
          : Math.sin(c * 0.45 + r * 0.55 + elapsed * 0.001) * 8.5;
        const h = Math.max(10, baseH + drift);

        // Horizontal fade: visible on left/center, fades out before photo on the right
        const fadeStart = width * 0.32;
        const fadeEnd = width * 0.66;
        let alpha = 1;
        if (groundX > fadeStart) {
          alpha = Math.max(0, 1 - (groundX - fadeStart) / (fadeEnd - fadeStart));
        }

        // Fade near bottom screen boundary
        if (groundY > height * 0.88) {
          alpha *= Math.max(0, 1 - (groundY - height * 0.88) / (height * 0.12));
        }

        if (alpha <= 0.01) continue;

        // Vertices for 3D block
        // Top face 4 points (elevated by h):
        const p0 = { x: groundX, y: groundY - h - halfD }; // top-back
        const p1 = { x: groundX + halfW, y: groundY - h }; // top-right
        const p2 = { x: groundX, y: groundY - h + halfD }; // top-front
        const p3 = { x: groundX - halfW, y: groundY - h }; // top-left

        // Base ground vertices:
        const b1 = { x: groundX + halfW, y: groundY };     // ground-right
        const b2 = { x: groundX, y: groundY + halfD };     // ground-front
        const b3 = { x: groundX - halfW, y: groundY };     // ground-left

        // Left face (front-left dark shadow):
        ctx.fillStyle = `rgba(10, 12, 17, ${alpha * 0.95})`;
        ctx.beginPath();
        ctx.moveTo(p3.x, p3.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.lineTo(b2.x, b2.y);
        ctx.lineTo(b3.x, b3.y);
        ctx.closePath();
        ctx.fill();

        // Right face (front-right mid-shadow):
        ctx.fillStyle = `rgba(13, 15, 21, ${alpha * 0.95})`;
        ctx.beginPath();
        ctx.moveTo(p2.x, p2.y);
        ctx.lineTo(p1.x, p1.y);
        ctx.lineTo(b1.x, b1.y);
        ctx.lineTo(b2.x, b2.y);
        ctx.closePath();
        ctx.fill();

        // Top face (matte charcoal with subtle elevation lighting):
        const normH = Math.min(1, Math.max(0, (h - 10) / 36));
        const rVal = Math.round(18 + normH * 10);
        const gVal = Math.round(20 + normH * 10);
        const bVal = Math.round(27 + normH * 12);
        ctx.fillStyle = `rgba(${rVal}, ${gVal}, ${bVal}, ${alpha * 0.96})`;
        ctx.beginPath();
        ctx.moveTo(p0.x, p0.y);
        ctx.lineTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.lineTo(p3.x, p3.y);
        ctx.closePath();
        ctx.fill();

        // Hairline top border for crisp matte texture:
        ctx.strokeStyle = `rgba(255, 255, 255, ${alpha * 0.04})`;
        ctx.lineWidth = 0.75;
        ctx.stroke();

        // Faint gold rim light on upper edges:
        ctx.strokeStyle = `rgba(255, 196, 70, ${alpha * (0.10 + normH * 0.16)})`;
        ctx.lineWidth = 1.1;
        ctx.beginPath();
        ctx.moveTo(p3.x, p3.y);
        ctx.lineTo(p0.x, p0.y);
        ctx.lineTo(p1.x, p1.y);
        ctx.stroke();
      }

      // Continue animation loop only if hero is in view and not static
      if (!isStatic && isInView) {
        animId = requestAnimationFrame(render);
      }
    };

    if (isStatic) {
      render(startTime);
    } else if (isInView) {
      animId = requestAnimationFrame(render);
    }

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [isInView, isMobile, prefersReducedMotion]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0 [mask-image:linear-gradient(to_right,black_0%,black_35%,rgba(0,0,0,0.5)_58%,transparent_76%)] [-webkit-mask-image:linear-gradient(to_right,black_0%,black_35%,rgba(0,0,0,0.5)_58%,transparent_76%)]"
      aria-hidden="true"
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full block pointer-events-none will-change-transform"
      />
    </div>
  );
};
