const memoria = require("./memoria");

let SQL2JSONBD = false;
let SQL_config = require("./SQL-config");

module.exports = function ({ io, execSql }) {
        async function verificarUsuario(usuario, contraseña) {
                let result = await execSql(`SELECT * FROM tbl_usuario WHERE LOGIN = '${usuario}' AND CONTRASENA = SHA2('${contraseña}', 256)`);
                if (result.length > 0) {
                        let user = result[0];
                        delete user["CONTRASENA"];
                        return user;
                } else {
                        let result2 = await execSql(`SELECT * FROM tbl_usuario WHERE LOGIN = '${usuario}' AND CONTRASENA = '${contraseña}'`);
                        if (result2.length > 0) {
                                let user = result2[0];
                                delete user["CONTRASENA"];
                                return user;
                        }
                        return false;
                }
        }

        async function usuarioInformacion(usuario) {
                let result = await execSql(`SELECT * FROM tbl_usuario WHERE LOGIN = '${usuario}'`);
                if (result.length > 0) {
                        delete result[0]["CONTRASENA"];
                        return result[0];
                } else {
                        return false;
                }
        }

        async function existeUsuario(usuario) {
                let result = await execSql(`SELECT * FROM tbl_usuario WHERE LOGIN = '${usuario}'`);
                if (result.length > 0) {
                        return true;
                } else {
                        return false;
                }
        }

        io.on('connection', function (socket) {
                socket.on('disconnect', function () {
                        let URL = socket.handshake.headers.referer;
                        if (URL.toString().includes("/login/admin/herramientas/SQL2JSONBD")) {
                                SQL2JSONBD = false;
                        }
                });

                socket.on('Verificar usuario', async function ({ usuario, contrasena }) {
                        io.to(socket.id).emit(
                                "Verificar usuario: respuesta",
                                await verificarUsuario(usuario, contrasena)
                        );
                });

                //----------------------------------------------------------------------------------------------------------

                socket.on('Usuario', async function (LOGIN) {
                        io.to(socket.id).emit(
                                "Usuario: respuesta",
                                await usuarioInformacion(LOGIN)
                        );
                });

                socket.on('Usuario: editar', async function (props) {
                        if (props["usuario"] != props["LOGIN"]) {
                                let ya_existe = await existeUsuario(props["LOGIN"]);
                                if (ya_existe) {
                                        return io.to(socket.id).emit("Usuario: editar: error!", {
                                                error: "El usuario ya existe, intente otro login"
                                        });
                                }
                        }
                        async function usuarioEditar(props) {
                                return Object.entries(props).map(async ([k, v]) => {
                                        if (k == "usuario") {
                                                return false;
                                        }
                                        let result = await execSql(`UPDATE tbl_usuario SET ${k} = '${v}' WHERE LOGIN = '${props["LOGIN"]}'`);
                                        if (result.affectedRows == 0) {
                                                let result2 = await execSql(`UPDATE tbl_usuario SET ${k} = ${v} WHERE LOGIN = '${props["LOGIN"]}`);
                                                return result2.affectedRows > 0;
                                        }
                                        return result.affectedRows > 0;
                                }).some(v => v);
                        }
                        if (await usuarioEditar(props)) {
                                io.emit("Hay un cambio en la tabla: tbl_usuario");
                                return io.to(socket.id).emit("Usuario: editar: ok!");
                        }
                        return io.to(socket.id).emit("Usuario: editar: error!");
                });

                //----------------------------------------------------------------------------------------------------------

                socket.on('Todos los usuarios', async function () {
                        async function usuariosInformacion(LIMIT) {
                                let result = await execSql(`SELECT * FROM tbl_usuario ORDER BY FECHA_MODIFICACION DESC ${LIMIT ? `LIMIT ${LIMIT}` : ''}`);
                                if (result.length > 0) {
                                        result.forEach(user => {
                                                delete user["CONTRASENA"];
                                        });
                                        return result;
                                } else {
                                        return false;
                                }
                        }

                        io.to(socket.id).emit(
                                "Todos los usuarios: respuesta",
                                await usuariosInformacion()
                        );
                });

                //----------------------------------------------------------------------------------------------------------

                socket.on('usuario-existe', async function (usuario) {
                        io.to(socket.id).emit(
                                "usuario-existe: respuesta",
                                await existeUsuario(usuario)
                        );
                });

                //----------------------------------------------------------------------------------------------------------

                socket.on('consultar tabla completa', async function (tabla) {
                        async function consultarTablaCompleta(tabla) {
                                let result = await execSql(`SELECT * FROM ${tabla}`);
                                return result;
                        }

                        io.to(socket.id).emit(
                                "tabla completa",
                                {
                                        tabla: await consultarTablaCompleta(tabla),
                                        nombre: tabla
                                }
                        );
                });

                //----------------------------------------------------------------------------------------------------------

                socket.on('SQL2JSONBD: parar', async function () {
                        console.log("SQL2JSONBD: parar");
                        SQL2JSONBD = false;
                });

                socket.on('SQL2JSONBD', async function () {
                        if (SQL2JSONBD) {
                                return;
                        }
                        SQL2JSONBD = true;
                        let bases_de_datos = await execSql("SHOW DATABASES");
                        bases_de_datos = bases_de_datos.map((x) => x["Database"]);
                        bases_de_datos = bases_de_datos.filter(
                                (x) => x.startsWith("bd_") && x.endsWith("rdw")
                        );
                        io.to(socket.id).emit("SQL2JSONBD: respuesta: bases-de-datos", bases_de_datos);
                        for (let i = 0; i < bases_de_datos.length; i++) {
                                let BD = bases_de_datos[i];
                                if (!SQL2JSONBD) {
                                        return;
                                }
                                let tablas = await execSql("SHOW TABLES FROM " + BD);
                                tablas = Object.values(tablas).map((x) => x["Tables_in_" + BD]);
                                io.to(socket.id).emit("SQL2JSONBD: respuesta: tablas", tablas);
                                for (let j = 0; j < tablas.length; j++) {
                                        let Tabla = tablas[j];
                                        if (!SQL2JSONBD) {
                                                return;
                                        }
                                        for (let contador = 0; ; contador++) {
                                                let querySQL = "SELECT * FROM " + BD + "." + Tabla + " LIMIT 2000 OFFSET " + (contador) * 2000;
                                                console.log(querySQL);
                                                let datos = await execSql(querySQL);
                                                if (!datos.length) {
                                                        break;
                                                }
                                                let PK = Object.keys(datos[0]).find((x) => x.startsWith("PK"));
                                                if (!PK) {
                                                        PK = Object.keys(datos[0]).find((x) => x.startsWith("id"));
                                                }
                                                if (!PK) {
                                                        break
                                                }

                                                for (let k = 0; k < datos.length; k++) {
                                                        let dato = datos[k];
                                                        Object.entries(dato).forEach(([k, v]) => {
                                                                if (!v) {
                                                                        delete dato[k];
                                                                }
                                                        });
                                                        if (!SQL2JSONBD) {
                                                                return;
                                                        }
                                                        let queryJSON = {
                                                                DOC: {
                                                                        [SQL_config["host"]]: {
                                                                                [BD]: {
                                                                                        [Tabla]: {
                                                                                                [dato[PK] + ".json"]: dato,
                                                                                        },
                                                                                },
                                                                        },
                                                                },
                                                        }
                                                        if (k % 233 == 0) {
                                                                io.to(socket.id).emit("SQL2JSONBD: respuesta: query", queryJSON);
                                                        }
                                                        await memoria.EXEC(queryJSON);
                                                }
                                        }
                                }
                        }
                        SQL2JSONBD = false;
                });
        });

        return {
                verificarUsuario,
                usuarioInformacion
        }
}