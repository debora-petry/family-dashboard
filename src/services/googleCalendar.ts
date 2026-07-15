import axios from "axios";

export async function getUpcomingEvents(accessToken: string) {
  // Busca todos os calendários
  const calendarsResponse = await axios.get(
    "https://www.googleapis.com/calendar/v3/users/me/calendarList",
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  const calendars = calendarsResponse.data.items;

  // Busca eventos de todos os calendários
  const eventResponses = await Promise.all(
    calendars.map((calendar: any) =>
      axios.get(
        `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(
          calendar.id
        )}/events`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          params: {
            maxResults: 20,
            singleEvents: true,
            orderBy: "startTime",
            timeMin: new Date().toISOString(),
          },
        }
      )
    )
  );

  // Junta todos os eventos
  const events = eventResponses.flatMap((response, index) =>
    response.data.items.map((event: any) => ({
      ...event,
      calendarName: calendars[index].summary,
      calendarColor: calendars[index].backgroundColor,
    }))
  );

  // Ordena por data
  events.sort((a, b) => {
    const dateA = new Date(a.start.dateTime ?? a.start.date).getTime();
    const dateB = new Date(b.start.dateTime ?? b.start.date).getTime();

    return dateA - dateB;
  });

  return events;
}