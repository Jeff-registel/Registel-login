module.exports = ({ query, carpeta = "usuarios", ejecutor }) => {
        let { inicio = "end", limite = 15, aplicacion, sucesor, antecesor = true } = query;
        if (!aplicacion || !aplicacion["PK"] || aplicacion["PK"] < 1) {
                return {
                        error: "No se ha especificado un usuario  para recuperar notificaciones",
                }
        }
        if (limite < 1) {
                return {
                        error: "El limite de bloque de notificaciones debe ser mayor a 0"
                }
        }
        if (!sucesor && !antecesor) {
                return {
                        error: "No se ha especificado el sentido de recorrido, sucesor o antecesor"
                }
        }
        let retorno = [];
        ruta = `${carpeta}/${aplicacion["PK"]}/notificaciones/${inicio}.json`;
        let notificacion = JSONBD_GET(ruta);
        notificacion = JSONBD_GET(`${carpeta}/${aplicacion["PK"]}/notificaciones/${notificacion.cursor.file}.json`);
        for (let i = 0; i < limite; i++) {
                if (!notificacion) {
                        break;
                }
                retorno.push(notificacion);
                if (sucesor) {
                        notificacion = JSONBD_GET(`${carpeta}/${aplicacion["PK"]}/notificaciones/${notificacion.sucesor?.file}.json`);
                } else {
                        notificacion = JSONBD_GET(`${carpeta}/${aplicacion["PK"]}/notificaciones/${notificacion.antecesor?.file}.json`);
                }
        }
        if (retorno.length ==1 && retorno[0].cursor.file == inicio) {
                retorno = [];
        }
        if (inicio == "end" && aplicacion["PK"] == ejecutor["PK"]) {
                JSONBD_MODULE("usuarios/!/SET")({
                        carpeta: "usuarios",
                        query: {
                                aplicacion: {
                                        PK: ejecutor["PK"]
                                },
                                archivo: "notificaciones/sin-leer.json",
                                valor: {
                                        estado: false
                                }
                        }
                });
        }
        return retorno;
}