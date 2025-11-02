import pool from '../config/db.js';

export const createOrder = async (req, res) => {
  const client = await pool.connect();

  try {
    const { user_id, items } = req.body;

    // 🔒 Validación básica
    if (!user_id || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Datos inválidos' });
    }

    // 🧮 Calcular total (soporta "precio" o "price")
    const total = items.reduce(
      (sum, i) => sum + Number(i.precio || i.price || 0) * (i.quantity || 1),
      0
    );

    await client.query('BEGIN');

    // 🧾 Insertar orden
    const orderResult = await client.query(
      `INSERT INTO orders (user_id, fecha, total)
       VALUES ($1, NOW(), $2)
       RETURNING id`,
      [user_id, total]
    );

    const orderId = orderResult.rows[0].id;

    // 🛒 Insertar detalles (acepta item.id o item.product_id)
    for (const item of items) {
      const productId = item.product_id || item.id;
      const price = Number(item.precio || item.price || 0);
      const quantity = item.quantity || 1;

      if (!productId) {
        console.warn('⚠️ Producto sin ID válido, se omitió:', item);
        continue;
      }

      await client.query(
        `INSERT INTO order_details (order_id, product_id, quantity, price)
         VALUES ($1, $2, $3, $4)`,
        [orderId, productId, quantity, price]
      );
    }

    // 🧹 Vaciar carrito solo si todo salió bien
    await client.query('DELETE FROM cart WHERE user_id = $1', [user_id]);

    await client.query('COMMIT');
    res.status(201).json({ message: '✅ Compra registrada con éxito', orderId });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Error al crear pedido:', error);
    res.status(500).json({ message: 'Error al crear pedido' });
  } finally {
    client.release();
  }
};
