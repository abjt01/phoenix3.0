import RegistrationForm from "@/components/RegistrationForm";

export const metadata = {
    title: "Phoenix 3.0 | Register",
    description: "Register for Phoenix 3.0 — DSCE's Annual Celebration of Knowledge, Creativity, and Innovation. March 5–6.",
};

export default function RegisterPage() {
    return (
        <div className="min-h-screen bg-background-dark">
            <main className="max-w-4xl mx-auto px-6 pt-20 md:pt-28 pb-12">
                {/* Header */}
                <div className="mb-12 space-y-4">
                    <h1 className="text-5xl md:text-6xl font-black tracking-tight leading-none uppercase">
                        Join the{" "}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-400 italic">
                            Flame
                        </span>
                    </h1>
                    <p className="text-white/50 text-lg max-w-2xl font-light">
                        Secure your spot for Phoenix 3.0. Fill out the form below and choose the events you want to participate in.
                    </p>
                </div>

                {/* Registration Form */}
                <RegistrationForm />
            </main>
        </div>
    );
}
