import express from "express";
import bodyParser from "body-parser";
import { fileURLToPath } from 'url';
import path from 'path';
import cors from "cors";
import dotenv from "dotenv";


dotenv.config()


const app = express()
const port = process.env.PORT;


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);



app.use(bodyParser.urlencoded({extended:true}));
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));
app.set('views', path.join(__dirname, '../frontend'));
app.use(cors());


app.get("/",(req,res)=>{
    res.render("../frontend/index.ejs")
})


app.get("")


app.listen(port , ()=>{
    console.log(`running on http://localhost:${port}`)
})