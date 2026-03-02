import Link from "next/link";

export default function Footer() {
    return (
        <footer className="bg-background-dark border-t border-white/5 py-12 px-6">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 items-center">
                <div className="flex items-center justify-center md:justify-start gap-3 opacity-50">
                    <p className="text-xs font-bold tracking-[0.2em] uppercase text-center md:text-left">Phoenix 3.0</p>
                </div>
                <div className="flex flex-col items-center justify-center gap-3 text-center">
                    <p className="text-white/50 text-xs tracking-widest uppercase font-medium">Made with ❤️ by Team Udbhava</p>
                    <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-white/40 text-xs tracking-widest uppercase font-medium">
                        <a className="hover:text-primary transition-colors" href="https://instagram.com/_udbhava" target="_blank" rel="noopener noreferrer">Instagram</a>
                        <a className="hover:text-primary transition-colors" href="https://linkedin.com/company/udbhava-csbs" target="_blank" rel="noopener noreferrer">LinkedIn</a>
                        <a className="hover:text-primary transition-colors" href="mailto:udbhava.dsce@gmail.com" target="_blank" rel="noopener noreferrer">Email</a>
                    </div>
                </div>
                <p className="text-white/30 text-xs text-center md:text-right">© 2026 Phoenix 3.0. All rights reserved.</p>
            </div>
        </footer>
    );
}
