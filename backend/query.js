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

const getAllProducts = async () =>{
    Text = ""
    db.query(Text)
}


//initials queries
const queries = {searchByCategories,getCountOfProducts,getNameOfCategory,getRandomProduct,getSpecifiedProduct}
//export queries
export default queries;