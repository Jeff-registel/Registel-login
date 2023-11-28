let GET_USUARIO = JSONBD_MODULE(`usuarios/!/GET`);

module.exports = ({ query, find, some, carpeta }) => {
        let { usuarios, pks } = query;
        let retorno = {};
        retorno["pks"] = JSONBD_LIST("usuarios").map(usuario => usuario.name).filter(usuario => !usuario.startsWith("!"));
        if (usuarios) {
                let loadObj = (PK) => {
                        ruta = `${carpeta}/${PK}/usuario.json`;
                        return JSONBD_GET(ruta);
                };
                if (find) {
                        return GET_USUARIO({
                                json: loadObj(retorno["pks"].find((PK) => find(loadObj(PK)))),
                                ruta,
                        });
                }
                if (some) {
                        return retorno["pks"].some((PK) => some(loadObj(PK)));
                }
                retorno["usuarios"] = retorno["pks"].map((PK) => {
                        return GET_USUARIO({
                                json: loadObj(PK),
                                ruta,
                        });
                });
                if (!pks) {
                        return retorno["usuarios"];
                }
        } else {
                return retorno["pks"];
        }
        return retorno;
}