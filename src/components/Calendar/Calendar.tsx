import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import type { CalendarEvent } from "../../types/calendar";
import ptBrLocale from "@fullcalendar/core/locales/pt-br";
import dayjs from "dayjs";
import { Box } from "@mui/material";
import { colors } from "../../theme/colors";
//import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import "dayjs/locale/pt-br";
import { renderEventContent } from "./renderEventContent";
import { getEventIcon } from "./getEventIcon";

dayjs.locale("pt-br");

interface CalendarProps {
  events: CalendarEvent[];
}

export function Calendar({ events }: CalendarProps) {
  const filteredEvents = events.filter((event) => {
    const start = dayjs(event.start.dateTime ?? event.start.date);
    const end = dayjs(
      event.end?.dateTime ??
        event.end?.date ??
        event.start.dateTime ??
        event.start.date,
    );
    console.log({
      title: event.summary,
      start: start.format(),
      end: end.format(),
    });
    const thirtyDaysAgo = dayjs().subtract(30, "day");
    const twentyDaysAhead = dayjs().add(20, "day");
    return end.isAfter(thirtyDaysAgo) && start.isBefore(twentyDaysAhead);
  });

  return (
    <Box
      sx={{
        p: 2,
        backgroundColor: colors.bg,
        borderRadius: 2,
        mt: 0,
        mr: 2,
        fontFamily: "Roboto, sans-serif",
        "& .fc-header-toolbar": {
          display: "none", //Esconde o header do FullCalendar (botão hoje, setas, e tipo de visualização)
        },
        "& .fc-col-header-cell": {
          backgroundColor: colors.bg,
          //border: "none",
          borderColor: "rgba(0,0,0,0.05)",
          borderTop: "none",
          borderBottom: "none",
          borderLeft: "none",
          borderRight: "none",
        },

        "& .fc-col-header-cell-cushion": {
          //cabeçalho de cada coluna do calendário
          fontSize: "15px",
          fontWeight: 400,
          color: colors.textFaint,
          textDecoration: "none",
          padding: "10px 0",
        },
        "& .fc-scrollgrid": {
          border: "none",
        },
        "& .fc-scrollgrid-section-header > *": {
          border: "none",
        },
        "& .fc-daygrid-day-top": {
          justifyContent: "flex-start !important",
        },
        "& .fc-daygrid-day-number": {
          display: "block",
          width: "100%",
          color: colors.textDim,
          textDecoration: "none",
        },
        "& .fc-daygrid-day": {
          borderColor: "rgba(0,0,0,0.05)",
        },
        "& .fc-daygrid-event-harness": {
          marginBottom: "0px",
        },
        "& .fc-event": {
          borderRadius: "10px",
          //padding: "2px 8px",
          fontSize: "14px",
          fontWeight: 500,
          //lineHeight: "16px",
        },
        "& .fc-daygrid-event": {
          marginBottom: "2px",
        },
        "& .fc-event-main": {
          //padding: "2px 8px",
        },
        "& .fc-daygrid-day-events": {
          //Age no container de todos os eventos daquele dia.
          //paddingLeft: "4px",
          //paddingRight: "4px",
          //overflow: "hidden",
        },
        /*  "& .fc-event-title": {
          overflow: "hidden", //Se não couber, esconde o excesso (hidden).
          whiteSpace: "nowrap", //Não quebra a linha (nowrap).
          textOverflow: "ellipsis", //Em vez de cortar abruptamente, coloca ... (ellipsis).
          display: "block",
        }, */
      }}
    >
      <FullCalendar
        locale={ptBrLocale}
        firstDay={1} // Segunda-feira como primeiro dia da semana
        height="auto" // Altura dos dias
        //contentHeight="auto"
        eventDisplay="block"
        //height={700}
        plugins={[dayGridPlugin]}
        initialView="dayGridTwoWeeks" // Renderiza 2 semanas
        views={{
          dayGridTwoWeeks: {
            type: "dayGrid",
            duration: { weeks: 2 },
          },
        }}
        initialDate={dayjs().format("YYYY-MM-DD")}
        eventContent={renderEventContent}
        //eventContent={(arg) => <>{arg.event.title}</>}
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
          borderColor: "transparent",
          textColor: colors.textDim,
          extendedProps: {
            icon: getEventIcon(event.summary),
          },
        }))}
        displayEventTime={false}
        eventDidMount={(info) => {
          const now = dayjs();
          const end = dayjs(info.event.end ?? info.event.start);

          // Estiliza cada evento
          //info.el.style.borderRadius = "10px";
          info.el.style.padding = "2px 8px";
          info.el.style.fontSize = "14px";
          info.el.style.fontWeight = "500";
          if (end.isBefore(now)) {
            info.el.style.opacity = "0.45";
          }
        }}
        dayHeaderFormat={
          //cabeçalho de cada coluna do calendário.
          {
            weekday: "narrow", //
          }
        }
        dayCellContent={(arg) => {
          const isToday = dayjs(arg.date).isSame(dayjs(), "day");

          return (
            <Box
              sx={{
                width: 28,
                height: 28,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: isToday ? colors.accent : "transparent",
                color: isToday ? "#fff" : colors.textDim,
                fontWeight: isToday ? 700 : 500,
              }}
            >
              <span>{arg.date.getDate()}</span>
            </Box>
          );
        }}
        //slotLabelContent={() => null} // Remove os labels de hora
      />
    </Box>
  );
}
