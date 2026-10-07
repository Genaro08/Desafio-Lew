const { test, describe } = require('node:test');
const assert = require('node:assert');
const atencionService = require('../src/services/atencionService');

describe('AtencionService - Cálculo de Prioridad', () => {

  test('Cliente CORPORATIVO con calificación < 3 NO debe aplicar multiplicador (factor 1.0) [Regla Corregida]', () => {
    // Calificación 2, no urgente, factor 1.0 -> prioridad 2.0
    const prioridad = atencionService.calcularPrioridad(2, false, 'CORPORATIVO');
    assert.strictEqual(prioridad, 2.0);
  });

  test('Cliente CORPORATIVO con calificación >= 3 SÍ debe aplicar multiplicador 1.2', () => {
    // Calificación 4, no urgente, factor 1.2 -> prioridad 4.8
    const prioridad = atencionService.calcularPrioridad(4, false, 'CORPORATIVO');
    assert.strictEqual(prioridad, 4.8);
  });

  test('Cliente VIP con calificación 5 y urgente debe calcular 9.5', () => {
    // 5 * 1.5 + 2.0 = 9.5
    const prioridad = atencionService.calcularPrioridad(5, true, 'VIP');
    assert.strictEqual(prioridad, 9.5);
  });

  test('Cliente REGULAR con calificación 3 aplica factor 1.0', () => {
    const prioridad = atencionService.calcularPrioridad(3, false, 'REGULAR');
    assert.strictEqual(prioridad, 3.0);
  });

});
