"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
    { href: "/", label: "Home" },
    { href: "/events", label: "Events" },
    { href: "/schedule", label: "Schedule" },
];

export default function Navbar() {
    const pathname = usePathname();
    const [menuOpen, setMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        setMenuOpen(false);
    }, [pathname]);

    useEffect(() => {
        document.body.style.overflow = menuOpen ? "hidden" : "";
        return () => { document.body.style.overflow = ""; };
    }, [menuOpen]);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    return (
        < >
            {/* Floating pill nav — desktop */}
            <header
                className={` fixed top-5 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 hidden mb-10 md:block ${scrolled ? "top-3" : "top-5"
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

            {/* Mobile header — full width pill row */}
            <header className="md:hidden fixed top-4 left-4 right-4 z-50">
                <div
                    className="flex items-center justify-between px-5 py-3 rounded-full border border-white/10"
                    style={{
                        background: "rgba(10, 6, 20, 0.6)",
                        backdropFilter: "blur(20px) saturate(160%)",
                        WebkitBackdropFilter: "blur(20px) saturate(160%)",
                        boxShadow:
                            "0 8px 32px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.07)",
                    }}
                >
                    <Link
                        href="/"
                        className="text-sm font-bold tracking-[0.12em] uppercase flex items-center gap-2"
                    >
                        <span className="material-symbols-outlined text-primary text-xl leading-none"></span>
                        Phoenix <span className="text-primary">3.0</span>
                    </Link>

                    <button
                        type="button"
                        onClick={() => setMenuOpen((v) => !v)}
                        aria-label={menuOpen ? "Close menu" : "Open menu"}
                        aria-expanded={menuOpen}
                        className="flex flex-col justify-center items-center w-8 h-8 gap-[5px]"
                    >
                        <span
                            className={`block w-5 h-[1.5px] bg-white transition-all duration-300 origin-center ${menuOpen ? "rotate-45 translate-y-[6.5px]" : ""
                                }`}
                        />
                        <span
                            className={`block w-5 h-[1.5px] bg-white transition-all duration-300 ${menuOpen ? "opacity-0 scale-x-0" : ""
                                }`}
                        />
                        <span
                            className={`block w-5 h-[1.5px] bg-white transition-all duration-300 origin-center ${menuOpen ? "-rotate-45 -translate-y-[6.5px]" : ""
                                }`}
                        />
                    </button>
                </div>

                {/* Mobile dropdown */}
                <div
                    className={`mt-2 rounded-2xl border border-white/10 overflow-hidden transition-all duration-300 ease-in-out ${menuOpen
                            ? "max-h-72 opacity-100 pointer-events-auto"
                            : "max-h-0 opacity-0 pointer-events-none"
                        }`}
                    style={{
                        background: "rgba(10, 6, 20, 0.75)",
                        backdropFilter: "blur(24px)",
                        WebkitBackdropFilter: "blur(24px)",
                    }}
                >
                    <div className="flex flex-col px-5 py-4 gap-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`py-3 text-sm font-semibold tracking-[0.15em] uppercase border-b border-white/5 last:border-0 transition-colors ${pathname === link.href
                                        ? "text-primary"
                                        : "text-white/60 hover:text-white"
                                    }`}
                            >
                                {link.label}
                            </Link>
                        ))}
                        <Link
                            href="/register"
                            className="mt-3 bg-primary text-white text-xs font-bold tracking-[0.2em] uppercase px-6 py-3 rounded-full btn-glow text-center transition-all active:scale-95"
                        >
                            Register Now
                        </Link>
                    </div>
                </div>
            </header>
        </>
    );
}
