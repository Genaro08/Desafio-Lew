// Middleware para validar que los datos enviados por el cliente (req.body) cumplan con un esquema de Zod.
const validarSchema = (schema) => {
  return (req, res, next) => {
    // Validamos req.body contra el esquema recibido
    const result = schema.safeParse(req.body);

    // Si los datos no cumplen la validación, devolvemos error 400 Bad Request con los mensajes de error
    if (!result.success) {
      const errores = result.error.issues.map((issue) => issue.message);

      return res.status(400).json({
        status: 'fail',
        mensaje: 'Error de validación en los datos de entrada',
        errores,
      });
    }

    req.body = result.data;
    next();
  };
};

module.exports = validarSchema;
