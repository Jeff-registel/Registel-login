let CONFIG = JSONBD_MODULE("tokens/!/CONFIG");

module.exports = function ({ creador, tipo, datos }) {
        if (!creador) {
                creador = {
                        PK: -1
                }
        } else {
                creador = {
                        PK: creador["PK"],
                }
        }
        let token = Math.random().toString(36).replace("0.", "");
        let jsonwrite = JSONBD_WRITE({
                ruta: `tokens/${token}.json`,
                valor: {
                        creador,
                        tipo,
                        datos,
                        time: new Date().getTime()
                }
        })
        if (!jsonwrite || jsonwrite["error"]) {
                return jsonwrite;
        }
        setTimeout(() => {
                JSONBD_DELETE(`tokens/${token}.json`);
                console.log("Eliminando token, timeout", token);
        }, CONFIG(tipo).expira);
        return token;
}