import express from "express";
import bodyParser from "body-parser";
import { fileURLToPath } from 'url';
import path from 'path';
import cors from "cors";
import dotenv from "dotenv";
import db from "./DB/config.js";
import queries from "./query.js";
import bcrypt from "bcrypt";
import cookieParser from "cookie-parser";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import { totalmem } from "os";

dotenv.config()

const app = express()
const port = process.env.PORT;
const saltRounds = 10;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//connect-pg-simple 
const pgSession = connectPgSimple(session);


app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));
app.set('views', path.join(__dirname, '../frontend'));
app.use(cors());
app.use(cookieParser());

app.use(
    session({
        store: new pgSession({
            pool: db,
            tableName: "session"
        }),
        secret: "mysecret",         // sessionID
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 1000 * 60 * 60, // 30 minutes
            httpOnly: true,
            secure: false,
            sameSite: "lax",
        },
    })
)

app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    next();
});


app.get("/", async (req, res) => {
    try {
        const products = await queries.getRandomProduct(1,8)
        const randomProducts = await queries.getRandomProduct(1,4)
        res.render("index.ejs", { content: products ,randomContent:randomProducts})
    } catch (err) {
        res.status(500)
    }
})


app.get("/login_signup", (req, res) => {
    res.render("login_signup.ejs")
})

app.post("/login", async (req, res) => {
    const { name, email1, pass1 } = req.body;
    try {
        if (!email1 || !pass1) return res.status(400).json({ message: 'Email and password required' });

        const existingUser = await queries.findUser(email1)
        //check user if not exist
        if (!existingUser[0]) return res.json({ message: "User not exist! please sign up." })
        const match = await bcrypt.compare(pass1, existingUser[0].password)

        if (!match) return res.status(400)
        req.session.user = {
            id: existingUser[0].id,
            name: existingUser[0].name,
            email: existingUser[0].email
        };

        res.redirect("/")
        // res.render("index.ejs", { content: products })
        //Test1234!@#

    } catch (err) {
        console.log(err)
    }
})

app.post("/signUp", async (req, res) => {
    const { username, email, pass } = req.body
    try {
        if (!email || !pass) return res.status(400).json({ message: 'Email and password required' });
        if (pass.length < 8) {
            return res.status(400).json({ message: 'Password must be at least 8 characters' });
        }

        //check user if exist
        const existingUser = await queries.findUser(email)
        if (existingUser > 0) return res.json({ message: "Email allready exist." })

        //hash password
        const hash = await bcrypt.hash(pass, saltRounds);
        await queries.postUser(username, email, hash);

        res.redirect("/")

    } catch (err) {
        res.status(500).send("server error...")
    }
})

//add product to shopping card
app.get("/:variantId/add-to-cart", async (req, res) => {
    const id = parseInt(req.params.variantId)
    try {
        const activeCartId = await queries.findActiveCart(res.locals.user.id)
        if (!activeCartId) activeCartId = await queries.createActiveCart(res.locals.user.id)

        const price = await queries.getVariantPrice(id)

        const findProductCart = await queries.findCartsProduct(activeCartId[0].id, id)
        if (findProductCart) {
            const addProductToCart = await queries.increaseProductQuantity(findProductCart.id)
        } else {
            const addProductToCart = await queries.addProductToCart(activeCartId[0].id, id, price)
        }

    } catch (err) {
        console.log(err)
    }
})

app.get("/shoppingCard", async (req, res) => {
    const cart_id = await queries.findActiveCart(res.locals.user.id)

    try {
        const getCartProducts = await queries.getCartItemsList(cart_id[0].id)
        let totalPrice = 0;
        getCartProducts.forEach(item=>{
            totalPrice += item.price
        })
        res.render("p1/index.ejs", { content: getCartProducts , totalPrice:totalPrice})
    } catch (err) {
        console.log(err)

    }
})

//remove cart item from shopping cart
app.get("/removeItem/:id", async (req, res) => {

    try {
        const id = parseInt(req.params.id);
        const removeItem = await queries.deleteShoppingItem(id)
        
        res.redirect('/shoppingCard')
    } catch (err) {
        console.log(err)
    }
})

app.get('/verifyAddres',async(req,res)=>{
    res.render('p2/index.ejs')
})

app.get('/shipmentMethod',async(req,res)=>{
    res.render('p3/index.ejs')
})

app.get('/payment',async(req,res)=>{
    const cart_id = await queries.findActiveCart(res.locals.user.id)
    try{
        const getCartProducts = await queries.getCartItemsList(cart_id[0].id)
        let totalPrice = 0;
        getCartProducts.forEach(item=>{
            totalPrice += item.price
        })
        console.log(getCartProducts)
        res.render('p4/index.ejs',{content: getCartProducts , totalPrice:totalPrice})
    }catch(err){}
})


//go to product page when press buy now btn
app.get("/product/:id", async (req, res) => {
    const id = parseInt(req.params.id)

    try {
        const getproductdetail = await queries.getProductSpecifications(id)

        console.log(id)
        const comments = await queries.getComments(id)
        const variant = await queries.getVariantByAttributes(id, [2, 10]);
        const getSpecifiedProduct = await queries.getSpecifiedProduct(id);

        //render file with data
        res.render("product.ejs", { content: getSpecifiedProduct, detail: getproductdetail ,variant:variant,comments:comments})
    } catch (err) {
        console.log(err)
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
