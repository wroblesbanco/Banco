import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom'; // Importar MemoryRouter
import Tareas from './Tareas';

// Mock de las funciones de API
global.fetch = jest.fn();

describe('Componente Tareas', () => {
    beforeEach(() => {
        fetch.mockClear();
    });

    test('debería mostrar el título "Tareas"', () => {
        render(
            <MemoryRouter>
                <Tareas />
            </MemoryRouter>
        );
        const titleElement = screen.getByText(/Tareas/i);
        expect(titleElement).toBeInTheDocument();
    });

    test('debería permitir agregar una nueva tarea', async () => {
        fetch.mockResolvedValueOnce({
            json: jest.fn().mockResolvedValueOnce({ id: 1, message: 'Tarea agregada' }),
        });

        render(
            <MemoryRouter>
                <Tareas />
            </MemoryRouter>
        );

        const inputElement = screen.getByPlaceholderText(/Nueva tarea/i);
        const addButton = screen.getByText(/Agregar/i);

        fireEvent.change(inputElement, { target: { value: 'Nueva tarea' } });
        fireEvent.click(addButton);

        await waitFor(() => {
            const tareaElement = screen.getByText(/Nueva tarea/i);
            expect(tareaElement).toBeInTheDocument();
        });
    });

    test('debería permitir listar las tareas', async () => {
        fetch.mockResolvedValueOnce({
            json: jest.fn().mockResolvedValueOnce([{ id: 1, tarea: 'Tarea 1' }, { id: 2, tarea: 'Tarea 2' }]),
        });

        render(
            <MemoryRouter>
                <Tareas />
            </MemoryRouter>
        );

        // Esperar a que la primera tarea se muestre
        await waitFor(() => {
            expect(screen.getByText(/Tarea 1/i)).toBeInTheDocument();
        });

        // Esperar a que la segunda tarea se muestre
        await waitFor(() => {
            expect(screen.getByText(/Tarea 2/i)).toBeInTheDocument();
        });
    });

    test('debería permitir editar una tarea', async () => {
        fetch.mockResolvedValueOnce({
            json: jest.fn().mockResolvedValueOnce({ id: 1, tarea: 'Tarea a editar' }),
        });

        render(
            <MemoryRouter>
                <Tareas />
            </MemoryRouter>
        );

        // Agregar una tarea
        const inputElement = screen.getByPlaceholderText(/Nueva tarea/i);
        fireEvent.change(inputElement, { target: { value: 'Tarea a editar' } });
        fireEvent.click(screen.getByText(/Agregar/i));

        await waitFor(() => {
            const tareaElement = screen.getByText(/Tarea a editar/i);
            expect(tareaElement).toBeInTheDocument();
        });

        // Habilitar edición
        fireEvent.click(screen.getByRole('button', { name: /Editar/i }));

        const editInputElement = screen.getByDisplayValue(/Tarea a editar/i);
        fireEvent.change(editInputElement, { target: { value: 'Tarea editada' } });
        fireEvent.click(screen.getByText(/Actualizar/i));

        await waitFor(() => {
            const updatedTareaElement = screen.getByText(/Tarea editada/i);
            expect(updatedTareaElement).toBeInTheDocument();
        });
    });

    test('debería permitir eliminar una tarea', async () => {
        // Simular que ya hay una tarea existente
        fetch.mockResolvedValueOnce({
            json: jest.fn().mockResolvedValueOnce([{ id: 1, tarea: 'Tarea a eliminar' }]),
        });

        render(
            <MemoryRouter>
                <Tareas />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByText(/Tarea a eliminar/i)).toBeInTheDocument();
        });

        // Simular eliminación
        fetch.mockResolvedValueOnce({ json: jest.fn().mockResolvedValueOnce({ message: 'Tarea eliminada' }) });

        fireEvent.click(screen.getByRole('button', { name: /Eliminar/i }));

        await waitFor(() => {
            const tareaElement = screen.queryByText(/Tarea a eliminar/i);
            expect(tareaElement).not.toBeInTheDocument();
        });
    });
});
