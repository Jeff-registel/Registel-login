/*
        Envia un correo electrónico con un enlace para recuperar la contraseña
*/
module.exports = async function ({ query }) {
        const { EMAIL, URL } = query;
        try {
                let usuario = JSONBD_MODULE("usuarios/!/TODO")({
                        query: { findEmail: EMAIL },
                })

                console.log("usuario", usuario);

                if (!usuario) {
                        return {
                                error: "No existe un usuario con ese correo electrónico"
                        }
                }

                let token = JSONBD_MODULE("tokens/!/CREAR")({
                        datos: {
                                PK: usuario["PK"],
                                EMAIL,
                        },
                        tipo: "recuperación de contraseña"
                });

                let sendmail = await JSONBD_MODULE("!/ENVIAR-CORREO")({
                        query: {
                                cuerpo: {
                                        to: usuario["EMAIL"],
                                        subject: "Recuperación de contraseña",
                                        html: HTML_MINIFY(`
                                                <div style="font-family: sans-serif;">
                                                        <img src=\"https://docs.google.com/drawings/d/e/2PACX-1vQ1wSTKVSNlKGjDxfKFJKMk8x42Uzk1H9Dx6OVHpF_vfUKd2zSF7pH8SIF4-nevYdgdT23QbCH0hMbq/pub?w=200\">
                                                        <br>
                                                        <h1>Recuperación de contraseña</h1>
                                                        <p>
                                                                Se ha solicitado la recuperación de contraseña para el usuario <b>${usuario["LOGIN"]}</b> 
                                                                <b>(${usuario["EMAIL"]})</b>
                                                        </p>
                                                        <p>Para recuperar la contraseña haga click en el siguiente enlace:</p>
                                                        <a href="${URL}/unlogged/pass-restore?token=${token}">
                                                                Recuperar contraseña
                                                                <br>
                                                                ${URL}/unlogged/pass-restore?token=${token}
                                                        </a>
                                                        <p>Si no ha solicitado la recuperación de contraseña, ignore este mensaje.</p>
                                                        <br>
                                                        <br>
                                                        <p>Este mensaje fue enviado automáticamente por el sistema de notificaciones de Registel.</p>
                                                </div>
                                        `)
                                }
                        }
                });

                if (sendmail["error"]) {
                        return sendmail;
                }

                let notify = JSONBD_MODULE("usuarios/!/NOTIFICAR")({
                        query: {
                                aplicacion: usuario,
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
                                                        ${new Date().SQL()}
                                                `
                                        }
                                },
                        },
                        ejecutor: {
                                PK: -1,
                        },
                });

                if (notify["error"]) {
                        return notify;
                }

                return {
                        ok: "Se ha enviado un correo electrónico para recuperar la contraseña"
                }
        } catch (error) {
                console.log(error);
                return {
                        error: "CATCH: No se ha podido enviar el correo electrónico"
                }
        }
}