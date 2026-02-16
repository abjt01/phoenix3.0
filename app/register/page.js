import RegistrationForm from "@/components/RegistrationForm";

export const metadata = {
    title: "Phoenix 3.0 | Register",
    description: "Register for Phoenix 3.0 — DSCE's Annual Celebration of Knowledge, Creativity, and Innovation. March 5–6.",
};

export default function RegisterPage() {
    return (
        <div className="min-h-screen bg-background-dark">
            <main className="max-w-4xl mx-auto px-6 py-16">
                {/* Header */}
                <div className="text-center mb-16">
                    <span className="inline-block px-4 py-1 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-bold tracking-widest uppercase mb-6">
                        Registration Open
                    </span>
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-6">
                        Join the <span className="text-primary italic">Flame</span>
                    </h1>
                    <p className="text-white/60 text-lg max-w-xl mx-auto leading-relaxed">
                        Secure your spot for Phoenix 3.0. Fill out the form below and choose the events you want to participate in.
                    </p>
                </div>

                {/* Registration Form */}
                <RegistrationForm />
            </main>
        </div>
    );
}
