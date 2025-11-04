import db from "./DB/config.js";


//get some product for render in home page
const getRandomProduct = async () => {
    // const Text = "SELECT * FROM products WHERE id BETWEEN $1 AND $2";
    const Text = "SELECT * FROM products";
    const result = await db.query(Text);
    return result.rows
}

//get specified product detail
const getSpecifiedProduct = async (product_id)=>{
    const Text = "SELECT * FROM products WHERE id = $1";
    const result = await db.query(Text,[product_id]);
    return result.rows[0]
}

//get name of category 
const getNameOfCategory = async (category_id) =>{
    const Text = "SELECT * FROM categories WHERE id = $1";
    const result = await db.query(Text,[category_id]);
    return result.rows[0].name
}

//get searched products with category
const searchByCategories = async (category_id) => {
    const Text = "SELECT * FROM products WHERE category_id = $1";
    const result = await db.query(Text,[category_id]);
    return result.rows
}

// get count of products in category page
const getCountOfProducts = async (condition) => {
    const Text = "SELECT * FROM products WHERE category_id = $1";
    const result = await db.query(Text,[condition]);
    return result.rowCount
}

//login and sign up page queries
//get user information from database
const getUserinformation = async (email)=>{
    const Text = "SELECT password FROM users WHERE email = $1";
    const result = await db.query(Text,[email]);
    return result.rows
}

//add new user to database
const postUser = async (name,email,password)=>{
    const Text = "INSERT INTO users (name,email,password) VALUES ($1,$2,$3)";
    const result = await db.query(Text,[name,email,password]);
    return result.rows
}

//find user with email
const findUser = async (email)=>{
    const Text = "SELECT * FROM users WHERE email = $1";
    const result = await db.query(Text,[email]);
    return result.rows
}

//product reviews
const productReviews = async (product_id)=>{
    const Text = "SELECT reviews FROM products WHERE id = $1";
    const result = await db.query(Text,[product_id]);
    return result.rows
}


//get products specification 
const getProductSpecifications = async (product_id)=>{
    const Text = "SELECT s.name AS specification_name, ps.value FROM product_spec ps JOIN specifications s ON ps.specification_id = s.id WHERE ps.product_id = $1;";
    const result1 = await db.query(Text,[product_id]);
    // const Text2 = "SELECT name FROM specifications WHERE id = $1"
    // const result2 = await db.query(Text2,[result1.rows[0]])
    // return 
    return result1.rows
}

//get variant of product with color and storage index
const getVariantByAttributes = async (product_id, attribute_value_ids) =>{
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
const getProductStorages = async (product_id) =>{
    const Text = "SELECT score FROM products WHERE id = $1";
    const result = await db.query(Text,[product_id]);
    return result.rows
}

//initials queries
const queries = {searchByCategories,getCountOfProducts,getNameOfCategory,
    getRandomProduct,getSpecifiedProduct,getUserinformation,
    postUser,findUser,productReviews,getProductSpecifications,
    getVariantByAttributes,getProductStorages
}

//export queries
export default queries;