import Link from "next/link";
import { getCategoryColorClasses } from "@/data/events";

export default function EventCard({ title, description, slug, category, categoryColor, image, imageAlt, participants }) {
    const colors = getCategoryColorClasses(categoryColor);

    return (
        <div className="event-card group bg-charcoal border border-white/5 rounded-xl overflow-hidden flex flex-col">
            <div className="h-48 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal to-transparent z-10"></div>
                <img
                    alt={title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    data-alt={imageAlt}
                    src={image}
                />
                <div className="absolute top-4 left-4 z-20">
                    <span className={`px-3 py-1 rounded-md ${colors.bg} border ${colors.border} ${colors.text} text-[10px] font-bold uppercase tracking-widest backdrop-blur-md`}>
                        {category}
                    </span>
                </div>
            </div>
            <div className="p-6 flex flex-col flex-1">
                <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{title}</h3>
                <p className="text-white/40 text-sm mb-6 flex-1 italic leading-relaxed">{description}</p>
                <div className="flex items-center justify-between mt-auto">
                    <div className="flex -space-x-2">
                        <div className="w-8 h-8 rounded-full border-2 border-charcoal bg-white/10 flex items-center justify-center text-[10px]">{participants}</div>
                    </div>
                    <Link
                        href={`/events/${slug}`}
                        className="flex items-center gap-2 bg-primary hover:bg-orange-500 text-white px-5 py-2.5 rounded-lg font-bold text-xs uppercase tracking-widest transition-all group/btn"
                    >
                        Enter Arena
                        <span className="material-symbols-outlined text-sm group-hover/btn:translate-x-1 transition-transform">arrow_forward_ios</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}
