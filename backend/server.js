const express = require('express');
const db = require('./database');
const cors = require('cors');
const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

// Middleware de autenticación
const authenticate = (req, res, next) => {
    const token = req.headers['authorization'];
    if (token === 'mi-token-secreto') {
        next();
    } else {
        res.status(401).json({ error: 'No autorizado' });
    }
};

// Ruta de prueba
app.get('/', (req, res) => {
    res.send('Servidor de backend funcionando');
});

// Ruta para registrar un usuario
app.post('/register', (req, res) => {
    const { usuario, clave } = req.body;
    const query = `INSERT INTO usuarios (usuario, clave) VALUES (?, ?)`;

    db.run(query, [usuario, clave], function(err) {
        if (err) {
            return res.status(500).json({ error: 'Error registrando usuario' });
        }
        res.json({ id: this.lastID, message: 'Usuario registrado' });
    });
});

// Ruta para iniciar sesión
app.post('/login', (req, res) => {
    const { usuario, clave } = req.body;
    const query = `SELECT * FROM usuarios WHERE usuario = ?`;

    db.get(query, [usuario], (err, row) => {
        if (err) {
            return res.status(500).json({ error: 'Error al iniciar sesión' });
        }
        if (!row) {
            return res.status(401).json({ error: 'Usuario no registrado' });
        }

        // Comparar la clave
        if (row.clave !== clave) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        res.json({ message: 'Inicio de sesión exitoso', usuarioId: row.id });
    });
});

// Ruta para agregar una tarea
app.post('/tareas', authenticate, (req, res) => {
    const { usuario_id, tarea } = req.body;
    const fecha = new Date().toISOString();
    const query = `INSERT INTO tareas (usuario_id, tarea, fecha_creacion, fecha_modificacion) VALUES (?, ?, ?, ?)`;

    db.run(query, [usuario_id, tarea, fecha, fecha], function(err) {
        if (err) {
            return res.status(500).json({ error: 'Error al agregar la tarea' });
        }
        res.json({ id: this.lastID, message: 'Tarea agregada' });
    });
});

// Ruta para modificar una tarea
app.put('/tareas/:id', authenticate, (req, res) => {
    const { id } = req.params;
    const { tarea } = req.body;
    const fechaModificacion = new Date().toISOString();
    const query = `UPDATE tareas SET tarea = ?, fecha_modificacion = ? WHERE id = ?`;

    db.run(query, [tarea, fechaModificacion, id], function(err) {
        if (err) {
            return res.status(500).json({ error: 'Error al modificar la tarea' });
        }
        res.json({ message: 'Tarea modificada' });
    });
});

// Ruta para obtener todas las tareas de un usuario
app.get('/tareas/:usuario_id', authenticate, (req, res) => {
    const { usuario_id } = req.params;
    const query = `SELECT * FROM tareas WHERE usuario_id = ?`;

    db.all(query, [usuario_id], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: 'Error al obtener las tareas' });
        }
        res.json(rows);
    });
});

// Ruta para eliminar una tarea
app.delete('/tareas/:id', authenticate, (req, res) => {
    const { id } = req.params;
    const query = `DELETE FROM tareas WHERE id = ?`;

    db.run(query, [id], function(err) {
        if (err) {
            return res.status(500).json({ error: 'Error al eliminar la tarea' });
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: 'Tarea no encontrada' });
        }
        res.json({ message: 'Tarea eliminada' });
    });
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
