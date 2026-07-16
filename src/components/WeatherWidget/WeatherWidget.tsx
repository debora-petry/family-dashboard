import { useEffect, useState } from "react";
import { Box, Typography, Card, CardContent } from "@mui/material";
import axios from "axios";
import dayjs from "dayjs";
import { colors } from "../../theme/colors";
/* import WbSunnyRoundedIcon from "@mui/icons-material/WbSunnyRounded";
import CloudRoundedIcon from "@mui/icons-material/CloudRounded";
import CloudQueueRoundedIcon from "@mui/icons-material/CloudQueueRounded";
import GrainRoundedIcon from "@mui/icons-material/GrainRounded";
import ThunderstormRoundedIcon from "@mui/icons-material/ThunderstormRounded";
import SevereColdRoundedIcon from "@mui/icons-material/SevereColdRounded"; */
import ClearDay from "@meteocons/svg-static/monochrome/clear-day.svg?react";
import PartlyCloudyDay from "@meteocons/svg-static/monochrome/partly-cloudy-day.svg?react";
import Cloudy from "@meteocons/svg-static/monochrome/cloudy.svg?react";
import Fog from "@meteocons/svg-static/monochrome/fog.svg?react";
import Rain from "@meteocons/svg-static/monochrome/rain.svg?react";
import Thunderstorms from "@meteocons/svg-static/monochrome/thunderstorms.svg?react";
import Snow from "@meteocons/svg-static/monochrome/snow.svg?react";

import type { ReactNode } from "react";

interface WeatherData {
  current: {
    temp: number;
    condition: string;
    icon: ReactNode;
  };
  forecast: Array<{
    date: string;
    temp: number;
    condition: string;
    icon: ReactNode;
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
            //icon: getWeatherIcon(current.weatherCode),
            icon: getWeatherIcon(Number(current.weatherCode)),
          },
          forecast: forecast.map((day: any) => ({
            date: day.date,
            temp: parseInt(day.avgtempC),
            condition: day.hourly[0].weatherDesc[0].value,
            //icon: getWeatherIcon(day.hourly[0].weatherCode),
            icon: getWeatherIcon(Number(day.hourly[0].weatherCode)),
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

  const iconStyle = {
  width: 56,
  height: 56,
};

const getWeatherIcon = (code: number): ReactNode => {
  switch (code) {
    // Sunny
    case 113:
      return <ClearDay style={iconStyle} />;

    // Partly cloudy
    case 116:
      return <PartlyCloudyDay style={iconStyle} />;

    // Cloudy
    case 119:
    case 122:
      return <Cloudy style={iconStyle} />;

    // Fog
    case 143:
    case 248:
    case 260:
      return <Fog style={iconStyle} />;

    // Rain
    case 176:
    case 263:
    case 266:
    case 293:
    case 296:
    case 299:
    case 302:
    case 305:
    case 308:
    case 353:
    case 356:
    case 359:
      return <Rain style={iconStyle} />;

    // Thunderstorms
    case 200:
    case 386:
    case 389:
    case 392:
    case 395:
      return <Thunderstorms style={iconStyle} />;

    // Snow / Ice
    case 179:
    case 182:
    case 185:
    case 227:
    case 230:
    case 281:
    case 284:
    case 311:
    case 314:
    case 317:
    case 320:
    case 323:
    case 326:
    case 329:
    case 332:
    case 335:
    case 338:
    case 350:
    case 362:
    case 365:
    case 368:
    case 371:
    case 374:
    case 377:
      return <Snow style={iconStyle} />;

    default:
      return <Cloudy style={iconStyle} />;
  }
};

/* const getWeatherIcon = (code: number): ReactNode => {
code = 395;
console.log("Codigo do clima: " + code);

switch (code) {
case 113: //Sunny
  return <WbSunnyRoundedIcon fontSize="large" />;//sol

case 116:
  return <CloudQueueRoundedIcon fontSize="large" />;//nuvem sem prrenc

case 119:
case 122:
  return <CloudRoundedIcon fontSize="large" />;//nuvem com oreenc

case 143:
case 248:
case 260: //Neblina
  return <GrainRoundedIcon  fontSize="large" />;//neblina (pontinhos)

case 176:
case 263:
case 266:
case 293:
case 296:
case 299:
case 302:
case 305:
case 308:
case 353:
case 356:
case 359:
  return <GrainRoundedIcon fontSize="large" />;

case 200:
case 386:
case 389:
case 392:
case 395:
  return <ThunderstormRoundedIcon fontSize="large" />;//nuvem com raiozinho

default:
  return <SevereColdRoundedIcon fontSize="large" />;//floco de neve com !
}
};
 */
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
      <Card sx={{ mb: 2, background: colors.bg}}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box>
              <Typography variant="h4" sx={{ color: colors.text, fontWeight: 'bold' }}>
                {weather.current.temp}°C
              </Typography>
              <Typography variant="body1" sx={{ color: colors.text, opacity: 0.9 }}>
                {weather.current.condition}
              </Typography>
              <Typography variant="body2" sx={{ color: colors.textDim, opacity: 0.8, mt: 1 }}>
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
