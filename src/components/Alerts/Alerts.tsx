import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  CircularProgress,
  Alert,
} from "@mui/material";
import CrisisAlertOutlinedIcon from "@mui/icons-material/CrisisAlertOutlined";
import { usePortoAlegreAlerts } from "./usePortoAlegreAlerts";
import { colors } from "../../theme/colors";
import type { InmetAlert } from "./inmet";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";

const severityColors: Record<string, string> = {
  Aviso: colors.gold,
  Alerta: colors.fcDad,
  Perigo: colors.red,
};

export function Alerts() {
  const { alerts: rawAlerts, loading, error } = usePortoAlegreAlerts();
  const alerts = rawAlerts as InmetAlert[];

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
        <CircularProgress size={24} />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        Erro ao carregar alertas do Inmet {error}
      </Alert>
    );
  }

  if (!alerts || alerts.length === 0) {
    return (
      <Box
        sx={{
          p: 0.5,
          fontFamily: "Roboto, sans-serif",
          color: colors.textDim,
          fontSize: "13px",
        }}
      >
        Oba! Nenhum alerta de tempo severo em Porto Alegre :)
      </Box>
    );
  }

  return (
    <Box
      sx={{
        mb: 2,
        //p: 2,
        //backgroundColor: colors.bg,
        borderRadius: 2,
        //border: `1px solid ${colors.border}`,
      }}
    >
      <Box
        sx={{
          mb: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 0.5,
          width: "100%",
        }}
      >
        <CrisisAlertOutlinedIcon sx={{ color: colors.textDim }} />
        <Typography
          variant="body1"
          sx={{
            fontFamily: "Roboto, sans-serif",
            color: colors.textDim,
            fontWeight: "bold",
            textAlign: "center",
            fontSize: "0.9rem",
            lineHeight: 1.2,
          }}
        >
          Alertas Inmet
        </Typography>
      </Box>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mr: 1 }}>
        {alerts.map((alert) => (
          <Card
            key={alert.id_aviso}
            sx={{
              backgroundColor: colors.bg2, //cor de fundo de cada alerta Inmet
              boxShadow: "none",
              border: "none",
              borderRadius: 2,
            }}
          >
            <CardContent
              sx={{
                p: 1.5,
                "&:last-child": { pb: 1.5 },
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 0.8,
                  mb: 1.5,
                }}
              >
                <Typography
                  sx={{
                    fontWeight: 500,
                    color: colors.textDim,
                    fontSize: "1rem",
                    textAlign: "center",
                  }}
                >
                  {alert.descricao}
                </Typography>

                <Chip
                  label={alert.severidade}
                  size="small"
                  sx={{
                    bgcolor: severityColors[alert.severidade],
                    color: colors.surface, // cor do texto
                    fontWeight: 700,
                    height: 22,
                    fontSize: "0.7rem",
                  }}
                />
              </Box>

              <Typography
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 0.5,
                  color: colors.textDim,
                  fontSize: "0.6rem",
                  width: "100%",
                }}
              >
                <AccessTimeOutlinedIcon
                  sx={{ fontSize: "0.6rem", position: "relative", top: "-1px" }}
                />
                Até{" "}
                {new Date(alert.data_fim)
                  .toLocaleDateString("pt-BR", {
                    day: "numeric",
                    month: "short",
                  })
                  .replace(".", "")}{" "}
                • {alert.hora_fim}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
}
