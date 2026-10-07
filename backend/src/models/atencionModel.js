const db = require('../config/db');

class AtencionModel {
  /**
   * Inserta una nueva atención registrada en MySQL utilizando una consulta parametrizada.
   * 
   * @param {object} datos - Datos de la atención (calificacionCliente, esUrgente, tipoCliente, prioridadCalculada)
   * @returns {Promise<number>} ID del registro insertado en la base de datos.
   */
  async crearAtencion(datos) {
    const { calificacionCliente, esUrgente, tipoCliente, prioridadCalculada } = datos;

    const query = `
      INSERT INTO atenciones_orbital 
        (calificacion_cliente, es_urgente, tipo_cliente, prioridad)
      VALUES 
        (?, ?, ?, ?)
    `;

    const [result] = await db.execute(query, [
      calificacionCliente,
      esUrgente,
      tipoCliente,
      prioridadCalculada,
    ]);

    return result.insertId;
  }
}

module.exports = new AtencionModel();
