const memoria = require("./app/memoria");
const _fs = require("./app/memoria/_fs");

module.exports = (pack_app) => {
  pack_app.app.get("/BD", async (req, res) => {
    console.log("Corriendo API_BD");
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

    console.log("json_query", json_query);

    if (json_query) {
      let q = QUERY2JSON();
      return q;
    }

    function QUERY2JSON() {
      let partesQuery;
      let cabeza;

      if (!json_query.includes("/{") && !json_query.startsWith("{")) {
        partesQuery = json_query.split("/");
        cabeza = partesQuery.at(-1);
      } else {
        partesQuery = json_query.substring(0, json_query.indexOf("/{"));
        cabeza = json_query.substring(json_query.indexOf("/{"));
      }

      console.log("partesQuery", partesQuery);
      console.log("cabeza", cabeza);

      if (cabeza.startsWith("/{") || cabeza.startsWith("{")) {
        let query;
        if (cabeza.startsWith("{")) {
          query = JSON.parse(cabeza);
        } else {
          query = JSON.parse(cabeza.substring(1));
        }
        let instruccion = Object.keys(query)[0];

        console.log("instruccion", instruccion);
        if (instruccion == "DOC" || instruccion == "DELETE") {
          console.log(memoria.EXEC(query));
          return res.json(memoria.EXEC(query)).end();
        }

        let MACRO = `${memoria.config.RAIZ}/${json_query.replaceAll(
          (cabeza.startsWith("/") ? "" : "/") + cabeza,
          ""
        )}/!SISTEMA/!${instruccion + ".js"}`;

        console.log("MACRO", MACRO);
        console.log("_fs.existe(MACRO)", _fs.existe(MACRO));

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
