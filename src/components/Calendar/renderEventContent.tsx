//import type { EventContentArg } from "@fullcalendar/core";
import { calendarEventIcons } from "../../constants/calendarEventIcons";

export function renderEventContent(eventInfo: any) {
  const icon =
    calendarEventIcons[
      eventInfo.event.extendedProps.icon as keyof typeof calendarEventIcons
    ];

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 4,
      }}
    >
      {icon}
      <span>{eventInfo.event.title}</span>
    </div>
  );
}
