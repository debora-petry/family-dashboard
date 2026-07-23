import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import { getInmetAlerts } from "./services/inmet.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envPath = path.join(__dirname, ".env.development");

if (process.env.NODE_ENV !== "production" && fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
}

import cors from "cors";
import axios from "axios";
import express from "express";

console.log("REDIRECT_URI =", process.env.REDIRECT_URI);
console.log("CLIENT_ID =", process.env.GOOGLE_CLIENT_ID);
console.log("FRONTEND_URL =", process.env.FRONTEND_URL);

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Novo: usa o Refresh Token salvo no Render, se existir.
// Caso contrário, continua usando o token em memória.
//const refreshToken = process.env.GOOGLE_REFRESH_TOKEN;

// Armazenamento em memória (em produção, use banco de dados)
let tokens = {
  access_token: null,
  refresh_token: null,
  expires_at: null,
};

async function getValidAccessToken() {
  const activeRefreshToken =
    process.env.GOOGLE_REFRESH_TOKEN || tokens.refresh_token;

  if (!activeRefreshToken) {
    throw new Error("Not authenticated");
  }

  // Reutiliza o token se ainda for válido
  if (
    tokens.access_token &&
    tokens.expires_at &&
    tokens.expires_at > Date.now() + 300000
  ) {
    return tokens.access_token;
  }

  const response = await axios.post("https://oauth2.googleapis.com/token", {
    client_id: process.env.GOOGLE_CLIENT_ID,
    client_secret: process.env.GOOGLE_CLIENT_SECRET,
    refresh_token: activeRefreshToken,
    grant_type: "refresh_token",
  });

  tokens.access_token = response.data.access_token;
  tokens.expires_at = Date.now() + response.data.expires_in * 1000;

  if (response.data.refresh_token) {
    tokens.refresh_token = response.data.refresh_token;
  }

  return tokens.access_token;
}

// Endpoint para iniciar login OAuth
app.get("/auth/google", (req, res) => {
  const authUrl =
    `https://accounts.google.com/o/oauth2/v2/auth?` +
    `client_id=${process.env.GOOGLE_CLIENT_ID}&` +
    `redirect_uri=${encodeURIComponent(process.env.REDIRECT_URI)}&` +
    `response_type=code&` +
    `scope=https://www.googleapis.com/auth/calendar.readonly https://www.googleapis.com/auth/photoslibrary.readonly&` +
    `access_type=offline&` +
    `prompt=consent`;

  res.json({ authUrl });
});

// Callback do OAuth
app.get("/auth/callback", async (req, res) => {
  const { code } = req.query;

  if (!code) {
    return res.status(400).json({ error: "Missing code" });
  }

  try {
    // Troca o code por tokens
    const response = await axios.post("https://oauth2.googleapis.com/token", {
      code,
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: process.env.REDIRECT_URI,
      grant_type: "authorization_code",
    });

    //console.log("TOKENS RECEBIDOS:");
    //console.log(response.data);
    //console.log("REFRESH TOKEN:", response.data.refresh_token);
    //console.log("ACCESS TOKEN:", response.data.access_token);

    tokens = {
      access_token: response.data.access_token,
      refresh_token: response.data.refresh_token,
      expires_at: Date.now() + response.data.expires_in * 1000,
    };

    res.redirect(`${process.env.FRONTEND_URL}?auth=success`);
  } catch (error) {
    console.error(
      "Error exchanging code for tokens:",
      error.response?.data || error,
    );
    res.status(500).json({ error: "Failed to exchange code for tokens" });
  }
});

app.get("/auth/token", async (req, res) => {
  try {
    const accessToken = await getValidAccessToken();
    res.json({ access_token: accessToken });
  } catch (error) {
    res.status(401).json({
      error: error.response?.data || error.message,
    });
  }
});

// Endpoint para logout
app.post("/auth/logout", (req, res) => {
  tokens = {
    access_token: null,
    refresh_token: null,
    expires_at: null,
  };
  res.json({ success: true });
});

// Endpoint para verificar status
app.get("/auth/status", (req, res) => {
  const hasRefreshToken =
    !!tokens.refresh_token || !!process.env.GOOGLE_REFRESH_TOKEN;
  res.json({
    authenticated: hasRefreshToken,
    expires_at: tokens.expires_at,
  });
});

app.get("/", (req, res) => {
  res.json({
    status: "ok",
    service: "Family Dashboard API",
    version: "1.0.0",
  });
});

app.get("/photos/albums", async (req, res) => {
  try {
    const accessToken = await getValidAccessToken();

    const response = await axios.get(
      "https://photoslibrary.googleapis.com/v1/albums",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    res.json(response.data);
  } catch (error) {
    console.error(error.response?.data || error.message);

    res.status(error.response?.status || 500).json(
      error.response?.data || {
        error: error.message,
      },
    );
  }
});

// ==============================
// INMET
// ==============================
console.log("Registrando rota /api/inmet-alerts");

app.get("/api/inmet-alerts", async (_req, res) => {
  try {
    const alerts = await getInmetAlerts();
    res.json(alerts);
  } catch (error) {
    console.error("Erro ao buscar alertas do INMET:", error);

    res.status(500).json({
      error: "Erro ao buscar alertas do INMET",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
