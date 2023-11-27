const memoria = require("../../../app/memoria");
const _fs = require("../../../app/memoria/_fs")

module.exports = ({ query }) => {
        let { usuarios, pks } = query;
        let retorno = {};
        retorno["pks"] = JSONBD_LIST("usuarios").map(usuario => usuario.name).filter(usuario => !usuario.startsWith("!"));
        if (usuarios) {
                retorno["usuarios"] = retorno["pks"].map(id => {
                        let ruta = `usuarios/${id}/usuario.json`;
                        return require(`./GET`)({
                                json: JSONBD_GET(ruta),
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