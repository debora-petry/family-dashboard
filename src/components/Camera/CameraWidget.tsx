import { useEffect, useState } from "react";
import axios from "axios";
import { useCameraSnapshot } from "./useCameraSnapshot";
import { colors } from "../../theme/colors";
import { Typography, Box } from "@mui/material";

const API_URL =
  import.meta.env.VITE_API_URL || "https://family-dashboard-api.onrender.com";

export function CameraWidget() {
  const imageUrl = useCameraSnapshot({
    interval: 1000,
  });
  const [motionAlert, setMotionAlert] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchAlert = async () => {
      try {
        const response = await axios.get(`${API_URL}/camera/motion/latest`);
        if (!isMounted) return;

        if (response.data?.status === "no_alert") {
          setMotionAlert(null);
        } else if (response.data?.payload) {
          const payload = response.data.payload;
          const message =
            typeof payload === "string"
              ? payload
              : JSON.stringify(payload).slice(0, 120);
          setMotionAlert(`Alerta de movimento: ${message}`);
        } else {
          setMotionAlert(null);
        }
      } catch (error) {
        console.error("Erro ao buscar alerta de câmera:", error);
      }
    };

    fetchAlert();
    const interval = window.setInterval(fetchAlert, 5000);

    return () => {
      isMounted = false;
      window.clearInterval(interval);
    };
  }, []);

  return (
    <Box
      sx={{
        bgcolor: colors.bg,
        borderRadius: 2,
        p: 1,
        mt: 1,
        mb: 1,
        ml: 2,
        mr: 1,
        width: "25%", //Largura que o Box ocupa da viewport
      }}
    >
      <Typography sx={{ mb: 1, color: colors.textDim }}>Front Door</Typography>

      {motionAlert ? (
        <Box
          sx={{
            mb: 1,
            p: 1,
            borderRadius: 1,
            bgcolor: colors.accent,
            color: colors.bg,
            fontSize: "0.85rem",
            lineHeight: 1.3,
          }}
        >
          {motionAlert}
        </Box>
      ) : (
        <Typography sx={{ mb: 1, color: colors.textDim, fontSize: "0.85rem" }}>
          Sem alertas de movimento recentes
        </Typography>
      )}

      <Box
        component="img"
        src={imageUrl}
        alt="Camera"
        sx={{
          width: "100%", //Largura que a imagem da cam ocupa do BOX!
          borderRadius: 1,
        }}
      />
    </Box>
  );
}
/* 

    <Box
      sx={{
        position: "relative",
        p: 1,
        mt: 1,
        mb: 1,
        mr: 1,
        bgcolor: colors.bg,
        borderRadius: 2,
        overflow: "hidden",
        width: "20%",
        height: "20%",
      }}
    >
      <Box
        component="img"
        src={imageUrl}
        alt="Camera"
        sx={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />

      <Typography
        sx={{
          position: "absolute",
          top: 16,
          left: 16,
          color: colors.accentDim,
          fontWeight: 500,
        }}
      >
        Front door cam{" "}
      </Typography>
      {/*     <Typography
        sx={{
          position: "absolute",
          top: 16,
          left: 16,
          color: "white",
          fontWeight: 600,
        }}
      >
        Online{" "}
      //</Typography> */
//</Box>
// );
//}*/
