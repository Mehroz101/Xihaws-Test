import dotenv from "dotenv";

dotenv.config();
import express, { Response } from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes";
import siteRoutes from "./routes/siteRoutes";
import aiRoutes from "./routes/aiRoutes";
import { setupSwagger } from "./config/swagger";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/sites", siteRoutes);
app.use("/api/ai", aiRoutes);

// Setup Swagger documentation
setupSwagger(app);

app.get("/", (_:unknown, res:Response) => res.send("Smart Link API running ✅"));
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
