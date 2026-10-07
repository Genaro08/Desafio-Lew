const { z } = require('zod');

const crearAtencionSchema = z.object({
  calificacionCliente: z
    .number({
      required_error: 'La calificación es requerida',
      invalid_type_error: 'La calificación debe ser un número entero',
    })
    .int('La calificación debe ser un número entero')
    .min(1, 'Calificación fuera de rango (1-5)')
    .max(5, 'Calificación fuera de rango (1-5)'),

  esUrgente: z.boolean({
    required_error: 'El campo esUrgente es requerido',
    invalid_type_error: 'El campo esUrgente debe ser un booleano (true/false)',
  }),

  tipoCliente: z
    .string({
      required_error: 'El tipo de cliente es requerido',
      invalid_type_error: 'El tipo de cliente debe ser una cadena de texto',
    })
    .trim()
    .min(1, 'El tipo de cliente no puede estar vacío'),
});

module.exports = {
  crearAtencionSchema,
};
