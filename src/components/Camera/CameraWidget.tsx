import { Box } from "@mui/material";
import { useCameraSnapshot } from "./useCameraSnapshot";
import { colors } from "../../theme/colors";

export function CameraWidget() {
  const imageUrl = useCameraSnapshot({
    interval: 1000,
  });

  return (
    <Box
      sx={{
        p: 1,
        mt: 1,
        mb: 1,
        bgcolor: colors.bg,
        borderRadius: 2,
        alignItems: "center",
        width: "100%",
        height: "100%",
        objectFit: "cover",
      }}
      component="img"
      src={imageUrl}
      alt="Camera"
    />
  );
}
