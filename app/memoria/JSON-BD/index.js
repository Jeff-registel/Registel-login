let fs = require("../../memoria/_fs");
let config = require("./__config.json");

if (!fs.existe(config.RAIZ)) {
    fs.carpeta.nueva(config.RAIZ);
}

module.exports = {
    escribir: require("./_DOC"),
    leer: require("./_READ"),
    EXEC: require("./-EXEC"),
    PACK: require("./_PACK"),
}