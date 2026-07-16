import { Box, Card, Typography } from "@mui/material";
import { colors } from "../../theme/colors";

export function InfoWidget() {
  return (
    <Box sx={{ mb: 4 }}>
      <Card sx={{ mb: 2, background: colors.bg}}>




      <Typography variant="h6" sx={{ mb: 2, color: colors.textDim }}>
        Melhor comprar...
      </Typography>

      <Typography variant="body1" sx={{ color: colors.textDim }}>
        Lista de compras (TODO)
      </Typography>



            </Card>
    </Box>
  );
}