"use client";

import { useState } from "react";

export default function RegistrationForm() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        college: "",
        phone: "",
        events: [],
    });
    const [submitted, setSubmitted] = useState(false);

    const eventOptions = [
        "Code-A-Thon 2024",
        "Beat the Buzzer",
        "Synth-Wave Night",
        "Algorithm Arena",
        "Pixel Perfect",
        "The Grand Quiz",
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleEventToggle = (eventName) => {
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
            </div>

            <div>
                <label className="block text-sm font-bold uppercase tracking-widest text-white/60 mb-4">Select Events</label>
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
