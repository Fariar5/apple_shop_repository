import express from "express";
import bodyParser from "body-parser";
import { fileURLToPath } from 'url';
import path from 'path';
import cors from "cors";
import dotenv from "dotenv";
import db from "./DB/config.js";
import queries from "./query.js";

dotenv.config()

const app = express()
const port = process.env.PORT;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));
app.set('views', path.join(__dirname, '../frontend'));
app.use(cors());




app.get("/", async (req, res) => {
    try {
        const selecetRandomProduct = await db.query("SELECT * FROM products")
        res.render("index.ejs", { content: selecetRandomProduct.rows })
    } catch (err) {
        res.status(500)
    }
})


app.get("/login", (req, res) => {
    res.render("login_signup.ejs")
})


app.get("/category/:id", async (req, res) => {
    const id = parseInt(req.params.id)

    try {
        const selectspecifiedproduct = await queries.searchByCategories(id);
        const count = await queries.getCountOfProducts(id)
        const categoryName = await queries.getNameOfCategory(id)

        res.render("category.ejs", { products: selectspecifiedproduct , count: count , categoryName : categoryName})
    } catch (err) {
        console.error("Error in /category/:id:", err);
        res.status(500).send("Server error");
    }
})


app.get("/product/:id", async (req, res) => {
    const id = parseInt(req.params.id)

    try {
        const product = await db.query("SELECT * FROM products WHERE id=$1", [id])
        res.render("product.ejs", { content: product.rows[0] })
    } catch (err) {
        res.status(500)
    }
})




app.listen(port, () => {
    console.log(`running on http://localhost:${port}`)
});
