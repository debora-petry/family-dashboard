import axios from "axios";

export async function getUpcomingEvents(accessToken: string) {
  const response = await axios.get(
    "https://www.googleapis.com/calendar/v3/calendars/primary/events",
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      params: {
        maxResults: 10,
        singleEvents: true,
        orderBy: "startTime",
        timeMin: new Date().toISOString(),
      },
    }
  );

  return response.data.items;
}