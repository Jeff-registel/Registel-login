const fs = require("fs");
const herramienta = require("../herramienta");

function ruta_existe(ruta, raiz) {
  if (raiz) {
    ruta = raiz + "/" + ruta;
  }
  if (fs.existsSync(ruta)) {
    let stat = fs.statSync(ruta);
    return stat.isFile();
  }
}

function buscar_archivo(...nodos_de_ruta) {
  nodos_de_ruta = nodos_de_ruta.filter((e) => e);
  let ultimo_nodo_ruta = nodos_de_ruta.pop() ?? "index";
  let ruta;
  let retorno;

  ["views", "public"].forEach((carpeta_base) => {
    ["", ".ejs", ".json"].forEach((extension) => {
      if (retorno) {
        return;
      }

      function retornar(argumentos) {
        let { profundidad } = argumentos;
        let p = [];
        for (let i = 0; i < profundidad; i++) {
          p.push("..");
        }

        let subir_a_raiz = p.join("/") + (profundidad ? "/" : "");
        return {
          info_pagina: {
            ...argumentos,
            ruta,
            extension,
            subir_a_raiz,
          },
        };
      }

      function caso_1_archivo_consultado() {
        ruta = `${nodos_de_ruta.join("/")}/${ultimo_nodo_ruta + extension}`;
        ruta = herramienta.limpiar_ruta(ruta);
        if (ruta_existe(ruta, carpeta_base)) {
          return retornar({
            profundidad: nodos_de_ruta.length,
            carpeta: nodos_de_ruta.join("/"),
            nombre: ultimo_nodo_ruta,
          });
        }
      }

      function caso_2_carpeta_consultada() {
        ruta = `${nodos_de_ruta.join("/")}/${
          ultimo_nodo_ruta + "/index" + extension
        }`;
        ruta = herramienta.limpiar_ruta(ruta);
        if (ruta_existe(ruta, carpeta_base)) {
          return retornar({
            profundidad: nodos_de_ruta.length + 1,
            carpeta: nodos_de_ruta.join("/") + "/" + ultimo_nodo_ruta,
            nombre: "index",
          });
        }
      }

      retorno = caso_1_archivo_consultado() ?? caso_2_carpeta_consultada();
    });
  });
  return retorno;
}

module.exports = buscar_archivo;