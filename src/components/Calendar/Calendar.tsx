import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import type { CalendarEvent } from "../../types/calendar";
import ptBrLocale from "@fullcalendar/core/locales/pt-br";
import dayjs from "dayjs";
import { Box } from "@mui/material";
import { colors } from "../../theme/colors";
//import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import "dayjs/locale/pt-br";
import listPlugin from "@fullcalendar/list";
import { renderEventContent } from "./renderEventContent";

dayjs.locale("pt-br");

interface CalendarProps {
  events: CalendarEvent[];
}

export function Calendar({ events }: CalendarProps) {
  // Filtrar eventos para próxima semana
  const now = dayjs();
  const next20Days = now.add(20, "day");
  //const nextWeek = now.add(7, "day");
  const filteredEvents = events.filter((event) => {
    const start = dayjs(event.start.dateTime ?? event.start.date);
    const end = dayjs(
      event.end?.dateTime ??
        event.end?.date ??
        event.start.dateTime ??
        event.start.date,
    );

    return (
      // Já começou até os próximos 20 dias
      start.isBefore(next20Days.add(1, "day")) &&
      // Ainda não terminou
      end.isAfter(now.subtract(1, "day"))
    );
  });

  /* const eventDate = dayjs(event.start.dateTime ?? event.start.date);
    return (
      eventDate.isAfter(now.subtract(1, "day")) &&
      eventDate.isBefore(next20Days.add(1, "day"))
    );
  }); */

  function getEventIcon(summary: string) {
    const normalizedText = summary
      .normalize("NFD")
      .replace(/\p{Diacritic}/gu, "")
      .toLowerCase();

    if (
      normalizedText.includes("beach") ||
      normalizedText.includes("bt") ||
      normalizedText.includes("play")
    )
      return "bt";

    if (normalizedText.includes("academia") || normalizedText.includes("acad"))
      return "gym";

    if (normalizedText.includes("shopping") || normalizedText.includes("super"))
      return "compras";

    if (normalizedText.includes("feira")) return "feira";

    if (normalizedText.includes("ginastica")) return "gymJulia";

    if (
      normalizedText.includes("consulta") ||
      normalizedText.includes("exame") ||
      normalizedText.includes("hcpa") ||
      normalizedText.includes("plantao") ||
      normalizedText.includes("tele")
    )
      return "doctor";

    if (normalizedText.includes("aniver") || normalizedText.includes("niver"))
      return "birthday";

    if (normalizedText.includes("viagem")) return "trip";

    if (normalizedText.includes("festa")) return "party";

    if (
      normalizedText.includes("obra") ||
      normalizedText.includes("engenheira") ||
      normalizedText.includes("reforma")
    )
      return "obra";

    if (normalizedText.includes("psico") || normalizedText.includes("mentoria"))
      return "psico";

    if (normalizedText.includes("ferias")) return "ferias";

    if (normalizedText.includes("dentista")) return "dentista";

    if (
      normalizedText.includes("massagem") ||
      normalizedText.includes("drenagem")
    )
      return "spa";
    if (normalizedText.includes("escola")) return "escola";

    if (
      normalizedText.includes("copa") ||
      normalizedText.includes("jogo") ||
      normalizedText.includes("gremio") ||
      normalizedText.includes("inter")
    )
      return "bola";

    if (normalizedText.includes("janta") || normalizedText.includes("almoço"))
      return "comida";

    if (
      normalizedText.includes("gat") ||
      normalizedText.includes("vet") ||
      normalizedText.includes("lola") ||
      normalizedText.includes("bisnaguinha")
    )
      return "pet";

    return undefined;
  }

  return (
    <Box
      sx={{
        p: 2,
        //pr: 2,
        //pt: 0,
        //pb: 2,
        //pl: 2,

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
          border: "none",
        },

        "& .fc-col-header-cell-cushion": {
          //cabeçalho de cada coluna do calendário
          fontSize: "15px",
          fontWeight: 400,
          color: colors.textDim,
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
          marginRight: "auto",
          marginLeft: 0,
          color: colors.textDim,
        },
      }}
    >
      {/*  <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          mb: 3,
        }}
      >
        <CalendarMonthRoundedIcon //Ícone, mês e ano
          sx={{
            color: colors.textDim,
            fontSize: 30,
          }}
        />

        {
          <Typography
            variant="h5"
            sx={{
              color: colors.textDim,
              fontWeight: 400,
              fontFamily: "Roboto, sans-serif",
            }}
          >
            {dayjs().format("MMMM [de] YYYY").charAt(0).toUpperCase() +
              dayjs().format("MMMM [de] YYYY").slice(1)}
          </Typography>
        }
      </Box> */}

      <FullCalendar
        locale={ptBrLocale}
        firstDay={1} // Segunda-feira como primeiro dia da semana
        height="auto"
        /*  headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay",
        }} */
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
        //initialView="listMonth" // Renderiza como lista dos eventos do mês todo
        initialView="dayGridTwoWeeks" // Renderiza 2 semanas
        views={{
          dayGridTwoWeeks: {
            type: "dayGrid",
            duration: { weeks: 2 },
          },
        }}
        initialDate={dayjs().format("YYYY-MM-DD")}
        eventContent={renderEventContent}
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
        slotMinTime="06:00:00"
        slotMaxTime="23:00:00"
        displayEventTime={false}
        allDaySlot={true}
        eventDidMount={(info) => {
          info.el.style.borderRadius = "8px";
          info.el.style.padding = "4px 8px";
          info.el.style.fontSize = "14px";
          info.el.style.fontWeight = "500";
          info.el.style.boxShadow = "0 2px 4px rgba(0,0,0,0.1)";
        }}
        dayHeaderFormat={
          //cabeçalho de cada coluna do calendário.
          {
            //day: 'numeric',
            weekday: "narrow", //
          }
        }
        slotLabelContent={() => null} // Remove os labels de hora
        /* titleFormat={(date) => {
          //console.log("date:" + date.date.marker.toISOString());

          const text = date.date.marker.toLocaleDateString("pt-BR", {
            month: "long",
            year: "numeric",
            timeZone: "UTC",
          });

          const formatted = text.charAt(0).toUpperCase() + text.slice(1);
          //console.log(dayjs().format("YYYY-MM-DD"));
          return formatted; */
        //}}
      />
    </Box>
  );
}
