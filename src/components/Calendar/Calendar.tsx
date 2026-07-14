import type { CalendarEvent } from "../../types/calendar";

interface CalendarProps {
  events: CalendarEvent[];
}

export function Calendar({ events }: CalendarProps) {
  return (
    <div className="calendar">
      <h2>Calendário</h2>
      {events.length === 0 ? (
        <p>Nenhum evento encontrado.</p>
      ) : (
        <ul>
          {events.map((event) => (
            <li key={event.id}>
              <strong>{event.summary}</strong>
              <br />
              {event.start.dateTime
                ? new Date(event.start.dateTime).toLocaleString()
                : event.start.date}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
