let config = require("./__config.json");
let fs = require("../_fs");
let { join } = require("path");

function pack(json) {
  console.log("PACK", json);
  if (!json) {
    json = { [config.RAIZ]: true };
  }else{
    json = { [config.RAIZ]: json }
  }

  resumir_arbol(json);

  function resumir_arbol(arbol, padres = []) {
    function cargar_rama({ padres = [], nombre }) {
      let retorno = {};
      fs.carpeta.listar(join(...padres, nombre)).forEach((archivo) => {
        retorno[archivo.name] = true;
      });
      return retorno;
    }
    Object.entries(arbol).forEach(([nombre, valor]) => {
      if (valor == false) {
        delete arbol[nombre]; //No se pidió consulta
        return;
      }

      let ruta = `${padres.join("/")}${padres.length ? "/" : ""}${nombre}`;

      console.log("RUTA", ruta);
      console.log("VALOR", valor);

      if (nombre.endsWith(".json")) {
        if (fs.esArchivo(ruta) && valor == true) {
          let json_leido = fs.archivo.leer(ruta);
          arbol[nombre] = json_leido;
        } else {
          delete arbol[nombre]; //No se encontró el json
        }
      } else if (fs.esCarpeta(ruta)) {
        if (valor == true) {
          arbol[nombre] = cargar_rama({
            padres,
            nombre,
          });
        }
        resumir_arbol(arbol[nombre], [...padres, nombre]);
      }
    });
  }

  return json[config.RAIZ];
}

module.exports = pack;
