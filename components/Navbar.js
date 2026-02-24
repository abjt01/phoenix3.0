"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, CalendarDays, Clock } from "lucide-react";
import { TubelightNavbar } from "@/components/ui/tubelight-navbar";

const navLinks = [
    { href: "/", label: "Home" },
    { href: "/events", label: "Events" },
    { href: "/schedule", label: "Schedule" },
];

const mobileNavItems = [
    { name: "Home", url: "/", icon: Home },
    { name: "Events", url: "/events", icon: CalendarDays },
    { name: "Schedule", url: "/schedule", icon: Clock },
];

export default function Navbar() {
    const pathname = usePathname();
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    return (
        <>
            {/* Floating pill nav — desktop only */}
            <header
                className={`fixed left-1/2 -translate-x-1/2 z-50 transition-all duration-500 hidden md:block ${scrolled ? "top-3" : "top-5"
                    }`}
            >
                <div
                    className="flex items-center gap-8 px-6 py-3 rounded-full border border-white/10 shadow-2xl"
                    style={{
                        background: "rgba(10, 6, 20, 0.55)",
                        backdropFilter: "blur(20px) saturate(180%)",
                        WebkitBackdropFilter: "blur(20px) saturate(180%)",
                        boxShadow:
                            "0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08)",
                    }}
                >
                    {/* Logo */}
                    <Link
                        href="/"
                        className="text-sm font-bold tracking-[0.15em] uppercase flex items-center gap-2 shrink-0"
                    >
                        <span className="material-symbols-outlined text-primary text-xl leading-none"></span>
                        Phoenix <span className="text-primary">3.0</span>
                    </Link>

                    {/* Divider */}
                    <div className="w-px h-4 bg-white/15" />

                    {/* Nav links */}
                    <nav className="flex items-center gap-6">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`relative text-xs font-semibold tracking-[0.18em] uppercase transition-colors duration-200 group ${pathname === link.href
                                    ? "text-primary"
                                    : "text-white/60 hover:text-white"
                                    }`}
                            >
                                {link.label}
                                <span
                                    className={`absolute -bottom-1 left-0 h-px bg-primary transition-all duration-300 ${pathname === link.href
                                        ? "w-full"
                                        : "w-0 group-hover:w-full"
                                        }`}
                                />
                            </Link>
                        ))}
                    </nav>
                </div>
            </header>

            {/* Tubelight bottom navbar — mobile only */}
            <div className="md:hidden">
                <TubelightNavbar items={mobileNavItems} />
            </div>

            {/* Mobile top-left logo  */}
            {pathname !== "/" && (
                <div className="md:hidden fixed top-4 left-4 z-50">
                    <Link
                        href="/"
                        className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 text-sm font-bold tracking-[0.12em] uppercase"
                        style={{
                            background: "rgba(10, 6, 20, 0.55)",
                            backdropFilter: "blur(16px)",
                            WebkitBackdropFilter: "blur(16px)",
                        }}
                    >
                        <span className="material-symbols-outlined text-primary text-lg leading-none"></span>
                        Phoenix <span className="text-primary">3.0</span>
                    </Link>
                </div>
            )}
        </>
    );
}
