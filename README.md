# L02 - Web API Blog (Node.js + Express + PostgreSQL)

Web API para la base de datos `blogDB` (roles, usuarios, publicaciones, comentarios y calificaciones).

**Integrantes:** _(nombres completos de los dos alumnos)_

## Requisitos

- Node.js 18 o superior
- PostgreSQL

## Instalación

1. Crear la base de datos en PostgreSQL (DBeaver): `CREATE DATABASE "blogDB";`
2. Ejecutar el script `database/blogDB.sql` sobre la base `blogDB`.
3. Copiar `.env.example` a `.env` y ajustar usuario y contraseña de PostgreSQL.
4. Instalar dependencias y arrancar:

```bash
npm install
npm start        # o: npm run dev (reinicia al guardar)
```

El servidor queda en `http://localhost:3000`.

## Estructura

```
src/
  config/db.js            # conexión a PostgreSQL (pool)
  routes/                 # definición de endpoints
  controllers/            # lógica de cada recurso
  middlewares/
    validate.js           # validación de ids, textos y body
    errorHandler.js       # 404 y manejo centralizado de errores
  utils/                  # AppError, asyncHandler, ensureExists
  app.js / server.js
database/blogDB.sql       # tablas y datos de prueba
```

## Endpoints

### Usuarios — `/api/usuarios`
| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/usuarios` | Listar todos |
| GET | `/api/usuarios/:id` | Buscar por ID |
| POST | `/api/usuarios` | Crear |
| PUT | `/api/usuarios/:id` | Actualizar |
| DELETE | `/api/usuarios/:id` | Eliminar |
| GET | `/api/usuarios/nombre/:nombre` | Filtrar por nombre |
| GET | `/api/usuarios/apellido/:apellido` | Filtrar por apellido |
| GET | `/api/usuarios/rol/:rolId` | Filtrar por rol |

Body (POST/PUT): `{ "rolId": 3, "nombreUsuario": "pedro", "clave": "123456", "nombre": "Pedro", "apellido": "Gómez" }`
(En PUT la `clave` es opcional.)

### Publicaciones — `/api/publicaciones`
| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/publicaciones` | Listar todas |
| GET | `/api/publicaciones/:id` | Buscar por ID |
| POST | `/api/publicaciones` | Crear |
| PUT | `/api/publicaciones/:id` | Actualizar |
| DELETE | `/api/publicaciones/:id` | Eliminar |
| GET | `/api/publicaciones/usuario/:usuarioId` | Publicaciones de un usuario |
| GET | `/api/publicaciones/top/:n` | TOP N con más comentarios (incluye `cantidadComentarios`) |

Body (POST/PUT): `{ "titulo": "Mi post", "descripcion": "Texto", "usuarioId": 1 }`

### Comentarios — `/api/comentarios`
| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/comentarios` | Listar todos |
| GET | `/api/comentarios/:id` | Buscar por ID |
| POST | `/api/comentarios` | Crear |
| PUT | `/api/comentarios/:id` | Actualizar |
| DELETE | `/api/comentarios/:id` | Eliminar |
| GET | `/api/comentarios/publicacion/:publicacionId` | Comentarios de una publicación |
| GET | `/api/comentarios/usuario/:usuarioId` | Comentarios de un usuario |

Body (POST/PUT): `{ "publicacionId": 1, "comentario": "Buen post", "usuarioId": 3 }`

### Roles — `/api/roles`
`GET /api/roles` lista los roles (útil para conocer el `rolId`).

## Manejo de errores

Todas las respuestas de error tienen el mismo formato:

```json
{ "ok": false, "status": 400, "message": "Datos inválidos", "details": ["\"nombre\" es obligatorio"] }
```

- `400` datos inválidos / ids mal formados / llave foránea inexistente
- `404` recurso o ruta no encontrada
- `409` valor único repetido o registro con datos relacionados al eliminar
- `500` error interno
