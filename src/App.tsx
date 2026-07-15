import { Button, Box, CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";

import { useGoogleCalendar } from "./hooks/useGoogleCalendar";
import { Calendar } from "./components/Calendar/Calendar";

const API_URL = 'http://localhost:3001';

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
        console.error('Erro ao verificar auth:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Verifica se veio do callback do OAuth
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('auth') === 'success') {
      // Remove o parâmetro da URL
      window.history.replaceState({}, document.title, window.location.pathname);
      // Obtém o token
      const getToken = async () => {
        try {
          const response = await axios.get(`${API_URL}/auth/token`);
          setAccessToken(response.data.access_token);
        } catch (error) {
          console.error('Erro ao obter token:', error);
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
      console.error('Erro ao iniciar login:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post(`${API_URL}/auth/logout`);
      setAccessToken(null);
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  // Refresh do token periodicamente
  useEffect(() => {
    if (!accessToken) return;

    const interval = setInterval(async () => {
      try {
        const response = await axios.get(`${API_URL}/auth/token`);
        setAccessToken(response.data.access_token);
      } catch (error) {
        console.error('Erro ao refresh token:', error);
        setAccessToken(null);
      }
    }, 55 * 60 * 1000); // 55 minutos

    return () => clearInterval(interval);
  }, [accessToken]);

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          height: '100vh',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        <CircularProgress />
        <p>Verificando sessão do Google...</p>
      </Box>
    );
  }

  if (!accessToken) {
    return (
      <Box
        sx={{
          display: 'flex',
          height: '100vh',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        <h2>Family Dashboard</h2>

        <Button
          variant="contained"
          size="large"
          onClick={handleLogin}
        >
          Conectar Google Calendar
        </Button>
      </Box>
    );
  }

  return (
    <>
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-end' }}>
        <Button variant="outlined" onClick={handleLogout}>
          Sair
        </Button>
      </Box>

      {error && <p>{error}</p>}

      <Calendar events={events} />
    </>
  );
}

export default App;