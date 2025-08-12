import express from 'express';
import { createProduct, deleteProduct, getProducts, updatedProduct } from '../controllers/product.controller.js';

const router = express.Router();  

  router.post("/", createProduct); // create a new product in the database 
  router.get("/", getProducts); // get all products from the database
  router.put("/:id", updatedProduct); // update a product in the database
  router.delete("/:id", deleteProduct); // delete a product from the database

export default router;  