let CONFIG = JSONBD_MODULE("tokens/!/CONFIG");

module.exports = function (creador, usuario, tipo) {
        if (!creador) {
                creador = {}
        }
        let token = Math.random().toString(36).replace("0.", "");
        console.log(
                JSONBD_WRITE({
                        ruta: `tokens/${token}.json`,
                        valor: {
                                creador: creador["PK"],
                                usuario: usuario["PK"],
                                tipo,
                                time: new Date().getTime()
                        }
                })
        )
        setTimeout(() => {
                JSONBD_DELETE(`tokens/${token}.json`);
                console.log("Eliminando token, timeout", token);
        }, CONFIG(tipo).expira);
        return token;
}