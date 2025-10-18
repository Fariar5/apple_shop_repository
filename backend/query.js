import express from "express";
import db from "./DB/config.js";


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
const queries = {searchByCategories,getCountOfProducts,getNameOfCategory}
//export queries
export default queries;