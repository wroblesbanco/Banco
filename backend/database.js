const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(':memory:');

// Crear tablas
db.serialize(() => {
    // Crear tabla de usuarios
    db.run(`CREATE TABLE IF NOT EXISTS usuarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        usuario TEXT NOT NULL UNIQUE,
        clave TEXT NOT NULL
    )`);

    // Crear tabla de tareas
    db.run(`CREATE TABLE IF NOT EXISTS tareas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        usuario_id INTEGER,
        tarea TEXT NOT NULL,
        fecha_creacion TEXT NOT NULL,
        fecha_modificacion TEXT,
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
    )`);
});

module.exports = db;
