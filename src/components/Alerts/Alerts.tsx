import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  CircularProgress,
  Alert,
} from "@mui/material";
import WarningIcon from "@mui/icons-material/Warning";
import { usePortoAlegreAlerts } from "../../hooks/usePortoAlegreAlerts";
import { colors } from "../../theme/colors";
import type { InmetAlert } from "../../types/inmet";

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
        Erro ao carregar alertas: {error}
      </Alert>
    );
  }

  if (!alerts || alerts.length === 0) {
    return (
      <Alert severity="success" sx={{ mb: 2 }}>
        Nenhum alerta de tempo severo em Porto Alegre :)
      </Alert>
    );
  }

  return (
    <Box
      sx={{
        mb: 3,
        p: 2,
        backgroundColor: colors.bg,
        borderRadius: 2,
        border: `1px solid ${colors.border}`,
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
        <WarningIcon sx={{ color: colors.red }} />
        Alertas Inmet para POA
      </Typography>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {alerts.map((alert) => (
          <Card
            key={alert.id_aviso}
            sx={{
              borderLeft: `4px solid ${severityColors[alert.severidade] || "#999"}`,
              backgroundColor: colors.bg,
              boxShadow: "none",
              border: `1px solid ${colors.border}`,
              borderLeftWidth: "4px",
            }}
          >
            <CardContent sx={{ p: 1.5, "&:last-child": { pb: 1.5 } }}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 1,
                  mb: 1,
                }}
              >
                <Typography
                  variant="subtitle2"
                  sx={{ fontWeight: "bold", color: colors.text }}
                >
                  {alert.descricao}
                </Typography>
                <Chip
                  label={alert.severidade}
                  size="small"
                  sx={{
                    backgroundColor: severityColors[alert.severidade] || "#999",
                    color: "white",
                    width: "fit-content",
                    fontSize: "0.65rem",
                    fontWeight: "bold",
                    height: "20px",
                  }}
                />
              </Box>

              <Typography
                variant="caption"
                sx={{
                  color: colors.textDim,
                  mb: 1,
                  display: "block",
                  opacity: 0.9,
                }}
              >
                <strong>Período:</strong>{" "}
                {new Date(alert.data_inicio).toLocaleDateString("pt-BR")} às{" "}
                {alert.hora_inicio}
                {alert.data_fim && (
                  <>
                    {" "}
                    até {new Date(alert.data_fim).toLocaleDateString(
                      "pt-BR",
                    )}{" "}
                    às {alert.hora_fim}
                  </>
                )}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
}
