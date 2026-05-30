import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import logo from "@/assets/skyths-logo.png";
import heroBg from "@/assets/hero-bg.jpg";

interface IntroAnimationProps {
  onComplete: () => void;
}

const IntroAnimation = ({ onComplete }: IntroAnimationProps) => {
  const [phase, setPhase] = useState<"hi" | "welcome">("hi");

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("welcome"), 1800);
    const t2 = setTimeout(() => onComplete(), 5200);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [onComplete]);

  const particles = useMemo(
    () =>
      Array.from({ length: 35 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        top: Math.random() * 100,
        size: Math.random() * 3 + 1,
        duration: Math.random() * 6 + 6,
        delay: Math.random() * 4,
      })),
    []
  );

  return (
    <motion.div
      className="fixed inset-0 z-[9999] overflow-hidden bg-background"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.08, filter: "blur(20px)" }}
      transition={{ duration: 1.1, ease: [0.65, 0, 0.35, 1] }}
    >
      {/* Leather texture base */}
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.35 }}
        transition={{ duration: 2, ease: "easeOut" }}
      >
        <img src={heroBg} alt="" className="w-full h-full object-cover" />
      </motion.div>

      {/* Vignette */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-background/70 to-background" />
      <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-transparent to-background/80" />

      {/* Orange ambient glow */}
      <motion.div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vmin] h-[80vmin] rounded-full"
        style={{
          background:
            "radial-gradient(circle, hsl(25 80% 55% / 0.35) 0%, hsl(30 85% 45% / 0.15) 40%, transparent 70%)",
          filter: "blur(40px)",
        }}
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 2.5, ease: "easeOut" }}
      />

      {/* Moving fog */}
      <motion.div
        className="absolute inset-0 opacity-30"
        style={{
          background:
            "radial-gradient(ellipse at 20% 70%, hsl(20 25% 18%) 0%, transparent 50%), radial-gradient(ellipse at 80% 30%, hsl(25 30% 20%) 0%, transparent 50%)",
        }}
        animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Dust particles */}
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-primary/60"
          style={{
            left: `${p.left}%`,
            top: `${p.top}%`,
            width: p.size,
            height: p.size,
            boxShadow: "0 0 6px hsl(25 80% 55% / 0.8)",
          }}
          initial={{ opacity: 0, y: 0 }}
          animate={{ opacity: [0, 0.9, 0], y: [-20, -120] }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Center stage */}
      <div className="absolute inset-0 z-10 grid place-items-center px-6">
        <div className="flex flex-col items-center gap-12">
          {/* Logo + rings - absolutely positioned together inside a fixed box */}
          <div className="relative w-[300px] h-[300px] md:w-[400px] md:h-[400px] grid place-items-center">
            {/* Rotating rings */}
            <motion.div
              className="absolute inset-0 rounded-full border border-primary/20"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1, rotate: 360 }}
              transition={{
                opacity: { duration: 1.5 },
                scale: { duration: 1.5, ease: "easeOut" },
                rotate: { duration: 40, repeat: Infinity, ease: "linear" },
              }}
            />
            <motion.div
              className="absolute inset-8 rounded-full border border-primary/30"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1, rotate: -360 }}
              transition={{
                opacity: { duration: 1.5, delay: 0.2 },
                scale: { duration: 1.5, delay: 0.2, ease: "easeOut" },
                rotate: { duration: 30, repeat: Infinity, ease: "linear" },
              }}
            />
            <motion.div
              className="absolute inset-16 rounded-full border border-primary/40"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1, rotate: 360 }}
              transition={{
                opacity: { duration: 1.5, delay: 0.4 },
                scale: { duration: 1.5, delay: 0.4, ease: "easeOut" },
                rotate: { duration: 22, repeat: Infinity, ease: "linear" },
              }}
            />

            {/* Orange rim glow centered on logo */}
            <div
              className="absolute w-40 h-40 md:w-52 md:h-52 rounded-full pointer-events-none"
              style={{
                boxShadow:
                  "0 0 80px hsl(25 80% 55% / 0.6), 0 0 160px hsl(30 85% 60% / 0.3)",
              }}
            />

            {/* Logo - dead center via grid place-items-center */}
            <motion.img
              src={logo}
              alt="Skyths"
              className="relative w-40 h-40 md:w-52 md:h-52 object-contain drop-shadow-2xl"
              initial={{ opacity: 0, scale: 0.6, filter: "blur(20px)" }}
              animate={{
                opacity: 1,
                scale: 1,
                filter: "blur(0px)",
                y: [0, -8, 0],
              }}
              transition={{
                opacity: { duration: 1.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] },
                scale: { duration: 1.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] },
                filter: { duration: 1.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] },
                y: { duration: 4, repeat: Infinity, ease: "easeInOut", delay: 2 },
              }}
            />
          </div>

          {/* Text below logo */}
          <div className="h-20 flex items-center justify-center">
            <AnimatePresence mode="wait">
              {phase === "hi" ? (
                <motion.h1
                  key="hi"
                  className="font-serif text-5xl md:text-7xl font-semibold tracking-wide text-gradient-copper"
                  initial={{ opacity: 0, y: 20, filter: "blur(15px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -20, filter: "blur(15px)" }}
                  transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                >
                  Hi!!
                </motion.h1>
              ) : (
                <motion.div
                  key="welcome"
                  className="text-center"
                  initial={{ opacity: 0, filter: "blur(15px)" }}
                  animate={{ opacity: 1, filter: "blur(0px)" }}
                  exit={{ opacity: 0, filter: "blur(15px)" }}
                  transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                >
                  <p className="font-sans text-[10px] md:text-xs tracking-[0.5em] uppercase text-muted-foreground mb-2">
                    Welcome To
                  </p>
                  <h1 className="font-serif text-3xl md:text-5xl font-semibold tracking-wider whitespace-nowrap">
                    <span className="text-gradient-copper">Skyths</span>{" "}
                    <span className="text-foreground/95">Store</span>
                  </h1>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Loader dots */}
        <motion.div
          className="absolute left-1/2 -translate-x-1/2 bottom-16 flex items-center gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.5 }}
        >
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="w-2 h-2 rounded-full bg-primary"
              style={{ boxShadow: "0 0 12px hsl(25 80% 55% / 0.9)" }}
              animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
              transition={{
                duration: 1.3,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeInOut",
              }}
            />
          ))}
        </motion.div>
      </div>




      {/* Top & bottom film bars for cinematic feel */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-12 bg-background"
        initial={{ y: "-100%" }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      />
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-12 bg-background"
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      />
    </motion.div>
  );
};

export default IntroAnimation;
