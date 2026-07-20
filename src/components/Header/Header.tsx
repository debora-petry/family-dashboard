import { AppBar, Toolbar, Typography, Box } from "@mui/material";
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
      elevation={0}
      sx={{
        bgcolor: "transparent",
        //backgroundColor: colors.surfaceHi,
        backgroundImage: "none",
        boxShadow: "none",
        py: 2,
        mb: 3,
        px: 3,
      }}
    >
      <Toolbar
        disableGutters
        sx={{
          minHeight: "unset !important",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "center",
            gap: 0.25,
          }}
        >
          <CottageOutlinedIcon
            sx={{
              fontSize: "1.8rem",
              color: colors.textFaint,
            }}
          />

          <Typography
            sx={{
              fontFamily: '"Instrument Serif", serif',
              fontSize: "2rem",
              fontWeight: 600,
              letterSpacing: "0.08em",
              lineHeight: 1.1,
              color: colors.textDim,
            }}
          >
            Família Wasem Petry
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            lineHeight: 1,
          }}
        >
          <Typography
            sx={{
              opacity: 0.65,
              fontWeight: 500,
              color: colors.textDim,
              fontSize: "1.05rem",
              mb: 0.3,
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
            sx={{
              fontWeight: 700,
              color: colors.textDim,
              lineHeight: 1,
            }}
          >
            {formatTime(currentTime)}
          </Typography>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
