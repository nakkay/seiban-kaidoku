"use client";

import { useEffect, useRef } from "react";

interface StarfieldProps {
  starCount?: number;
  showShootingStars?: boolean;
}

export function Starfield({
  starCount = 60,
  showShootingStars = false,
}: StarfieldProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Clear existing stars
    container.innerHTML = "";

    // Generate stars
    for (let i = 0; i < starCount; i++) {
      const star = document.createElement("div");
      star.className = "star";
      star.style.left = `${Math.random() * 100}%`;
      star.style.top = `${Math.random() * 100}%`;
      const size = Math.random() * 1.5 + 0.5;
      star.style.width = `${size}px`;
      star.style.height = `${size}px`;
      star.style.animationDelay = `${Math.random() * 4}s`;
      star.style.animationDuration = `${Math.random() * 3 + 3}s`;
      container.appendChild(star);
    }
  }, [starCount]);

  return (
    <>
      <style jsx global>{`
        .star {
          position: absolute;
          background: #e8c878;
          border-radius: 50%;
          animation: twinkle 4s infinite ease-in-out;
        }
        @keyframes twinkle {
          0%,
          100% {
            opacity: 0.2;
          }
          50% {
            opacity: 0.7;
          }
        }
        .shooting-star {
          position: fixed;
          width: 100px;
          height: 2px;
          background: linear-gradient(90deg, #e8c878, transparent);
          opacity: 0;
          animation: shoot 4s infinite;
        }
        @keyframes shoot {
          0% {
            opacity: 0;
            transform: translateX(0) translateY(0) rotate(-35deg);
          }
          5% {
            opacity: 1;
          }
          15% {
            opacity: 0;
            transform: translateX(200px) translateY(100px) rotate(-35deg);
          }
          100% {
            opacity: 0;
          }
        }
      `}</style>

      <div
        ref={containerRef}
        className="fixed inset-0 pointer-events-none overflow-hidden z-0"
        aria-hidden="true"
      />

      {showShootingStars && (
        <>
          <div
            className="shooting-star"
            style={{ top: "15%", left: "10%", animationDelay: "1s" }}
          />
          <div
            className="shooting-star"
            style={{ top: "35%", left: "60%", animationDelay: "2.5s" }}
          />
          <div
            className="shooting-star"
            style={{ top: "60%", left: "30%", animationDelay: "0.5s" }}
          />
        </>
      )}
    </>
  );
}


