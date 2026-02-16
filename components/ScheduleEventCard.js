"use client";

import Link from "next/link";

function parseTime(scheduleStr) {
    // e.g. "March 5, 2026 — 10:00 AM to 4:00 PM"
    // We want to extract just the time part: "10:00 AM to 4:00 PM"
    const parts = scheduleStr.split("—").map((s) => s.trim());
    return parts.length > 1 ? parts[1] : "";
}

export default function ScheduleEventCard({ event }) {
    const time = parseTime(event.schedule || "");
    // "10:00 AM to 4:00 PM" -> ["10:00 AM", "4:00 PM"]
    const timeParts = time.includes(" to ") ? time.split(" to ") : [time, ""];

    return (
        <div className="group">
            <Link
                href={`/events/${event.slug}`}
                className="block relative bg-charcoal border border-white/5 hover:border-primary/30 rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(255,106,0,0.1)]"
            >
                <div className="flex flex-col sm:flex-row sm:items-stretch">
                    {/* Time Column (Desktop) */}
                    <div className="hidden sm:flex flex-col justify-center items-center w-32 bg-white/5 border-r border-white/5 p-4 text-center shrink-0">
                        <span className="material-symbols-outlined text-primary mb-1 text-xl">
                            schedule
                        </span>
                        <span className="text-white font-bold text-sm">{timeParts[0]}</span>
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
                                    {event.title}
                                </h3>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 text-sm text-white/50">
                            <span className="flex items-center gap-1.5">
                                <span className="material-symbols-outlined text-sm">
                                    location_on
                                </span>
                                {event.venue}
                            </span>
                            <span className="w-1 h-1 rounded-full bg-white/20"></span>
                            <span className="flex items-center gap-1.5">
                                <span className="material-symbols-outlined text-sm">group</span>
                                {event.participants}
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
}
