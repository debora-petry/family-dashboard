import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  CircularProgress,
  Alert,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import WarningIcon from "@mui/icons-material/Warning";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
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
    <Box sx={{ mb: 3 }}>
      <Typography
        variant="body1"
        sx={{
          mb: 2,
          display: "flex",
          alignItems: "center",
          gap: 1,
          fontFamily: "Roboto, sans-serif",
          //fontWeight: "bold",
          fontColor: colors.red,
        }}
      >
        <WarningIcon sx={{ color: colors.red }} />
        Alertas - Porto Alegre
      </Typography>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {alerts.map((alert) => (
          <Card
            key={alert.id_aviso}
            sx={{
              borderLeft: `4px solid ${severityColors[alert.severidade] || "#999"}`,
              backgroundColor: "rgba(255, 165, 0, 0.05)",
            }}
          >
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 1,
                  mb: 1,
                }}
              >
                <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                  {alert.descricao}
                </Typography>
                <Chip
                  label={alert.severidade}
                  size="small"
                  sx={{
                    backgroundColor: severityColors[alert.severidade] || "#999",
                    color: "white",
                    width: "fit-content",
                  }}
                />
              </Box>

              <Typography
                variant="body2"
                sx={{ color: "textSecondary", mb: 1 }}
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

              {alert.riscos && alert.riscos.length > 0 && (
                <Box sx={{ mb: 1 }}>
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: "bold", mb: 0.5 }}
                  >
                    Riscos:
                  </Typography>
                  <List sx={{ py: 0, px: 1 }}>
                    {alert.riscos.map((risco, idx) => (
                      <ListItem key={idx} sx={{ py: 0.5, px: 0 }}>
                        <ListItemIcon sx={{ minWidth: 24 }}>
                          <FiberManualRecordIcon
                            sx={{ fontSize: "0.6rem", color: colors.red }}
                          />
                        </ListItemIcon>
                        <ListItemText primary={risco} />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              )}

              {/*    {alert.instrucoes && alert.instrucoes.length > 0 && (
                <Box>
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: "bold", mb: 0.5 }}
                  >
                    Instruções:
                  </Typography>
                  <Typography variant="body2" component="div" sx={{ pl: 2 }}>
                    <ul style={{ margin: 0, paddingLeft: 20 }}>
                      {alert.instrucoes.map((instrucao, idx) => (
                        <li key={idx}>{instrucao}</li>
                      ))}
                    </ul>
                  </Typography>
                </Box>
              )} */}
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
}
