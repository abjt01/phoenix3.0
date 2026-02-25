"use client";

import React, { forwardRef } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const TubelightNavbar = forwardRef(function TubelightNavbar({ items, className = "" }, ref) {
    const pathname = usePathname();
    // Derive active tab directly from pathname — no setState needed
    const activeTab = items.find((i) =>
        i.url === "/" ? pathname === "/" : pathname.startsWith(i.url)
    )?.name ?? items[0].name;

    return (
        <div ref={ref} className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 ${className}`} style={{ transition: "transform 0.4s ease, opacity 0.4s ease" }}>
            <div className="flex items-center gap-1 bg-black/40 border border-white/10 backdrop-blur-xl py-1 px-1 rounded-full shadow-2xl">
                {items.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.name;

                    return (
                        <Link
                            key={item.name}
                            href={item.url}
                            className={`relative cursor-pointer text-xs font-semibold px-5 py-2.5 rounded-full transition-colors ${isActive
                                ? "text-white"
                                : "text-white/50 hover:text-white/80"
                                }`}
                        >
                            <span className="flex flex-col items-center gap-1">
                                <Icon size={18} strokeWidth={2} />
                                <span className="text-[9px] tracking-widest uppercase">
                                    {item.name}
                                </span>
                            </span>

                            {isActive && (
                                <motion.div
                                    layoutId="tubelight-lamp"
                                    className="absolute inset-0 w-full bg-white/8 rounded-full -z-10"
                                    initial={false}
                                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                                >
                                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-1 bg-primary rounded-t-full">
                                        <div className="absolute w-14 h-6 bg-primary/25 rounded-full blur-md -top-2 -left-3" />
                                        <div className="absolute w-8 h-5 bg-primary/20 rounded-full blur-md -top-1" />
                                        <div className="absolute w-4 h-4 bg-primary/30 rounded-full blur-sm top-0 left-2" />
                                    </div>
                                </motion.div>
                            )}
                        </Link>
                    );
                })}
            </div>
        </div>
    );
});
