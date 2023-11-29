const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
                user: 'notificaciones.registel@gmail.com',
                pass: 'tggfdziwuewmeygu'
        }
});

module.exports = async ({ query }) => {
        let { cuerpo } = query;
        try {
                await transporter.sendMail({
                        ...cuerpo,
                        from: '"Registel 🚍" <notificaciones.registel@gmail.com>',
                });
                return {
                        ok: "Se ha enviado el correo electrónico"
                }
        } catch (error) {
                return {
                        error: "CATCH: No se ha podido enviar el correo electrónico",
                        details: error
                }
        }
}
