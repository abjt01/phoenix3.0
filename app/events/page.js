import Link from "next/link";
import EventGrid from "@/components/EventGrid";
import { events } from "@/data/events";

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


            </main>
        </div>
    );
}
