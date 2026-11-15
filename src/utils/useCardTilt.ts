import React, { useRef } from 'react';
import { useMotionValue, useSpring } from 'motion/react';
import { calculateCardTilt } from './portfolio-logic';

export function useCardTilt(hoverTilt: number = 4.5, clickTilt: number = 10) {
  const cardRef = useRef<HTMLDivElement>(null);
  const tiltX = useMotionValue(0);
  const tiltY = useMotionValue(0);
  const scale = useMotionValue(1);

  const smoothTiltX = useSpring(tiltX, { stiffness: 280, damping: 22 });
  const smoothTiltY = useSpring(tiltY, { stiffness: 280, damping: 22 });
  const smoothScale = useSpring(scale, { stiffness: 280, damping: 22 });

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const tilt = calculateCardTilt(e.clientX, e.clientY, rect, hoverTilt);
    tiltX.set(tilt.rotateX);
    tiltY.set(tilt.rotateY);
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const tilt = calculateCardTilt(e.clientX, e.clientY, rect, clickTilt);
    // If clicked near center, provide a natural 3D dip
    tiltX.set(tilt.rotateX !== 0 ? tilt.rotateX : 5);
    tiltY.set(tilt.rotateY !== 0 ? tilt.rotateY : -3);
    scale.set(0.97);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    scale.set(1);
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const tilt = calculateCardTilt(e.clientX, e.clientY, rect, hoverTilt);
    tiltX.set(tilt.rotateX);
    tiltY.set(tilt.rotateY);
  };

  const handlePointerLeave = () => {
    scale.set(1);
    tiltX.set(0);
    tiltY.set(0);
  };

  return {
    cardRef,
    style: {
      rotateX: smoothTiltX,
      rotateY: smoothTiltY,
      scale: smoothScale,
      transformStyle: 'preserve-3d' as const,
      transformPerspective: 1000,
    },
    bind: {
      ref: cardRef,
      onPointerMove: handlePointerMove,
      onPointerDown: handlePointerDown,
      onPointerUp: handlePointerUp,
      onPointerLeave: handlePointerLeave,
    },
  };
}

