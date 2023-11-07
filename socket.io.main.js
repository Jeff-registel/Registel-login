let conexiones = 0;

module.exports = function (app_pack) {
        let { io } = app_pack;

        io.on('connection', function (socket) {
                conexiones++;
                io.emit("usuarios conectados", conexiones);

                io.on("disconnect", () => {
                        conexiones--;
                        io.emit("usuarios conectados", conexiones);
                });

                socket.on("usuarios conectados", () => {
                        io.to(socket.id).emit("usuarios conectados", conexiones);
                });

                socket.on("Comprimir ZIP", (rutaCarpeta) => {
                        io.to(socket.id).emit("descargar archivo desde URL", zip.comprimirZIP(rutaCarpeta));
                })

                socket.on("generar DALL-E 2", async (prompt, numberOfImages) => {
                        let dalle2 = await openai.dalle2.generar(prompt, numberOfImages)
                        io.to(socket.id).emit("respuesta DALL-E 2", dalle2);
                })
        });
}