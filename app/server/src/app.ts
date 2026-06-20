import express from "express";
import cors from "cors";
import helmet from "helmet";
import swaggerUi from "swagger-ui-express";
import { authRouter } from "./modules/auth/auth.route.ts";
import { globalErrorHandler } from "./middlewares/globalErrorHandler.ts";
import { swaggerSpec } from "./config/swagger.ts";


const app = express();

app.use(cors());
app.use(helmet({ contentSecurityPolicy: false }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get("/api/docs.json", (_req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
});

app.use('/api/v1/auth', authRouter);

// Global error handler
app.use(globalErrorHandler);

export default app;
