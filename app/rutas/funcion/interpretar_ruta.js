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
    console.log("No se encontró la ruta:", URL)
    console.log({
      subir_a_raiz: "",
      carpeta: "/",
      nombre: "404",
      ultimo_nodo_ruta: "404",
    })
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
    let nodos = info_pagina.carpeta.split("/").filter((n) => n);
    if (nodos[0] == "logged") {
      let URLParametros = new URLSearchParams(URL.split("?")[1]);
      if (!req.user) {
        if (URLParametros.get("menu-izquierda") == "false") {
          return res.redirect("/unlogged");
        }
        return res.redirect("/");
      }
    }
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
