"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, CalendarDays, Clock, Pencil } from "lucide-react";
import { TubelightNavbar } from "@/components/ui/tubelight-navbar";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/events", label: "Events" },
  { href: "/schedule", label: "Schedule" },
  { href: "/register", label: "Register" },
];

const mobileNavItems = [
  { name: "Home", url: "/", icon: Home },
  { name: "Events", url: "/events", icon: CalendarDays },
  { name: "Schedule", url: "/schedule", icon: Clock },
  { name: "Register", url: "/register", icon: Pencil },
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
        desktopNavRef.current.style.transform = "translateY(-80px)";
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
        desktopNavRef.current.style.transform = "translateY(0)";
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
      {/* Desktop Header */}
      <header
        ref={desktopNavRef}
        className="fixed top-5 left-0 right-0 z-50 hidden md:flex justify-center pointer-events-none"
        style={{
          transition: "transform 0.4s ease, opacity 0.4s ease",
        }}
      >
        {/* Logo Pill (Desktop)  */}
        {pathname !== "/" && (
          <div className="absolute left-6 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-auto">
            <Link
              href="/"
              className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 text-sm font-bold tracking-[0.12em] uppercase"
              style={{
                background: "rgba(10, 6, 20, 0.55)",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
              }}
            >
              Phoenix <span className="text-primary">3.0</span>
            </Link>
          </div>
        )}

        {/* Center Nav Pill */}
        <div
          className="flex items-center gap-6 px-6 py-3 rounded-full border border-white/10 shadow-2xl pointer-events-auto"
          style={glassStyle}
        >
          <nav className="flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`relative text-xs font-semibold tracking-[0.18em] uppercase transition-colors duration-200 group ${
                  link.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(link.href)
                      ? "text-primary"
                      : "text-white/60 hover:text-white"
                }`}
              >
                {link.label}
                <span
                  className={`absolute -bottom-1 left-0 h-px bg-primary transition-all duration-300 ${
                    link.href === "/"
                      ? pathname === "/"
                        ? "w-full"
                        : "w-0 group-hover:w-full"
                      : pathname.startsWith(link.href)
                        ? "w-full"
                        : "w-0 group-hover:w-full"
                  }`}
                />
              </Link>
            ))}
          </nav>
        </div>
      </header>

      {/* Mobile Tubelight Navbar */}
      <TubelightNavbar
        ref={mobileNavWrapRef}
        items={mobileNavItems}
        className="md:hidden"
      />

      {/* Mobile Top-Left Logo */}
      {pathname !== "/" && (
        <div
          ref={mobileLogoRef}
          className="md:hidden fixed top-4 left-4 z-50"
          style={{
            transition: "transform 0.4s ease, opacity 0.4s ease",
          }}
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
            Phoenix <span className="text-primary">3.0</span>
          </Link>
        </div>
      )}
    </>
  );
}
