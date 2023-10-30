let fs = require("../_fs");
let JSONBD_config = require("./__config.json");

function array2Add(array_ruta_nodo, k, v) {
  if (k == undefined) {
    return;
  }
  array_ruta_nodo = array_ruta_nodo.replace(JSONBD_config.RAIZ+"/", "");
  let QUERY_UPDATE = {};
  let TQUERY_UPDATE = QUERY_UPDATE;
  array_ruta_nodo.split("/").forEach((item, index, array) => {
    if (index == array.length - 1) {
      TQUERY_UPDATE[item] = {
        [k]: v,
      };
      return;
    }
    TQUERY_UPDATE[item] = {};
    TQUERY_UPDATE = TQUERY_UPDATE[item];
  });
  return QUERY_UPDATE;
}

function Array2Nodo(
  array_ruta_nodo,
  { valor_de_ultimo_elemento = {}, leer_json = true, seguro = true, context = {} } = {}
) {
  let cuerpo = {};
  let cabeza = cuerpo;
  let cabeza_nombre;
  array_ruta_nodo
    .filter((e) => e != undefined)
    .forEach((nombre, indice, array) => {
      if (indice == array.length - 1) {
        cabeza[nombre] = valor_de_ultimo_elemento;
        let ruta = [JSONBD_config.RAIZ, ...array.map((e) => e.toString())].join(
          "/"
        );
        if (nombre.toString().endsWith(".json") && leer_json) {
          cabeza[nombre] = fs.archivo.leer(ruta);
          let GET = ruta.replace(nombre, "@!GET.js");
          if (fs.existe(GET)) {
            cabeza[nombre] = require("../../../" + GET)({
              json: cabeza[nombre],
              ruta,
              nombre,
              query: array,
              seguro,
              context,
            });
          }
        }
      } else {
        cabeza[nombre] = {};
      }
      cabeza = cabeza[nombre];
      cabeza_nombre = nombre;
    });
  return {
    cuerpo,
    cabeza,
    cabeza_nombre,
  };
}

module.exports = {
  Array2Nodo,
  array2Add,
};
