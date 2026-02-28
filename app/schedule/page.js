"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import Link from "next/link";
import { events } from "@/data/events";
import ScheduleEventCard from "@/components/ScheduleEventCard";
import AnimatedList, { AnimatedItem } from "@/components/AnimatedList";

/* ──── helpers ──── */

function parseSchedule(scheduleStr) {
    const parts = scheduleStr.split("—").map((s) => s.trim());
    const dateStr = parts.length > 1 ? parts[0] : scheduleStr;
    const timeStr = parts.length > 1 ? parts[1] : "";

    const dayMatch = dateStr.match(/([A-Za-z]+)\s+(\d+)/);
    const month = dayMatch ? dayMatch[1] : "";
    const day = dayMatch ? parseInt(dayMatch[2], 10) : 0;

    const dateObj = new Date(dateStr + ", 2026");

    let minutes = 0;
    if (timeStr) {
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

    // Short day-of-week abbreviation
    const weekdays = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
    const dayOfWeek = isNaN(dateObj.getTime()) ? "" : weekdays[dateObj.getDay()];

    // Short month abbreviation
    const monthShort = month.slice(0, 3).toUpperCase();

    return {
        fullDate: dateStr,
        month,
        monthShort,
        day,
        dayOfWeek,
        year: isNaN(dateObj.getFullYear()) ? new Date().getFullYear() : dateObj.getFullYear(),
        time: timeStr,
        minutes,
        dateObj,
    };
}

export default function SchedulePage() {
    const { groupedEvents, sortedDates } = useMemo(() => {
        const grouped = {};

        events.forEach((ev) => {
            if (!ev.schedule) return;
            const { fullDate } = parseSchedule(ev.schedule);
            if (!grouped[fullDate]) grouped[fullDate] = [];
            grouped[fullDate].push(ev);
        });

        const dates = Object.keys(grouped).sort((a, b) => new Date(a) - new Date(b));

        dates.forEach((date) => {
            grouped[date].sort((a, b) => {
                const timeA = parseSchedule(a.schedule).minutes;
                const timeB = parseSchedule(b.schedule).minutes;
                return timeA - timeB;
            });
        });

        return { groupedEvents: grouped, sortedDates: dates };
    }, []);

    const [activeDate, setActiveDate] = useState(sortedDates[0]);
    const [animKey, setAnimKey] = useState(0);
    const scrollRef = useRef(null);
    const activeRef = useRef(null);

    const currentEvents = groupedEvents[activeDate] || [];

    // Scroll the active pill into view when it changes
    useEffect(() => {
        if (activeRef.current && scrollRef.current) {
            const container = scrollRef.current;
            const pill = activeRef.current;
            const containerRect = container.getBoundingClientRect();
            const pillRect = pill.getBoundingClientRect();
            const scrollOffset =
                pillRect.left - containerRect.left - containerRect.width / 2 + pillRect.width / 2;
            container.scrollBy({ left: scrollOffset, behavior: "smooth" });
        }
    }, [activeDate]);

    // Derive date range for Hero section
    let dateRangeString = "Upcoming Events";
    if (sortedDates.length > 0) {
        const first = parseSchedule(groupedEvents[sortedDates[0]][0].schedule);
        const last = parseSchedule(groupedEvents[sortedDates[sortedDates.length - 1]][0].schedule);
        dateRangeString =
            first.month === last.month
                ? `${first.month} ${first.day} – ${last.day}, ${first.year}`
                : `${first.month} ${first.day} – ${last.month} ${last.day}, ${first.year}`;
    }

    function handleDateSelect(date) {
        setActiveDate(date);
        setAnimKey((k) => k + 1);
    }

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
            <style>{`
                /* Horizontal date picker scrollbar hidden */
                .date-scroll::-webkit-scrollbar { display: none; }
                .date-scroll { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>

            <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 pt-20 md:pt-28 pb-10">

                {/* ── Hero ── */}
                <div className="max-w-3xl mx-auto mb-10 space-y-3">

                    <h2 className="text-5xl md:text-6xl font-black tracking-tight leading-none uppercase">
                        Event{" "}
                        <span className="gradient-title pr-2 italic">
                            Schedule
                        </span>
                    </h2>
                    <p className="text-white/50 text-lg max-w-2xl font-light">
                        Pick a date below to explore events happening that day.
                    </p>
                </div>

                {/* ── Horizontal Date Picker ── */}
                <div className="relative mb-10">
                    {/* Fade edges */}
                    {/* <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-10 bg-gradient-to-r from-[var(--bg,#0a0a0a)] to-transparent z-10" />
                    <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-10 bg-gradient-to-l from-[var(--bg,#0a0a0a)] to-transparent z-10" /> */}

                    <div
                        ref={scrollRef}
                        className="date-scroll date-track relative flex justify-center gap-3 overflow-x-auto py-4 px-4"
                    >
                        {sortedDates.map((date, index) => {
                            const { day, monthShort, dayOfWeek } = parseSchedule(
                                groupedEvents[date][0].schedule
                            );
                            const isActive = activeDate === date;
                            const count = groupedEvents[date].length;

                            return (
                                <button
                                    key={date}
                                    ref={isActive ? activeRef : null}
                                    onClick={() => handleDateSelect(date)}
                                    className={`
                                        relative flex-shrink-0 flex flex-col items-center justify-center
                                        w-16 rounded-2xl border transition-all duration-300 select-none
                                        ${isActive
                                            ? "bg-primary border-primary text-white pill-active py-4"
                                            : "bg-white/5 border-white/10 text-white/50 hover:bg-white/10 hover:border-white/20 hover:text-white py-3"
                                        }
                                    `}
                                    style={{ minHeight: isActive ? "88px" : "100px" }}
                                >
                                    {/* Day label (DAY 01) */}
                                    <span className={`text-[9px] font-bold tracking-widest mb-0.5 ${isActive ? "text-white/70" : "text-white/30"}`}>
                                        DAY {String(index + 1).padStart(2, "0")}
                                    </span>

                                    {/* Big date number */}
                                    <span className={`text-2xl font-black leading-none ${isActive ? "text-white" : "text-white/70"}`}>
                                        {day}
                                    </span>

                                    {/* Month short */}
                                    <span className={`text-[10px] font-semibold tracking-wide mt-0.5 ${isActive ? "text-white/80" : "text-white/40"}`}>
                                        {monthShort}
                                    </span>

                                    {/* Event count badge */}
                                    <span className={`
                                        mt-1.5 text-[9px] font-bold px-2 py-0.5 rounded-full
                                        ${isActive
                                            ? "bg-white/20 text-white"
                                            : "bg-white/5 text-white/30"
                                        }
                                    `}>
                                        {count} {count === 1 ? "event" : "events"}
                                    </span>


                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* ── Active Date Header ── */}
                {activeDate && (() => {
                    const { day, month, dayOfWeek } = parseSchedule(
                        groupedEvents[activeDate][0].schedule
                    );
                    return (
                        <div className="max-w-3xl mx-auto flex items-center gap-4 mb-6">
                            <div className="flex items-baseline gap-2">
                                <span className="text-3xl font-black text-white italic uppercase">
                                    {dayOfWeek && <span className="text-primary mr-1">{dayOfWeek}, </span>}
                                    {month} {day}
                                </span>
                                {/* <span className="text-white/30 text-sm font-medium">{year}</span> */}
                            </div>
                            <div className="h-px flex-1 bg-gradient-to-r from-primary/40 to-transparent" />
                            <span className="text-white/40 text-sm font-medium">
                                {currentEvents.length} {currentEvents.length === 1 ? "event" : "events"}
                            </span>
                        </div>
                    );
                })()}

                {/* ── Event Cards (animated) ── */}
                <div className="max-w-3xl mx-auto flex justify-center w-full">
                    <div key={animKey} className="space-y-4 w-full">
                        {currentEvents.map((ev, i) => (
                            <AnimatedItem key={ev.slug} index={i} delay={i * 0.05} onMouseEnter={() => { }} onClick={() => { }}>
                                <ScheduleEventCard event={ev} />
                            </AnimatedItem>
                        ))}
                    </div>
                </div>

                {/* ── Bottom CTA ── */}
                <div className="mt-20 text-center">
                    <Link
                        href="/register"
                        className="inline-flex items-center gap-2 text-white/40 hover:text-primary font-bold text-sm tracking-widest uppercase transition-colors"
                    >
                        Register for Events
                        <span className="material-symbols-outlined text-lg">arrow_forward</span>
                    </Link>
                </div>
            </main>
        </div>
    );
}
