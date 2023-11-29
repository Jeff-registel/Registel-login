module.exports = () => {
        JSONBD_MODULE("!/LIST")({
                carpeta: "tokens"
        }).filter(e => e.endsWith(".json")).forEach((token) => {
                let archivo = JSONBD_GET(`tokens/${token}`);
                if (archivo) {
                        if (new Date().getTime() >  (archivo["time"] + JSONBD_MODULE("tokens/!/CONFIG")(archivo["tipo"]).expira)) {
                                console.log("Eliminando token, expirado", token);
                                JSONBD_DELETE({
                                        ruta: `tokens/${token}`
                                });
                        }
                }
        });
}