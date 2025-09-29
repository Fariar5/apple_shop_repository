import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());


const PORT = process.env.port || 3000;


app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));