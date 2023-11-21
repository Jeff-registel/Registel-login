const memoria = require("../../../app/memoria");

module.exports = ({ query }) => {
    let { login, contraseña } = query;
    if (!login || !contraseña) {
        return {
            error: "Faltan datos para la autenticacion",
        };
    }

    console.log("login", login);

    let { PK } = memoria.tools.Array2Nodo(`usuarios/!SISTEMA/ALIAS/LOGIN/${login}.json`).cabeza;

    if (!PK) {
        return {
            error: "El nombre de usuario no existe",
        };
    }

    let { contraseña: contraseñaUser } = memoria.tools.Array2Nodo(`usuarios/${PK}/usuario.json`).cabeza;

    if (contraseñaUser !== contraseña) {
        return {
            error: "La contraseña es incorrecta",
        };
    }

    return {
        ok: "Usuario autenticado",
    };
}