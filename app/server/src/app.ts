import express from "express";
import cors from "cors";
import helmet from "helmet";
import { httpResponse } from "./utils/httpResponse.ts";

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

export default app;
