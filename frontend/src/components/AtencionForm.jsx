import { useState, useEffect } from 'react';
import { Send, Sparkles, Building2, Edit3, ShieldAlert, Flame } from 'lucide-react';

export default function AtencionForm({
  tipoCliente,
  setTipoCliente,
  calificacionCliente,
  setCalificacionCliente,
  esUrgente,
  setEsUrgente,
  onSubmit,
  loading,
}) {
  const [modoInput, setModoInput] = useState('');

  useEffect(() => {
    const val = (tipoCliente || '').trim().toUpperCase();
    if (val === 'VIP') {
      setModoInput('VIP');
    } else if (val === 'CORPORATIVO') {
      setModoInput('CORPORATIVO');
    } else if (val.length > 0) {
      setModoInput('OTRO');
    } else {
      setModoInput('');
    }
  }, [tipoCliente]);

  const handleSeleccionarModo = (modo) => {
    setModoInput(modo);
    if (modo === 'VIP') setTipoCliente('VIP');
    if (modo === 'CORPORATIVO') setTipoCliente('CORPORATIVO');
    if (modo === 'OTRO') {
      if (tipoCliente === 'VIP' || tipoCliente === 'CORPORATIVO') {
        setTipoCliente('');
      }
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <div className="form-grid">
        {/* 1. Tipo de Cliente */}
        <div className="form-group full-width">
          <label className="form-label">Tipo de Cliente</label>
          <div className="segmented-control">
            <button
              type="button"
              className={`segmented-btn ${modoInput === 'VIP' ? 'active vip' : ''}`}
              onClick={() => handleSeleccionarModo('VIP')}
            >
              <Sparkles size={16} />
              VIP
            </button>

            <button
              type="button"
              className={`segmented-btn ${modoInput === 'CORPORATIVO' ? 'active corp' : ''}`}
              onClick={() => handleSeleccionarModo('CORPORATIVO')}
            >
              <Building2 size={16} />
              Corporativo
            </button>

            <button
              type="button"
              className={`segmented-btn ${modoInput === 'OTRO' ? 'active otro' : ''}`}
              onClick={() => handleSeleccionarModo('OTRO')}
            >
              <Edit3 size={16} />
              Otro
            </button>
          </div>

          <input
            type="text"
            className="custom-input"
            value={tipoCliente}
            onChange={(e) => setTipoCliente(e.target.value)}
            placeholder={
              modoInput === 'OTRO'
                ? 'Escriba el tipo de cliente personalizado...'
                : modoInput === ''
                ? 'Seleccione una opción arriba o seleccione Otro para escribir'
                : 'Valor asignado automáticamente'
            }
            readOnly={modoInput === 'VIP' || modoInput === 'CORPORATIVO'}
          />
        </div>

        {/* 2. Calificación de Atención */}
        <div className="form-group full-width">
          <label className="form-label">Calificación de Atención</label>
          <div className="rating-cards">
            {[1, 2, 3, 4, 5].map((num) => (
              <div
                key={num}
                className={`rate-card r-${num} ${calificacionCliente === num ? `active r-${num}` : ''}`}
                onClick={() => setCalificacionCliente(num)}
              >
                <span className="rate-num">{num}</span>
                <span className="rate-text">
                  {num === 1
                    ? 'Mala'
                    : num === 2
                    ? 'Regular'
                    : num === 3
                    ? 'Buena'
                    : num === 4
                    ? 'Muy Buena'
                    : 'Excelente'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Atención Urgente */}
        <div className="form-group full-width">
          <div
            className={`urgente-card ${esUrgente ? 'active' : ''}`}
            onClick={() => setEsUrgente(!esUrgente)}
          >
            <div className="urgente-info">
              {esUrgente ? (
                <Flame size={24} color="#ef4444" />
              ) : (
                <ShieldAlert size={24} color="#64748b" />
              )}
              <div className="urgente-title">Atención Urgente</div>
            </div>
            <input
              type="checkbox"
              checked={esUrgente}
              onChange={(e) => setEsUrgente(e.target.checked)}
              style={{ width: 18, height: 18, cursor: 'pointer' }}
            />
          </div>
        </div>

        {/* Botón de Enviar */}
        <div className="form-group full-width">
          <button type="submit" className="btn-submit" disabled={loading}>
            <Send size={18} />
            {loading ? 'Procesando registro...' : 'Registrar Atención'}
          </button>
        </div>
      </div>
    </form>
  );
}
