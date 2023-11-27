global.root = __dirname.split(require("path").sep).join("/");

let notificar = require("./BD/usuarios/!SISTEMAS/NOTIFICAR.js");

notificar({
        usuario: {
                "PK": 2
        },
        notificacion: {
                titulo: "Título",
                mensaje: "Mensaje"
        }
})