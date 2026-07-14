import { useEffect, useState } from "react";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";

import { Paper, Typography, Stack } from "@mui/material";

dayjs.locale("pt-br");

function Clock() {
  const [now, setNow] = useState(dayjs());

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(dayjs());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Paper
      elevation={4}
      sx={{
        p: 4,
        borderRadius: 4,
        width: 320,
        textAlign: "center",
      }}
    >
      <Stack spacing={1}>
<Typography variant="h2" sx={{ fontWeight: 700 }}>          {now.format("HH:mm")}
        </Typography>

        <Typography variant="h6" color="text.secondary">
          {now.format("dddd")}
        </Typography>

        <Typography variant="body1" color="text.secondary">
          {now.format("DD [de] MMMM")}
        </Typography>
      </Stack>
    </Paper>
  );
}

export default Clock;