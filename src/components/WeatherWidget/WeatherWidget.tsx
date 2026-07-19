import { useEffect, useState } from "react";
import { Box, Typography, Card, CardContent } from "@mui/material";
import axios from "axios";
import dayjs from "dayjs";
import { colors } from "../../theme/colors";
import ClearDay from "@meteocons/svg-static/monochrome/clear-day.svg?react";
import PartlyCloudyDay from "@meteocons/svg-static/monochrome/partly-cloudy-day.svg?react";
import Cloudy from "@meteocons/svg-static/monochrome/cloudy.svg?react";
import WeatherAlert from "@meteocons/svg-static/monochrome/weather-alert.svg?react";
import Fog from "@meteocons/svg-static/monochrome/fog.svg?react";
import Rain from "@meteocons/svg-static/monochrome/rain.svg?react";
import Thunderstorms from "@meteocons/svg-static/monochrome/thunderstorms.svg?react";
import Snow from "@meteocons/svg-static/monochrome/snow.svg?react";

import type { ReactNode } from "react";

const weatherTranslations: { [key: string]: string } = {
  Sunny: "Ensolarado",
  Clear: "Limpo",
  "Partly cloudy": "Parcialmente nublado",
  Cloudy: "Nublado",
  Overcast: "Encoberto",
  Mist: "Neblina",
  Fog: "Nevoeiro",
  Rain: "Chuva",
  "Light rain": "Chuva leve",
  "Heavy rain": "Chuva forte",
  Thunderstorm: "Tempestade",
  "Thundery outbreaks": "Tempestades isoladas",
  Snow: "Neve",
  "Light snow": "Neve leve",
  "Heavy snow": "Neve forte",
  Sleet: "Granizo",
  Hail: "Chuva de granizo",
  Drizzle: "Chuvisco",
  "Freezing drizzle": "Chuvisco congelante",
  "Freezing rain": "Chuva congelante",
  "Ice pellets": "Pelotas de gelo",
  Blizzard: "Nevasca",
  Windy: "Ventoso",
  Humid: "Úmido",
  Dry: "Seco",
  Hot: "Quente",
  Cold: "Frio",
  "Shower In Vicinity": "Pancadas na região",
};

const translateWeather = (condition: string): string => {
  return weatherTranslations[condition] || condition;
};

interface WeatherData {
  current: {
    temp: number;
    minTemp: number;
    maxTemp: number;
    condition: string;
    icon: ReactNode;
  };
  forecast: Array<{
    date: string;
    temp: number;
    minTemp: number;
    maxTemp: number;
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
        const response = await axios.get(
          "https://wttr.in/Porto%20Alegre?format=j1",
        );

        const current = response.data.current_condition[0];
        const forecast = response.data.weather.slice(0, 5); // Hoje + 4 dias
        console.log(response.data.weather.length);
        console.log(response.data.weather);

        setWeather({
          current: {
            temp: parseInt(current.temp_C),
            minTemp: parseInt(forecast[0].mintempC),
            maxTemp: parseInt(forecast[0].maxtempC),
            condition: current.weatherDesc[0].value,
            icon: getWeatherIcon(Number(current.weatherCode)),
          },
          forecast: forecast.map(
            (day: {
              date: string;
              avgtempC: string;
              mintempC: string;
              maxtempC: string;
              hourly: Array<{
                weatherDesc: Array<{ value: string }>;
                weatherCode: string;
              }>;
            }) => ({
              date: day.date,
              temp: parseInt(day.avgtempC),
              minTemp: parseInt(day.mintempC),
              maxTemp: parseInt(day.maxtempC),
              condition: day.hourly[0].weatherDesc[0].value,
              icon: getWeatherIcon(
                Number(day.hourly[0].weatherCode),
                forecastIconStyle,
              ),
            }),
          ),
        });
      } catch (error) {
        console.error("Erro ao buscar previsão:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, []);

  const iconStyle = {
    width: 70,
    height: 70,
  };

  const forecastIconStyle = {
    width: 60,
    height: 60,
  };

  const getWeatherIcon = (code: number, style = iconStyle): ReactNode => {
    //code = 374 //test code
    console.error("Código de clima:", code);

    switch (code) {
      // Sunny
      case 113:
        return (
          <ClearDay
            style={{
              ...style,
              color: colors.gold, //amarelo escuro
            }}
          />
        );

      // Partly cloudy
      case 116:
        //return <PartlyCloudyDay style={style} />;
        return (
          <PartlyCloudyDay
            style={{
              ...style,
              color: colors.fcMom, //blue
            }}
          />
        );

      // Cloudy
      case 119:
        return (
          <Cloudy
            style={{
              ...style,
              color: colors.fcMom, //blue
            }}
          />
        );

      // Fog
      case 143:
      case 248:
      case 260:
        return (
          <Fog
            style={{
              ...style,
              color: colors.textDim,
            }}
          />
        );

      // Rain
      case 122:
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
        //return <Rain style={style} />;
        return (
          <Rain
            style={{
              ...style,
              color: colors.fcMom, //blue
            }}
          />
        );

      // Thunderstorms
      case 200:
      case 386:
      case 389:
      case 392:
      case 395:
        //return <Thunderstorms style={style} />;
        return (
          <Thunderstorms
            style={{
              ...style,
              color: colors.fcDad, //laranja
            }}
          />
        );

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
        //return <Snow style={style} />;
        return (
          <Snow
            style={{
              ...style,
              color: colors.fcMom, //blue
            }}
          />
        );

      default:
        return <Cloudy style={style} />;
    }
  };

  if (loading) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography sx={{ color: colors.textDim }}>
          Carregando previsão...
        </Typography>
      </Box>
    );
  }

  if (!weather) {
    return (
      <Box sx={{ mb: 2, background: colors.bg }}>
        <WeatherAlert />

        <Typography sx={{ color: colors.textDim }}>
          Erro ao carregar previsão do tempo :(
        </Typography>
      </Box>
    );
  }
  console.log("Weather object" + weather.forecast.map((f) => f.date));

  return (
    <Box sx={{ mb: 4 }}>
      <Card sx={{ mb: 2, background: colors.bg }}>
        <CardContent
          sx={{
            pt: 0,
            px: 1,
            pb: 1,
            "&:last-child": { pb: 1 },
          }}
        >
          {/* Linha superior - temp e ícone */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 1,
              mb: 1,
            }}
          >
            {/* Temp atual */}
            <Typography
              sx={{
                color: colors.textDim,
                fontSize: "2.5rem",
                fontWeight: 500,
                lineHeight: 1.5,
              }}
            >
              {weather.current.temp}°C
            </Typography>

            {/* Icone */}
            <Box
              sx={{
                "& svg": {
                  fontSize: "1.0rem",
                },
              }}
            >
              {weather.current.icon}
            </Box>
          </Box>

          {/* Linha inferior: Nome da condição atual */}
          <Box
            sx={{
              mt: 0.5,
              textAlign: "center",
            }}
          >
            <Typography
              variant="body1"
              sx={{
                color: colors.textDim,
                fontWeight: 500,
                mb: 1, // aumenta o espaço abaixo
              }}
            >
              {translateWeather(weather.current.condition.split(",")[0])}
            </Typography>

            <Typography
              variant="body1"
              sx={{
                color: colors.textDim,
                mt: 0.25,
              }}
            >
              {weather.current.minTemp}° • {weather.current.maxTemp}°
            </Typography>
          </Box>

          {/* Próximos 3 dias - resumo */}
          <Box
            sx={{
              display: "flex",
              gap: 2,
              mt: 3,
              pt: 2,
              borderTop: `1px solid ${colors.border}`,
            }}
          >
            {weather.forecast.slice(1, 4).map((day, index) => (
              <Box
                key={index}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  //justifyContent: "center",
                  textAlign: "center",
                  flex: 1,
                }}
              >
                <Box>
                  <Typography
                    variant="body1"
                    sx={{ color: colors.textDim, fontWeight: "medium" }}
                  >
                    {dayjs(day.date).format("ddd").toUpperCase()}
                  </Typography>
                  <Box sx={{ fontSize: "1.5rem" }}>{day.icon}</Box>
                  <Typography
                    variant="caption"
                    sx={{ color: colors.textDim, display: "block" }}
                  >
                    {day.temp}°C
                  </Typography>

                  <Typography
                    variant="body2"
                    sx={{
                      color: colors.textDim,
                      opacity: 0.8,
                      textAlign: "center",
                      mt: 0.5,
                    }}
                  >
                    {day.minTemp}° • {day.maxTemp}°
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
