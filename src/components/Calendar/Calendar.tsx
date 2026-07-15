import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import type { CalendarEvent } from "../../types/calendar";
import ptBrLocale from "@fullcalendar/core/locales/pt-br";
import dayjs from "dayjs";
import { AppBar, Toolbar, Typography, Box } from "@mui/material";

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
    <Box sx={{ maxWidth: '1200px', margin: '0 auto' }}>
      <AppBar position="static" sx={{ mb: 2 }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Family Dashboard
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.8 }}>
            Próxima Semana
          </Typography>
        </Toolbar>
      </AppBar>
      <Box sx={{ p: 2 }}>
        <FullCalendar
          locale={ptBrLocale}
          firstDay={1}
          height="auto"
          headerToolbar={{
            left: 'title',
            center: '',
            right: 'prev,next'
          }}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="timeGridWeek"
          events={filteredEvents.map((event) => ({
            id: event.id,
            title: event.summary,
            start: event.start.dateTime ?? event.start.date,
            end: event.end.dateTime ?? event.end.date,
            backgroundColor: event.calendarColor || '#3b82f6',
            borderColor: event.calendarColor || '#3b82f6',
            textColor: '#ffffff',
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
    </Box>
  );
}   