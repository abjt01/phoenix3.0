"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
    { href: "/", label: "Home" },
    { href: "/events", label: "Events" },
];

export default function Navbar() {
    const pathname = usePathname();

    return (
        <header className="fixed top-0 w-full z-50 glass-nav px-6 lg:px-20 py-4">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="text-primary">
                        <span className="material-symbols-outlined text-4xl leading-none"> </span>
                    </div>
                    <Link href="/" className="text-xl font-bold tracking-tighter uppercase">
                        Phoenix <span className="text-primary">3.0</span>
                    </Link>
                </div>
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
                <div>
                    <Link
                        href="/register"
                        className="bg-primary hover:bg-primary/90 text-white text-xs font-bold tracking-[0.2em] uppercase px-6 py-3 rounded-lg btn-glow inline-block transition-all active:scale-95"
                    >
                        Register Now
                    </Link>
                </div>
            </div>
        </header>
    );
}
