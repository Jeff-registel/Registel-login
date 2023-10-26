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
        delete arbol[nombre]; //No se pidió consulta
        return;
      }

      let ruta = `${padres.join("/")}${padres.length ? "/" : ""}${nombre}`;

      let es_hoja = nombre.endsWith(".json");

      if (arbol[nombre] && arbol[nombre] != true && !es_hoja) {
        resumir_arbol(arbol[nombre], [...padres, nombre]);
      } else if (es_hoja && hojas) {
        if ((arbol[nombre] = hojas)) {
          let json_leido = fs.archivo.leer(ruta);
          if (!json_leido) {
            delete arbol[nombre]; //No se encontró el json
            return;
          }
          arbol[nombre] = json_leido;
        }
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