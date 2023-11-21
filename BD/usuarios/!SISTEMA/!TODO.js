const memoria = require("../../../app/memoria");
const _fs = require("../../../app/memoria/_fs")

module.exports = () => {
        return _fs.carpeta.listar(`${memoria.config.RAIZ}/usuarios`).map(usuario => usuario.name).filter(usuario => !usuario.startsWith("!"));
}