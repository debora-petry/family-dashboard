import { Typography, Box } from "@mui/material";
import { colors } from "../../theme/colors";
import WifiOutlinedIcon from "@mui/icons-material/WifiOutlined";
import LocalCafeOutlinedIcon from "@mui/icons-material/LocalCafeOutlined";
import QRCode from "react-qr-code";

const wifiNetworkName = "Not4UCLARO2G";
const wifiNetworkPass = "De#00130041";
const wifiNetworkType = "WPA";

const wifiString = `WIFI:T:${wifiNetworkType};S:${wifiNetworkName};P:${wifiNetworkPass};`;

export function WiFiWidget() {
  return (
    <Box
      sx={{
        p: 1,
        mt: 1,
        mb: 1,
        bgcolor: colors.bg,
        borderRadius: 2,
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 1.5,
        }}
      >
        <Box>
          <Typography
            sx={{
              color: colors.textDim,
              display: "flex",
              alignItems: "center",
              gap: 1,
              fontWeight: 500,
            }}
          >
            <WifiOutlinedIcon fontSize="small" sx={{ mt: "-6px" }} />
            Free Wi-Fi
          </Typography>
        </Box>
        <QRCode
          value={wifiString}
          size={60}
          bgColor={colors.bg}
          fgColor={colors.textDim}
        />
      </Box>
      <Typography
        sx={{
          color: colors.textDim,
          display: "flex",
          justifyContent: "center",

          alignItems: "center",
          gap: 0.5,
          mt: 1,
          whiteSpace: "nowrap",
        }}
      >
        and coffee, too.
        <LocalCafeOutlinedIcon
          fontSize="small"
          sx={{ mt: "-4px", color: colors.textFaint }}
        />
      </Typography>
    </Box>
  );
}
