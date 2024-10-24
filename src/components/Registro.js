import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Registro() {
    const [usuario, setUsuario] = useState('');
    const [clave, setClave] = useState('');
    const [mensaje, setMensaje] = useState('');
    const navigate = useNavigate();

    const handleRegistro = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:4000/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ usuario, clave }),
            });
    
            const data = await response.json();
            console.log('Respuesta del servidor:', data); // Agregar este log
    
            if (response.ok) {
                setMensaje('Usuario registrado exitosamente');
                navigate('/login');
            } else if (response.status === 409) {
                setMensaje(data.error); // Usuario ya registrado
            } else {
                setMensaje(data.error); // Otro error
            }
        } catch (error) {
            console.error('Error al registrar usuario:', error);
            setMensaje('Error al conectar con el servidor');
        }
    };
    

    return (
        <div className="container mt-5">
    <h2>Registro</h2>
    <form onSubmit={handleRegistro} className="border p-4 rounded shadow">
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
        <button type="submit" className="btn btn-primary">Registrar</button>
        <p className="text-danger mt-2">{mensaje}</p>
    </form>
</div>

    );
}

export default Registro;
