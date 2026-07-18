import { Box, CircularProgress, Typography, Button } from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";

import { useGoogleCalendar } from "./hooks/useGoogleCalendar";
import { Calendar } from "./components/Calendar/Calendar";
import { WeatherWidget } from "./components/WeatherWidget/WeatherWidget";
//import { InfoWidget } from "./components/InfoWidget/InfoWidget";
import { Header } from "./components/Header/Header";
import { colors } from "./theme/colors";
// import { PicWidget } from "./components/PicWidget/PicWidget";
import { Alerts } from "./components/Alerts/Alerts";

const API_URL =
  import.meta.env.VITE_API_URL || "https://family-dashboard-api.onrender.com";

console.log("MODE:", import.meta.env.MODE);
console.log("ENV:", import.meta.env);
console.log("App: API_URL =", API_URL);

function App() {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { events, error } = useGoogleCalendar(accessToken);

  // Verifica status da autenticação ao carregar
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get(`${API_URL}/auth/status`);
        if (response.data.authenticated) {
          // Já está autenticado, obtém token
          const tokenResponse = await axios.get(`${API_URL}/auth/token`);
          setAccessToken(tokenResponse.data.access_token);
        }
      } catch (error) {
        console.error("Erro ao verificar auth:", error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Verifica se veio do callback do OAuth
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("auth") === "success") {
      // Remove o parâmetro da URL
      window.history.replaceState({}, document.title, window.location.pathname);
      // Obtém o token
      const getToken = async () => {
        try {
          const response = await axios.get(`${API_URL}/auth/token`);
          setAccessToken(response.data.access_token);
        } catch (error) {
          console.error("Erro ao obter token:", error);
        }
      };
      getToken();
    }
  }, []);

  const handleLogin = async () => {
    try {
      const response = await axios.get(`${API_URL}/auth/google`);
      if (response.data.authUrl) {
        window.location.href = response.data.authUrl;
      }
    } catch (error) {
      console.error("Erro ao iniciar login:", error);
    }
  };

  // Refresh do token periodicamente
  useEffect(() => {
    if (!accessToken) return;

    const interval = setInterval(
      async () => {
        try {
          const response = await axios.get(`${API_URL}/auth/token`);
          setAccessToken(response.data.access_token);
        } catch (error) {
          console.error("Erro ao refresh token:", error);
          setAccessToken(null);
        }
      },
      55 * 60 * 1000,
    ); // 55 minutos

    return () => clearInterval(interval);
  }, [accessToken]);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          height: "100vh",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          gap: 2,
          backgroundColor: colors.bg,
        }}
      >
        <CircularProgress sx={{ color: colors.accent }} />
        <Typography sx={{ color: colors.textDim }}>
          Verificando sessão do Google...
        </Typography>
      </Box>
    );
  }

  if (!accessToken) {
    return (
      <Box
        sx={{
          display: "flex",
          height: "100vh",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          gap: 2,
          backgroundColor: colors.bg,
        }}
      >
        <Typography variant="h4" sx={{ color: colors.text, mb: 2 }}>
          Debora's Family Dashboard
        </Typography>

        <Button
          variant="contained"
          size="large"
          onClick={handleLogin}
          sx={{
            backgroundColor: colors.accent,
            "&:hover": { backgroundColor: colors.accentDim },
          }}
        >
          Conectar Google Calendar
        </Button>
      </Box>
    );
  }

  return (
    <>
      <Header />

      {error && (
        <Typography sx={{ color: colors.red, p: 2 }}>{error}</Typography>
      )}

      <Box
        sx={{
          display: "flex",
          height: "calc(100vh - 64px)",
          backgroundColor: colors.bg,
        }}
      >
        <Box
          sx={{
            width: "20%",
            p: 2,
            borderRight: `1px solid ${colors.border}`,
            overflow: "auto",
            backgroundColor: colors.surface,
          }}
        >
          {/* Widget lateral */}
          <Alerts />
          <WeatherWidget />
          {/* <PicWidget /> */}
        </Box>

        <Box sx={{ flex: 1, overflow: "auto", backgroundColor: colors.bg }}>
          <Calendar events={events} />
        </Box>
      </Box>
    </>
  );
}

export default App;
