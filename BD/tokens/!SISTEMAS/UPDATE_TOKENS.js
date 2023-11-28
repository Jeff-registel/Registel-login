module.exports = () => {
        JSONBD_MODULE("!/LIST")({
                carpeta: "tokens"
        }).filter(e => e.endsWith(".json")).forEach((token) => {
                console.log("Token", token);
                let archivo = JSONBD_GET(`tokens/${token}`);
                console.log("Archivo", archivo);
                if (archivo) {
                        if (new Date().getTime() - (archivo["time"] + JSONBD_MODULE("tokens/!/CONFIG")(archivo["tipo"]).expira) > 0) {
                                console.log("Eliminando token, expirado", token);
                                JSONBD_DELETE(`tokens/${token}`);
                        } else {
                                console.log("No se elimino token", token);
                        }
                }
        });
}