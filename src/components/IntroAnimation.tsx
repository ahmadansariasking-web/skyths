import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import logo from "@/assets/skyths-logo.png";
import heroBg from "@/assets/hero-bg.jpg";

interface IntroAnimationProps {
  onComplete: () => void;
}

const EASE_LUX = [0.22, 1, 0.36, 1] as const;

const IntroAnimation = ({ onComplete }: IntroAnimationProps) => {
  const [phase, setPhase] = useState<"hi" | "welcome">("hi");

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("welcome"), 1900);
    const t2 = setTimeout(() => onComplete(), 5800);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [onComplete]);

  const particles = useMemo(
    () =>
      Array.from({ length: 45 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        top: Math.random() * 100,
        size: Math.random() * 3 + 1,
        duration: Math.random() * 6 + 6,
        delay: Math.random() * 4,
        drift: Math.random() * 40 - 20,
      })),
    []
  );

  const welcomeLetters = "WELCOME TO".split("");

  return (
    <motion.div
      className="fixed inset-0 z-[9999] overflow-hidden bg-background"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.08, filter: "blur(24px)" }}
      transition={{ duration: 1.2, ease: [0.65, 0, 0.35, 1] }}
    >
      {/* Leather texture base */}
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0, scale: 1.15 }}
        animate={{ opacity: 0.4, scale: 1 }}
        transition={{ duration: 2.4, ease: "easeOut" }}
      >
        <img src={heroBg} alt="" className="w-full h-full object-cover" />
      </motion.div>

      {/* Vignette */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-background/70 to-background" />
      <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-transparent to-background/85" />

      {/* Orange ambient glow with slow breathing pulse */}
      <motion.div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vmin] h-[90vmin] rounded-full"
        style={{
          background:
            "radial-gradient(circle, hsl(25 80% 55% / 0.4) 0%, hsl(30 85% 45% / 0.18) 38%, transparent 70%)",
          filter: "blur(50px)",
        }}
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: [0, 1, 0.75, 1], scale: [0.5, 1, 1.06, 1] }}
        transition={{
          opacity: { duration: 2.5, ease: "easeOut" },
          scale: {
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2.5,
          },
        }}
      />

      {/* Cinematic light beams from top corners */}
      <motion.div
        className="absolute -top-24 left-[8%] w-[45vmin] h-[130%] origin-top pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, hsl(30 70% 50% / 0.10) 0%, transparent 70%)",
          filter: "blur(30px)",
          transform: "rotate(14deg)",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.8 }}
        transition={{ duration: 2.8, delay: 0.4, ease: "easeOut" }}
      />
      <motion.div
        className="absolute -top-24 right-[8%] w-[45vmin] h-[130%] origin-top pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, hsl(30 70% 50% / 0.08) 0%, transparent 70%)",
          filter: "blur(30px)",
          transform: "rotate(-14deg)",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.7 }}
        transition={{ duration: 2.8, delay: 0.7, ease: "easeOut" }}
      />

      {/* Moving fog */}
      <motion.div
        className="absolute inset-0 opacity-30"
        style={{
          background:
            "radial-gradient(ellipse at 20% 70%, hsl(20 25% 18%) 0%, transparent 50%), radial-gradient(ellipse at 80% 30%, hsl(25 30% 20%) 0%, transparent 50%)",
        }}
        animate={{ x: [0, 40, 0], y: [0, -24, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Floating dust particles with horizontal drift */}
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-primary/60"
          style={{
            left: `${p.left}%`,
            top: `${p.top}%`,
            width: p.size,
            height: p.size,
            boxShadow: "0 0 8px hsl(25 80% 55% / 0.9)",
          }}
          initial={{ opacity: 0, y: 0, x: 0 }}
          animate={{ opacity: [0, 0.9, 0], y: [-30, -140], x: [0, p.drift] }}
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
        <div className="flex flex-col items-center gap-10 md:gap-12">
          {/* Logo + rings - fixed box, logo dead center via grid */}
          <div className="relative w-[300px] h-[300px] md:w-[400px] md:h-[400px] grid place-items-center">
            {/* Rotating rings */}
            <motion.div
              className="absolute inset-0 rounded-full border border-primary/25"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1, rotate: 360 }}
              transition={{
                opacity: { duration: 1.5 },
                scale: { duration: 1.5, ease: EASE_LUX },
                rotate: { duration: 40, repeat: Infinity, ease: "linear" },
              }}
            />
            <motion.div
              className="absolute inset-8 rounded-full border border-dashed border-primary/30"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1, rotate: -360 }}
              transition={{
                opacity: { duration: 1.5, delay: 0.2 },
                scale: { duration: 1.5, delay: 0.2, ease: EASE_LUX },
                rotate: { duration: 30, repeat: Infinity, ease: "linear" },
              }}
            />
            <motion.div
              className="absolute inset-16 rounded-full border border-primary/40"
              style={{
                boxShadow:
                  "inset 0 0 40px hsl(25 80% 55% / 0.15), 0 0 40px hsl(25 80% 55% / 0.15)",
              }}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1, rotate: 360 }}
              transition={{
                opacity: { duration: 1.5, delay: 0.4 },
                scale: { duration: 1.5, delay: 0.4, ease: EASE_LUX },
                rotate: { duration: 22, repeat: Infinity, ease: "linear" },
              }}
            />

            {/* Orbiting light sparks (one per outer ring) */}
            {[
              { size: "inset-0", dur: 8, delay: 0.8 },
              { size: "inset-8", dur: 6, delay: 1.2 },
            ].map((s, i) => (
              <motion.div
                key={i}
                className={`absolute ${s.size}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, rotate: 360 }}
                transition={{
                  opacity: { duration: 1, delay: s.delay },
                  rotate: {
                    duration: s.dur,
                    repeat: Infinity,
                    ease: "linear",
                    delay: s.delay,
                  },
                }}
              >
                <span
                  className="absolute left-1/2 -top-[3px] -translate-x-1/2 block w-1.5 h-1.5 rounded-full bg-primary"
                  style={{
                    boxShadow: "0 0 12px 3px hsl(25 80% 55% / 0.9)",
                  }}
                />
              </motion.div>
            ))}

            {/* Orange rim glow centered on logo */}
            <motion.div
              className="absolute w-40 h-40 md:w-52 md:h-52 rounded-full pointer-events-none"
              style={{
                boxShadow:
                  "0 0 80px hsl(25 80% 55% / 0.6), 0 0 160px hsl(30 85% 60% / 0.3)",
              }}
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{
                duration: 3.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 2,
              }}
            />

            {/* Logo - dead center via grid place-items-center */}
            <motion.img
              src={logo}
              alt="Skyths"
              className="relative w-40 h-40 md:w-52 md:h-52 object-contain drop-shadow-2xl"
              initial={{ opacity: 0, scale: 0.6, filter: "blur(20px)", rotate: -6 }}
              animate={{
                opacity: 1,
                scale: 1,
                rotate: 0,
                filter: "blur(0px)",
                y: [0, -8, 0],
              }}
              transition={{
                opacity: { duration: 1.8, delay: 0.3, ease: EASE_LUX },
                scale: { duration: 1.8, delay: 0.3, ease: EASE_LUX },
                rotate: { duration: 1.8, delay: 0.3, ease: EASE_LUX },
                filter: { duration: 1.8, delay: 0.3, ease: EASE_LUX },
                y: { duration: 4, repeat: Infinity, ease: "easeInOut", delay: 2 },
              }}
            />

            {/* Metallic shine sweep across the logo */}
            <motion.div
              className="absolute w-40 h-40 md:w-52 md:h-52 rounded-full overflow-hidden pointer-events-none"
              style={{ WebkitMaskImage: "radial-gradient(circle, black 74%, transparent 76%)" }}
            >
              <motion.div
                className="absolute inset-y-0 w-1/3 -skew-x-12"
                style={{
                  background:
                    "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.35) 50%, transparent 100%)",
                }}
                initial={{ x: "300%" }}
                animate={{ x: "-300%" }}
                transition={{
                  duration: 1.6,
                  delay: 1.6,
                  ease: "easeInOut",
                  repeat: Infinity,
                  repeatDelay: 3.2,
                }}
              />
            </motion.div>
          </div>

          {/* Text below logo */}
          <div className="h-24 flex flex-col items-center justify-center gap-3">
            <AnimatePresence mode="wait">
              {phase === "hi" ? (
                <motion.h1
                  key="hi"
                  className="font-serif text-5xl md:text-7xl font-semibold tracking-wide text-gradient-copper"
                  initial={{ opacity: 0, y: 20, filter: "blur(15px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -20, filter: "blur(15px)" }}
                  transition={{ duration: 0.9, ease: EASE_LUX }}
                >
                  Hi!!
                </motion.h1>
              ) : (
                <motion.div
                  key="welcome"
                  className="text-center flex flex-col items-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, filter: "blur(15px)" }}
                  transition={{ duration: 0.6 }}
                >
                  {/* Staggered letters: WELCOME TO */}
                  <p className="font-sans text-[10px] md:text-xs tracking-[0.5em] uppercase text-muted-foreground mb-3 flex">
                    {welcomeLetters.map((ch, i) => (
                      <motion.span
                        key={i}
                        className="inline-block"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          duration: 0.5,
                          delay: 0.15 + i * 0.05,
                          ease: EASE_LUX,
                        }}
                      >
                        {ch === " " ? "\u00A0" : ch}
                      </motion.span>
                    ))}
                  </p>

                  {/* Animated divider line */}
                  <motion.div
                    className="h-px w-28 md:w-36 bg-gradient-to-r from-transparent via-primary to-transparent"
                    initial={{ scaleX: 0, opacity: 0 }}
                    animate={{ scaleX: 1, opacity: 1 }}
                    transition={{ duration: 1, delay: 0.5, ease: EASE_LUX }}
                  />

                  <motion.h1
                    className="font-serif text-3xl md:text-5xl font-semibold tracking-wider whitespace-nowrap mt-3"
                    initial={{ opacity: 0, y: 14, filter: "blur(12px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    transition={{ duration: 1, delay: 0.35, ease: EASE_LUX }}
                  >
                    <span className="text-gradient-copper">Skyths</span>{" "}
                    <span className="text-foreground/95">Store</span>
                  </motion.h1>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Premium progress bar */}
        <motion.div
          className="absolute left-1/2 -translate-x-1/2 bottom-16 w-48 md:w-56"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
        >
          <div className="h-[2px] w-full rounded-full bg-muted overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-primary via-gold to-primary rounded-full"
              style={{ boxShadow: "0 0 12px hsl(25 80% 55% / 0.9)" }}
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 4.4, delay: 0.6, ease: "easeInOut" }}
            />
          </div>
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
