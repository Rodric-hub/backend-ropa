import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import orderRoutes from './routes/orders.routes.js';

import productRoutes from "./routes/products.routes.js";
import userRoutes from "./routes/user.routes.js";
import cartRoutes from "./routes/cart.routes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Rutas
app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);

// Puerto
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
