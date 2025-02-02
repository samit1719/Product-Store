import Product from "../models/product.model.js"; // import the Product model to perform CRUD operations
import mongoose from "mongoose"; // to use the mongoose.Types.ObjectId.isValid method to check if the id is valid

export const getProducts = async (req, res) => {
    try {
      const products = await Product.find({}); // get all products from the database
      res.status(200).json({success: true, data: products}); // send the products as response
    } catch (error) {
      console.log("error in getting products:", error.message);
      res.status(500).json({success: false, message: "Server error"});
    }
  } 

export const createProduct = async (req, res) =>  {
    const product = req.body; // req.body is the data that is sent to the server from the client
  
    if(!product.name || !product.price || !product.image) {
      return res.status(400).json({success: false, message: "All fields are required"});
    }
  
    const newProduct = new Product(product); // create a new product
    
    try {
      await newProduct.save(); // save the product to the database
      res.status(201).json({success: true, data: newProduct});
    } catch (error) {
      console.log("error in creating product:", error.message);
      res.status(500).json({success: false, message: "Internal server error"});
    }
  }

export const updatedProduct = async (req, res) => { 
    const {id} = req.params;  
    const product = req.body;
  
    if(!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({success: false, message: "Invalid product id"});
    }
  
    try {
      const updatedProduct = await Product.findByIdAndUpdate(id, product, {new: true});
      res.status(200).json({success: true, data: updatedProduct});
    } catch (error) {
      res.status(500).json({success: false, message: "Internal server error"});
    }
  
  }

export const deleteProduct = async (req, res) => {
    const { id } = req.params;
    // console.log("ïd", id);
    if(!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({success: false, message: "Invalid product id"});
    }

    try {
      await Product.findByIdAndDelete(id);
      res.status(200).json({success: true , message: "Product deleted successfully"});
    }catch(error) {
      console.log("error in deleting product:", error.message);
      res.status(500).json({success: false, message: "server error"});
    }
  }