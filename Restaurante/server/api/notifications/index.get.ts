import { query } from '~/server/utils/db'

export default defineEventHandler(async () => {
  const readyOrders = await query(
    `SELECT p.id, m.numero AS mesa_numero FROM pedidos p JOIN mesas m ON m.id = p.mesa_id WHERE p.estado = 'listo' ORDER BY p.actualizado_en DESC LIMIT 3`,
  )
  const upcomingReservations = await query(
    `SELECT r.id, r.cliente, m.numero AS mesa_numero, r.fecha_hora FROM reservas r JOIN mesas m ON m.id = r.mesa_id WHERE r.fecha_hora > NOW() AND r.fecha_hora < NOW() + interval '1 hour' ORDER BY r.fecha_hora LIMIT 3`,
  )

  const notifications = []
  readyOrders.forEach((order: any) => {
    notifications.push({ id: `pedido-${order.id}`, text: `Pedido listo para mesa ${order.mesa_numero}` })
  })
  upcomingReservations.forEach((reserva: any) => {
    notifications.push({ id: `reserva-${reserva.id}`, text: `Reservación próxima de ${reserva.cliente} para mesa ${reserva.mesa_numero}` })
  })

  return notifications
})
