"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { events } from "@/data/events";
import ScheduleEventCard from "@/components/ScheduleEventCard";

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

    // Parse time into minutes for sorting
    let minutes = 0;
    if (timeStr) {
        // match "10:00", "AM" - takes the first time found (start time)
        const match = timeStr.match(/(\d+):(\d+)\s*(AM|PM)/i);
        if (match) {
            let h = parseInt(match[1], 10);
            let m = parseInt(match[2], 10);
            const period = match[3].toUpperCase();

            if (period === "PM" && h !== 12) h += 12;
            if (period === "AM" && h === 12) h = 0;

            minutes = h * 60 + m;
        }
    }

    return {
        fullDate: dateStr, // "March 5, 2026"
        month,             // "March"
        day,               // 5
        year: dateObj.getFullYear() || new Date().getFullYear(),
        time: timeStr,     // "10:00 AM to 4:00 PM"
        minutes,           // minutes from midnight
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

        // Sort events within each day by time
        dates.forEach((date) => {
            grouped[date].sort((a, b) => {
                const timeA = parseSchedule(a.schedule).minutes;
                const timeB = parseSchedule(b.schedule).minutes;
                return timeA - timeB;
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
                    {currentEvents.map((ev) => (
                        <ScheduleEventCard key={ev.slug} event={ev} />
                    ))}
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
