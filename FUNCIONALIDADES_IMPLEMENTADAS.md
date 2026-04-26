# Documentación de Funcionalidades Implementadas
**Proyecto: Gestión de Restaurante**

Este documento detalla todas las funcionalidades (obligatorias y adicionales) que han sido implementadas en el sistema de gestión del restaurante, cumpliendo estrictamente con los requerimientos definidos en los documentos técnicos base.

---

## 📌 1. Casos de Uso Obligatorios Implementados

Según la rúbrica del proyecto, se exigía la implementación de al menos tres (3) casos de uso obligatorios. Nuestro sistema **supera este requisito implementando cinco (5) casos de uso** robustos:

### 1.1 Gestión de Mesas
- **Rol:** Administrador (`admin`)
- **Funcionamiento:** Permite registrar la infraestructura física del restaurante. El administrador ingresa el número identificador de la mesa y la capacidad máxima de personas que puede soportar. Se puede visualizar un listado en tiempo real y eliminar mesas si el local es reconfigurado.

### 1.2 Gestión de Reservaciones
- **Rol:** Maitre (`maitre`)
- **Funcionamiento:** Permite agendar visitas de clientes. Al registrar la reserva, el sistema:
  1. Filtra dinámicamente las mesas para ofrecer solo aquellas cuya capacidad pueda acomodar al grupo de personas.
  2. Bloquea reservas si la mesa seleccionada ya está ocupada en ese intervalo (duración estándar de 2 horas).
  3. Muestra una vista visual interactiva (mapa) con el estado de todas las mesas.

### 1.3 Gestión del Menú
- **Rol:** Administrador (`admin`)
- **Funcionamiento:** Administra la oferta gastronómica. Cada plato o bebida se registra especificando su nombre, precio, descripción, tiempo de preparación y, lo más importante, su **Categoría** (Entrada, Plato Fuerte, Bebida o Postre). Esta clasificación es vital para la lógica de enrutamiento en la cocina.

### 1.4 Registro de Pedidos
- **Rol:** Mesero (`mesero`)
- **Funcionamiento:** El mesero tiene acceso a un catálogo digital interactivo donde puede abrir una cuenta para una mesa específica. Puede ir sumando unidades de diferentes platos al pedido. Una vez confirmado, el pedido se guarda en base de datos bajo el estado `en_preparacion` e inicia su ciclo de vida.

### 1.5 Gestión de Entregas (Flujo KDS - Kitchen Display System)
- **Roles:** Mesero y Cocinero (`mesero`, `cocinero`)
- **Funcionamiento:** Flujo bidireccional inteligente:
  - **En Cocina:** El cocinero inicia sesión y el sistema filtra los pedidos activos mostrando *únicamente* los platos correspondientes a su **especialidad** (Ej. El parrillero solo ve los platos fuertes). Cuando el plato está preparado, el cocinero lo marca con el botón "Listo".
  - **En Sala:** El estado del pedido se actualiza instantáneamente para el Mesero, indicando que puede ser recogido en barra. Finalmente, el mesero lo marca como `entregado` cerrando el ciclo.

---

## ⭐ 2. Funcionalidades Adicionales Implementadas

El proyecto requería la "Interfaz de usuario" como obligatoria, más un mínimo de tres (3) funcionalidades extra del listado. Nuestro sistema **implementa cuatro (4)** funcionalidades extra, garantizando la máxima calificación.

### 2.1 Interfaz de Usuario (Requisito Obligatorio)
- **Descripción:** Se diseñó una interfaz gráfica "Premium" utilizando **Vue 3, Nuxt 4 y TailwindCSS v4**. Emplea principios de *Glassmorphism* (fondos difuminados, transparencias), retroalimentación visual en cada botón, iconos dinámicos (Lucide) y separaciones claras por roles en la barra lateral.

### 2.2 Gestión de Empleados (Adicional 1)
- **Descripción:** Panel de administración de personal (CRUD de usuarios) accesible por el Administrador.
- **Funcionamiento:** Permite crear credenciales cifradas (SHA-256) para nuevos miembros del staff. Si se selecciona el rol de "Cocinero", la interfaz muta dinámicamente exigiendo que se le asigne una especialidad obligatoria (Entrada, Plato Fuerte, Bebida o Postre) para mantener la integridad de la cocina.

### 2.3 Validación de Cupo Matemática (Adicional 2)
- **Descripción:** Motor de reglas de negocio que protege la capacidad máxima del local.
- **Funcionamiento:** El sistema de reservas (`server/api/reservas/index.post.ts`) realiza una doble validación transaccional:
  1. **Validación Individual:** Impide que el Maitre asigne un grupo de personas a una mesa física que no los soporta (Ej. 6 personas en mesa de 4).
  2. **Validación Global:** Suma todas las reservas activas en ese rango horario y verifica contra la suma total de asientos del restaurante (exactamente 50 cupos). Si la nueva reserva rompe el aforo máximo de 50, la transacción en base de datos es rechazada.

### 2.4 Historial de Clientes (Adicional 3)
- **Descripción:** Un motor de búsqueda y auditoría de consumos.
- **Funcionamiento:** Se habilitó la vista `/dashboard/clientes` para el Admin y el Maitre. Cuenta con un buscador donde al ingresar el nombre del cliente, el sistema consulta de forma concurrente el historial de `reservas` y `pedidos` asociados a esa persona. Muestra los resultados en dos líneas de tiempo cronológicas con detalles como la mesa ocupada, los platos exactos ordenados y la fecha/hora.

### 2.5 Sistema Automático de Notificaciones (Adicional 4)
- **Descripción:** Alertas visuales flotantes sincronizadas con la base de datos sin necesidad de intervención manual o recarga de la página (implementado vía polling inteligente).
- **Funcionamiento:** 
  - **Maitre:** El sistema analiza en segundo plano el reloj interno. Si detecta que una reservación está a 30 minutos (o menos) de iniciar, empuja una alerta visual en pantalla avisándole al Maitre que prepare la mesa del cliente.
  - **Mesero:** Si el estado de un pedido es actualizado por un cocinero al estado `listo`, la terminal del mesero lanza una ventana emergente color verde con una campana saltando indicándole exactamente qué mesa tiene comida pendiente por entregar, agilizando enormemente el servicio.
