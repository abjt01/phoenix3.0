'use client';

import { useState } from 'react';
import RegistrationForm from "@/components/RegistrationForm";

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
                <RegistrationForm onSuccess={() => setIsRegistered(true)} />
            </main>
        </div>
    );
}
