import Link from "next/link";
import EventGrid from "@/components/EventGrid";
import { events } from "@/data/events";
import { getParticipantCount } from "@/lib/googleSheets";

export const revalidate = 60; // fetch counts every 60s

export const metadata = {
    title: "Phoenix 3.0 | The Arena",
    description: "Enter the proving grounds of the next generation. Compete in high-stakes technical battles, knowledge gauntlets, and creative showcases.",
};

export default async function EventsPage() {
    const eventsWithCounts = await Promise.all(
        events.map(async (event) => {
            const count = await getParticipantCount(event.sheetId);
            return {
                ...event,
                participants: count > 0 ? count.toString() : "0",
            };
        })
    );

    return (
        <div className="arena-body-bg min-h-screen">
            <main className="max-w-7xl mx-auto w-full px-6 pt-20 md:pt-28 pb-12">
                {/* Hero Header */}
                <div className="mb-12 space-y-4">
                    <h2 className="text-5xl md:text-6xl font-black tracking-tight leading-none uppercase">The <span className="gradient-title italic">Arena</span></h2>
                    <p className="text-white/50 text-lg max-w-2xl font-light">Enter the proving grounds of the next generation. Compete in high-stakes technical battles, knowledge gauntlets, and creative showcases.</p>
                </div>

                {/* Filter Tabs */}
                {/* Filter Tabs - REMOVED */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-10 border-b border-white/5 pb-8">
                    <div className="flex items-center gap-3 text-white/40 text-sm">
                        <span>Showing {events.length} Active Arenas</span>
                        
                    </div>
                </div>

                {/* Events Grid */}
                <EventGrid events={eventsWithCounts} />


            </main>
        </div>
    );
}
