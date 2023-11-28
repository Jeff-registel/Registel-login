let _fs = require("../../app/memoria/_fs");

module.exports = ({ ruta }) => {
    if (_fs.archivo.eliminar(ruta)) {
        return {
            ok: "Se ha eliminado el archivo",
        };        
    }
    return {
        error: "No se ha podido eliminar el archivo",
    };
}
