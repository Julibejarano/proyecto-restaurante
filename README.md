# Sistema de Gestión de Restaurante

Aplicación de gestión de restaurante con frontend y backend integrados, desarrollada en Vue.js con Nuxt 4.

## Funcionalidades implementadas

- Autenticación de usuarios con roles.
- Control de acceso por roles (Administrador, Maitre, Mesero, Cocinero).
- Gestión de mesas, menú y empleados.
- Registro de reservaciones con validación de cupo y horarios.
- Registro y seguimiento de pedidos.
- Notificaciones de pedidos listos y reservaciones próximas.

## Estructura del Proyecto

El código fuente principal se encuentra en la carpeta `Restaurante/`:

- `pages/` — vistas y rutas de la aplicación.
- `components/` — componentes de UI reutilizables.
- `composables/` — lógica compartida.
- `assets/` — estilos y recursos estáticos.
- `middleware/` — control de acceso y navegación.
- `server/` — backend integrado de la aplicación (Nuxt Nitro).
  - `api/` — endpoints REST para auth, mesas, reservas, menú, pedidos, etc.
  - `utils/` — conexión a PostgreSQL, utilidades de base de datos.
  - `plugins/` — inicialización de la base de datos en el arranque.
- `nuxt.config.ts` — configuración de Nuxt y variables de entorno.

## Requisitos previos

- Node.js
- PostgreSQL activo.

## Instalación y ejecución

1. Ingresa a la carpeta de la aplicación:
   ```bash
   cd Restaurante
   ```

2. Configura las variables de entorno:
   Edita el archivo `.env` dentro de la carpeta `Restaurante/` si necesitas modificar las credenciales de conexión a PostgreSQL.

3. Instala las dependencias:
   ```bash
   npm install
   ```

4. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```

## Base de datos

La aplicación utiliza PostgreSQL para la persistencia de datos. El sistema está configurado para crear las tablas necesarias automáticamente durante el arranque si no existen.

## Credenciales iniciales (Administrador)

- **Usuario:** `admin`
- **Contraseña:** `admin123`
