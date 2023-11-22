const memoria = require("../../../app/memoria");

module.exports = ({ query }) => {
        let { login } = query;
        if (!login) {
                return {
                        error: "No hay usuario",
                };
        }
        let usuarioLOGIN = memoria.tools.Array2Nodo(`usuarios/!SISTEMA/ALIAS/LOGIN/${login}.json`).cabeza;
        if (!usuarioLOGIN) {
                return {
                        error: "El usuario no existe: " + login,
                };
        }

        let { PK } = usuarioLOGIN;

        if (!PK) {
                return {
                        error: "El nombre de usuario no existe",
                };
        }
        let ruta = `usuarios/${PK}/usuario.json`;
        let usuario = memoria.tools.Array2Nodo(ruta).cabeza;

        if (!usuario) {
                return {
                        error: "El usuario no existe",
                };
        }

        usuario = require("./!GET")({
                json: usuario,
                ruta,
        });

        return usuario;
}