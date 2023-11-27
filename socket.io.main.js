let conexiones = 0;

const nodemailer = require("nodemailer");
const memoria = require("./app/memoria");


const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
                user: 'notificaciones.registel@gmail.com',
                pass: 'tggfdziwuewmeygu'
        }
});

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
                        try {
                                let token = Math.random().toString().replace("0.", "");
                                await transporter.sendMail({
                                        from: '"Registel 🚍" <notificaciones.registel@gmail.com>',
                                        to: usuario["EMAIL"],
                                        subject: "Recuperación de contraseña",
                                        html: `
                                                <div style="font-family: sans-serif;">
                                                        <img src=\"https://docs.google.com/drawings/d/e/2PACX-1vQ1wSTKVSNlKGjDxfKFJKMk8x42Uzk1H9Dx6OVHpF_vfUKd2zSF7pH8SIF4-nevYdgdT23QbCH0hMbq/pub?w=200\">
                                                        <br>
                                                        <h1>Recuperación de contraseña</h1>
                                                        <p>
                                                                Se ha solicitado la recuperación de contraseña para el usuario <b>${usuario["LOGIN"]}</b> 
                                                                <b>(${usuario["EMAIL"]})</b>
                                                        </p>
                                                        <p>Para recuperar la contraseña haga click en el siguiente enlace:</p>
                                                        <a href="${URL}unlogged/pass-restore?TOKEN=${token}">
                                                                Recuperar contraseña
                                                                <br>
                                                                ${URL}unlogged/pass-restore?TOKEN=${token}
                                                        </a>
                                                        <p>Si no ha solicitado la recuperación de contraseña, ignore este mensaje.</p>
                                                        <br>
                                                        <br>
                                                        <p>Este mensaje fue enviado automáticamente por el sistema de notificaciones de Registel.</p>
                                                </div>
                                        `
                                });

                                let fecha = new Date();
                                let fechaString = fecha.getFullYear() + "-" + (fecha.getMonth() + 1).toString().padStart(2, "0") + "-" + fecha.getDate().toString().padStart(2, "0") + " " + fecha.getHours().toString().padStart(2, "0") + ":" + fecha.getMinutes().toString().padStart(2, "0") + ":" + fecha.getSeconds().toString().padStart(2, "0");

                                JSONBD_EXEC({
                                        DOC: {
                                                "tokens": {
                                                        [token+".json"]: {
                                                                usuario: usuario["PK"],
                                                                tipo: "recuperación de contraseña",
                                                                fecha: fechaString
                                                        }
                                                }
                                        }
                                });

                                JSONBD_MODULE("usuarios/!/NOTIFICAR")({
                                        usuario,
                                        notificacion: {
                                                titulo: "Recuperación de contraseña",
                                                mensaje: "Se ha enviado un correo electrónico para recuperar la contraseña",
                                                tipo: "info",
                                                icono: "fa fa-envelope",
                                                swal: {
                                                        title: "Recuperación de contraseña",
                                                        html: `
                                                                Se ha enviado un correo electrónico para recuperar la contraseña a <b>${usuario["EMAIL"]}</b>
                                                                <br>
                                                                <br>
                                                                Se solicitó cambio de contraseña
                                                                <br>
                                                                <br>
                                                                ${fechaString}
                                                        `
                                                }
                                        }
                                });

                                io.to(socket.id).emit("Recuperar contraseña: OK");
                        } catch (error) {
                                console.error(error);
                                io.to(socket.id).emit("Recuperar contraseña: ERROR");
                        }
                })

        });
}