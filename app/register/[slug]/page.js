import RegistrationForm from "@/components/RegistrationForm";
import { getEventBySlug } from "@/data/events";

export async function generateMetadata({ params }) {
    const { slug } = await params;
    const event = getEventBySlug(slug);
    if (!event) return { title: "Event Not Found" };

    return {
        title: `Register for ${event.title} | Phoenix 3.0`,
        description: `Register for ${event.title} at Phoenix 3.0.`,
    };
}

export default async function EventRegistrationPage({ params }) {
    const { slug } = await params;
    const event = getEventBySlug(slug);

    if (!event) {
        return (
            <div className="min-h-screen bg-background-dark flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-4xl font-bold mb-4">Event Not Found</h1>
                    <p className="text-white/60">The event you are looking for does not exist.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background-dark">
            <main className="max-w-4xl mx-auto px-6 pt-20 md:pt-28 pb-12">
                {/* Header */}
                <div className="text-center mb-16">
                    
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-6">
                        Register for <span className="text-primary italic">{event.title}</span>
                    </h1>
                    <p className="text-white/60 text-lg max-w-xl mx-auto leading-relaxed">
                        Secure your spot for {event.title}. Fill out the form below to participate.
                    </p>
                </div>

                {/* Registration Form */}
                <RegistrationForm selectedEventSlug={slug} />
            </main>
        </div>
    );
}
