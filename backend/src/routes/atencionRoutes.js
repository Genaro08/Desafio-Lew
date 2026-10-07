const express = require('express');
const atencionController = require('../controllers/atencionController');
const validarSchema = require('../middlewares/validarSchemaMiddleware');
const { crearAtencionSchema } = require('../schemas/atencionSchema');

const router = express.Router();

// Ruta POST para registrar una atención con validación de Zod
router.post(
  '/atenciones',
  validarSchema(crearAtencionSchema),
  atencionController.crearAtencion
);

module.exports = router;
