import Link from "next/link";
import EventGrid from "@/components/EventGrid";
import { events , championship} from "@/data/events";

export const metadata = {
    title: "Phoenix 3.0 | The Arena",
    description: "Enter the proving grounds of the next generation. Compete in high-stakes technical battles, knowledge gauntlets, and creative showcases.",
};

export default function EventsPage() {
    return (
        <div className="arena-body-bg min-h-screen">
            <main className="max-w-7xl mx-auto w-full px-6 py-12">
                {/* Hero Header */}
                <div className="mb-12 space-y-4">
                    <h2 className="text-5xl md:text-6xl font-black tracking-tight leading-none uppercase italic">The <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-400">Arena</span></h2>
                    <p className="text-white/50 text-lg max-w-2xl font-light">Enter the proving grounds of the next generation. Compete in high-stakes technical battles, knowledge gauntlets, and creative showcases.</p>
                </div>

                {/* Filter Tabs */}
                {/* Filter Tabs - REMOVED */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-10 border-b border-white/5 pb-8">
                    <div className="flex items-center gap-3 text-white/40 text-sm">
                        <span>Showing {events.length} Active Arenas</span>
                        <span className="material-symbols-outlined">filter_list</span>
                    </div>
                </div>

                {/* Events Grid */}
                <EventGrid events={events} />

                {/* Featured Full-Width Arena */}
                <div className="mt-16 p-px bg-gradient-to-r from-transparent via-primary/50 to-transparent rounded-2xl">
                    <div className="bg-charcoal/80 backdrop-blur-xl rounded-2xl overflow-hidden flex flex-col md:flex-row items-stretch border border-white/10">
                        <div className="md:w-1/2 aspect-video md:aspect-auto">
                            <img
                                alt="Grand Finale Arena"
                                className="w-full h-full object-cover opacity-60"
                                data-alt={championship.imageAlt}
                                src={championship.image}
                            />
                        </div>
                        <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
                            <div className="flex items-center gap-2 mb-4 text-primary">
                                <span className="material-symbols-outlined">stars</span>
                                <span className="font-bold uppercase tracking-widest text-xs">Featured Arena</span>
                            </div>
                            <h2 className="text-3xl md:text-4xl font-black mb-4 uppercase tracking-tight">{championship.title.replace("Phoenix Championship ", "Phoenix Championship ")}<span className="text-primary italic"> Finale</span></h2>
                            <p className="text-white/60 mb-8 leading-relaxed max-w-lg">{championship.description}</p>
                            <div className="flex flex-wrap gap-4">
                                <Link href="/register" className="bg-primary text-white font-bold px-8 py-3 rounded-lg uppercase tracking-wider hover:shadow-lg hover:shadow-primary/30 transition-all">Join Spectator Mode</Link>
                                <button className="bg-white/5 border border-white/10 text-white font-bold px-8 py-3 rounded-lg uppercase tracking-wider hover:bg-white/10 transition-all">View Brackets</button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
