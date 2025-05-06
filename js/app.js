const API_URL = "http://3.215.185.126:5000/api/devices";
let ipPublica = "";

// Obtener la IP pública del cliente
function obtenerIpPublica() {
    fetch('https://api.ipify.org?format=json')
        .then(res => res.json())
        .then(data => {
            ipPublica = data.ip;
            console.log("IP pública:", ipPublica);
        })
        .catch(err => {
            console.error("Error al obtener la IP pública:", err);
        });
}

// Enviar comando al servidor
function sendCommand(command) {
    document.getElementById("currentCommand").textContent = command;

    const payload = {
        name: "Lizbeth Gonzalez",
        ip: ipPublica,
        status: command
    };

    fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    })
    .then(response => {
        if (!response.ok) throw new Error("Error al enviar el comando");
        return response.json();
    })
    .then(data => {
        console.log("Comando enviado correctamente:", data);
    })
    .catch(error => {
        console.error("Error en la petición:", error);
    });
}

window.addEventListener('DOMContentLoaded', obtenerIpPublica);
