import { useEffect, useState } from "react";
import { Box, Typography, Card, CardContent } from "@mui/material";
import axios from "axios";
import dayjs from "dayjs";
import { colors } from "../../theme/colors";
import ClearDay from "@meteocons/svg-static/monochrome/clear-day.svg?react";
import PartlyCloudyDay from "@meteocons/svg-static/monochrome/partly-cloudy-day.svg?react";
import Cloudy from "@meteocons/svg-static/monochrome/cloudy.svg?react";
import Fog from "@meteocons/svg-static/monochrome/fog.svg?react";
import Rain from "@meteocons/svg-static/monochrome/rain.svg?react";
import Thunderstorms from "@meteocons/svg-static/monochrome/thunderstorms.svg?react";
import Snow from "@meteocons/svg-static/monochrome/snow.svg?react";

import type { ReactNode } from "react";

const weatherTranslations: { [key: string]: string } = {
  "Sunny": "Ensolarado",
  "Clear": "Limpo",
  "Partly cloudy": "Parcialmente nublado",
  "Cloudy": "Nublado",
  "Overcast": "Encoberto",
  "Mist": "Neblina",
  "Fog": "Nevoeiro",
  "Rain": "Chuva",
  "Light rain": "Chuva leve",
  "Heavy rain": "Chuva forte",
  "Thunderstorm": "Tempestade",
  "Thundery outbreaks": "Tempestades isoladas",
  "Snow": "Neve",
  "Light snow": "Neve leve",
  "Heavy snow": "Neve forte",
  "Sleet": "Granizo",
  "Hail": "Chuva de granizo",
  "Drizzle": "Chuvisco",
  "Freezing drizzle": "Chuvisco congelante",
  "Freezing rain": "Chuva congelante",
  "Ice pellets": "Pelotas de gelo",
  "Blizzard": "Nevasca",
  "Windy": "Ventoso",
  "Humid": "Úmido",
  "Dry": "Seco",
  "Hot": "Quente",
  "Cold": "Frio",
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
        const response = await axios.get('https://wttr.in/Porto%20Alegre?format=j1');
        
        const current = response.data.current_condition[0];
        const forecast = response.data.weather.slice(0, 4); // Hoje + 3 dias

        setWeather({
          current: {
            temp: parseInt(current.temp_C),
            minTemp: parseInt(forecast[0].mintempC),
            maxTemp: parseInt(forecast[0].maxtempC),
            condition: current.weatherDesc[0].value,
            //icon: getWeatherIcon(current.weatherCode),
            icon: getWeatherIcon(Number(current.weatherCode),),
          },
          forecast: forecast.map((day: any) => ({
            date: day.date,
            temp: parseInt(day.avgtempC),
            minTemp: parseInt(day.mintempC),
            maxTemp: parseInt(day.maxtempC),
            condition: day.hourly[0].weatherDesc[0].value,
            //icon: getWeatherIcon(day.hourly[0].weatherCode),
            icon: getWeatherIcon(Number(day.hourly[0].weatherCode),forecastIconStyle),
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
  width: 72,
  height: 72,
};

const forecastIconStyle = {
  width: 30,
  height: 30,
};

const getWeatherIcon = (code: number, style = iconStyle): ReactNode => {
  
  
  //code = 374 //test code
  switch (code) {
    // Sunny
    case 113:
      return (
          <ClearDay
            style={{
              ...style,
              color: colors.gold,//amarelo escuro
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
        color: colors.fcMom,//blue
      }}
    />
  );

    // Cloudy
    case 119:
    case 122:
      //return <Cloudy style={style} />;
       return (
    <Cloudy
      style={{
        ...style,
        color: colors.fcMom,//blue
      }}
    />
  );

    // Fog
    case 143:
    case 248:
    case 260:
      return <Fog style={style} />;

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
      //return <Rain style={style} />;
          return (
    <Rain
      style={{
        ...style,
        color: colors.fcMom,//blue
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
            color: colors.fcDad,//laranja
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
            color: colors.fcMom,//blue
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
    {}
      
      {/* Previsão de hoje - maior */}
      <Card sx={{ mb: 2, background: colors.bg}}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box>
              <Typography sx={{
                color: colors.textDim,
                fontSize: "3.5rem",
                fontWeight: 500,
                lineHeight: 1,
              }}>
                {weather.current.temp}°C
              </Typography>
              <Typography variant="body1" sx={{ color: colors.text, opacity: 0.9 }}>
                {translateWeather(weather.current.condition)}
              </Typography>
              <Typography variant="body2" sx={{ color: colors.textDim, opacity: 0.8 }}>
{weather.current.minTemp}° • {weather.current.maxTemp}°              </Typography>
              
              <Typography variant="body2" sx={{ color: colors.textDim, opacity: 0.8, mt: 1 }}>
                {dayjs().format('dddd, DD/MM')}
              </Typography>
            </Box>
            <Typography variant="h3" sx={{ fontSize: '4rem' }}>
              {weather.current.icon}
            </Typography>
          </Box>




          {/* Próximos 2 dias - resumo */}
          <Box sx={{
             display: 'flex',
             gap: 2, mt: 3,
              pt: 2, borderTop: `1px solid ${colors.border}` 
              }}>
            
            
            
            {weather.forecast.slice(1, 3).map((day, index) => (
              <Box key={index} sx={{ 
                
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              //justifyContent: "center",
              textAlign: "center",
              flex: 1,
               }}>
              
                <Box>
                  <Typography variant="body1" sx={{ color: colors.text, fontWeight: 'medium' }}>
                    {dayjs(day.date).format('ddd').toUpperCase()}
                  </Typography>
                   <Box sx={{ fontSize: '1.5rem' }}> 
                  {day.icon} 
                </Box>
                  <Typography variant="caption" sx={{ color: colors.textDim, display: 'block' }}>
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
