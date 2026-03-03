import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getEventBySlug } from "@/data/events";

export const revalidate = 60; // fetch counts every 60s

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
            <main className="max-w-5xl mx-auto w-full px-6 py-30">
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
                        <Image
                            alt={event.title}
                            className="w-full h-full object-cover"
                            src={event.image}
                            fill
                            sizes="100vw"
                            priority
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

                            {event.coordinators && event.coordinators.length > 0 && (
                                <div className="pt-4 mt-2 border-t border-white/5 space-y-3">
                                    <div className="text-xs font-bold uppercase tracking-widest text-white/40 mb-2">Coordinators</div>
                                    {event.coordinators.map((coordinator, idx) => (
                                        <div key={idx} className="flex items-center justify-between">
                                            <div className="flex flex-col gap-0.5">
                                                <span className="text-sm font-bold text-white/90">{coordinator.name}</span>
                                            </div>
                                            <a
                                                href={`https://wa.me/${coordinator.phone}?text=Hi%20${coordinator.name}%20I%20have%20a%20query%20regarding%20${event.title}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="bg-[#25D366]/10 hover:bg-[#25D366]/20 transition-colors w-10 h-10 rounded-full flex items-center justify-center group/wa shrink-0 ml-4"
                                                title={`Chat with ${coordinator.name}`}
                                            >
                                                <svg className="w-5 h-5 text-[#25D366] group-hover/wa:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                                </svg>
                                            </a>
                                        </div>
                                    ))}
                                </div>
                            )}
                            <Link
                                href={`/register/${event.slug}`}
                                className="block w-full bg-primary hover:bg-orange-500 text-white px-5 py-3 rounded-lg font-bold text-sm uppercase tracking-widest transition-all text-center btn-glow"
                            >
                                Register Now
                            </Link>
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
