import express from "express";
import cors from "cors";
import helmet from "helmet";
import { rateLimit } from "express-rate-limit";
import agentRoutes from "./routes/agent.routes.js";
import authRoutes from "./routes/auth.routes.js";
import agentCreationRoutes from "./routes/agentCreation.routes.js";
import integrationRoutes from "./routes/integration.routes.js";
import { cloudnaryConfig } from "./config/cloudinary.js";
import { google } from "googleapis";

const app = express();
app.set("trust proxy", 1);
// Security Middleware
app.use(helmet());
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message:
      "Too many requests from this IP, please try again after 15 minutes",
  }),
);

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  }),
);
app.use(express.json());
app.use("/api/agents", agentCreationRoutes);
app.use("/api/agent", agentRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/integrations", integrationRoutes);

cloudnaryConfig();

export default app;
