import { useEffect, useState } from "react";
import { Box, Typography, Card, CardContent } from "@mui/material";
import axios from "axios";
import dayjs from "dayjs";
import { colors } from "../../theme/colors";
import WeatherAlert from "@meteocons/svg-static/monochrome/weather-alert.svg?react";
import { weatherTranslations } from "./weatherTranslations";
import type { ReactNode } from "react";
import { getWeatherIcon } from "./getWeatherIcon";
import { Alerts } from "../Alerts/Alerts";
import { alpha } from "@mui/material/styles";

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
        //console.log(response.data.weather.length);
        //console.log(response.data.weather);

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

  const forecastIconStyle = {
    width: 45,
    height: 45,
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
      <Box
        sx={{
          mb: 2,
          background: colors.bg,
          "& svg": {
            fontSize: "1.0rem",
          },
        }}
      >
        <WeatherAlert />

        <Typography sx={{ color: colors.textDim }}>
          Erro ao carregar previsão do tempo :(
        </Typography>
      </Box>
    );
  }
  //console.log("Weather object" + weather.forecast.map((f) => f.date));

  return (
    <Box sx={{}}>
      {" "}
      {/* Container */}
      <Card
        elevation={0}
        sx={{ mb: 0, background: colors.bg, borderRadius: 2 }}
      >
        {/*Remove sombra padrão do Card do MUI{" "} */}
        <CardContent
          sx={{
            pt: 0, // padding superior = 0
            px: 0, // padding horizontal = 1 8px
            pb: 0, // padding inferior = 1 = 8px
            pl: 1,
            "&:last-child": { pb: 0 }, // mantém o padding inferior em 1 mesmo no último filho
          }}
        >
          {/* Linha superior - temp e ícone */}
          <Box
            sx={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "center",
              gap: 1,
              mb: 0,
            }}
          >
            {/* Temp atual */}
            <Typography
              sx={{
                color: colors.textDim,
                fontSize: "2rem",
                fontWeight: 500,
                lineHeight: 1,
                //background: "yellow",
              }}
            >
              {weather.current.temp}°C
            </Typography>

            {/* Icone */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                //background: "cyan",

                "& svg": {
                  fontSize: "3rem",
                  display: "block",
                },
              }}
            >
              {weather.current.icon}
            </Box>
          </Box>

          {/* Linha inferior: Nome da condição atual */}
          <Box
            sx={{
              mt: 0,
              pt: 0,
              mb: 0,
              pb: 0,
              textAlign: "center",
            }}
          >
            <Typography
              variant="body1"
              sx={{
                color: colors.textDim,
                fontWeight: 500,
                mb: 0,
                mt: 0,
                pt: 0,
                pb: 0,
              }}
            >
              {translateWeather(weather.current.condition.split(",")[0])}
            </Typography>

            <Typography
              variant="body1"
              sx={{
                color: colors.textDim,
                mt: 0,
              }}
            >
              {weather.current.minTemp}° • {weather.current.maxTemp}°
            </Typography>
          </Box>

          {/* Próximos 3 dias - resumo */}
          <Box
            sx={{
              display: "flex",
              gap: 1,
              mt: 1,
              pt: 1,
              borderTop: `1px solid ${alpha(colors.textFaint, 0.5)}`, // Divider
            }}
          >
            {weather.forecast.slice(1, 4).map((day, index) => (
              <Box
                key={index}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
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
                  <Box sx={{ fontSize: "1rem" }}>{day.icon}</Box>
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
          <Box
            sx={{
              display: "flex",
              gap: 1,
              mt: 1,
              pt: 1,
              borderTop: `1px solid ${alpha(colors.textFaint, 0.5)}`, // Divider 2
            }}
          ></Box>
          <Alerts />
        </CardContent>
      </Card>
    </Box>
  );
}
