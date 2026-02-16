import Link from "next/link";

export default function Footer() {
    return (
        <footer className="bg-background-dark border-t border-white/5 py-12 px-6">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="flex items-center gap-3 opacity-50">
                    <span className="material-symbols-outlined text-2xl">local_fire_department</span>
                    <p className="text-xs font-bold tracking-[0.2em] uppercase">Phoenix 3.0 © 2026</p>
                </div>
                <div className="flex gap-8 text-white/40 text-xs tracking-widest uppercase font-medium">
                    <a className="hover:text-primary transition-colors" href="https://instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a>
                    <a className="hover:text-primary transition-colors" href="https://twitter.com" target="_blank" rel="noopener noreferrer">X (Twitter)</a>
                    <a className="hover:text-primary transition-colors" href="https://linkedin.com" target="_blank" rel="noopener noreferrer">LinkedIn</a>
                    <a className="hover:text-primary transition-colors" href="https://youtube.com" target="_blank" rel="noopener noreferrer">YouTube</a>
                </div>
                <p className="text-white/30 text-xs">© 2026 Phoenix Legacy Foundation. All rights reserved.</p>
            </div>
        </footer>
    );
}
