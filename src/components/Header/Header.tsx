import { AppBar, Toolbar, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { colors } from "../../theme/colors";

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
    return date.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'America/Sao_Paulo'
    });
  };

  return (
    <AppBar position="static" sx={{ width: '100%', background: `linear-gradient(135deg, ${colors.surfaceHi} 0%, ${colors.surfaceHi} 100%)` }}>
      <Toolbar>
        <Typography variant="h5" component="div" sx={{ flexGrow: 1, color: colors.textDim, fontFamily: 'Roboto, sans-serif',     fontWeight: 600,
 }}>
          Debora's Family Dashboard
        </Typography>
         <Typography
              variant="body1"
              sx={{ opacity: 0.9, fontWeight: 500, color: colors.textDim }}
            >
              {new Date().toLocaleDateString("pt-BR", {
                day: "numeric",
                month: "long",
                year: "numeric",
                timeZone: "America/Sao_Paulo",
              })}
        </Typography>
        <Typography variant="body1" sx={{ opacity: 0.9, ml: 2, fontWeight: 500, color: colors.textDim }}>
          {formatTime(currentTime)}
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.8, ml: 2, color: colors.textDim }}>
          Porto Alegre, RS
        </Typography>
      </Toolbar>
    </AppBar>
  );
}
