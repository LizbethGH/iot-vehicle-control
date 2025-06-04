const API_URL = "http://44.222.248.238:5000/api/devices";
const API_ESTADO = "http://44.222.248.238:5000/api/estado_grabacion";
let ipPublica = "";
let movimientosGrabados = [];
let grabando = false;

// Obtener IP pública
function obtenerIpPublica() {
  fetch('https://api.ipify.org?format=json')
    .then(res => res.json())
    .then(data => {
      ipPublica = data.ip;
      console.log("IP pública obtenida:", ipPublica);
    })
    .catch(err => console.error("Error al obtener IP:", err));
}

// Cambiar velocidad visualmente
function cambiarVelocidad(valor) {
  document.getElementById("velocidadValor").textContent = valor;
}

// Enviar movimiento individual o grabado
function ejecutarMovimientoIndividual(comando, velocidad) {
  if (!comando || comando === "Esperando...") return;

  document.getElementById("velocidad").value = velocidad;
  cambiarVelocidad(velocidad);
  document.getElementById("currentCommand").textContent = comando;

  const tipoMovimiento = grabando ? "grabado" : "individual";

  const payload = {
    name: "Lizbeth Gonzalez",
    ip: ipPublica,
    status: comando,
    velocidad: velocidad,
    tipo: tipoMovimiento
  };

  console.log(`Movimiento ${tipoMovimiento}: ${comando} Velocidad: ${velocidad}`);

  fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  }).catch(error => console.error("Error al enviar POST:", error));

  // Solo agregar si está grabando y no supera el límite
  if (grabando) {
    if (movimientosGrabados.length < 10) {
      movimientosGrabados.push({ comando, velocidad });
      console.log("Movimientos grabados hasta ahora:", movimientosGrabados);
    } else {
      console.warn("Límite alcanzado: máximo 10 movimientos.");
    }
  }
}

// Función para iniciar o detener la grabación
function grabarMovimiento() {
  grabando = !grabando;

  if (grabando) {
    movimientosGrabados = [];
    console.log("Grabación iniciada. Presiona botones para grabar movimientos (máximo 10).");
  } else {
    console.log("Grabación finalizada.");
    console.table(movimientosGrabados, ["comando", "velocidad"]);
  }
  enviarEstadoGrabacion(grabando);
}

// Enviar estado de grabación al backend
function enviarEstadoGrabacion(estado) {
  fetch(API_ESTADO, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ grabando: estado })
  }).catch(err => console.error("Error al enviar estado de grabación:", err));
}

// Limpiar movimientos grabados
function limpiarMovimientos() {
  movimientosGrabados = [];
  console.clear();
  console.log("Movimientos borrados.");
  document.getElementById("currentCommand").textContent = "Esperando...";
}

// Obtener IP al cargar la página
window.addEventListener('DOMContentLoaded', obtenerIpPublica);

// Función para enviar comandos desde los botones
function sendCommand(comando) {
  const velocidad = parseInt(document.getElementById("velocidad").value);
  ejecutarMovimientoIndividual(comando, velocidad);
}
