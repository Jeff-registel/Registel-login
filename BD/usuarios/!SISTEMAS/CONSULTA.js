module.exports = ({ query }) => {
        let { login } = query;
        if (!login) {
                return {
                        error: "No hay usuario a consultar",
                };
        }
        let LOGIN = JSONBD_GET(`usuarios/!/ALIAS/LOGIN/${login}.json`);
        if (!LOGIN) {
                return {
                        error: "El usuario no existe: " + login,
                };
        }
        let { PK } = LOGIN;
        if (!PK) {
                return {
                        error: "El nombre de usuario no existe",
                };
        }
        usuario = JSONBD_MODULE(`usuarios/!/GET`)({ ruta: `usuarios/${PK}/usuario.json` });
        if (!usuario) {
                return {
                        error: "El usuario no existe",
                };
        }
        return usuario;
}