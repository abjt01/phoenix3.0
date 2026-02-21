import Link from "next/link";
import { notFound } from "next/navigation";
import { getEventBySlug } from "@/data/events";

export async function generateMetadata({ params }) {
    const { slug } = await params;
    const event = getEventBySlug(slug);
    if (!event) return { title: "Event Not Found" };
    return {
        title: `Phoenix 3.0 | ${event.title}`,
        description: event.description,
    };
}

export default async function EventDetailPage({ params }) {
    const { slug } = await params;
    const event = getEventBySlug(slug);

    if (!event) {
        notFound();
    }

    return (
        <div className="arena-body-bg min-h-screen">
            <main className="max-w-5xl mx-auto w-full px-6 py-12">
                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-sm text-white/40 mb-8">
                    <Link href="/events" className="hover:text-primary transition-colors">Arena</Link>
                    <span className="material-symbols-outlined text-sm">chevron_right</span>
                    <span className="text-white">{event.title}</span>
                </div>

                {/* Event Hero */}
                <div className="relative rounded-2xl overflow-hidden mb-12">
                    <div className="h-80 relative">
                        <div className="absolute inset-0 bg-gradient-to-t from-charcoal to-transparent z-10"></div>
                        <img
                            alt={event.title}
                            className="w-full h-full object-cover"
                            data-alt={event.imageAlt}
                            src={event.image}
                        />

                    </div>
                </div>

                {/* Event Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    <div className="lg:col-span-2">
                        <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-6">{event.title}</h1>
                        <p className="text-white/60 text-lg leading-relaxed mb-8 italic">{event.description}</p>
                        <p className="text-white/70 leading-relaxed mb-8">{event.longDescription}</p>

                        <h3 className="text-xl font-bold mb-4 text-primary">Rules &amp; Guidelines</h3>
                        <ul className="space-y-3 mb-8">
                            {event.rules.map((rule, index) => (
                                <li key={index} className="flex items-start gap-3 text-white/60">
                                    <span className="material-symbols-outlined text-sm text-primary mt-0.5">check_circle</span>
                                    <span>{rule}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        <div className="bg-charcoal border border-white/5 rounded-xl p-6 space-y-6">
                            <div>
                                <div className="text-xs font-bold uppercase tracking-widest text-white/40 mb-2">Schedule</div>
                                <div className="flex items-center gap-2 text-white">
                                    <span className="material-symbols-outlined text-primary text-sm">calendar_today</span>
                                    <span className="text-sm">{event.schedule}</span>
                                </div>
                            </div>
                            <div>
                                <div className="text-xs font-bold uppercase tracking-widest text-white/40 mb-2">Venue</div>
                                <div className="flex items-center gap-2 text-white">
                                    <span className="material-symbols-outlined text-primary text-sm">location_on</span>
                                    <span className="text-sm">{event.venue}</span>
                                </div>
                            </div>
                            <div>
                                <div className="text-xs font-bold uppercase tracking-widest text-white/40 mb-2">Participants</div>
                                <div className="flex items-center gap-2 text-white">
                                    <span className="material-symbols-outlined text-primary text-sm">group</span>
                                    <span className="text-sm">{event.participants} registered</span>
                                </div>
                            </div>
                            <a
                                href="/brochure.pdf"
                                download
                                className="block w-full bg-primary hover:bg-orange-500 text-white px-5 py-3 rounded-lg font-bold text-sm uppercase tracking-widest transition-all text-center btn-glow"
                            >
                                Download Brochure
                            </a>
                        </div>

                        <Link
                            href="/events"
                            className="flex items-center gap-2 text-white/40 hover:text-primary text-sm font-medium transition-colors"
                        >
                            <span className="material-symbols-outlined text-sm">arrow_back</span>
                            Back to Arena
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    );
}
