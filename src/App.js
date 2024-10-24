import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import Login from './components/Login';
import Registro from './components/Registro';
import Tareas from './components/Tareas';
import 'bootstrap/dist/css/bootstrap.min.css';


function App() {
    const [usuarioId, setUsuarioId] = useState(null);

    return (
        <Router>
            <Routes>
                {/* Redirige a Login al iniciar la aplicación */}
                <Route path="/" element={<Navigate to="/login" />} />

                {/* Ruta de Login */}
                <Route path="/login" element={<Login setUsuarioId={setUsuarioId} />} />

                {/* Ruta de Registro */}
                <Route path="/registro" element={<Registro setUsuarioId={setUsuarioId} />} />

                {/* Ruta de Tareas */}
                <Route path="/tareas" element={<Tareas usuarioId={usuarioId} />} />
            </Routes>
        </Router>
    );
}

export default App;
