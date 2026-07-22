import { calendarEventIcons } from "../../constants/calendarEventIcons";

export function renderEventContent(eventInfo: any) {
  const icon =
    calendarEventIcons[
      eventInfo.event.extendedProps.icon as keyof typeof calendarEventIcons
    ];

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 4,
        minWidth: 0, // 👈 importante
      }}
    >
      {icon} {/* Ícone do evento, caso exista*/}
      <span
        style={{
          // Estilo do texto do nome do evento
          flex: 1, // ocupa o espaço disponível
          minWidth: 0, // permite encolher
          overflow: "hidden", //esconde o texto que ultrapassar o limite
          textOverflow: "ellipsis", //coloca ... no final do texto caso ele seja muito grande
          whiteSpace: "nowrap",
        }}
      >
        {eventInfo.event.title}
      </span>{" "}
    </div>
  );
}
