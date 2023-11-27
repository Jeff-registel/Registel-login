let config = require("./__config.json");
let fs = require("../_fs");

function objeto(json, { context = {} } = {}) {
  try {
    recorrer_arbol({
      [config.RAIZ]: json,
    });
    return {
      ok: "todo bien"
    };
  } catch (error) {
    return {
      error: "No se pudo ejecutar la instruccion"
    };
  }


  function recorrer_arbol(arbol, padres = []) {
    let retorno = {};

    Object.entries(arbol).forEach(async ([nombre, json_new]) => {
      if (nombre.endsWith(".json")) {
        let archivo_ruta = `${padres.join("/")}/${nombre}`;

        let json_old = fs.archivo.leer(archivo_ruta);
        if (!json_old) {
          json_old = {};
        }
        let json_combinado = {
          ...json_old,
          ...json_new,
        };
        Object.entries(json_new).forEach(([clave, valor]) => {
          if (!valor) {
            delete json_combinado[clave];
          }
        });

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
