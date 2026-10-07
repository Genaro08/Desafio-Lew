class AtencionService {
  /**
   * Calcula la prioridad de atención aplicando las reglas de negocio de Orbital.
   * 
   * @param {number} calificacionCliente - Número entero entre 1 y 5.
   * @param {boolean} esUrgente - Booleano que indica urgencia.
   * @param {string} tipoCliente - Tipo de cliente ("VIP", "CORPORATIVO" u otros).
   * @returns {number} Valor numérico de la prioridad calculada (máximo 10.0).
   */
  calcularPrioridad(calificacionCliente, esUrgente, tipoCliente) {
    let factor = 1.0;

    const tipoUpper = tipoCliente.toUpperCase();

    // Regla de Negocio Corregida:
    // VIP multiplica por 1.5.
    // CORPORATIVO solo multiplica por 1.2 si la calificación es >= 3.
    if (tipoUpper === 'VIP') {
      factor = 1.5;
    } else if (tipoUpper === 'CORPORATIVO' && calificacionCliente >= 3) {
      factor = 1.2;
    }

    let prioridad = calificacionCliente * factor;

    if (esUrgente) {
      prioridad += 2.0;
    }

    return Math.min(prioridad, 10.0);
  }
}

module.exports = new AtencionService();
