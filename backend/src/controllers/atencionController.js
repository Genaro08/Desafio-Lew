const atencionService = require('../services/atencionService');

class AtencionController {
  /**
   * Endpoint para crear y registrar una atención.
   */
  crearAtencion = async (req, res) => {
    try {
      const { calificacionCliente, esUrgente, tipoCliente } = req.body;

      // Calculamos la prioridad de atención utilizando el servicio
      const prioridadCalculada = atencionService.calcularPrioridad(
        calificacionCliente,
        esUrgente,
        tipoCliente
      );

      return res.status(201).json({
        status: 'success',
        mensaje: 'Atención registrada correctamente',
        data: {
          calificacionCliente,
          esUrgente,
          tipoCliente,
          prioridadCalculada,
        },
      });
    } catch (error) {
      return res.status(500).json({
        status: 'error',
        mensaje: 'Error interno al registrar la atención',
        error: error.message,
      });
    }
  };
}

module.exports = new AtencionController();
