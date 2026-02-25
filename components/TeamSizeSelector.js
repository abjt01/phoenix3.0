"use client";

/**
 * Adapted from @kokonutui/team-selector by @dorianbaffier (MIT)
 * Ported to JS and themed for Phoenix 3.0 (dark bg + orange primary).
 */

import { AnimatePresence, motion } from "framer-motion";
import { useRef, useState } from "react";

const AVATAR_OVERLAP = 10;

// Placeholder avatar "slots" — abstract coloured rings instead of photos
const SLOT_COLORS = [
    "from-primary to-orange-400",
    "from-orange-400 to-yellow-400",
    "from-amber-500 to-orange-300",
    "from-red-400 to-primary",
    "from-yellow-400 to-amber-500",
    "from-orange-300 to-red-400",
];

const animations = {
    avatar: {
        visible: {
            opacity: 1,
            scale: 1,
            transition: { type: "spring", stiffness: 300, damping: 24, mass: 0.8 },
        },
        hidden: {
            opacity: 0,
            scale: 0.5,
            transition: { duration: 0.2, ease: "easeOut" },
        },
    },
    vibration: {
        idle: { x: 0 },
        shake: {
            x: [-5, 5, -5, 5, 0],
            transition: { duration: 0.38, ease: "easeOut" },
        },
    },
};

export default function TeamSizeSelector({ value, onChange, min = 1, max = 6 }) {
    const count = parseInt(value, 10) || 1;
    const directionRef = useRef(1);
    const [isVibrating, setIsVibrating] = useState(false);

    const slots = Array.from({ length: max }, (_, i) => i);

    function triggerVibration() {
        setIsVibrating(true);
        setTimeout(() => setIsVibrating(false), 380);
    }

    function handleIncrement(e) {
        e.preventDefault();
        if (count < max) {
            directionRef.current = 1;
            onChange(String(count + 1));
        } else {
            triggerVibration();
        }
    }

    function handleDecrement(e) {
        e.preventDefault();
        if (count > min) {
            directionRef.current = -1;
            onChange(String(count - 1));
        } else {
            triggerVibration();
        }
    }

    function handleKeyDown(e, action) {
        if (e.key === "Enter" || e.key === " ") {
            action === "increment" ? handleIncrement(e) : handleDecrement(e);
        }
    }

    return (
        <div className="flex flex-col items-center justify-center w-full">
            <div className="max-w-md mx-auto w-full rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                <p className="mb-5 text-xs font-bold uppercase tracking-[0.2em] text-white/40 text-center">
                    Team Size
                </p>

                {/* Avatar stack */}
                <div className="mb-6 flex justify-center">
                    <motion.div className="flex items-center" layout>
                        {slots.map((i) => (
                            <motion.div
                                key={i}
                                animate={i < count ? "visible" : "hidden"}
                                initial={i < count ? "visible" : "hidden"}
                                variants={animations.avatar}
                                style={{
                                    marginLeft: i === 0 ? 0 : -AVATAR_OVERLAP,
                                    zIndex: max - i,
                                }}
                                className="flex items-center justify-center"
                            >
                                <div
                                    className={`w-11 h-11 rounded-full bg-gradient-to-br ${SLOT_COLORS[i % SLOT_COLORS.length]} border-2 border-[#0a0a0a] flex items-center justify-center shadow-lg`}
                                >
                                    {/* Person silhouette */}
                                    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white/80" xmlns="http://www.w3.org/2000/svg">
                                        <circle cx="12" cy="8" r="4" />
                                        <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
                                    </svg>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>

                {/* Controls */}
                <motion.div
                    animate={isVibrating ? "shake" : "idle"}
                    initial="idle"
                    variants={animations.vibration}
                    className="flex items-center justify-center gap-6"
                >
                    {/* Decrement */}
                    <button
                        type="button"
                        aria-label="Decrease team size"
                        disabled={count <= min}
                        onClick={handleDecrement}
                        onKeyDown={(e) => handleKeyDown(e, "decrement")}
                        className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/50 transition-all duration-200 hover:border-primary/40 hover:bg-primary/10 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 active:scale-95 disabled:cursor-not-allowed disabled:opacity-30"
                    >
                        <span className="select-none text-lg font-medium leading-none">−</span>
                    </button>

                    {/* Counter */}
                    <div className="flex min-w-16 flex-col items-center">
                        <div className="relative h-10 overflow-hidden">
                            <AnimatePresence initial={false} mode="popLayout">
                                <motion.output
                                    key={count}
                                    aria-label={`Current team size: ${count}`}
                                    className="block select-none bg-gradient-to-b from-white to-white/50 bg-clip-text text-4xl font-black text-transparent"
                                    initial={{ opacity: 0, y: directionRef.current * 18 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{
                                        opacity: 0,
                                        y: directionRef.current * -18,
                                        transition: { duration: 0.14, ease: "easeIn" },
                                    }}
                                    transition={{ duration: 0.2, ease: "easeOut" }}
                                >
                                    {count}
                                </motion.output>
                            </AnimatePresence>
                        </div>
                        <span className="text-xs text-white/40 mt-0.5">
                            {count === 1 ? "member (solo)" : "members"}
                        </span>
                    </div>

                    {/* Increment */}
                    <button
                        type="button"
                        aria-label="Increase team size"
                        disabled={count >= max}
                        onClick={handleIncrement}
                        onKeyDown={(e) => handleKeyDown(e, "increment")}
                        className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/50 transition-all duration-200 hover:border-primary/40 hover:bg-primary/10 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 active:scale-95 disabled:cursor-not-allowed disabled:opacity-30"
                    >
                        <span className="select-none text-lg font-medium leading-none">+</span>
                    </button>
                </motion.div>

                {/* Range hint */}
                {min !== max && (
                    <p className="mt-4 text-center text-[10px] text-white/25 tracking-widest uppercase">
                        {min} – {max} members allowed
                    </p>
                )}
            </div>
        </div>
    );
}

