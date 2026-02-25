"use client";

import { useEffect, useRef } from "react";
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

const glassStyle = {
    background: "rgba(10, 6, 20, 0.55)",
    backdropFilter: "blur(20px) saturate(180%)",
    WebkitBackdropFilter: "blur(20px) saturate(180%)",
    boxShadow: "0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08)",
};

export default function Navbar() {
    const pathname = usePathname();

    const desktopNavRef = useRef(null);
    const mobileLogoRef = useRef(null);
    const mobileNavWrapRef = useRef(null);

    useEffect(() => {
        let lastY = window.scrollY;
        let isHidden = false;

        const applyHide = () => {
            if (isHidden) return;
            isHidden = true;
            if (desktopNavRef.current) {
                desktopNavRef.current.style.transform = "translateX(-50%) translateY(-80px)";
                desktopNavRef.current.style.opacity = "0";
                desktopNavRef.current.style.pointerEvents = "none";
            }
            if (mobileNavWrapRef.current) {
                mobileNavWrapRef.current.style.transform = "translateY(80px)";
                mobileNavWrapRef.current.style.opacity = "0";
                mobileNavWrapRef.current.style.pointerEvents = "none";
            }
            if (mobileLogoRef.current) {
                mobileLogoRef.current.style.transform = "translateY(-60px)";
                mobileLogoRef.current.style.opacity = "0";
                mobileLogoRef.current.style.pointerEvents = "none";
            }
        };

        const applyShow = () => {
            if (!isHidden) return;
            isHidden = false;
            if (desktopNavRef.current) {
                desktopNavRef.current.style.transform = "translateX(-50%) translateY(0)";
                desktopNavRef.current.style.opacity = "1";
                desktopNavRef.current.style.pointerEvents = "";
            }
            if (mobileNavWrapRef.current) {
                mobileNavWrapRef.current.style.transform = "translateY(0)";
                mobileNavWrapRef.current.style.opacity = "1";
                mobileNavWrapRef.current.style.pointerEvents = "";
            }
            if (mobileLogoRef.current) {
                mobileLogoRef.current.style.transform = "translateY(0)";
                mobileLogoRef.current.style.opacity = "1";
                mobileLogoRef.current.style.pointerEvents = "";
            }
        };

        const onScroll = () => {
            const y = window.scrollY;

            if (y < 50) {
                applyShow();
            } else if (y > lastY + 4) {
                applyHide();
            } else if (y < lastY - 4) {
                applyShow();
            }

            lastY = y;
        };

        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    return (
        <>
            {/* Desktop nav links — centered pill */}
            <header
                ref={desktopNavRef}
                className="fixed top-5 z-50 hidden md:block"
                style={{
                    left: "50%",
                    transform: "translateX(-50%)",
                    transition: "transform 0.4s ease, opacity 0.4s ease",
                }}
            >
                <div className="flex items-center gap-6 px-6 py-3 rounded-full border border-white/10 shadow-2xl" style={glassStyle}>
                    <nav className="flex items-center gap-6">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`relative text-xs font-semibold tracking-[0.18em] uppercase transition-colors duration-200 group ${pathname === link.href ? "text-primary" : "text-white/60 hover:text-white"
                                    }`}
                            >
                                {link.label}
                                <span className={`absolute -bottom-1 left-0 h-px bg-primary transition-all duration-300 ${pathname === link.href ? "w-full" : "w-0 group-hover:w-full"
                                    }`} />
                            </Link>
                        ))}
                    </nav>
                </div>
            </header>

            {/* Tubelight bottom navbar — mobile only */}
            <TubelightNavbar
                ref={mobileNavWrapRef}
                items={mobileNavItems}
                className="md:hidden"
            />

            {/* Mobile top-left logo — hidden on home page */}
            {pathname !== "/" && (
                <div
                    ref={mobileLogoRef}
                    className="md:hidden fixed top-4 left-4 z-50"
                    style={{ transition: "transform 0.4s ease, opacity 0.4s ease" }}
                >
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
