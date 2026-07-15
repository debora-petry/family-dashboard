import { useEffect, useState } from "react";
import { Box, Typography, Card, CardContent } from "@mui/material";
import axios from "axios";
import dayjs from "dayjs";
import { colors } from "../../theme/colors";

interface WeatherData {
  current: {
    temp: number;
    condition: string;
    icon: string;
  };
  forecast: Array<{
    date: string;
    temp: number;
    condition: string;
    icon: string;
  }>;
}

export function WeatherWidget() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        // Usando wttr.in (gratuito, sem necessidade de API key)
        const response = await axios.get('https://wttr.in/Porto%20Alegre?format=j1');
        
        const current = response.data.current_condition[0];
        const forecast = response.data.weather.slice(0, 4); // Hoje + 3 dias

        setWeather({
          current: {
            temp: parseInt(current.temp_C),
            condition: current.weatherDesc[0].value,
            icon: getWeatherIcon(current.weatherCode),
          },
          forecast: forecast.map((day: any) => ({
            date: day.date,
            temp: parseInt(day.avgtempC),
            condition: day.hourly[0].weatherDesc[0].value,
            icon: getWeatherIcon(day.hourly[0].weatherCode),
          })),
        });
      } catch (error) {
        console.error('Erro ao buscar previsão:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, []);

  const getWeatherIcon = (code: number): string => {
    // Mapeamento simplificado de códigos do wttr.in para emojis
    if (code >= 0 && code <= 3) return '☀️'; // Sol
    if (code >= 4 && code <= 11) return '⛅'; // Parcialmente nublado
    if (code >= 12 && code <= 18) return '🌧️'; // Chuva
    if (code >= 19 && code <= 29) return '⛈️'; // Tempestade
    if (code >= 30 && code <= 39) return '❄️'; // Neve
    if (code >= 40 && code <= 48) return '🌫️'; // Neblina
    return '🌡️'; // Padrão
  };

  if (loading) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography sx={{ color: colors.textDim }}>Carregando previsão...</Typography>
      </Box>
    );
  }

  if (!weather) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography sx={{ color: colors.textDim }}>Erro ao carregar previsão</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h6" sx={{ mb: 2, color: colors.text }}>
        Previsão do Tempo
      </Typography>
      
      {/* Previsão de hoje - maior */}
      <Card sx={{ mb: 2, background: `linear-gradient(135deg, ${colors.accent} 0%, ${colors.accentDim} 100%)` }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box>
              <Typography variant="h4" sx={{ color: colors.surface, fontWeight: 'bold' }}>
                {weather.current.temp}°C
              </Typography>
              <Typography variant="body1" sx={{ color: colors.surface, opacity: 0.9 }}>
                {weather.current.condition}
              </Typography>
              <Typography variant="body2" sx={{ color: colors.surface, opacity: 0.8, mt: 1 }}>
                {dayjs().format('dddd, DD/MM')}
              </Typography>
            </Box>
            <Typography variant="h3" sx={{ fontSize: '4rem' }}>
              {weather.current.icon}
            </Typography>
          </Box>
        </CardContent>
      </Card>

      {/* Próximos 3 dias - menor */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        {weather.forecast.slice(1).map((day, index) => (
          <Card key={index} sx={{ background: colors.surfaceHi }}>
            <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="h4" sx={{ fontSize: '1.5rem' }}>
                    {day.icon}
                  </Typography>
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 'medium', color: colors.text }}>
                      {dayjs(day.date).format('ddd')}
                    </Typography>
                    <Typography variant="caption" sx={{ color: colors.textDim }}>
                      {dayjs(day.date).format('DD/MM')}
                    </Typography>
                  </Box>
                </Box>
                <Typography variant="body1" sx={{ fontWeight: 'bold', color: colors.text }}>
                  {day.temp}°C
                </Typography>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
}
