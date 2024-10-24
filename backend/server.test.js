const request = require('supertest');
const app = require('./server'); // Asegúrate de exportar tu app de express

describe('API de Tareas', () => {
    test('debería crear una nueva tarea', async () => {
        const response = await request(app)
            .post('/tareas')
            .send({ usuario_id: 1, tarea: 'Tarea de prueba' });

        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe('Tarea agregada');
    });

    test('debería obtener todas las tareas de un usuario', async () => {
        const response = await request(app)
            .get('/tareas/1');

        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });

    test('debería eliminar una tarea', async () => {
        const response = await request(app)
            .delete('/tareas/1'); // Asegúrate de que este ID sea válido

        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe('Tarea eliminada');
    });
});
