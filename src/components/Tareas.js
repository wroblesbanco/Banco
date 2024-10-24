import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEdit, FaTrash } from 'react-icons/fa'; // Asegúrate de instalar react-icons

function Tareas() {
    const [tareas, setTareas] = useState([]);
    const [nuevaTarea, setNuevaTarea] = useState('');
    const [mensaje, setMensaje] = useState('');
    const [tareaEditada, setTareaEditada] = useState(null);
    const [textoEditado, setTextoEditado] = useState('');
    const navigate = useNavigate();
    const usuarioId = localStorage.getItem('usuarioId');

    useEffect(() => {
        if (!usuarioId) {
            navigate('/login');
        } else {
            const fetchTareas = async () => {
                try {
                    const response = await fetch(`http://localhost:4000/tareas/${usuarioId}`, {
                        headers: {
                            'Authorization': 'mi-token-secreto', // Token de autenticación
                        },
                    });
                    const data = await response.json();
                    setTareas(data);
                } catch (error) {
                    console.error('Error al obtener las tareas:', error);
                }
            };
            fetchTareas();
        }
    }, [usuarioId, navigate]);

    const agregarTarea = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:4000/tareas', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'mi-token-secreto', // Token de autenticación
                },
                body: JSON.stringify({ usuario_id: usuarioId, tarea: nuevaTarea }),
            });
            const data = await response.json();
            setTareas([...tareas, { id: data.id, tarea: nuevaTarea }]);
            setNuevaTarea('');
            setMensaje('Tarea agregada');
        } catch (error) {
            console.error('Error al agregar tarea:', error);
        }
    };

    const eliminarTarea = async (id) => {
        try {
            await fetch(`http://localhost:4000/tareas/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': 'mi-token-secreto', // Token de autenticación
                },
            });
            setTareas(tareas.filter(tarea => tarea.id !== id));
            setMensaje('Tarea eliminada');
        } catch (error) {
            console.error('Error al eliminar tarea:', error);
        }
    };

    const habilitarEdicion = (tarea) => {
        setTareaEditada(tarea.id);
        setTextoEditado(tarea.tarea);
    };

    const actualizarTarea = async (id) => {
        try {
            const response = await fetch(`http://localhost:4000/tareas/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'mi-token-secreto', // Token de autenticación
                },
                body: JSON.stringify({ tarea: textoEditado }),
            });
            if (response.ok) {
                setTareas(tareas.map(t => (t.id === id ? { ...t, tarea: textoEditado } : t)));
                setMensaje('Tarea actualizada');
                setTareaEditada(null);
                setTextoEditado('');
            }
        } catch (error) {
            console.error('Error al actualizar tarea:', error);
        }
    };

    const cerrarSesion = () => {
        localStorage.removeItem('usuarioId');
        navigate('/login');
    };

    return (

<div className="container mt-5">
    <h2>Tareas</h2>
    <button className="btn btn-danger mb-3" onClick={cerrarSesion}>Cerrar Sesión</button>
    <form onSubmit={agregarTarea} className="mb-3">
        <div className="input-group">
            <input
                type="text"
                className="form-control"
                placeholder="Nueva tarea"
                value={nuevaTarea}
                onChange={(e) => setNuevaTarea(e.target.value)}
            />
            <button type="submit" className="btn btn-primary">Agregar</button>
        </div>
    </form>
    <table className="table table-striped">
        <thead>
            <tr>
                <th>Tarea</th>
                <th>Acciones</th>
            </tr>
        </thead>
        <tbody>
            {tareas.map(tarea => (
                <tr key={tarea.id}>
                    <td>
                        {tareaEditada === tarea.id ? (
                            <input
                                type="text"
                                value={textoEditado}
                                onChange={(e) => setTextoEditado(e.target.value)}
                                className="form-control"
                            />
                        ) : (
                            tarea.tarea
                        )}
                    </td>
                    <td>
                        {tareaEditada === tarea.id ? (
                            <button onClick={() => actualizarTarea(tarea.id)} className="btn btn-success">
                                Guardar
                            </button>
                        ) : (
                            <>
                                <button onClick={() => habilitarEdicion(tarea)} className="btn btn-warning me-2">
                                    <FaEdit />
                                </button>
                                <button onClick={() => eliminarTarea(tarea.id)} className="btn btn-danger">
                                    <FaTrash />
                                </button>
                            </>
                        )}
                    </td>
                </tr>
            ))}
        </tbody>
    </table>
    <p className="text-success">{mensaje}</p>
</div>

    );
}

export default Tareas;
