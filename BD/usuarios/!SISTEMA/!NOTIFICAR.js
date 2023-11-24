const memoria = require("../../../app/memoria");

module.exports = ({ notificacion, usuario }) => {
        let fecha = new Date();
        let año = fecha.getFullYear();
        let mes = fecha.getMonth() + 1;
        let dia = fecha.getDate();
        let hora = fecha.getHours().toString().padStart(2, '0');
        let minuto = fecha.getMinutes().toString().padStart(2, '0');
        let segundo = fecha.getSeconds().toString().padStart(2, '0');
        let milisegundo = fecha.getMilliseconds().toString().padStart(3, '0');

        let LENGTH = memoria.tools.Array2Nodo(`usuarios/${usuario["PK"]}/notificaciones/length.json`).cabeza;
        let START = memoria.tools.Array2Nodo(`usuarios/${usuario["PK"]}/notificaciones/start.json`).cabeza;
        let END = memoria.tools.Array2Nodo(`usuarios/${usuario["PK"]}/notificaciones/end.json`).cabeza;
        let cursor = {
                año,
                mes,
                dia,
                hora,
                minuto,
                segundo,
                milisegundo
        }

        if (!LENGTH || !Object.keys(LENGTH).length) {
                LENGTH = {
                        conteo: 1
                }
                START = {
                        cursor,
                        cursor_sucesor: cursor
                }
                END = {
                        cursor,
                        cursor_antecesor: cursor
                }
                memoria.EXEC({
                        DOC: {
                                usuarios: {
                                        [usuario["PK"]]: {
                                                notificaciones: {
                                                        "length.json": LENGTH,
                                                        "start.json": START,
                                                        "end.json": END,
                                                        [año]: {
                                                                [mes]: {
                                                                        [dia]: {
                                                                                [`${hora}-${minuto}-${segundo}-${milisegundo}.json`]: {
                                                                                        ...START,
                                                                                        notificacion
                                                                                },
                                                                        }
                                                                }
                                                        }
                                                }
                                        }
                                }
                        }
                })
        } else {
                LENGTH.conteo++;
                memoria.EXEC({
                        DOC: {
                                usuarios: {
                                        [usuario["PK"]]: {
                                                notificaciones: {
                                                        [END.cursor.año]: {
                                                                [END.cursor.mes]: {
                                                                        [END.cursor.dia]: {
                                                                                [`${END.cursor.hora}-${END.cursor.minuto}-${END.cursor.segundo}-${END.cursor.milisegundo}.json`]: {
                                                                                        cursor_sucesor: cursor
                                                                                }
                                                                        }
                                                                }
                                                        }
                                                }
                                        }
                                }
                        }
                })
                END = {
                        cursor,
                        cursor_antecesor: END.cursor
                }
                memoria.EXEC({
                        DOC: {
                                usuarios: {
                                        [usuario["PK"]]: {
                                                notificaciones: {
                                                        "length.json": LENGTH,
                                                        "end.json": END,
                                                        [año]: {
                                                                [mes]: {
                                                                        [dia]: {
                                                                                [`${hora}-${minuto}-${segundo}-${milisegundo}.json`]: {
                                                                                        ...END,
                                                                                        notificacion
                                                                                },
                                                                        }
                                                                }
                                                        }
                                                }
                                        }
                                }
                        }
                })
        }
        memoria.EXEC({
                DOC: {
                        usuarios: {
                                [usuario["PK"]]: {
                                        notificaciones: {
                                                "sin-leer.json": {
                                                        estado: true
                                                },
                                        }
                                }
                        }
                }
        })
};