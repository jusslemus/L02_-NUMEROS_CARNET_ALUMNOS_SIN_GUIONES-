
CREATE DATABASE "blogDB";

DROP TABLE IF EXISTS calificaciones CASCADE;
DROP TABLE IF EXISTS comentarios CASCADE;
DROP TABLE IF EXISTS publicaciones CASCADE;
DROP TABLE IF EXISTS usuarios CASCADE;
DROP TABLE IF EXISTS roles CASCADE;

CREATE TABLE roles (
    rolId   SERIAL PRIMARY KEY,
    rol     VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE usuarios (
    usuarioId       SERIAL PRIMARY KEY,
    rolId           INTEGER NOT NULL REFERENCES roles(rolId),
    nombreUsuario   VARCHAR(50) NOT NULL UNIQUE,
    clave           VARCHAR(255) NOT NULL,
    nombre          VARCHAR(100) NOT NULL,
    apellido        VARCHAR(100) NOT NULL
);

CREATE TABLE publicaciones (
    publicacionId   SERIAL PRIMARY KEY,
    titulo          VARCHAR(150) NOT NULL,
    descripcion     VARCHAR(1000),
    usuarioId       INTEGER NOT NULL REFERENCES usuarios(usuarioId)
);

CREATE TABLE comentarios (
    comentarioId    SERIAL PRIMARY KEY,
    publicacionId   INTEGER NOT NULL REFERENCES publicaciones(publicacionId) ON DELETE CASCADE,
    comentario      VARCHAR(500) NOT NULL,
    usuarioId       INTEGER NOT NULL REFERENCES usuarios(usuarioId)
);

CREATE TABLE calificaciones (
    calificacionId  SERIAL PRIMARY KEY,
    publicacionId   INTEGER NOT NULL REFERENCES publicaciones(publicacionId) ON DELETE CASCADE,
    usuarioId       INTEGER NOT NULL REFERENCES usuarios(usuarioId),
    calificacion    INTEGER NOT NULL CHECK (calificacion BETWEEN 1 AND 5)
);

INSERT INTO roles (rol) VALUES ('Administrador'), ('Editor'), ('Lector');

INSERT INTO usuarios (rolId, nombreUsuario, clave, nombre, apellido) VALUES
(1, 'admin',  '123456', 'Ana',   'Martínez'),
(2, 'carlos', '123456', 'Carlos','López'),
(3, 'maria',  '123456', 'María', 'Hernández'),
(3, 'jose',   '123456', 'José',  'Martínez');

INSERT INTO publicaciones (titulo, descripcion, usuarioId) VALUES
('Introducción a Node.js', 'Primeros pasos con Node y Express', 1),
('Qué es PostgreSQL',      'Conceptos básicos de bases de datos', 2),
('Guía de Web API',        'Cómo diseñar endpoints REST', 2);

INSERT INTO comentarios (publicacionId, comentario, usuarioId) VALUES
(1, 'Muy buena explicación', 3),
(1, 'Gracias por compartir', 4),
(1, 'Esperando la parte 2',  2),
(2, 'Me sirvió mucho',       3),
(3, 'Excelente guía',        4);

INSERT INTO calificaciones (publicacionId, usuarioId, calificacion) VALUES
(1, 3, 5), (1, 4, 4), (2, 3, 5), (3, 4, 3);

