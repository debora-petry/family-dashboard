import { useState } from "react";
import { Button } from "@mui/material";
import { useGoogleLogin } from "@react-oauth/google";

import { useGoogleCalendar } from "./hooks/useGoogleCalendar";

function App() {
  const [accessToken, setAccessToken] = useState<string | null>(null);

  const { events, loading, error } = useGoogleCalendar(accessToken);

  const login = useGoogleLogin({
    scope: "https://www.googleapis.com/auth/calendar.readonly",

    onSuccess: (tokenResponse) => {
      setAccessToken(tokenResponse.access_token);
    },

    onError: () => {
      console.log("Erro no login");
    },
  });

  return (
    <>
      {!accessToken && (
        <Button variant="contained" onClick={() => login()}>
          Conectar Google Calendar
        </Button>
      )}

      {loading && <p>Carregando...</p>}

      {error && <p>{error}</p>}

      {events.map((event: any) => (
  <div
    key={event.id}
    style={{
      border: "1px solid #ddd",
      borderRadius: "8px",
      padding: "12px",
      marginBottom: "8px",
    }}
  >
    <h3>{event.summary}</h3>

    <p>
      {event.start.dateTime
        ? new Date(event.start.dateTime).toLocaleString("pt-BR")
        : event.start.date}
    </p>
  </div>
))}
    </>
  );
}

export default App;