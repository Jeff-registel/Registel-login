module.exports = function ({ io, mysql }) {
        io.on('connection', function (socket) {

                socket.on('Verificar usuario', async function ({ usuario, contrasena }) {
                        io.to(socket.id).emit(
                                "Verificar usuario: respuesta",
                                await mysql.verificarUsuario(usuario, contrasena)
                        );
                });

                socket.on('usuario-existe', async function (usuario) {
                        io.to(socket.id).emit(
                                "usuario-existe: respuesta",
                                await mysql.existeUsuario(usuario)
                        );
                });

                socket.on('consultar tabla completa', async function (tabla) {
                        io.to(socket.id).emit(
                                "tabla completa",
                                {
                                        tabla: await mysql.consultarTablaCompleta(tabla),
                                        nombre: tabla
                                }
                        );
                });

        });
}