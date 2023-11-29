let NOTIFICAR = JSONBD_MODULE("usuarios/!/NOTIFICAR");

/*
        Contiene la función para cambiar la contraseña de un usuario, requiere un token de recuperación de contraseña generado en el modulo de recuperación de contraseña
*/

module.exports = ({ query }) => {
        let { "token-code": token_code, contraseña } = query;
        let token = JSONBD_GET(`tokens/${token_code}.json`);
        console.log("token", token);
        if (!token) {
                return {
                        error: "El token no existe"
                }
        }
        if (token["tipo"] != "recuperación de contraseña") {
                return {
                        error: "El token no es de recuperación de contraseña"
                }
        }
        let { PK } = token["datos"];

        if (!PK) {
                return {
                        error: "El token no contiene un usuario"
                }
        }

        let jsonupdate = JSONBD_MODULE("!/UPDATE")({
                query: {
                        ruta: `usuarios/${PK}/usuario.json`,
                        valor: {
                                CONTRASEÑA: JSONBD_MODULE("!/CESAR")({
                                        query: {
                                                text: contraseña,
                                        }
                                }),
                                CRYPTOPASS: "CESAR"
                        }
                }
        });
        if (jsonupdate["error"]) {
                return jsonupdate;
        }
        let jsondelete = JSONBD_DELETE(`tokens/${token_code}.json`);
        if (jsondelete["error"]) {
                return jsondelete;
        }
        NOTIFICAR({
                query: {
                        aplicacion: {
                                PK
                        },
                        notificacion: {
                                titulo: "Cambio de contraseña",
                                mensaje: "La contraseña se ha cambiado correctamente",
                                tipo: "info",
                                icono: "fas fa-lock",
                        },
                },
        });
        return {
                ok: "Se ha cambiado la contraseña"
        }
}