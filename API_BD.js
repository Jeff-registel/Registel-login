const memoria = require("./app/memoria");
const _fs = require("./app/memoria/_fs");

module.exports = (pack_app) => {
  pack_app.app.get("/BD", async (req, res) => {
    let URL = req.protocol + "://" + req.get("host") + req.originalUrl;
    let partes = URL.split("?");
    if (!partes[1]) {
      return res.json({}).end();
    }
    let URLParams = new URLSearchParams(partes[1]);
    let EXEC = URLParams.get("queryJSON-EXEC");
    let urlQueryURL2JSON = URLParams.get("queryURL2JSON");

    if (EXEC) {
      try {
        let usuario = URLParams.get("usuario");
        if (usuario) {
          usuario = JSON.parse(usuario);
        }
        await memoria.EXEC(JSON.parse(EXEC), {
          context: {
            pack_app,
            usuario,
          },
        });
        return res.json({ status: "ok!" }).end();
      } catch (error) {
        return res.json({ status: "error", error }).end();
      }
    }

    if (urlQueryURL2JSON) {
      return QUERY2JSON();
    }

    function QUERY2JSON() {
      let partesQuery = urlQueryURL2JSON.split("/");
      let cabeza = partesQuery.at(-1);
      if (cabeza.startsWith(":")) {
        let MACROS =
          memoria.config.RAIZ +
          "/" +
          urlQueryURL2JSON.replace(cabeza, "@MACROS.js");
        cabeza = cabeza.slice(1);

        if (_fs.existe(MACROS)) {
          let params = cabeza
            .split(";")
            .filter((e) => e && e.includes("="))
            .map((e) => {
              let i = e.split("=");
              let llave = i[0];
              let valor = i[1];
              return { [llave]: valor };
            })
            .reduce((a, b) => Object.assign(a, b), {});
          let instruccion = params.i;
          delete params.i;
          return res
            .json(
              require("./" + MACROS)({
                instruccion,
                args: params,
                url: urlQueryURL2JSON,
                query: cabeza,
                context: {
                  pack_app,
                },
              })
            )
            .end();
        } else {
          return res.json({}).end();
        }
      }
      return res
        .json(
          memoria.tools.Array2Nodo(partesQuery, { context: { pack_app } })
            .cabeza
        )
        .end();
    }

    res
      .json(
        memoria.tools.Array2Nodo(partesQuery, { context: { pack_app } }).cabeza
      )
      .end();
  });
};
