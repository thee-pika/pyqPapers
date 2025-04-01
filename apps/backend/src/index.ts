import express from "express";
import { config } from "dotenv";
import cors from "cors";
import { authRouter } from "./router/v1/authRouter.js";
import { pyqRouter } from "./router/v1/pyqRouter.js";
import "./jobs/expiration.js";

config();

const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

app.use(cors());

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/paper", pyqRouter);

app.get("/", (req, res) => {
  res.send("backend is saying hii!!");
});

app.listen(PORT, () => {
  console.log("App is listening to", PORT);
});
