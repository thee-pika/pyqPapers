import express from "express";
import { config } from "dotenv";
import cors from "cors";
config();

const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
    res.send("backend is saying hii!!");
})

app.listen(PORT, () => {
    console.log("App is listening to", PORT)
})