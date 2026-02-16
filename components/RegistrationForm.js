"use client";

import { useState } from "react";

import { events } from "@/data/events";

export default function RegistrationForm({ selectedEventSlug }) {
    const initialEvent = selectedEventSlug ? events.find(e => e.slug === selectedEventSlug)?.title : null;

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        college: "",
        phone: "",
        teamSize: "1",
        events: initialEvent ? [initialEvent] : [],
    });
    const [submitted, setSubmitted] = useState(false);

    // Dynamic event options from data
    const eventOptions = events.map(e => e.title);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleEventToggle = (eventName) => {
        // If a specific event is pre-selected via prop, don't allow toggling others (isolated mode)
        // Or if user wants to register for multiple, they can use the main form.
        // For this specific request "isolated registration form for each event", 
        // implies the form on /register/:slug should only register for THAT event.
        if (selectedEventSlug) return;

        setFormData((prev) => ({
            ...prev,
            events: prev.events.includes(eventName)
                ? prev.events.filter((e) => e !== eventName)
                : [...prev.events, eventName],
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);
        // In a real app, you'd send formData to backend here
        console.log("Form Submitted:", formData);
    };

    if (submitted) {
        return (
            <div className="text-center py-20">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="material-symbols-outlined text-primary text-4xl">check_circle</span>
                </div>
                <h2 className="text-3xl font-bold mb-4">Registration Complete!</h2>
                <p className="text-white/60 text-lg max-w-md mx-auto">
                    Welcome to Phoenix 3.0. You&apos;ll receive a confirmation email shortly with all the details.
                </p>
                {selectedEventSlug && (
                    <div className="mt-8">
                        <a href="/events" className="text-primary hover:underline">Browse more events</a>
                    </div>
                )}
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-8">
            <div className="space-y-6">
                <div>
                    <label className="block text-sm font-bold uppercase tracking-widest text-white/60 mb-2">Full Name</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:ring-primary focus:border-primary transition-all"
                        placeholder="Enter your full name"
                    />
                </div>
                <div>
                    <label className="block text-sm font-bold uppercase tracking-widest text-white/60 mb-2">Email Address</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:ring-primary focus:border-primary transition-all"
                        placeholder="you@example.com"
                    />
                </div>
                <div>
                    <label className="block text-sm font-bold uppercase tracking-widest text-white/60 mb-2">College / Institution</label>
                    <input
                        type="text"
                        name="college"
                        value={formData.college}
                        onChange={handleChange}
                        required
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:ring-primary focus:border-primary transition-all"
                        placeholder="Your college or institution"
                    />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-bold uppercase tracking-widest text-white/60 mb-2">Phone Number</label>
                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:ring-primary focus:border-primary transition-all"
                            placeholder="+91 XXXXX XXXXX"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold uppercase tracking-widest text-white/60 mb-2">Team Size</label>
                        <select
                            name="teamSize"
                            value={formData.teamSize}
                            onChange={handleChange}
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:ring-primary focus:border-primary transition-all appearance-none"
                        >
                            {[1, 2, 3, 4, 5].map(num => (
                                <option key={num} value={num} className="bg-background-dark text-white">
                                    {num} Member{num > 1 ? 's' : ''}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            <div>
                <label className="block text-sm font-bold uppercase tracking-widest text-white/60 mb-4">
                    {selectedEventSlug ? "Registering For" : "Select Events"}
                </label>

                {selectedEventSlug ? (
                    // Read-only view for single event registration
                    <div className="p-4 rounded-xl border border-primary/30 bg-primary/10 text-white flex items-center gap-3">
                        <span className="material-symbols-outlined text-primary">check_circle</span>
                        <span className="font-bold">{initialEvent || "Unknown Event"}</span>
                    </div>
                ) : (
                    // Multi-select view for general registration
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {eventOptions.map((event) => (
                            <button
                                key={event}
                                type="button"
                                onClick={() => handleEventToggle(event)}
                                className={`p-4 rounded-xl border text-left text-sm font-medium transition-all ${formData.events.includes(event)
                                    ? "bg-primary/20 border-primary text-white"
                                    : "bg-white/5 border-white/10 text-white/60 hover:border-white/20"
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <span className={`material-symbols-outlined text-sm ${formData.events.includes(event) ? "text-primary" : "text-white/30"}`}>
                                        {formData.events.includes(event) ? "check_circle" : "radio_button_unchecked"}
                                    </span>
                                    {event}
                                </div>
                            </button>
                        ))}
                    </div>
                )}
            </div>

            <button
                type="submit"
                className="w-full bg-primary text-white font-bold py-4 px-8 rounded-lg text-sm tracking-[0.2em] uppercase btn-glow"
            >
                Complete Registration
            </button>
        </form>
    );
}
