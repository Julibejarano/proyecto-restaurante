const { Client } = require('pg');
const client = new Client({ connectionString: 'postgres://juliana:juliana2004@localhost:5432/restaurant_db' });
async function test() {
  await client.connect();
  try {
    const res = await client.query(`
      SELECT p.id, p.mesa_id, m.numero AS mesa_numero, p.cliente, p.estado, p.creado_en, p.actualizado_en,
        COALESCE(json_agg(json_build_object('id', pi.id, 'item_menu_id', pi.item_menu_id, 'nombre', mi.nombre, 'categoria', mi.categoria, 'cantidad', pi.cantidad, 'estado', pi.estado)) FILTER (WHERE pi.id IS NOT NULL), '[]') AS items
       FROM pedidos p
       JOIN mesas m ON m.id = p.mesa_id
       LEFT JOIN pedido_items pi ON pi.pedido_id = p.id
       LEFT JOIN menu_items mi ON pi.item_menu_id = mi.id
       GROUP BY p.id, m.numero
       ORDER BY p.creado_en ASC
    `);
    console.log('Success:', res.rows.length);
  } catch (err) {
    console.error('Error:', err.message);
  }
  process.exit(0);
}
test();
