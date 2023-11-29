module.exports = ({ query, ejecutor }) => {
        let { aplicacion, notificacion } = query;

        if (!aplicacion || !aplicacion["PK"] || aplicacion["PK"] < 1) {
                return {
                        error: "No se ha especificado un usuario para modificar",
                }
        }

        let datosAGuardar = {
                notificacion,
                ejecutor,
        }

        let carpetaUsuarioNotificaciones = `usuarios/${aplicacion["PK"]}/notificaciones`;

        let [LENGTH, START, END] = ["length", "start", "end"].map(archivo => JSONBD_GET(`${carpetaUsuarioNotificaciones}/${archivo}.json`));

        let fecha = new Date();
        let año = fecha.getFullYear();
        let mes = fecha.getMonth() + 1;
        let dia = fecha.getDate();
        let time = fecha.getTime();
        let file = `${año}/${mes}/${dia}/${time}`;

        notificacion.creacion = fecha.getTime();

        let cursor = {
                año,
                mes,
                dia,
                time,
                file,
        }

        if (!LENGTH || !Object.keys(LENGTH).length) {
                LENGTH = {
                        conteo: 1
                }
                START = {
                        cursor,
                        sucesor: cursor
                }
                END = {
                        cursor,
                        antecesor: cursor
                }
                JSONBD_UPDATE({
                        ruta: `${carpetaUsuarioNotificaciones}/${file}.json`,
                        valor: {
                                ...START,
                                ...datosAGuardar
                        }
                })
        } else {
                LENGTH.conteo++;
                JSONBD_UPDATE({
                        ruta: `${carpetaUsuarioNotificaciones}/${END.cursor.file}.json`,
                        valor: {
                                sucesor: cursor
                        }
                })
                END = {
                        cursor,
                        antecesor: END.cursor
                }
                JSONBD_UPDATE({
                        ruta: `${carpetaUsuarioNotificaciones}/${file}.json`,
                        valor: {
                                ...END,
                                ...datosAGuardar
                        }
                })
        }
        JSONBD_UPDATE({
                ruta: `${carpetaUsuarioNotificaciones}/length.json`,
                valor: LENGTH
        })
        JSONBD_UPDATE({
                ruta: `${carpetaUsuarioNotificaciones}/start.json`,
                valor: START
        })
        JSONBD_UPDATE({
                ruta: `${carpetaUsuarioNotificaciones}/end.json`,
                valor: END
        })
        JSONBD_UPDATE({
                ruta: `${carpetaUsuarioNotificaciones}/sin-leer.json`,
                valor: {
                        estado: true
                }
        })
        return {
                ok: "Se ha guardado la notificación"
        }
};