import { useEffect, useState } from "react";
import { getUpcomingEvents } from "../services/googleCalendar";

export interface CalendarEvent {
  id: string;
  summary: string;
  start: {
    dateTime?: string;
    date?: string;
  };
  end: {
    dateTime?: string;
    date?: string;
  };
}

export function useGoogleCalendar(accessToken: string | null = null) {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!accessToken) return;

    async function loadEvents() {
      try {
        setLoading(true);
        setError(null);

        const data = await getUpcomingEvents(accessToken);
        setEvents(data);
      } catch (err) {
        console.error(err);
        setError("Erro ao carregar eventos.");
      } finally {
        setLoading(false);
      }
    }

    loadEvents();
  }, [accessToken]);

  return {
    events,
    loading,
    error,
  };
}