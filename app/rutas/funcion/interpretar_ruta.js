const fs = require("fs");

function interpretar_ruta(req, res, next) {
  let URL = req.protocol + "://" + req.get("host") + req.originalUrl;

  let nodos_ruta = [];
  for (let i = 1; i < 100; i++) {
    let node = req.params[`node${i}`];
    if (node) {
      nodos_ruta.push(node);
    } else {
      break;
    }
  }
  let ultimo_nodo_ruta = nodos_ruta.pop();

  let argumentos_ruta = require("./buscar_archivo")(
    ...nodos_ruta,
    ultimo_nodo_ruta
  );

  if (!argumentos_ruta) {
    return res.render("@plantilla-general.ejs", {
      info_pagina: {
        subir_a_raiz: "",
        carpeta: "/",
        nombre: "404",
        ultimo_nodo_ruta: "404",
      },
      user: req.user,
    });
  }

  let { info_pagina } = argumentos_ruta;

  if ([".ejs", ".jsx"].includes(info_pagina.extension)) {
    return res.render(
      info_pagina.extension == ".ejs"
        ? info_pagina.ruta
        : "@plantilla-general.ejs",
      {
        ...argumentos_ruta,
        carpeta: nodos_ruta.join("/") + "/",
        URL,
        user: req.user,
      }
    );
  } else {
    let { ruta } = info_pagina;
    if (fs.existsSync(ruta)) {
      let stat = fs.statSync(ruta);
      if (stat.isFile()) {
        return res.sendFile(info_pagina.ruta, { root: "./views" });
      }
    }
  }

  return res.render("@plantilla-general.ejs", {
    ...argumentos_ruta,
    URL,
    user: req.user,
  });
}

module.exports = interpretar_ruta;
