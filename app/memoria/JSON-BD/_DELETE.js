let config = require("./__config.json");
let fs = require("../_fs");
let { join } = require("path");

function objeto(json) {
  return objeto_json({ json });
}

function objeto_json({ json = {}, hojas = true, ramas = true }) {
  if (typeof json != "object") {
    return;
  }

  json = { [config.RAIZ]: json };

  resumir_arbol(json);

  function resumir_arbol(arbol, padres = []) {
    function cargar_rama({ padres = [], nombre }) {
      let retorno = {};
      fs.carpeta.listar(join(...padres, nombre)).forEach((archivo) => {
        let esHoja = hojas && archivo.isFile();
        let esRama = ramas && archivo.isDirectory();
        let estado = esHoja || esRama;
        if (estado) {
          retorno[archivo.name] = estado;
        }
      });
      return retorno;
    }
    Object.entries(arbol).forEach(([nombre, valor]) => {
      if (valor == false) {
        delete arbol[nombre]; //No se pidió eliminación
        return;
      }

      let ruta = `${padres.join("/")}${padres.length ? "/" : ""}${nombre}`;

      let borrar = nombre.endsWith(".json") || valor == true;

      if (arbol[nombre] && !borrar) {
        resumir_arbol(arbol[nombre], [...padres, nombre]);
      } else if (borrar) {
        fs.archivo.eliminar(ruta);
      } else {
        arbol[nombre] = cargar_rama({
          padres,
          nombre,
        });
      }
    });
  }
  return json[config.RAIZ];
}

module.exports = objeto;
