let config = require("./__config.json");
let fs = require("../_fs");

function objeto(json, { context = {} }) {
  recorrer_arbol({
    [config.RAIZ]: json,
  });

  function recorrer_arbol(arbol, padres = []) {
    let retorno = {};

    Object.entries(arbol).forEach(async ([nombre, json_new]) => {
      if (nombre.endsWith(".json")) {
        let archivo_ruta = `${padres.join("/")}/${nombre}`;
        let SET = `${padres.join("/")}/@!SET.js`;
        let json_old = fs.archivo.leer(archivo_ruta);
        if (!json_old) {
          json_old = {};
        }
        let json_combinado = {
          ...json_old,
          ...json_new,
        };
        if (fs.existe(SET) && !nombre.startsWith("@")) {
          json_combinado = await require("../../../" + SET)({
            json: json_combinado,
            json_new,
            json_old,
            ruta: archivo_ruta,
            nombre,
            query: json,
            context,
          });
        }
        Object.entries(json_combinado).forEach(([clave, valor]) => {
          if (!valor) {
            delete json_combinado[clave];
          }
        });
        fs.archivo.escribir({
          nombre: archivo_ruta,
          contenido: json_combinado,
        });
        retorno = json_combinado;
        return;
      }
      recorrer_arbol(json_new, [...padres, nombre]);
    });

    return retorno;
  }
}

module.exports = objeto;
