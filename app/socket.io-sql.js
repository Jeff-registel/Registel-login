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

        });

        return {
                verificarUsuario,
                usuarioInformacion
        }
}