import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

import weatherRoutes from "./routes/weather.js";

app.use("/weather", weatherRoutes); //Registrando a rota

app.get("/privacy", (req, res) => {
  res.send(`
    <html>
      <head>
        <title>Privacy Policy - Family Dashboard</title>
        <style>
          body { font-family: sans-serif; line-height: 1.6; max-width: 800px; margin: 40px auto; padding: 20px; color: #333; }
          h1 { color: #2c3e50; }
          h2 { color: #34495e; margin-top: 30px; }
        </style>
      </head>
      <body>
        <h1>Privacy Policy</h1>
        <p>This Privacy Policy describes how the "Family Dashboard" application handles information collected from users. This is a personal project for private use.</p>
        
        <h2>1. Data Collection</h2>
        <p>The Application accesses the following information via Google APIs:</p>
        <ul>
          <li><strong>Google Calendar:</strong> Read-only access to display calendar events.</li>
          <li><strong>Google Home APIs:</strong> Access to view and control smart home devices.</li>
        </ul>

        <h2>2. Data Usage</h2>
        <p>The data obtained is used exclusively for real-time display on the Application's dashboard. We do not store or share your data with third parties.</p>

        <h2>3. Token Storage</h2>
        <p>Access and Refresh tokens are stored securely in environment variables on the hosting server (Render) to maintain connectivity.</p>

        <h2>4. Data Sharing</h2>
        <p>No data is shared with third parties. All information is transmitted via encrypted HTTPS connections.</p>

        <h2>5. Revoking Access</h2>
        <p>Users can revoke access at any time through their Google Account security settings.</p>

        <h2>6. Contact</h2>
        <p>For questions regarding this personal project, please contact the developer via the dashboard interface.</p>
      </body>
    </html>
  `);
});

export default app;
