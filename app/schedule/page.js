"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { events } from "@/data/events";

/* ──── helpers ──── */

function parseSchedule(scheduleStr) {
    // e.g. "March 5, 2026 — 10:00 AM to 4:00 PM"
    // We want to extract the date part "March 5, 2026" and the time part
    // Splits by the mdash
    const parts = scheduleStr.split("—").map((s) => s.trim());

    // If no mdash, just assume the whole thing is date or time (fallback)
    const dateStr = parts.length > 1 ? parts[0] : scheduleStr;
    const timeStr = parts.length > 1 ? parts[1] : "";

    // Extract just the day number for sorting if needed, or use the full date string for grouping
    // Matches "March 5"
    const dayMatch = dateStr.match(/([A-Za-z]+)\s+(\d+)/);
    const month = dayMatch ? dayMatch[1] : "";
    const day = dayMatch ? parseInt(dayMatch[2], 10) : 0;

    // To get a sortable date object
    // If year is missing in dateStr but present in "2026", we can try to parse it. 
    // For now "March 5, 2026" works with new Date() usually
    const dateObj = new Date(dateStr);

    return {
        fullDate: dateStr, // "March 5, 2026"
        month,             // "March"
        day,               // 5
        year: dateObj.getFullYear() || new Date().getFullYear(),
        time: timeStr,     // "10:00 AM to 4:00 PM"
        dateObj
    };
}

export default function SchedulePage() {
    // Group events by their date string (e.g. "March 5, 2026")
    const { groupedEvents, sortedDates } = useMemo(() => {
        const grouped = {};

        events.forEach((ev) => {
            // guard against missing schedule
            if (!ev.schedule) return;

            const { fullDate } = parseSchedule(ev.schedule);
            if (!grouped[fullDate]) grouped[fullDate] = [];
            grouped[fullDate].push(ev);
        });

        // Sort dates chronologically
        const dates = Object.keys(grouped).sort((a, b) => {
            const dateA = new Date(a);
            const dateB = new Date(b);
            return dateA - dateB;
        });

        // Sort events within each day by time (roughly)
        dates.forEach((date) => {
            grouped[date].sort((a, b) => {
                const timeA = parseSchedule(a.schedule).time;
                const timeB = parseSchedule(b.schedule).time;
                // Simple string comparison for time isn't perfect but works for "10:00 AM" vs "2:00 PM" 
                // if format is consistent. For better sort we'd need to parse AM/PM. 
                // For now, let's trust the order or simple string sort.
                return timeA.localeCompare(timeB);
            });
        });

        return { groupedEvents: grouped, sortedDates: dates };
    }, []);

    // Default to the first day
    const [activeDate, setActiveDate] = useState(sortedDates[0]);
    const currentEvents = groupedEvents[activeDate] || [];

    // Derive date range for Hero section, safely
    let dateRangeString = "Upcoming Events";
    if (sortedDates.length > 0) {
        const first = parseSchedule(groupedEvents[sortedDates[0]][0].schedule);
        const last = parseSchedule(groupedEvents[sortedDates[sortedDates.length - 1]][0].schedule);

        if (first.month === last.month) {
            dateRangeString = `${first.month} ${first.day} – ${last.day}, ${first.year}`;
        } else {
            dateRangeString = `${first.month} ${first.day} – ${last.month} ${last.day}, ${first.year}`;
        }
    }

    // If no events, show empty state (optional but good practice)
    if (!sortedDates.length) {
        return (
            <div className="arena-body-bg min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-3xl font-bold mb-4">No events scheduled yet.</h2>
                    <Link href="/" className="text-primary hover:underline">Return Home</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="arena-body-bg min-h-screen">
            <main className="max-w-4xl mx-auto w-full px-6 py-12">
                {/* ── Hero ── */}
                <div className="mb-12 space-y-4 text-center md:text-left">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest">
                        <span className="material-symbols-outlined text-sm">
                            calendar_month
                        </span>
                        {dateRangeString}
                    </div>
                    <h2 className="text-5xl md:text-6xl font-black tracking-tight leading-none uppercase italic">
                        Event{" "}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-400 pr-2">
                            Schedule
                        </span>
                    </h2>
                    <p className="text-white/50 text-lg max-w-2xl font-light">
                        Plan your journey through the proving grounds. Select a day to view
                        the lineup.
                    </p>
                </div>

                {/* ── Tabs ── */}
                <div className="flex flex-col sm:flex-row gap-4 mb-12 border-b border-white/5 pb-8">
                    {sortedDates.map((date, index) => {
                        // grab the first event of this group to parse the date parts again for display
                        const { day, month } = parseSchedule(groupedEvents[date][0].schedule);

                        // If activeDate wasn't set (initial render), use first date
                        const currentActive = activeDate || sortedDates[0];
                        const isActive = currentActive === date;

                        return (
                            <button
                                key={date}
                                onClick={() => setActiveDate(date)}
                                className={`flex-1 py-4 px-6 rounded-xl border transition-all duration-300 relative overflow-hidden group ${isActive
                                    ? "bg-primary border-primary text-white shadow-[0_0_20px_rgba(255,106,0,0.3)]"
                                    : "bg-white/5 border-white/10 text-white/40 hover:bg-white/10 hover:border-white/20 hover:text-white"
                                    }`}
                            >
                                <div className="relative z-10 flex flex-col items-center sm:items-start gap-1">
                                    <span className="text-xs font-bold tracking-[0.2em] uppercase opacity-80">
                                        Day {String(index + 1).padStart(2, "0")}
                                    </span>
                                    <span className="text-2xl font-black italic uppercase tracking-tight">
                                        {month} {day}
                                    </span>
                                </div>
                                {isActive && (
                                    <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent pointer-events-none" />
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* ── Event List ── */}
                <div className="space-y-4">
                    {currentEvents.map((ev) => {
                        const { time } = parseSchedule(ev.schedule || "");


                        // "10:00 AM to 4:00 PM" -> ["10:00 AM", "4:00 PM"]
                        const timeParts = time.includes(" to ") ? time.split(" to ") : [time, ""];

                        return (
                            <div key={ev.slug} className="group">
                                <Link
                                    href={`/events/${ev.slug}`}
                                    className="block relative bg-charcoal border border-white/5 hover:border-primary/30 rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(255,106,0,0.1)]"
                                >
                                    <div className="flex flex-col sm:flex-row sm:items-stretch">
                                        {/* Time Column (Desktop) */}
                                        <div className="hidden sm:flex flex-col justify-center items-center w-32 bg-white/5 border-r border-white/5 p-4 text-center shrink-0">
                                            <span className="material-symbols-outlined text-primary mb-1 text-xl">
                                                schedule
                                            </span>
                                            <span className="text-white font-bold text-sm">
                                                {timeParts[0]}
                                            </span>
                                            {timeParts[1] && (
                                                <span className="text-white/40 text-[10px] font-medium uppercase mt-1">
                                                    to {timeParts[1]}
                                                </span>
                                            )}
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 p-5 sm:p-6 flex flex-col gap-3">
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="flex flex-col gap-2">
                                                    {/* Mobile Time */}
                                                    <div className="flex sm:hidden items-center gap-1.5 text-primary text-xs font-bold mb-1">
                                                        <span className="material-symbols-outlined text-sm">
                                                            schedule
                                                        </span>
                                                        {time}
                                                    </div>

                                                    <h3 className="text-xl sm:text-2xl font-bold group-hover:text-primary transition-colors">
                                                        {ev.title}
                                                    </h3>
                                                </div>

                                            </div>

                                            <div className="flex items-center gap-4 text-sm text-white/50">
                                                <span className="flex items-center gap-1.5">
                                                    <span className="material-symbols-outlined text-sm">
                                                        location_on
                                                    </span>
                                                    {ev.venue}
                                                </span>
                                                <span className="w-1 h-1 rounded-full bg-white/20"></span>
                                                <span className="flex items-center gap-1.5">
                                                    <span className="material-symbols-outlined text-sm">
                                                        group
                                                    </span>
                                                    {ev.participants}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Action Arrow */}
                                        <div className="hidden sm:flex items-center justify-center w-16 bg-white/5 border-l border-white/5 group-hover:bg-primary/10 transition-colors">
                                            <span className="material-symbols-outlined text-white/40 group-hover:text-primary transition-colors group-hover:translate-x-1 duration-300">
                                                arrow_forward_ios
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        );
                    })}
                </div>

                {/* ── Bottom CTA ── */}
                <div className="mt-20 text-center">
                    <Link
                        href="/register"
                        className="inline-flex items-center gap-2 text-white/40 hover:text-primary font-bold text-sm tracking-widest uppercase transition-colors"
                    >
                        Register for Events
                        <span className="material-symbols-outlined text-lg">
                            arrow_forward
                        </span>
                    </Link>
                </div>
            </main>
        </div>
    );
}
