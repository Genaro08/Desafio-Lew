public class AtencionService {
    public double calcularPrioridad(int calificacionCliente, boolean esUrgente, String tipoCliente) {
       
        double factor = 1.0;
        
        // Regla de Negocio: Los clientes VIP tienen máxima prioridad, 
        // pero la calificación de un cliente CORPORATIVO no puede multiplicar si la atención fue mala (< 3).

        if ("VIP".equalsIgnoreCase(tipoCliente)) {
            factor = 1.5;
        } else if ("CORPORATIVO".equalsIgnoreCase(tipoCliente)) {
            factor = 1.2;
        }

        if (calificacionCliente < 1 || calificacionCliente > 5) {
            throw new IllegalArgumentException("Calificación fuera de rango (1-5)");
        }
        
        double prioridad = (calificacionCliente * factor);

        if (esUrgente) {
            prioridad += 2.0;
        }

        return Math.min(prioridad, 10.0);
    }
}