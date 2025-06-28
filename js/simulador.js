// Simulador de Ahorro Acumulado con DOM y localStorage

// Cargar historial desde localStorage o inicializar vacío
let historial = JSON.parse(localStorage.getItem("historialAhorro")) || [];
let totalAcumulado = historial.length > 0 ? historial[historial.length - 1].total : 0;

// Referencias a elementos del DOM
const form = document.getElementById("formAhorro");
const resultado = document.getElementById("resultado");
const historialDiv = document.getElementById("historial");
const btnLimpiar = document.getElementById("limpiarHistorial");

// Función para actualizar el historial en el DOM
function actualizarHistorialDOM() {
  historialDiv.innerHTML = "<h2>Historial de ahorro</h2>";
  if (historial.length === 0) {
    historialDiv.innerHTML += "<p>No hay historial aún.</p>";
    return;
  }
  historialDiv.innerHTML += "<ul>" +
    historial.map(item => `
      <li>
        <strong>${item.fecha}</strong>: $${item.total.toFixed(2)}
        <details>
          <summary>Ver detalle</summary>
          <ul>${item.detalle.map(d => `<li>${d}</li>`).join("")}</ul>
        </details>
      </li>
    `).join("") +
    "</ul>";
}

// Evento al enviar el formulario
form.addEventListener("submit", function(e) {
  e.preventDefault();
  const ahorroMensual = parseFloat(document.getElementById("ahorroMensual").value);
  const meses = parseInt(document.getElementById("meses").value);

  if (isNaN(ahorroMensual) || ahorroMensual < 0 || isNaN(meses) || meses < 1) {
    resultado.innerHTML = "<p style='color:red;'>Por favor, ingresa valores válidos.</p>";
    return;
  }

  let total = totalAcumulado;
  let detalle = [];
  for (let i = 1; i <= meses; i++) {
    total += ahorroMensual;
    detalle.push(`Mes ${i}: $${total.toFixed(2)}`);
  }
  totalAcumulado = total;

  // Guardar en historial y localStorage
  const registro = {
    fecha: new Date().toLocaleString(),
    total: totalAcumulado,
    detalle: [...detalle]
  };
  historial.push(registro);
  localStorage.setItem("historialAhorro", JSON.stringify(historial));

  // Mostrar resultados
  resultado.innerHTML = `<h2>Resultado</h2>
    <p>Ahorro total acumulado: <strong>$${totalAcumulado.toFixed(2)}</strong></p>
    <h3>Detalle:</h3>
    <ul>${detalle.map(m => `<li>${m}</li>`).join("")}</ul>`;

  actualizarHistorialDOM();
});

// Evento para limpiar historial
btnLimpiar.addEventListener("click", function() {
  if (confirm("¿Seguro que deseas borrar el historial?")) {
    historial = [];
    totalAcumulado = 0;
    localStorage.removeItem("historialAhorro");
    resultado.innerHTML = "";
    actualizarHistorialDOM();
  }
});

// Mostrar historial al cargar la página
actualizarHistorialDOM();