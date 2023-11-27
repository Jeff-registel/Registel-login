const _fs = require("../../app/memoria/_fs");

module.exports = ({ ruta, valor }) => {
        if (!ruta.endsWith(".json")) {
                return {
                        error: "El archivo debe ser .json",
                };
        }
        if (typeof valor != "object") {
                return {
                        error: "El valor a escribir debe ser un objeto",
                };
        }
        _fs.archivo.escribir({
                nombre: ruta,
                contenido: valor
        })
        return {
                ok: "Se ha actualizado el archivo"
        }
}