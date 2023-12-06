let _fs = require("./app/memoria/_fs");

let mySQL = require("mysql");

var con = mySQL.createConnection({
  host: "localhost",
  user: "root",
  password: "diseno&desarrollo",
});

global.SQL = {
        EXEC: async (sql) => {
                if (sql.includes(";\n")) {
                        let queries = sql.split(";\n");
                        let result = [];
                        for (let query of queries) {
                                if (query.trim() != "") {
                                        result.push(await SQL.EXEC(query));
                                }
                        }
                        return result;
                }
                if (!sql.endsWith(";")) {
                        sql += ";";
                }
                return await new Promise((resolve, reject) => {
                        con.query(sql, function (err, result, fields) {
                                if (err) {
                                        console.log(sql);
                                        console.log(err);
                                        return resolve({
                                                error: err
                                        });
                                }
                                if (result.length == 1) {
                                        result = result[0];
                                }
                                resolve(result)
                        });
                });
        },
        GET_COLUMNS: async (table) => {
                return (await SQL.EXEC(`DESCRIBE ${table}`)).map((column) => {
                        return column.Field;
                });
        },
        SAVE: async ({ table, data }) => {
                if (!table.startsWith("tbl_")) {
                        table = "tbl_" + table;
                }
                await SQL.EXEC(`
                        CREATE TABLE IF NOT EXISTS ${tabla} (
                                PK INT(10) NOT NULL PRIMARY KEY AUTO_INCREMENT
                        )
                `);
                if (data["error"]) {
                        console.log(data);
                        return data;
                }
                for (let key in data) {
                        if (!data[key] || data[key] == "null") {
                                delete data[key];
                        }
                }
                let ahora = new Date();
                data["TIME_CREACION"] = ahora;
                data["TIME_ACTUALIZACION"] = ahora;
                let coincide = (await SQL.EXEC(`SELECT * FROM ${table} WHERE PK = ${data["PK"] ?? -1}`)).length > 0;
                if (coincide) {
                        delete data["TIME_CREACION"];
                }
                let columns_table = (await SQL.GET_COLUMNS(table)) ?? [];
                let columns_data = Object.keys(data);
                for (let column_data of columns_data) {
                        if (!columns_table.includes(column_data)) {
                                if (["TIME_CREACION", "TIME_ACTUALIZACION"].includes(column_data)) {
                                        await SQL.EXEC(`ALTER TABLE ${table} ADD ${column_data} DATE`);
                                } else if (column_data.startsWith("FK_")) {
                                        await SQL.EXEC(`ALTER TABLE ${table} ADD ${column_data} INT`);
                                } else {
                                        await SQL.EXEC(`ALTER TABLE ${table} ADD ${column_data} TEXT`);
                                }
                        }
                }
                if (coincide) {
                        return await SQL.EXEC(`
                                UPDATE ${table}
                                SET ${columns_data.map((column) => {
                                return `${column} = '${data[column] ?? ""}'`;
                        }).join(", ")}
                                WHERE PK = ${data["PK"]}
                        `);
                } else {
                        return await SQL.EXEC(`
                                INSERT INTO ${table} (${columns_data.join(", ")})
                                VALUES (${columns_data.map((column) => {
                                return `'${data[column]}'`;
                        }).join(", ")})`);
                }
        },
        USE: async (database) => {
                return await SQL.EXEC(`USE ${database}`);
        }
};

SQL.USE("regislogin");

module.exports = () => {
  APP_PACK.app.get("/API", async (req, res) => {
    let URL = req.protocol + "://" + req.get("host") + req.originalUrl;
    if (!URL.includes("?")) {
      return res
        .json({
          error: "No se ha especificado una consulta",
        })
        .end();
    }
module.exports = (test = false) => {
        if (test) {
                return;
        }
        APP_PACK.app.get("/API", async (req, res) => {
                let URL = req.protocol + "://" + req.get("host") + req.originalUrl;
                if (!URL.includes("?")) {
                        return res
                                .json({
                                        error: "No se ha especificado una consulta",
                                })
                                .end();
                }

    let URLParams = new URLSearchParams(URL.substring(URL.indexOf("?")));

    let macro = URLParams.get("macro");
    let usuario_peticion = URLParams.get("usuario-peticion");
    if (usuario_peticion) {
      usuario_peticion = JSON.parse(usuario_peticion);
    }

    if (macro) {
      let partesQuery;
      let cabeza;

      if (!macro.includes("/{")) {
        partesQuery = macro.split("/");
      } else {
        partesQuery = macro.substring(0, macro.indexOf("/{")).split("/");
        cabeza = macro.substring(macro.indexOf("/{"));
      }

      let rutaMacro_SQL = [];

      let rutaMACRO_EQUIPO = [root, "MACROS", ...partesQuery].join("/") + ".js";
      let rutaREAD_EQUIPO = [root, "MACROS", ...partesQuery].join("/");

      if (_fs.existe(rutaREAD_EQUIPO) && rutaREAD_EQUIPO.endsWith(".md")) {
        let contenido = _fs.archivo.leer(rutaREAD_EQUIPO);
        var showdown = require("showdown"),
          html = new showdown.Converter().makeHtml(contenido);
        res.setHeader("Content-Type", "text/html");
        console.log(contenido);
        return res.send(
          `
            <style>
              @import url('https://fonts.googleapis.com/css2?family=Roboto&display=swap');
              body{
                      font-family: 'Roboto', sans-serif;
                      padding: 20px;
              }
            </style>
        ` + html
        );
      }

      if (!_fs.existe(rutaMACRO_EQUIPO)) {
        //La macro no se encontró en el equipo
        return res.json({
          error: "No se encontró la macro",
        });
      }

      if (rutaMacro_SQL.includes("authreq") && !usuario_peticion) {
        //La macro requiere autenticación
        return res.json({
          error: "La macro requiere autenticación",
        });
      }

      if (!cabeza) {
        //No hay parametros, la macro es directa
        let retorno = await require(rutaMACRO_EQUIPO)({
          URL,
          usuario_peticion,
          carpeta: rutaMacro_SQL.join("/"),
        });

        return res.json(retorno).end();
      }

      if (cabeza.startsWith("/{") || cabeza.startsWith("{")) {
        let paramsQuery;
        try {
          if (cabeza.startsWith("{")) {
            paramsQuery = JSON.parse(cabeza);
          } else {
            paramsQuery = JSON.parse(cabeza.substring(1));
          }
        } catch (error) {
          return res.json({
            error: "No se pudo parsear el query",
            query: cabeza,
          });
        }

        console.log("rutaMACRO_EQUIPO", rutaMACRO_EQUIPO);
        console.log(cabeza);
        console.log(paramsQuery);

        let retorno;

        try {
          retorno = await require(rutaMACRO_EQUIPO)({
            URL,
            usuario_peticion,
            carpeta: rutaMacro_SQL.join("/"),
            query: paramsQuery,
          });
        } catch (error) {
          console.log(error);
          return res.json({
            error: "No se pudo ejecutar la macro",
            query: cabeza,
          });
        }

        return res.json(retorno).end();
      }
    }

    //No se pidió una macro
    return res.json({
      error: "No se ha especificado una macro de consulta",
    });
  });
};
