import db from "./DB/config.js";


//get some product for render in home page
const getRandomProduct = async (firstid,secondid) => {
    // const Text = "SELECT * FROM products WHERE id BETWEEN $1 AND $2";
    const Text = "SELECT * FROM products WHERE id BETWEEN $1 AND $2";
    const result = await db.query(Text,[firstid,secondid]);
    return result.rows
}

//get specified product detail
const getSpecifiedProduct = async (product_id) => {
    const Text = "SELECT * FROM products WHERE id = $1";
    const result = await db.query(Text, [product_id]);
    return result.rows[0]
}

//get name of category 
const getNameOfCategory = async (category_id) => {
    const Text = "SELECT * FROM categories WHERE id = $1";
    const result = await db.query(Text, [category_id]);
    return result.rows[0]
}

//get searched products with category
const searchByCategories = async (category_id) => {
    const Text = "SELECT * FROM products WHERE category_id = $1";
    const result = await db.query(Text, [category_id]);
    return result.rows
}

// get count of products in category page
const getCountOfProducts = async (condition) => {
    const Text = "SELECT * FROM products WHERE category_id = $1";
    const result = await db.query(Text, [condition]);
    return result.rowCount
}

//login and sign up page queries
//get user information from database
const getUserinformation = async (email) => {
    const Text = "SELECT password FROM users WHERE email = $1";
    const result = await db.query(Text, [email]);
    return result.rows
}

//add new user to database
const postUser = async (name, email, password) => {
    const Text = "INSERT INTO users (name,email,password) VALUES ($1,$2,$3)";
    const result = await db.query(Text, [name, email, password]);
    return result.rows
}

//find user with email
const findUser = async (email) => {
    const Text = "SELECT * FROM users WHERE email = $1";
    const result = await db.query(Text, [email]);
    return result.rows
}

//product reviews
const productReviews = async (product_id) => {
    const Text = "SELECT reviews FROM products WHERE id = $1";
    const result = await db.query(Text, [product_id]);
    return result.rows
}


//get products specification 
const getProductSpecifications = async (product_id) => {
    const Text = "SELECT s.name AS specification_name, ps.value FROM product_spec ps JOIN specifications s ON ps.specification_id = s.id WHERE ps.product_id = $1;";
    const result1 = await db.query(Text, [product_id]);
    return result1.rows
}

//get variant of product with color and storage index
const getVariantByAttributes = async (product_id, attribute_value_ids) => {
    const query = `
    SELECT v.*
    FROM product_variants v
    JOIN variant_attributes va ON va.variant_id = v.id
    WHERE v.product_id = $1
    GROUP BY v.id
    HAVING array_agg(va.attribute_value_id ORDER BY va.attribute_value_id) =array[$2,$3]::int[];`;

    const result = await db.query(query, [product_id, ...attribute_value_ids]);
    return result.rows[0];
}

//get storages that product had
const getProductStorages = async (product_id) => {
    const Text = "SELECT score FROM products WHERE id = $1";
    const result = await db.query(Text, [product_id]);
    return result.rows
}

//get comments for each product
const getComments = async (user_id)=>{
    const Text = "SELECT c.id AS id,c.product_id AS product_id,u.name AS username,c.text AS text FROM comments c JOIN users u ON c.user_id = u.id WHERE product_id=$1";
    const result = await db.query(Text, [user_id]);
    return result.rows
}

//shopping card queries
//find id of active cart
const findActiveCart = async (user_id) => {
    const Text = "SELECT id FROM carts WHERE user_id = $1 AND status='active' ";
    const result = await db.query(Text, [user_id]);
    return result.rows
}

//create active cart and return id
const createActiveCart = async (user_id) => {
    const Text = "INSERT INTO carts(user_id, status) VALUES ($1, 'active') RETURNING id;"
    const result = await db.query(Text, [user_id]);
    return result.rows
}

//find product in cart_items
const findCartsProduct = async (cart_id, variant_id) => {
    const Text = "SELECT id, quantity FROM cart_items WHERE cart_id = $1 AND variant_id = $2;"
    const result = await db.query(Text, [cart_id, variant_id]);
    return result.rows[0]
}

//add product to cart_items
const addProductToCart = async (cart_id, variant_id, variant_price) => {
    const Text = "INSERT INTO cart_items (cart_id,variant_id,price) SELECT $1,$2,$3 FROM product_variants WHERE id = $2"
    const result = await db.query(Text, [cart_id, variant_id, variant_price]);
    return result.rows
}

const getVariantPrice = async (variant_id) => {
    const Text = "SELECT price FROM product_variants WHERE id = $1"
    const result = await db.query(Text, [variant_id]);
    return result.rows[0].price
}
//increase the number of product in cart_items
const increaseProductQuantity = async (cart_items_id) => {
    const Text = "UPDATE cart_items SET quantity = quantity + 1 WHERE id = $1"
    const result = await db.query(Text, [cart_items_id]);
    return result.rows[0]
}

const getCartItemsList = async (cart_id) => {
    const Text = "SELECT ci.id AS cart_item_id, p.id AS product_id, pv.id AS variant_id, p.name AS name, ci.quantity AS quantity, ci.price AS price FROM product_variants pv JOIN products p ON pv.product_id = p.id JOIN cart_items ci ON pv.id = ci.variant_id WHERE cart_id = $1; "
    const result = await db.query(Text, [cart_id]);
    return result.rows
}

//delete items from shoppping cart
const deleteShoppingItem = async (cart_item_id) =>{
    const Text = "DELETE FROM cart_items WHERE id = $1"
    const result = await db.query(Text, [cart_item_id]);
}



//initials queries
const queries = {
    searchByCategories, getCountOfProducts, getNameOfCategory,
    getRandomProduct, getSpecifiedProduct, getUserinformation,
    postUser, findUser, productReviews, getProductSpecifications,
    getVariantByAttributes, getProductStorages, createActiveCart, findActiveCart,
    addProductToCart, getVariantPrice, findCartsProduct, increaseProductQuantity,
    getCartItemsList,deleteShoppingItem,getComments
}

//export queries
export default queries;