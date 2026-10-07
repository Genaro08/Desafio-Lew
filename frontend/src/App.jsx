import { useState } from 'react';
import Header from './components/Header';
import AtencionForm from './components/AtencionForm';
import ResultadoCard from './components/ResultadoCard';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export default function App() {
  const [tipoCliente, setTipoCliente] = useState('');
  const [calificacionCliente, setCalificacionCliente] = useState(null);
  const [esUrgente, setEsUrgente] = useState(false);

  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!tipoCliente || !tipoCliente.trim()) {
      setError('Por favor ingrese o seleccione un Tipo de Cliente.');
      return;
    }

    if (!calificacionCliente) {
      setError('Por favor seleccione una Calificación de Atención (1 a 5).');
      return;
    }

    setLoading(true);
    setError(null);
    setResultado(null);

    try {
      const response = await fetch(`${API_URL}/atenciones`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tipoCliente: tipoCliente.trim(),
          calificacionCliente: Number(calificacionCliente),
          esUrgente,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          Array.isArray(data.errores) ? data.errores.join(', ') : (data.mensaje || 'Error al procesar la atención')
        );
      }

      setResultado(data);
    } catch (err) {
      setError(err.message || 'Error de conexión con la API');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="card">
        <Header />
        <div className="card-body">
          <AtencionForm
            tipoCliente={tipoCliente}
            setTipoCliente={setTipoCliente}
            calificacionCliente={calificacionCliente}
            setCalificacionCliente={setCalificacionCliente}
            esUrgente={esUrgente}
            setEsUrgente={setEsUrgente}
            onSubmit={handleSubmit}
            loading={loading}
          />
          <ResultadoCard resultado={resultado} error={error} />
        </div>
      </div>
    </div>
  );
}
