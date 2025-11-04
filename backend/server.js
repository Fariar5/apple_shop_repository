import express from "express";
import bodyParser from "body-parser";
import { fileURLToPath } from 'url';
import path from 'path';
import cors from "cors";
import dotenv from "dotenv";
import db from "./DB/config.js";
import queries from "./query.js";
import bcrypt from "bcrypt";

dotenv.config()

const app = express()
const port = process.env.PORT;
const saltRounds = 10;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));
app.set('views', path.join(__dirname, '../frontend'));
app.use(cors());




app.get("/", async (req, res) => {
    try {
        const products = await queries.getRandomProduct()
        res.render("index.ejs", { content: products })
    } catch (err) {
        res.status(500)
    }
})


app.get("/login_signup", (req, res) => {
    res.render("login_signup.ejs")
})

// app.get("/login_signup/login", (req, res) => {
//     const { name, email, pass } = req.body
//     try {
//         if (!email || !pass) return res.status(400).json({ message: 'Email and password required' });


//     } catch (err) { }
// })

app.post("/signUp", async (req, res) => {
    const { username, email, pass } = req.body
    try {
        if (!email || !pass) return res.status(400).json({ message: 'Email and password required' });
        if (pass.length < 8) {
            return res.status(400).json({ message: 'Password must be at least 8 characters' });
        }
        const hash = await bcrypt.hash(pass, saltRounds);
        await queries.postUser(username, email, hash);

        res.redirect("/")

    } catch (err) {
        res.status(500).send("server error...")
    }
})

//go to product page when press buy now btn
app.get("/product/:id", async (req, res) => {
    const id = parseInt(req.params.id)
    try {
        const getproductdetail = await queries.getProductSpecifications(id)
        
        const variant = await queries.getVariantByAttributes(id, [1, 4]);
        const getSpecifiedProduct = await queries.getSpecifiedProduct(id);

        //render file with data
        res.render("product.ejs", { content: getSpecifiedProduct, detail: getproductdetail, variant: variant })
    } catch (err) {
     }
})


app.get("/category/:id", async (req, res) => {
    const id = parseInt(req.params.id)

    try {
        const searchByCategory = await queries.searchByCategories(id);
        const count = await queries.getCountOfProducts(id)
        const categoryName = await queries.getNameOfCategory(id)

        res.render("category.ejs", { products: searchByCategory, count: count, categoryName: categoryName })
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
