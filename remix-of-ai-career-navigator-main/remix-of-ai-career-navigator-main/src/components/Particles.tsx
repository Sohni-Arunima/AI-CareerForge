import { useMemo } from "react";

export function Particles({ count = 28 }: { count?: number }) {
  const items = useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        size: 2 + Math.random() * 4,
        delay: Math.random() * 18,
        duration: 14 + Math.random() * 18,
        hue: Math.random() > 0.5 ? "var(--neon-cyan)" : "var(--neon-violet)",
      })),
    [count],
  );
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {items.map((p) => (
        <span
          key={p.id}
          style={{
            position: "absolute",
            left: `${p.left}%`,
            bottom: "-10vh",
            width: p.size,
            height: p.size,
            borderRadius: "9999px",
            background: p.hue,
            boxShadow: `0 0 12px ${p.hue}`,
            animation: `float-up ${p.duration}s linear ${p.delay}s infinite`,
            opacity: 0.6,
          }}
        />
      ))}
    </div>
  );
}
