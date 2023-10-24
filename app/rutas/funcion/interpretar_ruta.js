const fs = require("fs");

function interpretar_ruta(req, res, next) {
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
    return res.redirect("/404");
  }

  let { info_pagina } = argumentos_ruta;

  console.log(JSON.stringify(info_pagina));

  if (info_pagina.extension == ".ejs") {
    return res.render(info_pagina.ruta, {
      ...argumentos_ruta,
      user: req.user,
    });
  } else {
    let { ruta } = info_pagina;
    if (fs.existsSync(ruta)) {
      let stat = fs.statSync(ruta);
      if (stat.isFile()) {
        return res.sendFile(info_pagina.ruta, { root: "./views" });
      }
    }
  }

  return res.redirect("/404");
}

module.exports = interpretar_ruta;
