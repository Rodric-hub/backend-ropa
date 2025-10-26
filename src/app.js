import express from 'express';
import sequelize from './config/db.js';
import productoRoutes from './routes/productoRoutes.js';

const app = express();
app.use(express.json());
app.use('/api/productos', productoRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Servidor corriendo en puerto ${process.env.PORT}`);
});
