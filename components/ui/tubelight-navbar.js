"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function TubelightNavbar({ items, className = "" }) {
    const pathname = usePathname();
    const [activeTab, setActiveTab] = useState(
        items.find((i) => i.url === pathname)?.name ?? items[0].name
    );

    // Keep active tab in sync with pathname (e.g. browser back/forward)
    useEffect(() => {
        const match = items.find((i) => i.url === pathname);
        if (match) setActiveTab(match.name);
    }, [pathname, items]);

    return (
        <div
            className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 ${className}`}
        >
            <div className="flex items-center gap-1 bg-black/40 border border-white/10 backdrop-blur-xl py-1 px-1 rounded-full shadow-2xl">
                {items.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.name;

                    return (
                        <Link
                            key={item.name}
                            href={item.url}
                            onClick={() => setActiveTab(item.name)}
                            className={`relative cursor-pointer text-xs font-semibold px-5 py-2.5 rounded-full transition-colors ${isActive
                                    ? "text-white"
                                    : "text-white/50 hover:text-white/80"
                                }`}
                        >
                            {/* Icon always visible on mobile, text hidden */}
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
                                    {/* Tubelight glow on top */}
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
}
