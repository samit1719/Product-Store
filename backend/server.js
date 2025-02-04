// const express = require('express');
import express from "express";
import dotenv from "dotenv";
import { connectDB } from './config/db.js';
import productRoutes from "./routes/product.route.js";

dotenv.config(); // to use environment variables

const app = express(); // create an express app
const PORT = process.env.PORT || 5000; // set the port for the server

app.use(express.json()); // to parse json to javascript object from the request body
app.use("/api/products", productRoutes); // use the product routes for all routes starting with /api/products


app.listen(PORT, () => {
  connectDB();
  console.log("Server Started at http://localhost:" + PORT);
});



