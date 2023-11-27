//const fetch = require("node-fetch");
const config = require("./config.json")
let interpretar_ruta = require("./funcion/interpretar_ruta")

require("./herramienta")

let mapa = {
  "/": interpretar_ruta,
};

let nodos = [];

for (let i = 1; i < config["nodos-soportados"]; i++) {
  nodos.push(`node${i}`);
  mapa[`/:${nodos.join("/:")}`] = interpretar_ruta;
}

module.exports = function () {
  let { app } = APP_PACK;
  require("./rutas-manuales")();
  
  Object.entries(mapa).forEach(([k, v]) => {
    app.get(k, v);
  });
};
