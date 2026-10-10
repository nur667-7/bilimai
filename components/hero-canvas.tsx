"use client";
import { useEffect, useRef, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { themeStorageKey } from "@/lib/user-profile";

export function useAniqTheme() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(themeStorageKey) ?? localStorage.getItem("bilim-theme");
      const isDark = saved === "dark";
      setDark(isDark);
      document.documentElement.classList.toggle("dark", isDark);
    } catch {}
  }, []);

  function toggleTheme() {
    setDark((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(themeStorageKey, next ? "dark" : "light");
        document.documentElement.classList.toggle("dark", next);
      } catch {}
      return next;
    });
  }

  return { dark, toggleTheme };
}

export function ThemeToggleButton({
  dark,
  onToggle,
  label = "Тёмная тема"
}: {
  dark: boolean;
  onToggle: () => void;
  label?: string;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={label}
      title={label}
      className="aniq-icon-btn"
    >
      {dark ? <Sun size={17} /> : <Moon size={17} />}
    </button>
  );
}

interface Node3D {
  x: number;
  y: number;
  z: number;
  neighbors: number[];
}

export function HeroCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Build 320-point Fibonacci sphere with nearest-neighbor edges
    const count = 320;
    const goldenAngle = Math.PI * (3 - Math.sqrt(5));
    const nodes: Node3D[] = [];

    for (let i = 0; i < count; i++) {
      const y = 1 - (i / (count - 1)) * 2;
      const radius = Math.sqrt(Math.max(0, 1 - y * y));
      const theta = goldenAngle * i;
      nodes.push({
        x: Math.cos(theta) * radius,
        y,
        z: Math.sin(theta) * radius,
        neighbors: []
      });
    }

    for (let i = 0; i < count; i++) {
      let linked = 0;
      for (let j = i + 1; j < count && linked < 3; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dz = nodes[i].z - nodes[j].z;
        if (dx * dx + dy * dy + dz * dz < 0.068) {
          nodes[i].neighbors.push(j);
          linked++;
        }
      }
    }

    let width = 0;
    let height = 0;
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.clientWidth || window.innerWidth;
      height = canvas.clientHeight || 520;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    let targetMouseX = 0;
    let targetMouseY = 0;
    let smoothMouseX = 0;
    let smoothMouseY = 0;

    const onMouseMove = (e: MouseEvent) => {
      if (!width || !height) return;
      targetMouseX = (e.clientX / width - 0.5) * 0.55;
      targetMouseY = (e.clientY / height - 0.5) * 0.45;
    };

    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMouseMove, { passive: true });

    let angleY = 0.3;
    const angleX = 0.18;
    let rafId = 0;

    const renderFrame = () => {
      ctx.clearRect(0, 0, width, height);

      smoothMouseX += (targetMouseX - smoothMouseX) * 0.05;
      smoothMouseY += (targetMouseY - smoothMouseY) * 0.05;

      if (!reducedMotion) {
        angleY += 0.0022;
      }

      const rotY = angleY + smoothMouseX;
      const rotX = angleX + smoothMouseY;
      const cosY = Math.cos(rotY);
      const sinY = Math.sin(rotY);
      const cosX = Math.cos(rotX);
      const sinX = Math.sin(rotX);

      const sphereRadius = Math.min(width, height) * 0.42;
      const cx = width * 0.5;
      const cy = height * 0.46;
      const isDark = document.documentElement.classList.contains("dark");

      const projected = nodes.map((n) => {
        const x1 = n.x * cosY - n.z * sinY;
        const z1 = n.z * cosY + n.x * sinY;
        const y2 = n.y * cosX - z1 * sinX;
        const z2 = z1 * cosX + n.y * sinX;
        const perspective = 2.6 / (2.6 - z2 * 0.75);
        return {
          px: cx + x1 * sphereRadius * perspective,
          py: cy + y2 * sphereRadius * perspective,
          z: z2,
          scale: perspective
        };
      });

      // Draw edges
      ctx.lineWidth = 0.85;
      for (let i = 0; i < count; i++) {
        const p1 = projected[i];
        if (p1.z < -0.55) continue;
        for (const j of nodes[i].neighbors) {
          const p2 = projected[j];
          const depth = (p1.z + p2.z) * 0.5;
          if (depth < -0.5) continue;
          const alpha = Math.max(0.03, (depth + 0.65) * (isDark ? 0.22 : 0.16));
          ctx.strokeStyle = isDark
            ? `rgba(232, 163, 76, ${alpha.toFixed(3)})`
            : `rgba(217, 138, 43, ${alpha.toFixed(3)})`;
          ctx.beginPath();
          ctx.moveTo(p1.px, p1.py);
          ctx.lineTo(p2.px, p2.py);
          ctx.stroke();
        }
      }

      // Draw nodes
      for (let i = 0; i < count; i++) {
        const p = projected[i];
        if (p.z < -0.75) continue;
        const normZ = (p.z + 1) * 0.5;
        const r = Math.max(1.1, (1.1 + normZ * 1.9) * (p.scale * 0.78));
        const alpha = Math.max(0.12, normZ * (isDark ? 0.78 : 0.62));
        ctx.fillStyle =
          i % 5 === 0
            ? `rgba(216, 90, 48, ${alpha.toFixed(3)})`
            : `rgba(217, 138, 43, ${alpha.toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(p.px, p.py, r, 0, Math.PI * 2);
        ctx.fill();
      }

      if (!reducedMotion) {
        rafId = window.requestAnimationFrame(renderFrame);
      }
    };

    renderFrame();

    return () => {
      window.cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="aniq-hero-canvas"
    />
  );
}
