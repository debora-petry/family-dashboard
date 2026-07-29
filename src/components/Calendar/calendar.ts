// The CalendarEvent interface represents a calendar event
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

  calendarName?: string;
  calendarColor?: string;
}
