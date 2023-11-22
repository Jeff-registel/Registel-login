const sha256 = require('sha256')
const memoria = require("../../../app/memoria");

module.exports = ({ query }) => {
    let { login, contraseña } = query;
    contraseña = sha256(contraseña);
    
    if (!login || !contraseña) {
        return {
            error: "Faltan datos para la autenticacion",
        };
    }

    let { PK } = memoria.tools.Array2Nodo(`usuarios/!SISTEMA/ALIAS/LOGIN/${login}.json`).cabeza;
    if (!PK) {
        return {
            error: "El nombre de usuario no existe",
        };
    }
    let ruta = `usuarios/${PK}/usuario.json`;
    let usuario = memoria.tools.Array2Nodo(ruta).cabeza;
    let { "CONTRASEÑA": CONTRASEÑA } = usuario;

    if (CONTRASEÑA != contraseña) {
        return {
            error: "La contraseña es incorrecta",
        };
    }

    return require("./!GET")({
        json: usuario,
        ruta,
    });
}