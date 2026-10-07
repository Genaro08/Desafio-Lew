-- Script de creación de la tabla atenciones_orbital para MySQL

CREATE TABLE IF NOT EXISTS atenciones_orbital (
    id INT AUTO_INCREMENT PRIMARY KEY,
    calificacion_cliente INT NOT NULL,
    es_urgente BOOLEAN NOT NULL,
    tipo_cliente VARCHAR(50) NOT NULL,
    prioridad DECIMAL(4,2) NOT NULL,
    fecha_creacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
