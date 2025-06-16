import "reflect-metadata";
import express from "express";
import { orderRouter, userRouter } from "./routes/index.route";
import { setupSwagger } from "./swagger";

export const app = express();


app.use(express.json());
app.use("/api/user", userRouter);
app.use("/api/product",orderRouter);

// setupSwagger(app);