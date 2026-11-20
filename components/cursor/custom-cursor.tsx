"use client";

import { useEffect, useRef } from "react";
import { lerp } from "@/lib/math";

export function CustomCursor() {
  const cross = useRef<HTMLDivElement>(null);
  const dot = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;

    let x = 0;
    let y = 0;
    let currentX = 0;
    let currentY = 0;
    let hovering = false;
    let frame = 0;

    const onMove = (event: MouseEvent) => {
      x = event.clientX;
      y = event.clientY;
      if (cross.current) {
        cross.current.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
      }
    };

    const onOver = (event: MouseEvent) => {
      const target = event.target;
      hovering =
        target instanceof Element &&
        Boolean(target.closest("a, button, input, [role='button']"));
    };

    const tick = () => {
      currentX = lerp(currentX, x, 0.12);
      currentY = lerp(currentY, y, 0.12);
      if (dot.current) {
        const scale = hovering ? 2.5 : 1;
        dot.current.style.transform = `translate(${currentX}px, ${currentY}px) translate(-50%, -50%) scale(${scale})`;
      }
      frame = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseover", onOver);
    frame = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <>
      <div
        ref={cross}
        className="cursor-fx fixed top-0 left-0 z-[9999] hidden pointer-events-none lg:block"
        style={{ willChange: "transform" }}
      >
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-px"
          style={{ width: 20, height: 1, background: "#E8702A", opacity: 0.7 }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-px -translate-y-1/2"
          style={{ width: 1, height: 20, background: "#E8702A", opacity: 0.7 }}
        />
      </div>
      <div
        ref={dot}
        className="cursor-fx fixed top-0 left-0 z-[9998] hidden pointer-events-none lg:block"
        style={{
          width: 5,
          height: 5,
          background: "#E8702A",
          borderRadius: "50%",
          willChange: "transform",
        }}
      />
    </>
  );
}
