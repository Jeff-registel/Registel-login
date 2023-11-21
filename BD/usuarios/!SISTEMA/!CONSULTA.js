module.exports = ({ query }) => {
        let { login } = query;
        if (!login) {
                return {
                        error: "No hay usuario",
                };
        }
        let { PK } = memoria.tools.Array2Nodo(`usuarios/!SISTEMAS/ALIAS/LOGIN/${login}.json`).cabeza;

        if (!PK) {
                return {
                        error: "El nombre de usuario no existe",
                };
        }

        let usuario = memoria.tools.Array2Nodo(`usuarios/${PK}/usuario.json`).cabeza;

        if (!usuario) {
                return {
                        error: "El usuario no existe",
                };
        }

        usuario = require("./!GET")(usuario);

        return usuario;
}