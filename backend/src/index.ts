// server.ts or app.ts
import dotenv from "dotenv";
dotenv.config();
import express, { Response, Request } from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes";
import siteRoutes from "./routes/siteRoutes";
import aiRoutes from "./routes/aiRoutes";
import { setupSwagger } from "./config/swagger";

const app = express();

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/sites", siteRoutes);
app.use("/api/ai", aiRoutes);

// Setup Swagger
setupSwagger(app);

// Health check
app.get("/", (_: Request, res: Response) => res.send("Smart Link API running ✅"));

app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found`
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`
🚀 Server running on port ${PORT}
📚 API Documentation: http://localhost:${PORT}/api-docs
🌐 Frontend URL: ${process.env.FRONTEND_URL || "http://localhost:3000"}
  `);
});