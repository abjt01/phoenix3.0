import { events } from "@/data/events";
import ScheduleClient from "./ScheduleClient";

export const metadata = {
    title: "Phoenix 3.0 | Event Schedule",
    description: "View the official schedule for Phoenix 3.0 events.",
};

export default function SchedulePage() {
    return <ScheduleClient events={events} />;
}
