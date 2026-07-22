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
import { usePortoAlegreAlerts } from "../../hooks/usePortoAlegreAlerts";
import { colors } from "../../theme/colors";
import type { InmetAlert } from "../../types/inmet";
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
          p: 2,
          fontFamily: "Roboto, sans-serif",
          color: colors.textDim,
        }}
      >
        Oba! Nenhum alerta de tempo severo em Porto Alegre :)
      </Box>
    );
  }

  return (
    <Box
      sx={{
        mb: 3,
        //p: 2,
        //backgroundColor: colors.bg,
        borderRadius: 2,
        //border: `1px solid ${colors.border}`,
      }}
    >
      <Typography
        variant="body1"
        sx={{
          mb: 2,
          display: "flex",
          alignItems: "center",
          gap: 1,
          fontFamily: "Roboto, sans-serif",
          color: colors.textDim,
          fontWeight: "bold",
        }}
      >
        <CrisisAlertOutlinedIcon sx={{ color: colors.textDim }} />
        Alertas Inmet
      </Typography>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {alerts.map((alert) => (
          <Card
            key={alert.id_aviso}
            sx={{
              backgroundColor:
                alert.severidade === "Perigo"
                  ? "#FDEAE5"
                  : alert.severidade === "Alerta"
                    ? "#d9caa5"
                    : "#FFF9E8",
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
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 1,
                }}
              >
                <Typography
                  sx={{
                    fontWeight: 500,
                    color: colors.textDim,
                    fontSize: "1rem",
                  }}
                >
                  {alert.descricao}
                </Typography>

                <Chip
                  label={alert.severidade}
                  size="small"
                  sx={{
                    bgcolor: severityColors[alert.severidade],
                    color: "#fff",
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
                  gap: 0.5,
                  color: colors.textDim,
                  fontSize: "0.82rem",
                }}
              >
                <AccessTimeOutlinedIcon
                  sx={{ fontSize: "0.9rem", position: "relative", top: "-1px" }}
                />
                Até{" "}
                {new Date(alert.data_fim).toLocaleDateString("pt-BR", {
                  day: "2-digit",
                  month: "short",
                })}{" "}
                • {alert.hora_fim}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
}
