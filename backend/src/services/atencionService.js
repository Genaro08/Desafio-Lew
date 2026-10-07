const atencionModel = require('../models/atencionModel');

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

    const tipoUpper = typeof tipoCliente === 'string' ? tipoCliente.toUpperCase() : '';

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

  /**
   * Ejecuta el caso de uso completo: calcula la prioridad y persiste en MySQL.
   * 
   * @param {object} datos - { calificacionCliente, esUrgente, tipoCliente }
   * @returns {Promise<object>} Objeto con id y prioridad.
   */
  async crearAtencion({ calificacionCliente, esUrgente, tipoCliente }) {
    // 1. Lógica de negocio: calcular prioridad
    const prioridadCalculada = this.calcularPrioridad(
      calificacionCliente,
      esUrgente,
      tipoCliente
    );

    // 2. Persistencia: llamar al modelo para guardar en DB
    const idAtencion = await atencionModel.crearAtencion({
      calificacionCliente,
      esUrgente,
      tipoCliente,
      prioridadCalculada,
    });

    return {
      id: idAtencion,
      prioridad: prioridadCalculada,
    };
  }
}

module.exports = new AtencionService();
