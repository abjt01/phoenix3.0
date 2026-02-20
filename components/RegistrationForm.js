"use client";

import { useState, useEffect, useCallback } from "react";
import { events } from "@/data/events";

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
// TeamMemberFields — renders name + email inputs for extra members
// ---------------------------------------------------------------------------
function TeamMemberFields({ index, value, onChange, errors }) {
    return (
        <div className="p-4 rounded-xl border border-white/10 bg-white/[0.03] space-y-4">
            <p className="text-sm font-bold uppercase tracking-widest text-white/50">
                Member {index + 2}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-white/50 mb-1">
                        Full Name
                    </label>
                    <input
                        type="text"
                        value={value.name}
                        onChange={(e) => onChange(index, "name", e.target.value)}
                        placeholder={`Member ${index + 2} name`}
                        className={`w-full bg-white/5 border rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/60 transition-all ${errors?.name ? "border-red-500" : "border-white/10 focus:border-primary/60"
                            }`}
                    />
                    {errors?.name && (
                        <p className="mt-1 text-xs text-red-400">{errors.name}</p>
                    )}
                </div>
                <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-white/50 mb-1">
                        Email
                    </label>
                    <input
                        type="email"
                        value={value.email}
                        onChange={(e) => onChange(index, "email", e.target.value)}
                        placeholder={`member${index + 2}@example.com`}
                        className={`w-full bg-white/5 border rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/60 transition-all ${errors?.email ? "border-red-500" : "border-white/10 focus:border-primary/60"
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
export default function RegistrationForm({ selectedEventSlug }) {
    const lockedEvent = selectedEventSlug
        ? events.find((e) => e.slug === selectedEventSlug)
        : null;

    // Core form state
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        college: "",
        phone: "",
        teamSize: lockedEvent
            ? String(lockedEvent.minTeamSize)
            : "1",
        selectedEvents: lockedEvent ? [lockedEvent.slug] : [],
    });

    // Team member additional details (array of { name, email })
    const [teamMembers, setTeamMembers] = useState([]);

    // UI state
    const [fieldErrors, setFieldErrors] = useState({});
    const [submitState, setSubmitState] = useState("idle"); // idle | loading | success | error
    const [serverError, setServerError] = useState("");

    // ---------------------------------------------------------------------------
    // Keep teamMembers array length in sync with teamSize
    // ---------------------------------------------------------------------------
    useEffect(() => {
        const size = parseInt(formData.teamSize, 10);
        const extras = Math.max(0, size - 1);
        setTeamMembers((prev) => {
            if (prev.length === extras) return prev;
            if (prev.length < extras) {
                return [...prev, ...Array(extras - prev.length).fill({ name: "", email: "" })];
            }
            return prev.slice(0, extras);
        });
    }, [formData.teamSize]);

    // ---------------------------------------------------------------------------
    // Re-clamp team size when selected events change (general form only)
    // ---------------------------------------------------------------------------
    const constraints = getTeamSizeConstraints(formData.selectedEvents);

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
            return {
                ...prev,
                selectedEvents: already
                    ? prev.selectedEvents.filter((s) => s !== slug)
                    : [...prev.selectedEvents, slug],
            };
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
        const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const PHONE_RE = /^[\d\s+\-().]{7,20}$/;

        if (!formData.name.trim()) errors.name = "Full name is required.";
        if (!formData.email.trim()) errors.email = "Email address is required.";
        else if (!EMAIL_RE.test(formData.email.trim())) errors.email = "Enter a valid email address.";
        if (!formData.college.trim()) errors.college = "College / institution is required.";
        if (!formData.phone.trim()) errors.phone = "Phone number is required.";
        else if (!PHONE_RE.test(formData.phone.trim())) errors.phone = "Enter a valid phone number.";

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
                else if (!EMAIL_RE.test(m.email.trim())) me.email = "Enter a valid email.";
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
                    <a
                        href="/events"
                        className="text-primary border border-primary/30 hover:bg-primary/10 text-sm font-bold tracking-widest uppercase px-6 py-3 rounded-lg transition-all"
                    >
                        Browse Events
                    </a>
                    <a
                        href="/schedule"
                        className="bg-primary hover:bg-primary/90 text-white text-sm font-bold tracking-widest uppercase px-6 py-3 rounded-lg btn-glow transition-all"
                    >
                        View Schedule
                    </a>
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
                    Personal Details
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
            </section>

            {/* ---------------------------------------------------------------- */}
            {/* Section 2: Event Selection                                        */}
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
                    /* Multi-event toggle grid */
                    <>
                        <div
                            className="grid grid-cols-1 sm:grid-cols-2 gap-3"
                            data-field-error={fieldErrors.selectedEvents ? "true" : undefined}
                        >
                            {events.map((event) => {
                                const isSelected = formData.selectedEvents.includes(event.slug);
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
                                        className={`p-4 rounded-xl border text-left transition-all ${isSelected
                                            ? "bg-primary/20 border-primary text-white"
                                            : "bg-white/5 border-white/10 text-white/60 hover:border-white/25 hover:text-white/80"
                                            }`}
                                    >
                                        <div className="flex items-start gap-3">
                                            <span
                                                className={`material-symbols-outlined text-base mt-0.5 shrink-0 ${isSelected ? "text-primary" : "text-white/30"
                                                    }`}
                                            >
                                                {isSelected ? "check_circle" : "radio_button_unchecked"}
                                            </span>
                                            <div>
                                                <p className="text-sm font-semibold leading-snug">{event.title}</p>
                                                <p className="text-xs text-white/40 mt-0.5">{teamLabel}</p>
                                            </div>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>

                        {/* Conflict warning */}
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

                    {/* Show helpful constraint info */}
                    {!selectedEventSlug && formData.selectedEvents.length > 0 && !constraints.conflict && (
                        <p className="text-xs text-white/40 mb-2">
                            Allowed for your selected events:{" "}
                            <span className="text-white/60 font-semibold">
                                {constraints.min === constraints.max
                                    ? `${constraints.min} member${constraints.min > 1 ? "s" : ""}`
                                    : `${constraints.min}–${constraints.max} members`}
                            </span>
                        </p>
                    )}

                    {constraints.conflict || teamSizeOptions.length === 0 ? (
                        <div className="w-full bg-white/5 border border-amber-500/30 rounded-lg px-4 py-3 text-amber-400 text-sm">
                            Resolve event conflict above to set team size.
                        </div>
                    ) : (
                        <select
                            name="teamSize"
                            value={formData.teamSize}
                            onChange={handleChange}
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/60 focus:border-primary/60 transition-all appearance-none"
                        >
                            {teamSizeOptions.map((num) => (
                                <option key={num} value={num} className="bg-neutral-900 text-white">
                                    {num} Member{num > 1 ? "s" : ""}
                                    {num === 1 ? " (Solo)" : ""}
                                </option>
                            ))}
                        </select>
                    )}
                </div>

                {/* Additional member fields */}
                {teamMembers.length > 0 && (
                    <div className="space-y-3 pt-2">
                        <p className="text-xs text-white/40 uppercase tracking-widest font-semibold">
                            Additional Team Members
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
