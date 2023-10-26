let fs = require("../_fs");
let { join } = require("path");
let JSONBD_config = require("./__config.json");

function Array2Nodo(array_ruta_nodo, argumentos = {}) {
  let { valor_de_ultimo_elemento = {}, leer_json = true } = argumentos;
  let cuerpo = {};
  let cabeza = cuerpo;
  let cabeza_nombre;
  array_ruta_nodo
    .filter((e) => e != undefined)
    .forEach((nombre, indice, array) => {
      if (indice == array.length - 1) {
        cabeza[nombre] = valor_de_ultimo_elemento;
        let ruta = [JSONBD_config.RAIZ,...array.map((e) => e.toString())].join("/");
        if (nombre.toString().endsWith(".json") && leer_json) {
          cabeza[nombre] = fs.archivo.leer(ruta);
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
};
