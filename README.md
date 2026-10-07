# Desafío Técnico & De Servicio: Orbital

Este repositorio contiene la migración, refactorización y resolución técnica del servicio de atenciones del sistema **Orbital** a **Node.js (Express) + React (Vite) + MySQL**.

---

## Guía Rápida de Ejecución

### 1. Requisitos Previos

* **Node.js**: v20.x o superior.

* **MySQL Server**: v8.0 o superior (o MariaDB).

---

### 2. Base de Datos (MySQL)

1. Inicia tu servidor MySQL local y crea la base de datos que prefieras:

   ```sql
   CREATE DATABASE tu_base_de_datos;
   ```

2. Ejecuta el script SQL ubicado en [`database/schema.sql`](./database/schema.sql) para crear la tabla requerida (`atenciones_orbital`):

   ```bash
   mysql -u root -p tu_base_de_datos < database/schema.sql
   ```

---

### 3. Backend (Node.js + Express)

1. Navega a la carpeta `backend/`:

   ```bash
   cd backend
   ```

2. Instala las dependencias:

   ```bash
   npm install
   ```

3. Configura el archivo `.env` tomando como referencia `.env.example` asignando tus credenciales y el nombre de tu base de datos:

   ```env
   PORT=3000
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=tu_usuario
   DB_PASSWORD=tu_contraseña
   DB_NAME=tu_base_de_datos
   ```

4. Ejecuta las **pruebas unitarias automatizadas** (usando el test runner nativo de Node.js):

   ```bash
   npm test
   ```

5. Inicia el servidor en modo desarrollo:

   ```bash
   npm run dev
   ```

   *El servidor estará corriendo en `http://localhost:3000`.*

---

### 4. Frontend (React + Vite)

1. En otra terminal, navega a la carpeta `frontend/`:

   ```bash
   cd frontend
   ```

2. Instala las dependencias:

   ```bash
   npm install
   ```

3. Inicia el servidor de desarrollo:

   ```bash
   npm run dev
   ```

4. Abre tu navegador en **`http://localhost:5173`**.

---

## Control de Calidad e Informe del "Examen de IA"

### 1. Análisis de Detección de la IA en el Código Legacy (Java)

#### Lo que la IA SÍ detectó:

* **Regla faltante de CORPORATIVO < 3:** Identificó que el comentario indicaba *"la calificación de un cliente CORPORATIVO no puede multiplicar si la atención fue mala (< 3)"*, pero planteó la ambigüedad matemática de si "no multiplicar" significaba usar un factor neutro (`1.0`) o anular el término multiplicativo (`0.0`). *(Se adoptó factor 1.0 por ser la alternativa más lógica de negocio)*.

* **Higiene de Strings:** Señaló la falta de `.trim()` en `tipoCliente`, notando que cadenas con espacios como `" VIP "` o `" vip"` caían silenciosamente en el caso por defecto.

* **Uso de Enum:** Sugirió que reemplazar `String tipoCliente` por un `Enum` resolvería de raíz la validación de tipos, nulos y valores no esperados. Pero de esta forma estaríamos agregando una regla de negocio en donde los posibles tipos de cliente ya están definidos, cosa que no es cierta.

* **Manejo de Nulos:** Notó que si `tipoCliente` ingresaba como `null`, en Java no lanzaba excepción pero caía en el caso por defecto (factor 1.0).

* **Orden de Validación (Fail-Fast):** Detectó que en Java se calculaba el factor *antes* de comprobar si la calificación estaba entre 1 y 5.

#### Lo que la IA NO detectó (Descubierto por la Revisión Humana):

* **La ambigüedad de "Máxima Prioridad" para clientes VIP:** La IA no cuestionó el término del comentario. La revisión humana notó que "máxima prioridad" podía interpretarse de tres maneras:

  1. Devolver directamente el valor máximo `10.0` ante cualquier VIP.

  2. Que el peor escenario de un VIP tenga más prioridad que el mejor escenario de cualquier otro cliente. Esto es matemáticamente imposible por culpa de `+2` de urgente; habría que cambiar ese valor para que sea posible ajustar los factores hasta que se dé esta condición.

  3. Que ante igualdad de condiciones, el VIP tenga el multiplicador más alto (que es lo que hacía el código legacy con factor `1.5`).

* **El tope inalcanzable (`Math.min` inútil):** La IA no notó que con las reglas matemáticas del código legacy, la prioridad máxima alcanzable es de `9.5` (`5 × 1.5 + 2.0`), por lo que la instrucción `Math.min(prioridad, 10.0)` resulta ser código muerto inalcanzable.

---

### 2. Correcciones y Ajustes Manuales (SQL & React)

#### Ajustes en SQL y Base de Datos (MySQL)

* **Índices Prematuros:** Se removieron índices secundarios propuestos por la IA en `tipo_cliente` y `calificacion_cliente`. No se consideró justificado agregarlos sin conocer previamente los patrones de consulta reales del sistema.

#### Ajustes en el Componente React & UX/UI

* **Manejo de Errores de Red:** Se agregó captura de errores de conexión (`Failed to fetch`) para mostrar un mensaje claro al usuario ("Servidor fuera de servicio o sin conexión").

* **Valores Predeterminados:** Se quitaron selecciones automáticas iniciales en el formulario para requerir una acción consciente por parte del operador.

* **Input Dinámico:** Se adaptó el campo `tipoCliente` para permitir botones rápidos (`VIP`, `CORPORATIVO`) o escribir libremente cualquier tipo de cliente en un input de texto.

---

### 3. Decisiones y Ajustes Realizados Manualmente

Además de las correcciones sobre la implementación generada por IA, se tomaron algunas decisiones de diseño y persistencia de forma manual.

* **Tipos de Datos:** Se asignó `DECIMAL(4,2)` a la columna `prioridad` para evitar imprecisiones de coma flotante.

* **Fecha de Creación:** Se asignó `TIMESTAMP DEFAULT CURRENT_TIMESTAMP` a `fecha_creacion` para que la base de datos registre automáticamente cuándo se creó cada atención.

* **Persistencia del factor:** La IA propuso almacenar en la tabla el factor utilizado para calcular la prioridad. Se decidió no incorporarlo al modelo actual, ya que el factor puede derivarse del tipo de cliente. Además, almacenar el factor utilizado mezcla en la misma entidad los datos de la atención con un valor perteneciente a la fórmula de cálculo, que podría cambiar independientemente en el futuro. Si fuera necesario conservar el valor histórico de la fórmula utilizada para cada atención, debería evaluarse un mecanismo específico para versionar o registrar dicha configuración.

* **Estructura del frontend:** La primera implementación generada concentraba la solución en un único archivo. Se reorganizó manualmente para separar responsabilidades y mejorar la legibilidad y mantenibilidad del código.

* **Pruebas:** La IA no generó inicialmente una cobertura de pruebas. Los tests fueron incorporados y revisados manualmente para validar las reglas principales y distintos escenarios del sistema.

* **Validación de reglas de negocio:** Se revisaron manualmente distintos casos límite y combinaciones de parámetros para comprobar que la implementación respetara las reglas definidas y no solamente que el código fuera funcional.

---

### 4. Revisión de la Solución Generada por IA

#### Aspectos de diseño detectados durante la revisión humana:

* **Contrato de la API:** Se revisó qué información debe devolver el endpoint además de indicar si la operación fue exitosa. Se consideró si la respuesta debe incluir la prioridad calculada y qué información adicional podría necesitar el consumidor de la API.

* **Modelo de datos y relaciones:** Se revisó si la tabla propuesta debía relacionarse con otras entidades o tablas existentes y si correspondía incorporar claves foráneas u otras restricciones. No se agregaron relaciones que no estuvieran justificadas por el modelo actual.

---

## Preguntas de Negocio y Posibles Mejoras (Alineación con Cliente / Product Owner)

Para evolucionar el sistema **Orbital**, se sugiere revisar los siguientes puntos con el cliente o equipo de producto:

1. **Definición de Máxima Prioridad VIP:** Confirmar si el negocio requiere que un cliente VIP obtenga `10.0` automático en todos los casos, si se mantiene el multiplicador `1.5` actual, o si se necesitan revisar y reajustar todos los factores para que todos los casos de un cliente VIP sean más prioritarios que cualquier caso de un cliente no VIP.

2. **Restricción de Tipos de Cliente:** Definir si conviene cerrar los tipos de cliente mediante un Enum estricto en base de datos o si se mantendrá el campo de texto libre `VARCHAR(50)` para dar flexibilidad a nuevos segmentos.

3. **Contrato de la API:** Definir formalmente qué información debe devolver el endpoint al registrar una atención: únicamente el resultado de la operación, la prioridad calculada, los datos del registro creado u otra información necesaria para el consumidor.

4. **Patrones de consulta e índices:** Antes de agregar índices adicionales, identificar con el cliente o equipo funcional qué campos serán utilizados habitualmente para búsquedas, filtros, ordenamientos o reportes. A partir de esos patrones se podrá determinar qué índices aportan valor.

5. **Evolución del Modelo de Datos:** Confirmar si las atenciones deberán relacionarse en el futuro con clientes, operadores, usuarios u otras entidades. Esto permitiría definir desde el inicio las relaciones y claves foráneas necesarias sin agregar
