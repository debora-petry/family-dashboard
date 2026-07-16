import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import axios from 'axios';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Armazenamento em memória (em produção, use banco de dados)
let tokens = {
  access_token: null,
  refresh_token: null,
  expires_at: null
};

// Endpoint para iniciar login OAuth
app.get('/auth/google', (req, res) => {
  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
    `client_id=${process.env.GOOGLE_CLIENT_ID}&` +
    `redirect_uri=${encodeURIComponent(process.env.REDIRECT_URI)}&` +
    `response_type=code&` +
    `scope=https://www.googleapis.com/auth/calendar.readonly&` +
    `access_type=offline&` +
    `prompt=consent`;

  res.json({ authUrl });
});

// Callback do OAuth
app.get('/auth/callback', async (req, res) => {
  const { code } = req.query;

  if (!code) {
    return res.status(400).json({ error: 'Missing code' });
  }

  try {
    // Troca o code por tokens
    const response = await axios.post('https://oauth2.googleapis.com/token', {
      code,
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: process.env.REDIRECT_URI,
      grant_type: 'authorization_code',
    });

    tokens = {
      access_token: response.data.access_token,
      refresh_token: response.data.refresh_token,
      expires_at: Date.now() + (response.data.expires_in * 1000),
    };

    res.redirect(`${process.env.FRONTEND_URL}?auth=success`);
  } catch (error) {
    console.error('Error exchanging code for tokens:', error.response?.data || error);
    res.status(500).json({ error: 'Failed to exchange code for tokens' });
  }
});

// Endpoint para obter access token válido
app.get('/auth/token', async (req, res) => {
  if (!tokens.refresh_token) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  // Se o token ainda é válido (com margem de 5 minutos)
  if (tokens.expires_at && tokens.expires_at > Date.now() + 300000) {
    return res.json({ access_token: tokens.access_token });
  }

  // Refresh do token
  try {
    const response = await axios.post('https://oauth2.googleapis.com/token', {
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      refresh_token: tokens.refresh_token,
      grant_type: 'refresh_token',
    });

    tokens = {
      access_token: response.data.access_token,
      refresh_token: tokens.refresh_token,
      expires_at: Date.now() + (response.data.expires_in * 1000),
    };

    res.json({ access_token: tokens.access_token });
  } catch (error) {
    console.error('Error refreshing token:', error.response?.data || error);
    res.status(401).json({ error: 'Failed to refresh token' });
  }
});

// Endpoint para logout
app.post('/auth/logout', (req, res) => {
  tokens = {
    access_token: null,
    refresh_token: null,
    expires_at: null,
  };
  res.json({ success: true });
});

// Endpoint para verificar status
app.get('/auth/status', (req, res) => {
  res.json({
    authenticated: !!tokens.refresh_token,
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

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
