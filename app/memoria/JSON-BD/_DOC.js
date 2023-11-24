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
        let nodos = [...padres]
        let SET;
        while (nodos.pop()) {
          SET = `${nodos.join("/")}/!SISTEMA/!SET.js`;
          console.log(SET);
          if (fs.existe(SET)) {
            console.log("existe");
            break;
          }
        }


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
        if (fs.existe(SET) && !nombre.startsWith("!")) {
          json_combinado = await require(root + "/" + SET)({
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
