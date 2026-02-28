import EventCard from "./EventCard";

export default function EventGrid({ events }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event, index) => (
                <EventCard key={event.slug} {...event} index={index} />
            ))}
        </div>
    );
}
