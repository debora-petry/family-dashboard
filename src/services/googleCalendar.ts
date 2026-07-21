import axios from "axios";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";

interface Calendar {
  id: string;
  summary: string;
  backgroundColor: string;
}

interface GoogleCalendarEvent {
  id: string;
  summary: string;
  start: { dateTime?: string; date?: string };
  end: { dateTime?: string; date?: string };
}

export async function getUpcomingEvents(accessToken: string) {
  // Busca todos os calendários
  const calendarsResponse = await axios.get(
    "https://www.googleapis.com/calendar/v3/users/me/calendarList",
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  const calendars = calendarsResponse.data.items as Calendar[];

  // Busca eventos de todos os calendários
  const eventResponses = await Promise.all(
    calendars.map((calendar) =>
      axios.get(
        `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(
          calendar.id,
        )}/events`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          params: {
            maxResults: 100,
            singleEvents: true,
            orderBy: "startTime",
            timeMin: dayjs().subtract(30, "day").toISOString(),
            timeMax: dayjs().add(20, "day").toISOString(),
          },
        },
      ),
    ),
  );

  // Junta todos os eventos
  const events = eventResponses.flatMap((response, index) =>
    response.data.items.map((event: GoogleCalendarEvent) => ({
      ...event,
      calendarName: calendars[index].summary,
      calendarColor: calendars[index].backgroundColor,
    })),
  );

  // Ordena por data
  events.sort((a, b) => {
    const dateA = new Date(a.start.dateTime ?? a.start.date).getTime();
    const dateB = new Date(b.start.dateTime ?? b.start.date).getTime();

    return dateA - dateB;
  });

  return events;
}
