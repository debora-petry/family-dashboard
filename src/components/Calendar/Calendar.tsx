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
    <Box sx={{ p: 2, backgroundColor: colors.surface, borderRadius: 2, fontFamily: "Roboto, sans-serif", "& .fc-toolbar-title": {
      fontSize: "1.5rem",//24px
      fontWeight: 400,
      fontFamily: "Roboto, sans-serif",
      lineHeight: 1.3,
      letterSpacing: 0,
      color: colors.textDim,
    }, 
    "& .fc-col-header-cell": {
  backgroundColor: colors.surface,
},

"& .fc-col-header-cell-cushion": { //cabeçalho de cada coluna do calendário
  fontSize: "15px",
  fontWeight: 400,
  color: colors.text,
  textDecoration: "none",
  padding: "10px 0",
}}}>
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
        initialView="dayGridMonth"
        events={filteredEvents.map((event) => ({
          id: event.id,
          title: event.start.dateTime
            ? `${new Date(event.start.dateTime).toLocaleTimeString("pt-BR", {
                hour: "2-digit",
                minute: "2-digit",
              })} • ${event.summary}`
            : event.summary,     
          start: event.start.dateTime ?? event.start.date,
          end: event.end.dateTime ?? event.end.date,
          display: "block",
          backgroundColor: colors.surfaceHi,
          borderColor: event.calendarColor || colors.accent,
          textColor: colors.textDim,
          
        }))}
        slotMinTime="06:00:00"
        slotMaxTime="23:00:00"
        displayEventTime={false}
        allDaySlot={true}
        eventDidMount={(info) => {
          info.el.style.borderRadius = '8px';
          info.el.style.padding = '4px 8px';
          info.el.style.fontSize = '14px';
          info.el.style.fontWeight = '500';
          info.el.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
        }}
        dayHeaderFormat={ //cabeçalho de cada coluna do calendário.
          {            
            //day: 'numeric',
            weekday: 'short'
           }}
        
        slotLabelContent={() => null} // Remove os labels de hora
        titleFormat={(date) => {
            const text = date.date.marker.toLocaleDateString("pt-BR", {
              month: "long",
              year: "numeric",
            });

    const formatted =
      text.charAt(0).toUpperCase() + text.slice(1);

    return `📅 ${formatted}`;
  }}
      />
    </Box>
  );
}   