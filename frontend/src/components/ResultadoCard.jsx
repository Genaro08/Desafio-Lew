import { CheckCircle, AlertTriangle } from 'lucide-react';

export default function ResultadoCard({ resultado, error }) {
  if (error) {
    const esErrorConexion =
      error.toLowerCase().includes('failed to fetch') ||
      error.toLowerCase().includes('conexion');

    const mensajeAMostrar = esErrorConexion
      ? 'Servidor fuera de servicio o sin conexión. Por favor intente más tarde.'
      : error;

    return (
      <div className="alert alert-error">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <AlertTriangle size={20} color="#ef4444" />
          <strong>Error en la petición:</strong>
        </div>
        <p>{mensajeAMostrar}</p>
      </div>
    );
  }

  if (resultado) {
    return (
      <div className="alert alert-success">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <CheckCircle size={20} color="#10b981" />
          <strong>{resultado.mensaje || '¡Atención registrada con éxito!'}</strong>
        </div>
      </div>
    );
  }

  return null;
}
