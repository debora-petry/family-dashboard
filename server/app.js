import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

import weatherRoutes from "./routes/weather.js";

app.use("/weather", weatherRoutes); //Registrando a rota

export default app;
