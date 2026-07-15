import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import type { CalendarEvent } from "../../types/calendar";
import ptBrLocale from "@fullcalendar/core/locales/pt-br";
import dayjs from "dayjs";
import { Box } from "@mui/material";
import { colors } from "../../theme/colors";

interface CalendarProps {
  events: CalendarEvent[];
}

export function Calendar({ events }: CalendarProps) {
  // Filtrar eventos para próxima semana
  const now = dayjs();
  const nextWeek = now.add(7, 'day');
  const filteredEvents = events.filter((event) => {
    const eventDate = dayjs(event.start.dateTime ?? event.start.date);
    return eventDate.isAfter(now.subtract(1, 'day')) && eventDate.isBefore(nextWeek.add(1, 'day'));
  });

  return (
    <Box sx={{ p: 2, backgroundColor: colors.surface, borderRadius: 2 }}>
      <FullCalendar
        locale={ptBrLocale}
        firstDay={1}
        height="auto"
        headerToolbar={{
          left: 'title',
          center: '',
          right: ''
        }}
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        events={filteredEvents.map((event) => ({
          id: event.id,
          title: event.summary,
          start: event.start.dateTime ?? event.start.date,
          end: event.end.dateTime ?? event.end.date,
          backgroundColor: event.calendarColor || colors.accent,
          borderColor: event.calendarColor || colors.accent,
          textColor: colors.surface,
        }))}
        slotMinTime="06:00:00"
        slotMaxTime="23:00:00"
        allDaySlot={false}
        eventDidMount={(info) => {
          info.el.style.borderRadius = '8px';
          info.el.style.padding = '4px 8px';
          info.el.style.fontSize = '14px';
          info.el.style.fontWeight = '500';
          info.el.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
        }}
        dayHeaderFormat={{ weekday: 'short', day: 'numeric' }}
        slotLabelFormat={{
          hour: 'numeric',
          minute: '2-digit',
          hour12: false
        }}
      />
    </Box>
  );
}   