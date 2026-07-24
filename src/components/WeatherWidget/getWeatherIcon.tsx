import Fog from "@meteocons/svg-static/monochrome/fog.svg?react";
import Rain from "@meteocons/svg-static/monochrome/rain.svg?react";
import Thunderstorms from "@meteocons/svg-static/monochrome/thunderstorms.svg?react";
import Snow from "@meteocons/svg-static/monochrome/snow.svg?react";
import ClearDay from "@meteocons/svg-static/monochrome/clear-day.svg?react";
import PartlyCloudyDay from "@meteocons/svg-static/monochrome/partly-cloudy-day.svg?react";
import Cloudy from "@meteocons/svg-static/monochrome/cloudy.svg?react";
import type { ReactNode } from "react";
import { colors } from "../../theme/colors";

const iconStyle = {
  width: 55,
  height: 55,
};

export const getWeatherIcon = (code: number, style = iconStyle): ReactNode => {
  //code = 113; //test code

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
