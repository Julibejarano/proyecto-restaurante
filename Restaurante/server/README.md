# Backend integrado

Este directorio contiene la parte de backend de la aplicación dentro del proyecto Nuxt.

## Estructura

- `api/` — endpoints REST del servidor.
  - `auth/` — login, registro y sesión.
  - `mesas/` — gestión de mesas.
  - `reservas/` — gestión de reservaciones.
  - `menu/` — gestión del menú.
  - `pedidos/` — gestión de pedidos.
  - `reportes/` — estadísticas y reportes para administración.
  - `notifications/` — notificaciones simples.
  - `users/` — datos de empleados y usuarios.

- `utils/` — utilidades de backend.
  - `db.ts` — inicialización y consultas PostgreSQL.
  - `auth.ts` — hashing de contraseñas y JWT.

- `plugins/` — plugins de Nitro.
  - `db.server.ts` — inicializa el esquema y los datos en el arranque.

## Cómo funciona

Al iniciar el proyecto con `npm run dev`, Nuxt carga el backend integrado desde `backend/` y expone los endpoints bajo `/api/*`.

- Frontend consume estas rutas con llamadas HTTP locales.
- Backend maneja la conexión PostgreSQL, la creación de tablas y la semilla inicial de datos.

## Nota

Aunque la aplicación está dentro de un único proyecto Nuxt, la distinción entre frontend y backend está en las carpetas:

- Frontend: `pages/`, `components/`, `composables/`, `assets/`, `middleware/`.
- Backend: `backend/api/`, `backend/utils/`, `backend/plugins/`.
