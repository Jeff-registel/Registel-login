let config = require("./__config.json");
let fs = require("../_fs")

function objeto(json, {
  usuario
}) {
  recorrer_arbol({
    [config.RAIZ]: json,
  });

  function recorrer_arbol(arbol, padres = []) {
    Object.entries(arbol).forEach(async([nombre, json_new]) => {
      if (nombre.endsWith(".json")) {
        let archivo_ruta = `${padres.join("/")}/${nombre}`;
        let SET = `${padres.join("/")}/@SET.js`;
        let json_old = fs.archivo.leer(
          archivo_ruta
        );
        if(!json_old){
          json_old = {};
        }
        let json_combinado = {
          ...json_old, 
          ...json_new
        };
        if (fs.existe(SET) && !nombre.startsWith("@")) {
          json_combinado = await require("../../../" + SET)({
            json: json_combinado,
            json_new,
            json_old,
            ruta: archivo_ruta,
            nombre,
            query: json,
            usuario
          });
        }
        fs.archivo.escribir({
          nombre: archivo_ruta,
          contenido: json_combinado,
        });
        return;
      }
      recorrer_arbol(json_new, [...padres, nombre]);
    });
  }
}

module.exports = objeto;
