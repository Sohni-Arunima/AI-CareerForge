import { motion } from "framer-motion";
import { Brain } from "lucide-react";

export function AIOrb() {
  return (
    <div className="relative mx-auto h-[340px] w-[340px] sm:h-[420px] sm:w-[420px]">
      {/* outer rings */}
      <div className="absolute inset-0 rounded-full border border-white/10 pulse-ring" />
      <div className="absolute inset-6 rounded-full border border-white/10 pulse-ring" style={{ animationDelay: "1s" }} />
      <div className="absolute inset-12 rounded-full border border-white/10 pulse-ring" style={{ animationDelay: "2s" }} />

      {/* rotating gradient ring */}
      <div
        className="absolute inset-2 rounded-full spin-slow"
        style={{
          background:
            "conic-gradient(from 0deg, var(--neon-violet), var(--neon-cyan), var(--neon-pink), var(--neon-violet))",
          WebkitMask: "radial-gradient(closest-side, transparent 64%, black 66%, black 68%, transparent 70%)",
          mask: "radial-gradient(closest-side, transparent 64%, black 66%, black 68%, transparent 70%)",
          opacity: 0.85,
        }}
      />

      {/* core */}
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-0 grid place-items-center"
      >
        <div className="glass-strong relative grid h-40 w-40 place-items-center rounded-full ring-glow">
          <div
            className="absolute inset-2 rounded-full opacity-70 blur-2xl"
            style={{
              background:
                "radial-gradient(circle, var(--neon-violet), transparent 70%)",
            }}
          />
          <Brain className="relative h-16 w-16 text-white" />
        </div>
      </motion.div>

      {/* orbiting nodes */}
      {[0, 60, 120, 180, 240, 300].map((deg, i) => (
        <motion.div
          key={deg}
          className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            background: i % 2 ? "var(--neon-cyan)" : "var(--neon-pink)",
            boxShadow: `0 0 16px ${i % 2 ? "var(--neon-cyan)" : "var(--neon-pink)"}`,
          }}
          animate={{
            rotate: 360,
          }}
          transition={{ duration: 14 + i, repeat: Infinity, ease: "linear" }}
        >
          <div
            style={{
              transform: `rotate(${deg}deg) translateX(160px)`,
            }}
            className="h-3 w-3 rounded-full bg-inherit"
          />
        </motion.div>
      ))}
    </div>
  );
}
