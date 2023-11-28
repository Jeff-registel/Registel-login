const _fs = require("../../app/memoria/_fs");

module.exports = ({ carpeta }) => {
    if (_fs.esCarpeta(JSONBD_PATH(carpeta))) {
        return JSONBD_LIST(carpeta).map((archivo) => archivo.name).filter((archivo) => !archivo.startsWith("!"));
    }
    return {
        error: "Solo se puede listar una carpeta",
    }
}