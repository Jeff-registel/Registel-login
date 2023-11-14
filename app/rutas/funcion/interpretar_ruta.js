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
    return res.render("404.ejs", {
      info_pagina: {
        subir_a_raiz: "",
      },
      user: req.user,
    });
  }

  let { info_pagina } = argumentos_ruta;

  if (info_pagina.extension == ".ejs") {
    let nodos = info_pagina.carpeta.split("/").filter((n) => n);

    if (nodos[0] == "login") {
      if (!req.user) {
        let URLParametros = new URLSearchParams(URL.split("?")[1]);
        console.log(URLParametros)
        console.log(URLParametros.get("menu-izquierda"))
        if (URLParametros.get("menu-izquierda") == "false") {
          return res.send(`
            <style>
              body, html {
                margin: 0;
                padding: 0;
              }
            </style>
            <div style="display: flex; justify-content: center; align-items: center; height: 100vh; width: 100vw;background-color: white;color: black;">
              <h1>Debes iniciar sesión</h1>
            </div>
          `);
        } else {
          return res.redirect("/");
        }
      }
      if (nodos[1] == "admin") {
        if (![1, 2].includes(req.user["FK_PERFIL"])) {
          return res.send("Necesitas permisos de administrador");
        }
      }
    }

    return res.render(info_pagina.ruta, {
      ...argumentos_ruta,
      URL,
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

  return res.render("404.ejs", {
    info_pagina: {
      subir_a_raiz: "",
    },
    user: req.user,
  });
}

module.exports = interpretar_ruta;
