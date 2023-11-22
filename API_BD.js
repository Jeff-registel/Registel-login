const memoria = require("./app/memoria");
const _fs = require("./app/memoria/_fs");

module.exports = (pack_app) => {
  pack_app.app.get("/BD", async (req, res) => {
    let URL = req.protocol + "://" + req.get("host") + req.originalUrl;
    if (!URL.includes("?")) {
      return res
        .json({
          error: "No se ha especificado una consulta",
        })
        .end();
    }

    let json_query = new URLSearchParams(URL.substring(URL.indexOf("?"))).get(
      "json-query"
    );

    if (json_query) {
      return QUERY2JSON();
    }

    function QUERY2JSON() {
      let partesQuery = json_query.split("/");
      let cabeza = partesQuery.at(-1);
      if (cabeza.startsWith("{")) {
        let query = JSON.parse(cabeza);
        let instruccion = Object.keys(query)[0];
        let MACRO = `${memoria.config.RAIZ}/${json_query.replaceAll(
          "/" + cabeza,
          ""
        )}/!SISTEMA/!${instruccion + ".js"}`;

        if (_fs.existe(MACRO)) {
          if (Object.keys(query).some((clave) => clave.startsWith("!"))) {
            return res
              .json({
                error: "No se puede acceder a los atributos del sistema",
              })
              .end();
          }
          return res
            .json(
              require("./" + MACRO)({
                URL,
                instruccion,
                query: query[instruccion],
                context: {
                  pack_app,
                },
              })
            )
            .end();
        } else {
          return res
            .json({
              error: "No se ha encontrado la instruccion",
            })
            .end();
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
