// Simulador de Ahorro Acumulado con DOM, localStorage y catálogo dinámico

// Cargar historial desde localStorage o inicializar vacío
let historial = JSON.parse(localStorage.getItem("historialAhorro")) || [];
let totalAcumulado = historial.length > 0 ? historial[historial.length - 1].total : 0;

// Referencias a elementos del DOM
const form = document.getElementById("formAhorro");
const resultado = document.getElementById("resultado");
const historialDiv = document.getElementById("historial");
const btnLimpiar = document.getElementById("limpiarHistorial");
const catalogoDiv = document.getElementById("catalogo");

// Actualiza el historial en el DOM
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

// Evento: Enviar formulario de ahorro
form.addEventListener("submit", function(e) {
  e.preventDefault();
  const ahorroMensual = parseFloat(document.getElementById("ahorroMensual").value);
  const meses = parseInt(document.getElementById("meses").value);

  // Validación de datos
  if (isNaN(ahorroMensual) || ahorroMensual < 0 || isNaN(meses) || meses < 1) {
    resultado.innerHTML = "<p style='color:red;'>Por favor, ingresa valores válidos.</p>";
    return;
  }

  // Calcular nuevo total y detalle de ahorro
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

  // Mostrar resultados y actualizar historial y catálogo
  resultado.innerHTML = `<h2>Resultado</h2>
    <p>Ahorro total acumulado: <strong>$${totalAcumulado.toFixed(2)}</strong></p>
    <h3>Detalle:</h3>
    <ul>${detalle.map(m => `<li>${m}</li>`).join("")}</ul>`;

  actualizarHistorialDOM();
  cargarObjetivos(); // Actualiza el catálogo de objetivos
});

// Evento: Limpiar historial con confirmación SweetAlert2
btnLimpiar.addEventListener("click", function() {
  Swal.fire({
    title: "¿Seguro que deseas borrar el historial?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Sí, borrar",
    cancelButtonText: "Cancelar"
  }).then((result) => {
    if (result.isConfirmed) {
      historial = [];
      totalAcumulado = 0;
      localStorage.removeItem("historialAhorro");
      resultado.innerHTML = "";
      actualizarHistorialDOM();
      cargarObjetivos(); // Actualiza el catálogo
      Swal.fire("¡Historial borrado!", "", "success");
    }
  });
});

// Mostrar historial al cargar la página
actualizarHistorialDOM();


// ----------- FEATURE EXTRA: Catálogo de objetivos de ahorro -----------

// Cargar objetivos desde JSON simulado y renderizarlos
async function cargarObjetivos() {
  catalogoDiv.innerHTML = "<h2>Objetivos de ahorro</h2><p>Cargando...</p>";
  try {
    const resp = await fetch("js/objetivos.json");
    const objetivos = await resp.json();
    renderizarObjetivos(objetivos);
  } catch (error) {
    catalogoDiv.innerHTML = "<p style='color:red;'>No se pudo cargar el catálogo.</p>";
  }
}

// Renderiza los objetivos y asigna eventos a los botones
function renderizarObjetivos(objetivos) {
  catalogoDiv.innerHTML = "<h2>Objetivos de ahorro</h2><ul>" +
    objetivos.map(obj => {
      const puedeComprar = totalAcumulado >= obj.monto;
      return `
        <li>
          <strong>${obj.nombre}</strong>: $${obj.monto.toLocaleString()}
          <button class="btn-objetivo" data-monto="${obj.monto}" data-nombre="${obj.nombre}">Ver progreso</button>
          ${puedeComprar ? `<button class="btn-comprar" data-monto="${obj.monto}" data-nombre="${obj.nombre}">Comprar</button>` : ""}
        </li>
      `;
    }).join("") +
    "</ul>";

  // Delegación de eventos para los botones del catálogo
  catalogoDiv.addEventListener('click', function(e) {
    // Ver progreso de objetivo
    if (e.target.classList.contains('btn-objetivo')) {
      const monto = parseInt(e.target.dataset.monto);
      const nombre = e.target.dataset.nombre;
      const faltante = monto - totalAcumulado;
      Swal.fire({
        title: `Objetivo: ${nombre}`,
        html: faltante > 0
          ? `<p>Te faltan <strong>$${faltante.toLocaleString()}</strong> para alcanzar tu objetivo.</p>`
          : `<p>¡Felicitaciones! Ya alcanzaste tu objetivo.</p>`,
        icon: faltante > 0 ? "info" : "success"
      });
    }

    // Comprar objetivo si hay suficiente ahorro
    if (e.target.classList.contains('btn-comprar')) {
      const monto = parseInt(e.target.dataset.monto);
      const nombre = e.target.dataset.nombre;
      Swal.fire({
        title: `¿Comprar ${nombre}?`,
        text: `Se descontarán $${monto.toLocaleString()} de tu ahorro.`,
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Comprar",
        cancelButtonText: "Cancelar"
      }).then((result) => {
        if (result.isConfirmed) {
          totalAcumulado -= monto;
          const registro = {
            fecha: new Date().toLocaleString(),
            total: totalAcumulado,
            detalle: [`Compra de ${nombre}: -$${monto.toLocaleString()}`]
          };
          historial.push(registro);
          localStorage.setItem("historialAhorro", JSON.stringify(historial));
          actualizarHistorialDOM();
          cargarObjetivos(); // Actualiza catálogo y botones
          resultado.innerHTML = `<h2>¡Compra realizada!</h2>
            <p>Has comprado <strong>${nombre}</strong> por $${monto.toLocaleString()}.</p>
            <p>Tu ahorro restante es <strong>$${totalAcumulado.toLocaleString()}</strong>.</p>`;
          Swal.fire("¡Compra realizada!", `Has comprado ${nombre}.`, "success");
        }
      });
    }
  });
}

// Cargar objetivos al inicio
cargarObjetivos();