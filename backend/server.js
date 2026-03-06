// const express = require('express');
import express from "express";
import dotenv from "dotenv";
import { connectDB } from './config/db.js';  
import productRoutes from "./routes/product.route.js";
import path from "path";

dotenv.config(); // to use environment variables

const app = express(); // create an express app
const PORT = process.env.PORT || 5000; // set the port for the server
const __dirname = path.resolve(); // get the current directory name

app.use(express.json()); // to parse json to javascript object from the request body
app.use("/api/products", productRoutes); // use the product routes for all routes starting with /api/products

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "frontend/dist"))); // serve static files from the frontend dist folder
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html")); // send the index.html file for all routes
  });
}

app.listen(PORT, () => {
  connectDB();
  console.log("Server Started at http://localhost:" + PORT); 
});





