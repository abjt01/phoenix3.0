import { events } from "@/data/events";
import { getParticipantCount } from "@/lib/googleSheets";
import ScheduleClient from "./ScheduleClient";

export const revalidate = 60; // fetch counts every 60s

export const metadata = {
    title: "Phoenix 3.0 | Event Schedule",
    description: "View the official schedule for Phoenix 3.0 events.",
};

export default async function SchedulePage() {
    const eventsWithCounts = await Promise.all(
        events.map(async (event) => {
            const count = await getParticipantCount(event.sheetId);
            return {
                ...event,
                participants: count > 0 ? count.toString() : "0",
            };
        })
    );

    return <ScheduleClient events={eventsWithCounts} />;
}
