let _fs = require("../../app/memoria/_fs");

module.exports = ({ query }) => {
    let { ruta } = query;
    if (_fs.archivo.eliminar(JSONBD_PATH(ruta))) {
        return {
            ok: "Se ha eliminado el archivo",
        };
    }
    return {
        error: "No se ha podido eliminar el archivo",
    };
}
