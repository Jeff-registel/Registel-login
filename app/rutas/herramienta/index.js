function limpiar_ruta(ruta) {
  if (!ruta) {
    return ruta;
  }
  ruta = ruta.replaceAll("//", "/");
  if (ruta.startsWith("/")) {
    ruta = ruta.substr(1);
  }
  return ruta;
}

function info_pagina_hoja(argumentos) {
  let {
    raiz = "view",
    nodos_ruta,
    ultimo_nodo_ruta,
    extension = "",
  } = argumentos;

  let ruta_carpeta_relativa = nodos_ruta.join("/");
  let archivo_estructura = ultimo_nodo_ruta;
  if (!ultimo_nodo_ruta.endsWith(extension)) {
    archivo_estructura += extension;
  }
  let ruta_carpeta = `${raiz}/${ruta_carpeta_relativa}`;
  let ruta = `${ruta_carpeta}/${archivo_estructura}`;

  ruta = limpiar_ruta(ruta)

  let profundidad = nodos_ruta.length;
  let p = [];
  for (let i = 0; i < profundidad; i++) {
    p.push("..");
  }
  let subir_a_raiz = p.join("/") + (profundidad ? "/" : "");
  let info_pagina = {
    carpeta: ruta_carpeta_relativa,
    nombre: ultimo_nodo_ruta,
    extension,
    profundidad,
    ruta: `${ruta_carpeta_relativa}/${archivo_estructura}`,
    subir_a_raiz,
  };
  return info_pagina;
}

module.exports = {
  limpiar_ruta,
  info_pagina_hoja
};
