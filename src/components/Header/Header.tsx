import { AppBar, Toolbar, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { colors } from "../../theme/colors";
import CottageOutlinedIcon from "@mui/icons-material/CottageOutlined";

export function Header() {
  const [currentTime, setCurrentTime] = useState(new Date());

  // Atualiza o tempo a cada segundo
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "America/Sao_Paulo",
    });
  };

  return (
    <AppBar
      position="static"
      sx={{
        width: "100%",
        background: `linear-gradient(135deg, ${colors.surfaceHi} 0%, ${colors.surfaceHi} 100%)`,
        borderBottom: `2px solid ${colors.border}`,
      }}
    >
      <Toolbar>
        <Typography
          variant="h5"
          component="div"
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            flexGrow: 1,
            color: colors.textDim,
            fontFamily: "Roboto, sans-serif",
            fontWeight: 600,
          }}
        >
          <CottageOutlinedIcon
            sx={{
              fontSize: "1.8rem",
              color: colors.textDim,
              mt: "-7px",
            }}
          />
          Família Wasem Petry
        </Typography>
        <Typography
          variant="body1"
          sx={{
            opacity: 0.7,
            ml: 2,
            fontWeight: 500,
            color: colors.textDim,
            fontSize: "1.05rem",
          }}
        >
          {`${new Date().toLocaleDateString("pt-BR", {
            weekday: "long",
            timeZone: "America/Sao_Paulo",
          })} • ${new Date().toLocaleDateString("pt-BR", {
            day: "numeric",
            month: "long",
            timeZone: "America/Sao_Paulo",
          })}`}
        </Typography>
        <Typography
          variant="h3"
          sx={{ opacity: 0.9, ml: 2, fontWeight: 700, color: colors.textDim }}
        >
          {formatTime(currentTime)}
        </Typography>
      </Toolbar>
    </AppBar>
  );
}
