"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { events } from "@/data/events";
import TeamSizeSelector from "@/components/TeamSizeSelector";

// ---------------------------------------------------------------------------
// Helper: compute the effective team-size constraints for a set of event slugs.
// effectiveMin = max of all minTeamSizes (must satisfy the strictest minimum)
// effectiveMax = min of all maxTeamSizes (must satisfy the strictest maximum)
// ---------------------------------------------------------------------------
function getTeamSizeConstraints(slugs) {
    if (!slugs || slugs.length === 0) return { min: 1, max: 6, conflict: false };
    const selected = events.filter((e) => slugs.includes(e.slug));
    const min = Math.max(...selected.map((e) => e.minTeamSize));
    const max = Math.min(...selected.map((e) => e.maxTeamSize));
    return { min, max, conflict: min > max };
}

// ---------------------------------------------------------------------------
// Helper: returns the pair of slugs that cause a scheduling overlap, or null.
// Two events overlap when their time ranges intersect (start < other.end && end > other.start).
// ---------------------------------------------------------------------------
function getTimeConflict(slugs) {
    if (!slugs || slugs.length < 2) return null;
    const selected = events.filter((e) => slugs.includes(e.slug));
    for (let i = 0; i < selected.length; i++) {
        for (let j = i + 1; j < selected.length; j++) {
            const a = selected[i];
            const b = selected[j];
            if (!a.startTime || !b.startTime) continue;
            const aStart = new Date(a.startTime);
            const aEnd = new Date(a.endTime);
            const bStart = new Date(b.startTime);
            const bEnd = new Date(b.endTime);
            // Overlap when a starts before b ends AND a ends after b starts
            if (aStart < bEnd && aEnd > bStart) {
                return { a: a.title, b: b.title };
            }
        }
    }
    return null;
}

const LS_KEY = "phoenix_reg_draft_v2";

// ---------------------------------------------------------------------------
// TeamMemberFields — renders name + email inputs for extra members
// ---------------------------------------------------------------------------
function TeamMemberFields({ index, value, onChange, errors }) {
    return (
        <div className="p-4 rounded-xl border border-white/10 bg-white/[0.03] space-y-4">
            <p className="text-sm font-bold uppercase tracking-widest text-white/50">
                Member {index + 2}
            </p>

            <div className="grid grid-cols-1 gap-4">

                {/* Full Name */}
                <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-white/50 mb-1">
                        Full Name <span className="text-primary">*</span>
                    </label>
                    <input
                        type="text"
                        value={value.name}
                        onChange={(e) => onChange(index, "name", e.target.value)}
                        placeholder={`Member ${index + 2} name`}
                        className={`w-full bg-white/5 border rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/60 transition-all ${errors?.name
                            ? "border-red-500"
                            : "border-white/10 focus:border-primary/60"
                            }`}
                    />
                    {errors?.name && (
                        <p className="mt-1 text-xs text-red-400">{errors.name}</p>
                    )}
                </div>

                {/* Phone */}
                <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-white/50 mb-1">
                        Phone Number <span className="text-primary">*</span>
                    </label>
                    <input
                        type="tel"
                        value={value.phone}
                        onChange={(e) => onChange(index, "phone", e.target.value)}
                        placeholder="+91 XXXXX XXXXX"
                        className={`w-full bg-white/5 border rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/60 transition-all ${errors?.phone
                            ? "border-red-500"
                            : "border-white/10 focus:border-primary/60"
                            }`}
                    />
                    {errors?.phone && (
                        <p className="mt-1 text-xs text-red-400">{errors.phone}</p>
                    )}
                </div>

                {/* Email */}
                <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-white/50 mb-1">
                        Email <span className="text-primary">*</span>
                    </label>
                    <input
                        type="email"
                        value={value.email}
                        onChange={(e) => onChange(index, "email", e.target.value)}
                        placeholder={`member${index + 2}@example.com`}
                        className={`w-full bg-white/5 border rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/60 transition-all ${errors?.email
                            ? "border-red-500"
                            : "border-white/10 focus:border-primary/60"
                            }`}
                    />
                    {errors?.email && (
                        <p className="mt-1 text-xs text-red-400">{errors.email}</p>
                    )}
                </div>

            </div>
        </div>
    );
}

// ---------------------------------------------------------------------------
// Main RegistrationForm component
// ---------------------------------------------------------------------------
export default function RegistrationForm({ selectedEventSlug, onSuccess }) {
    const lockedEvent = selectedEventSlug
        ? events.find((e) => e.slug === selectedEventSlug)
        : null;

    // Core form state — always start with safe server-side defaults
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        college: "",
        phone: "",
        teamSize: lockedEvent ? String(lockedEvent.minTeamSize) : "1",
        selectedEvents: lockedEvent ? [lockedEvent.slug] : [],
    });

    // Team member additional details (array of { name, email, phone })
    const [teamMembers, setTeamMembers] = useState([]);

    // Restore draft from localStorage after first client paint (avoids hydration mismatch)
    useEffect(() => {
        try {
            const saved = JSON.parse(localStorage.getItem(LS_KEY) || "null");
            if (!saved) return;

            // Filter out stale slugs that no longer exist in the current events list
            const validSlugs = new Set(events.map((e) => e.slug));
            const restoredEvents = (saved.formData?.selectedEvents ?? []).filter((s) => validSlugs.has(s));

            setFormData((prev) => ({
                ...prev,
                ...saved.formData,
                // In locked mode, keep the locked event + its min team size
                selectedEvents: lockedEvent ? [lockedEvent.slug] : restoredEvents,
                teamSize: lockedEvent ? String(lockedEvent.minTeamSize) : (saved.formData?.teamSize ?? "1"),
            }));
            if (!lockedEvent && saved.teamMembers?.length) {
                setTeamMembers(saved.teamMembers);
            }
        } catch { /* ignore corrupt data */ }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // run once on mount

    // UI state
    const [fieldErrors, setFieldErrors] = useState({});
    const [submitState, setSubmitState] = useState("idle"); // idle | loading | success | error
    const [serverError, setServerError] = useState("");

    // ---------------------------------------------------------------------------
    // Persist draft to localStorage whenever formData or teamMembers change
    // Skip the very first run so the blank default state doesn't overwrite
    // a previously saved draft before the restore effect has committed.
    // ---------------------------------------------------------------------------
    const hasMounted = useRef(false);
    useEffect(() => {
        if (!hasMounted.current) {
            hasMounted.current = true;
            return; // skip the initial mount run
        }
        if (submitState === "success") return; // don't re-save after success
        try {
            localStorage.setItem(LS_KEY, JSON.stringify({ formData, teamMembers }));
        } catch { /* storage full / private mode */ }
    }, [formData, teamMembers, submitState]);

    // ---------------------------------------------------------------------------
    // Keep teamMembers array length in sync with teamSize
    // ---------------------------------------------------------------------------
    useEffect(() => {
        const size = parseInt(formData.teamSize, 10);
        const extras = Math.max(0, size - 1);
        setTeamMembers((prev) => {
            if (prev.length === extras) return prev;
            if (prev.length < extras) {
                return [...prev, ...Array(extras - prev.length).fill({ name: "", email: "", phone: "" })];
            }
            return prev.slice(0, extras);
        });
    }, [formData.teamSize]);

    // ---------------------------------------------------------------------------
    // Computed: team size constraints + scheduling conflict
    // ---------------------------------------------------------------------------
    const constraints = getTeamSizeConstraints(formData.selectedEvents);
    const timeConflict = getTimeConflict(formData.selectedEvents);

    useEffect(() => {
        if (selectedEventSlug) return; // locked — constraints are fixed
        const size = parseInt(formData.teamSize, 10);
        if (!constraints.conflict) {
            if (size < constraints.min) {
                setFormData((prev) => ({ ...prev, teamSize: String(constraints.min) }));
            } else if (size > constraints.max) {
                setFormData((prev) => ({ ...prev, teamSize: String(constraints.max) }));
            }
        }
    }, [formData.selectedEvents, constraints.min, constraints.max, constraints.conflict, selectedEventSlug, formData.teamSize]);

    // ---------------------------------------------------------------------------
    // Handlers
    // ---------------------------------------------------------------------------
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
    };

    const handleEventToggle = (slug) => {
        if (selectedEventSlug) return; // locked mode
        setFormData((prev) => {
            const already = prev.selectedEvents.includes(slug);
            const next = already
                ? prev.selectedEvents.filter((s) => s !== slug)
                : [...prev.selectedEvents, slug];
            // Block toggle if adding this event creates a scheduling conflict
            if (!already) {
                const conflict = getTimeConflict(next);
                if (conflict) {
                    // Still update so we can surface the warning, no — better UX: block it
                    return prev; // reject the toggle silently (UI shows the conflict badge)
                }
            }
            return { ...prev, selectedEvents: next };
        });
        setFieldErrors((prev) => ({ ...prev, selectedEvents: undefined }));
    };

    const handleMemberChange = useCallback((index, field, value) => {
        setTeamMembers((prev) => {
            const updated = [...prev];
            updated[index] = { ...updated[index], [field]: value };
            return updated;
        });
        setFieldErrors((prev) => {
            const memberErrors = { ...(prev.teamMembers ?? {}) };
            if (memberErrors[index]) {
                memberErrors[index] = { ...memberErrors[index], [field]: undefined };
            }
            return { ...prev, teamMembers: memberErrors };
        });
    }, []);

    // ---------------------------------------------------------------------------
    // Client-side validation (mirrors server validation for instant feedback)
    // ---------------------------------------------------------------------------
    function validate() {
        const errors = {};
        const EMAIL_RE = /^[^\s@]+@(gmail\.com|yahoo\.com|outlook\.com|hotmail\.com|[a-zA-Z0-9.-]+\.(edu\.in|ac\.in|edu))$/i;
        const PHONE_RE = /^(?:\+91|91)?[6-9]\d{9}$/;

        if (!formData.name.trim()) errors.name = "Full name is required.";
        if (!formData.email.trim()) errors.email = "Email address is required.";
        else if (!EMAIL_RE.test(formData.email.trim())) errors.email = "Use a college email (*.edu.in / *.ac.in) or Gmail / Yahoo / Outlook.";
        if (!formData.college.trim()) errors.college = "College / institution is required.";
        if (!formData.phone.trim()) errors.phone = "Phone number is required.";
        else if (!PHONE_RE.test(formData.phone.trim().replace(/\s/g, ""))) errors.phone = "Enter a valid 10-digit mobile number (e.g. 9876543210).";

        if (formData.selectedEvents.length === 0)
            errors.selectedEvents = "Please select at least one event.";

        if (constraints.conflict) {
            errors.selectedEvents =
                "The selected events have incompatible team sizes. Please adjust your selection.";
        }

        const teamSizeNum = parseInt(formData.teamSize, 10);
        const memberErrors = {};
        if (teamSizeNum > 1) {
            for (let i = 0; i < teamSizeNum - 1; i++) {
                const m = teamMembers[i] ?? {};
                const me = {};
                if (!m.name?.trim()) me.name = "Name is required.";
                if (!m.email?.trim()) me.email = "Email is required.";
                else if (!EMAIL_RE.test(m.email.trim())) me.email = "Use a college email or Gmail / Yahoo / Outlook.";
                if (!m.phone?.trim()) me.phone = "Phone number is required.";
                else if (!PHONE_RE.test(m.phone.trim().replace(/\s/g, ""))) me.phone = "Enter a valid 10-digit mobile number.";
                if (Object.keys(me).length) memberErrors[i] = me;
            }
        }
        if (Object.keys(memberErrors).length) errors.teamMembers = memberErrors;

        return errors;
    }

    // ---------------------------------------------------------------------------
    // Submit
    // ---------------------------------------------------------------------------
    const handleSubmit = async (e) => {
        e.preventDefault();
        setServerError("");

        const errors = validate();
        if (Object.keys(errors).length > 0) {
            setFieldErrors(errors);
            // Scroll to first error
            const firstError = document.querySelector("[data-field-error]");
            firstError?.scrollIntoView({ behavior: "smooth", block: "center" });
            return;
        }

        setSubmitState("loading");

        try {
            const res = await fetch("/api/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: formData.name.trim(),
                    email: formData.email.trim(),
                    college: formData.college.trim(),
                    phone: formData.phone.trim(),
                    teamSize: formData.teamSize,
                    selectedEvents: formData.selectedEvents,
                    teamMembers: teamMembers.map((m) => ({
                        name: m.name?.trim() ?? "",
                        email: m.email?.trim() ?? "",
                        phone: m.phone?.trim() ?? "",
                    })),
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                setServerError(data.error ?? "Registration failed. Please try again.");
                setSubmitState("error");
                return;
            }

            setSubmitState("success");
            if (onSuccess) onSuccess();
            try { localStorage.removeItem(LS_KEY); } catch { /* ignore */ }
        } catch {
            setServerError("Network error. Please check your connection and try again.");
            setSubmitState("error");
        }
    };

    // ---------------------------------------------------------------------------
    // Success screen
    // ---------------------------------------------------------------------------
    if (submitState === "success") {
        const registeredEventTitles = formData.selectedEvents
            .map((slug) => events.find((e) => e.slug === slug)?.title)
            .filter(Boolean);

        return (
            <div className="text-center py-20 max-w-lg mx-auto">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 ring-2 ring-primary/30">
                    <span className="material-symbols-outlined text-primary text-4xl">check_circle</span>
                </div>
                <h2 className="text-3xl font-bold mb-3">You&apos;re Registered!</h2>
                <p className="text-white/60 text-base mb-6">
                    Welcome to <span className="text-primary font-semibold">Phoenix 3.0</span>. Your spot is confirmed.
                </p>
                {registeredEventTitles.length > 0 && (
                    <div className="mb-8 space-y-2">
                        {registeredEventTitles.map((title) => (
                            <div
                                key={title}
                                className="inline-flex items-center gap-2 bg-primary/10 border border-primary/30 text-white text-sm font-medium px-4 py-2 rounded-full mr-2"
                            >
                                <span className="material-symbols-outlined text-primary text-base">event</span>
                                {title}
                            </div>
                        ))}
                    </div>
                )}
                <p className="text-white/40 text-sm mb-10">
                    Keep an eye on this page and our social channels for event updates.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Link
                        href="/events"
                        className="text-primary border border-primary/30 hover:bg-primary/10 text-sm font-bold tracking-widest uppercase px-6 py-3 rounded-lg transition-all"
                    >
                        Browse Events
                    </Link>
                    <Link
                        href="/schedule"
                        className="bg-primary hover:bg-primary/90 text-white text-sm font-bold tracking-widest uppercase px-6 py-3 rounded-lg btn-glow transition-all"
                    >
                        View Schedule
                    </Link>
                </div>
            </div>
        );
    }

    // ---------------------------------------------------------------------------
    // Effective team size options for the select dropdown
    // ---------------------------------------------------------------------------
    const effectiveMin = lockedEvent ? lockedEvent.minTeamSize : constraints.min;
    const effectiveMax = lockedEvent ? lockedEvent.maxTeamSize : (constraints.conflict ? 6 : constraints.max);
    const teamSizeOptions = Array.from(
        { length: Math.max(0, effectiveMax - effectiveMin + 1) },
        (_, i) => effectiveMin + i
    );

    const inputClass = (field) =>
        `w-full bg-white/5 border rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/60 transition-all ${fieldErrors[field] ? "border-red-500" : "border-white/10 focus:border-primary/60"
        }`;

    return (
        <form onSubmit={handleSubmit} noValidate className="max-w-2xl mx-auto space-y-10">
            {/* ---------------------------------------------------------------- */}
            {/* Section 1: Personal Details                                       */}
            {/* ---------------------------------------------------------------- */}
            <section className="space-y-6">
                <h3 className="text-xs font-bold uppercase tracking-[0.25em] text-white/40 border-b border-white/10 pb-3">
                    Team Leader Details
                </h3>

                {/* Name */}
                <div>
                    <label className="block text-sm font-bold uppercase tracking-widest text-white/60 mb-2">
                        Full Name <span className="text-primary">*</span>
                    </label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter your full name"
                        autoComplete="name"
                        className={inputClass("name")}
                        data-field-error={fieldErrors.name ? "true" : undefined}
                    />
                    {fieldErrors.name && (
                        <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1">
                            <span className="material-symbols-outlined text-sm">error</span>
                            {fieldErrors.name}
                        </p>
                    )}
                </div>


                {/* Phone */}
                <div>
                    <label className="block text-sm font-bold uppercase tracking-widest text-white/60 mb-2">
                        Phone Number <span className="text-primary">*</span>
                    </label>
                    <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+91 XXXXX XXXXX"
                        autoComplete="tel"
                        className={inputClass("phone")}
                        data-field-error={fieldErrors.phone ? "true" : undefined}
                    />
                    {fieldErrors.phone && (
                        <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1">
                            <span className="material-symbols-outlined text-sm">error</span>
                            {fieldErrors.phone}
                        </p>
                    )}
                </div>


                {/* Email */}
                <div>
                    <label className="block text-sm font-bold uppercase tracking-widest text-white/60 mb-2">
                        Email Address <span className="text-primary">*</span>
                    </label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="you@example.com"
                        autoComplete="email"
                        className={inputClass("email")}
                        data-field-error={fieldErrors.email ? "true" : undefined}
                    />
                    {fieldErrors.email && (
                        <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1">
                            <span className="material-symbols-outlined text-sm">error</span>
                            {fieldErrors.email}
                        </p>
                    )}
                </div>

                {/* College */}
                <div>
                    <label className="block text-sm font-bold uppercase tracking-widest text-white/60 mb-2">
                        College / Institution <span className="text-primary">*</span>
                    </label>
                    <input
                        type="text"
                        name="college"
                        value={formData.college}
                        onChange={handleChange}
                        placeholder="Your college or institution"
                        autoComplete="organization"
                        className={inputClass("college")}
                        data-field-error={fieldErrors.college ? "true" : undefined}
                    />
                    {fieldErrors.college && (
                        <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1">
                            <span className="material-symbols-outlined text-sm">error</span>
                            {fieldErrors.college}
                        </p>
                    )}
                </div>


            </section>

            {/* ---------------------------------------------------------------- */}
            {/* Section 2: Event Selection                                       */}
            {/* ---------------------------------------------------------------- */}
            <section className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-[0.25em] text-white/40 border-b border-white/10 pb-3">
                    {selectedEventSlug ? "Registering For" : "Select Events"}
                </h3>

                {selectedEventSlug ? (
                    /* Locked single-event badge */
                    <div className="p-4 rounded-xl border border-primary/40 bg-primary/10 flex items-center gap-3">
                        <span className="material-symbols-outlined text-primary text-xl">event_available</span>
                        <div>
                            <p className="font-bold text-white">{lockedEvent?.title ?? "Unknown Event"}</p>
                            <p className="text-xs text-white/50 mt-0.5">
                                Team size: {lockedEvent?.minTeamSize === lockedEvent?.maxTeamSize
                                    ? `${lockedEvent?.minTeamSize} member${lockedEvent?.minTeamSize > 1 ? "s" : ""} (solo)`
                                    : `${lockedEvent?.minTeamSize}–${lockedEvent?.maxTeamSize} members`}
                            </p>
                        </div>
                    </div>
                ) : (
                    /* Multi-event toggle grid — grouped by day */
                    <>
                        {/* Build day-grouped structure from startTime */}
                        {(() => {
                            // Group events by their date string (YYYY-MM-DD)
                            const dayMap = new Map();
                            events.forEach((event) => {
                                const dateKey = event.startTime
                                    ? event.startTime.slice(0, 10)
                                    : "TBD";
                                if (!dayMap.has(dateKey)) dayMap.set(dateKey, []);
                                dayMap.get(dateKey).push(event);
                            });
                            const days = [...dayMap.entries()].sort(([a], [b]) => a.localeCompare(b));

                            return (
                                <div
                                    className={`grid gap-6 ${days.length > 1 ? "md:grid-cols-2" : "grid-cols-1"}`}
                                    data-field-error={fieldErrors.selectedEvents ? "true" : undefined}
                                >
                                    {days.map(([dateKey, dayEvents], dayIdx) => {
                                        // Human-readable date label
                                        const dateLabel = dateKey !== "TBD"
                                            ? new Date(dateKey + "T12:00:00").toLocaleDateString("en-IN", { day: "numeric", month: "long" })
                                            : "TBD";

                                        return (
                                            <div key={dateKey} className="space-y-2">
                                                {/* Day header */}
                                                <div className="flex items-center gap-2 mb-3">
                                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary bg-primary/10 border border-primary/30 px-2.5 py-1 rounded-full">
                                                        Day {dayIdx + 1}
                                                    </span>
                                                    <span className="text-xs text-white/30 font-medium">{dateLabel}</span>
                                                    <div className="h-px flex-1 bg-white/5" />
                                                </div>

                                                {/* Events for this day */}
                                                {dayEvents.map((event) => {
                                                    const isSelected = formData.selectedEvents.includes(event.slug);
                                                    const wouldConflict = !isSelected && !!getTimeConflict(
                                                        [...formData.selectedEvents, event.slug]
                                                    );
                                                    const teamLabel =
                                                        event.minTeamSize === event.maxTeamSize
                                                            ? event.minTeamSize === 1
                                                                ? "Solo"
                                                                : `${event.minTeamSize} members`
                                                            : `${event.minTeamSize}–${event.maxTeamSize} members`;
                                                    return (
                                                        <button
                                                            key={event.slug}
                                                            type="button"
                                                            onClick={() => handleEventToggle(event.slug)}
                                                            disabled={wouldConflict}
                                                            title={wouldConflict ? "This event overlaps with one you already selected" : undefined}
                                                            className={`w-full p-4 rounded-xl border text-left transition-all ${isSelected
                                                                ? "bg-primary/20 border-primary text-white"
                                                                : wouldConflict
                                                                    ? "bg-white/[0.02] border-white/5 text-white/25 cursor-not-allowed"
                                                                    : "bg-white/5 border-white/10 text-white/60 hover:border-white/25 hover:text-white/80"
                                                                }`}
                                                        >
                                                            <div className="flex items-start gap-3">
                                                                <span
                                                                    className={`material-symbols-outlined text-base mt-0.5 shrink-0 ${isSelected ? "text-primary" : wouldConflict ? "text-white/20" : "text-white/30"
                                                                        }`}
                                                                >
                                                                    {isSelected ? "check_circle" : wouldConflict ? "event_busy" : "radio_button_unchecked"}
                                                                </span>
                                                                <div>
                                                                    <p className="text-sm font-semibold leading-snug">{event.title}</p>

                                                                    <p className="text-xs text-white/40 mt-0.5">
                                                                        {wouldConflict ? (
                                                                            <span className="text-amber-500/70">Schedule conflict</span>
                                                                        ) : teamLabel}
                                                                    </p>
                                                                    {(event.startTime || event.endTime) && (
                                                                        <p className="text-[13px] text-white/25 mt-1">
                                                                            {event.startTime && new Date(event.startTime).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true })}
                                                                            {event.startTime && event.endTime && " – "}
                                                                            {event.endTime && new Date(event.endTime).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true })}
                                                                        </p>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        );
                                    })}
                                </div>
                            );
                        })()}

                        {/* Time conflict warning */}
                        {timeConflict && (
                            <div className="flex items-start gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                                <span className="material-symbols-outlined text-base mt-0.5 shrink-0">schedule</span>
                                <span>
                                    <strong>{timeConflict.a}</strong> and <strong>{timeConflict.b}</strong> overlap — you can&apos;t attend both. Please deselect one.
                                </span>
                            </div>
                        )}

                        {/* Team-size conflict warning */}
                        {constraints.conflict && formData.selectedEvents.length > 1 && (
                            <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 text-sm">
                                <span className="material-symbols-outlined text-base mt-0.5 shrink-0">warning</span>
                                <span>
                                    The selected events have incompatible team sizes. Please deselect one to continue.
                                </span>
                            </div>
                        )}

                        {fieldErrors.selectedEvents && !constraints.conflict && (
                            <p className="text-xs text-red-400 flex items-center gap-1">
                                <span className="material-symbols-outlined text-sm">error</span>
                                {fieldErrors.selectedEvents}
                            </p>
                        )}
                    </>
                )}
            </section>

            {/* ---------------------------------------------------------------- */}
            {/* Section 3: Team Size                                              */}
            {/* ---------------------------------------------------------------- */}
            <section className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-[0.25em] text-white/40 border-b border-white/10 pb-3">
                    Team Details
                </h3>

                <div>
                    <label className="block text-sm font-bold uppercase tracking-widest text-white/60 mb-2">
                        Team Size <span className="text-primary">*</span>
                    </label>

                    {/* Team Size Selector */}
                    {constraints.conflict || teamSizeOptions.length === 0 ? (
                        <div className="w-full bg-white/5 border border-amber-500/30 rounded-lg px-4 py-3 text-amber-400 text-sm">
                            Resolve event conflict above to set team size.
                        </div>
                    ) : (
                        <TeamSizeSelector
                            value={formData.teamSize}
                            onChange={(val) => {
                                setFormData((prev) => ({ ...prev, teamSize: val }));
                                setFieldErrors((prev) => ({ ...prev, teamSize: undefined }));
                            }}
                            min={effectiveMin}
                            max={effectiveMax}
                        />
                    )}
                </div>

                {/* Additional member fields */}
                {teamMembers.length > 0 && (
                    <div className="space-y-3 pt-2">
                        <p className="text-xs text-white/40 uppercase tracking-widest font-semibold">
                            Team Members Details
                        </p>
                        {teamMembers.map((member, i) => (
                            <TeamMemberFields
                                key={i}
                                index={i}
                                value={member}
                                onChange={handleMemberChange}
                                errors={fieldErrors.teamMembers?.[i]}
                            />
                        ))}
                    </div>
                )}
            </section>

            {/* ---------------------------------------------------------------- */}
            {/* Server error banner                                               */}
            {/* ---------------------------------------------------------------- */}
            {submitState === "error" && serverError && (
                <div className="flex items-start gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                    <span className="material-symbols-outlined text-base mt-0.5 shrink-0">error</span>
                    <span>{serverError}</span>
                </div>
            )}

            {/* ---------------------------------------------------------------- */}
            {/* Submit button                                                     */}
            {/* ---------------------------------------------------------------- */}
            <button
                type="submit"
                disabled={submitState === "loading" || constraints.conflict}
                className="w-full bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 px-8 rounded-lg text-sm tracking-[0.2em] uppercase btn-glow transition-all active:scale-[0.98] flex items-center justify-center gap-3"
            >
                {submitState === "loading" ? (
                    <>
                        <svg
                            className="animate-spin h-4 w-4 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                            />
                            <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8v8H4z"
                            />
                        </svg>
                        Submitting…
                    </>
                ) : (
                    "Complete Registration"
                )}
            </button>

            <p className="text-center text-xs text-white/30">
                By registering you agree to abide by Phoenix 3.0 event rules and code of conduct.
            </p>
        </form>
    );
}
