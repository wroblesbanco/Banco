import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Login({ setUsuarioId }) {
    const [usuario, setUsuario] = useState('');
    const [clave, setClave] = useState('');
    const [mensaje, setMensaje] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        // Verificar si ya hay un usuario autenticado
        const usuarioId = localStorage.getItem('usuarioId');
        if (usuarioId) {
            navigate('/tareas'); // Redirige a la página de tareas si ya está autenticado
        }
    }, [navigate]);

    const handleLogin = async (e) => {
        e.preventDefault();
        
        // Aquí puedes realizar la lógica de autenticación contra un servidor
        try {
            const response = await fetch('http://localhost:4000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ usuario, clave }),
            });

            if (response.ok) {
                const data = await response.json();
                setMensaje('Inicio de sesión exitoso');
                setUsuarioId(data.usuarioId); // Asume que el backend devuelve el ID del usuario
                localStorage.setItem('usuarioId', data.usuarioId); // Guarda el ID de usuario en localStorage
                navigate('/tareas'); // Redirige a la página de tareas
            } else {
                setMensaje('Credenciales inválidas'); // Mensaje de error si las credenciales son incorrectas
            }
        } catch (error) {
            console.error('Error en la autenticación:', error);
            setMensaje('Error en la autenticación');
        }
    };

    return (
        <div className="container mt-5">
    <h2>Iniciar Sesión</h2>
    <form onSubmit={handleLogin} className="border p-4 rounded shadow">
        <div className="mb-3">
            <label htmlFor="usuario" className="form-label">Usuario</label>
            <input
                type="text"
                id="usuario"
                className="form-control"
                placeholder="Usuario"
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
            />
        </div>
        <div className="mb-3">
            <label htmlFor="clave" className="form-label">Clave</label>
            <input
                type="password"
                id="clave"
                className="form-control"
                placeholder="Clave"
                value={clave}
                onChange={(e) => setClave(e.target.value)}
            />
        </div>
        <button type="submit" className="btn btn-primary">Iniciar Sesión</button>
        <p className="text-danger mt-2">{mensaje}</p>
    </form>
    <button onClick={() => navigate('/registro')} className="btn btn-link mt-3">Registrarse</button>
</div>

    );
}

export default Login;
