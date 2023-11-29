let conexiones = 0;



module.exports = function () {
        let { io } = APP_PACK;

        io.on('connection', function (socket) {
                conexiones++;

                io.on("disconnect", () => {
                        conexiones--;
                });

                socket.on("usuarios conectados", () => {
                        io.to(socket.id).emit("usuarios conectados", conexiones);
                });

                socket.on("Recuperar contraseña", async (usuario, URL) => {
                       
                })

        });
}