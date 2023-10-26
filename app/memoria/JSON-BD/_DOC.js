let config = require("./__config.json");
let fs = require("../_fs")

function objeto(json) {
  recorrer_arbol({
    [config.RAIZ]: json,
  });

  function recorrer_arbol(arbol, padres = []) {
    Object.entries(arbol).forEach(([nombre, nodo]) => {
      if (nombre.endsWith(".json")) {
        let archivo_ruta = `${padres.join("/")}/${nombre}`;
        let json_nuevo = fs.archivo.leer(
          archivo_ruta
        );
        json_nuevo ??= {};
        Object.assign(json_nuevo, nodo);
        fs.archivo.escribir({
          nombre: archivo_ruta,
          contenido: json_nuevo,
        });
        return;
      }
      recorrer_arbol(nodo, [...padres, nombre]);
    });
  }
}

module.exports = objeto;
