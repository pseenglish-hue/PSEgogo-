import React, { useEffect, useRef } from 'react';

const CursorGlow: React.FC = () => {
  const glowRef = useRef<HTMLDivElement>(null);
  const posRef = useRef({ mx: 0, my: 0, gx: 0, gy: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      posRef.current.mx = e.clientX;
      posRef.current.my = e.clientY;
      if (glowRef.current) {
        glowRef.current.style.opacity = '1';
      }
    };

    const handleMouseLeave = () => {
      if (glowRef.current) {
        glowRef.current.style.opacity = '0';
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    let animationFrameId: number;

    const animateGlow = () => {
      const { mx, my, gx, gy } = posRef.current;
      
      // Linear interpolation for smooth following
      posRef.current.gx += (mx - gx) * 0.15;
      posRef.current.gy += (my - gy) * 0.15;

      if (glowRef.current) {
        glowRef.current.style.left = `${posRef.current.gx}px`;
        glowRef.current.style.top = `${posRef.current.gy}px`;
      }
      
      animationFrameId = requestAnimationFrame(animateGlow);
    };

    animateGlow();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <div ref={glowRef} className="cursor-glow" />;
};

export default CursorGlow;