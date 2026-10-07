const atencionService = require('../services/atencionService');

class AtencionController {
  /**
   * Endpoint HTTP para registrar una nueva atención.
   */
  crearAtencion = async (req, res) => {
    try {
      const { calificacionCliente, esUrgente, tipoCliente } = req.body;

      // Delegamos el caso de uso completo (cálculo + guardado) al servicio
      const resultado = await atencionService.crearAtencion({
        calificacionCliente,
        esUrgente,
        tipoCliente,
      });

      return res.status(201).json({
        status: 'success',
        mensaje: 'Atención registrada correctamente',
        data: resultado,
      });
    } catch (error) {
      return res.status(500).json({
        status: 'error',
        mensaje: 'Error interno al registrar la atención',
      });
    }
  };
}

module.exports = new AtencionController();
