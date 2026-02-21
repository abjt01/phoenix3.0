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

    // Close mobile menu on route change
    useEffect(() => {
        setMenuOpen(false);
    }, [pathname]);

    // Prevent body scroll when menu is open
    useEffect(() => {
        document.body.style.overflow = menuOpen ? "hidden" : "";
        return () => { document.body.style.overflow = ""; };
    }, [menuOpen]);

    return (
        <header className="fixed top-0 w-full z-50 glass-nav px-6 lg:px-20 py-4">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                {/* Logo */}
                <div className="flex items-center gap-3">
                    <div className="text-primary">
                        <span className="material-symbols-outlined text-4xl leading-none"> </span>
                    </div>
                    <Link href="/" className="text-xl font-bold tracking-tighter uppercase">
                        Phoenix <span className="text-primary">3.0</span>
                    </Link>
                </div>

                {/* Desktop nav */}
                <nav className="hidden md:flex items-center gap-10">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`text-sm font-medium tracking-widest uppercase transition-colors ${pathname === link.href ? "text-primary" : "hover:text-primary"
                                }`}
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>

                {/* Desktop CTA + Mobile hamburger */}
                <div className="flex items-center gap-4">
                    <Link
                        href="/register"
                        className="hidden md:inline-block bg-primary hover:bg-primary/90 text-white text-xs font-bold tracking-[0.2em] uppercase px-6 py-3 rounded-lg btn-glow transition-all active:scale-95"
                    >
                        Register Now
                    </Link>

                    {/* Hamburger button — mobile only */}
                    <button
                        type="button"
                        onClick={() => setMenuOpen((v) => !v)}
                        aria-label={menuOpen ? "Close menu" : "Open menu"}
                        aria-expanded={menuOpen}
                        className="md:hidden flex flex-col justify-center items-center w-10 h-10 rounded-lg hover:bg-white/10 transition-colors"
                    >
                        <span
                            className={`block w-5 h-0.5 bg-white transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-[6px]" : ""}`}
                        />
                        <span
                            className={`block w-5 h-0.5 bg-white mt-1 transition-all duration-300 ${menuOpen ? "opacity-0 scale-x-0" : ""}`}
                        />
                        <span
                            className={`block w-5 h-0.5 bg-white mt-1 transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-[6px]" : ""}`}
                        />
                    </button>
                </div>
            </div>

            {/* Mobile drawer */}
            <div
                className={`md:hidden absolute top-full left-0 right-0 glass-nav border-t border-white/10 px-6 flex flex-col gap-4 overflow-hidden transition-all duration-300 ease-in-out ${
                    menuOpen ? "py-6 max-h-screen opacity-100 pointer-events-auto" : "max-h-0 py-0 opacity-0 pointer-events-none"
                }`}
            >
                {navLinks.map((link) => (
                    <Link
                        key={link.href}
                        href={link.href}
                        className={`text-base font-medium tracking-widest uppercase py-2 transition-colors ${pathname === link.href ? "text-primary" : "text-white/70 hover:text-primary"
                            }`}
                    >
                        {link.label}
                    </Link>
                ))}
                <Link
                    href="/register"
                    className="mt-2 bg-primary text-white text-sm font-bold tracking-[0.2em] uppercase px-6 py-3 rounded-lg btn-glow text-center transition-all active:scale-95"
                >
                    Register Now
                </Link>
            </div>
        </header>
    );
}
