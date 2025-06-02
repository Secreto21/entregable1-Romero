// Simulador de Ahorro Acumulado

// Descripción: Permite calcular el ahorro acumulado mes a mes, sumando un monto
// fijo durante varios meses, y muestra el historial en consola y alertas.

// Variables globales
let historial = []; // Array para guardar el historial de ahorro por mes
let totalAcumulado = 0; // Total acumulado entre simulaciones, inicializado en 0

// Solicita al usuario un número válido mediante prompt
// Devuelve el número ingresado o null si cancela
function solicitarNumero(mensaje) {
  let valor;
  do {
    valor = prompt(mensaje);
    if (valor === null) return null; // Permite cancelar la operación
    valor = parseFloat(valor);
  } while (isNaN(valor) || valor < 0); // Valida que sea un número positivo
  return valor;
}

// Calcula el ahorro acumulado mes a mes
// Parámetros: montoInicial (número), mensual (número), cantidadMeses (número)
// Devuelve el total acumulado al finalizar los meses
function calcularAhorro(montoInicial, mensual, cantidadMeses) {
  let total = montoInicial;
  historial = []; // Reinicia el historial para cada simulación
  for (let i = 1; i <= cantidadMeses; i++) {
    total += mensual;
    historial.push(`Mes ${i}: $${total.toFixed(2)}`); // Guarda el total de cada mes
  }
  return total;
}

// Muestra el historial de ahorro por mes en la consola
function mostrarHistorial() {
  console.log("\nHistorial de ahorro por mes:");
  historial.forEach(mes => console.log(mes));
}

// Muestra un saludo inicial al usuario por alert y consola
function saludarUsuario() {
  alert("Bienvenido/a al simulador de ahorro mensual");
  console.log("Simulador iniciado...");
}

// Función principal: ejecuta el flujo del simulador de ahorro
function simuladorAhorro() {
  saludarUsuario();

  alert(`Tu ahorro acumulado actual es: $${totalAcumulado.toFixed(2)}`);

  // Solicita datos al usuario
  const ahorroMensual = solicitarNumero("¿Cuánto dinero puedes ahorrar por mes?");
  if (ahorroMensual === null) return;

  const meses = solicitarNumero("¿Durante cuántos meses vas a ahorrar?");
  if (meses === null) return;

  // Calcula el nuevo total acumulado y muestra resultados
  const totalAhorrado = calcularAhorro(totalAcumulado, ahorroMensual, meses);
  totalAcumulado = totalAhorrado;

  mostrarHistorial();
  alert(`Ahorro total acumulado: $${totalAcumulado.toFixed(2)}`);
  console.log(`Ahorro total final: $${totalAcumulado.toFixed(2)}`);
}

// Bucle principal: permite repetir la simulación si el usuario lo desea
do {
  simuladorAhorro();
} while (confirm("¿Deseas agregar más ahorro?"));