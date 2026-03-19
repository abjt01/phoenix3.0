'use client';

import { useState } from 'react';
// Registration is closed

export default function RegisterPage() {
    const [isRegistered, setIsRegistered] = useState(false);

    return (
        <div className="min-h-screen bg-background-dark">
            <main className="max-w-4xl mx-auto px-6 pt-20 md:pt-28 pb-12">
                {/* Header — hidden on registration success */}
                {!isRegistered && (
                    <div className="mb-12 space-y-4">
                        <h1 className="text-5xl md:text-6xl font-black tracking-tight leading-none uppercase">
                            Join the{" "}
                            <br />
                            <span className="gradient-title italic">
                                Flame.{" "}
                            </span>
                        </h1>
                        <p className="text-white/50 text-lg max-w-2xl font-light">
                            Secure your spot for Phoenix 3.0. Fill out the form below and choose the events you want to participate in.
                        </p>
                    </div>
                )}

                {/* Registration Form */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-8 mb-8 text-center mt-12">
                    <h2 className="text-2xl font-bold mb-4 text-white">Event Concluded</h2>
                    <p className="text-white/60 mb-6">Phoenix 3.0 has successfully concluded. Thank you to everyone who participated!</p>
                </div>
            </main>
        </div>
    );
}
