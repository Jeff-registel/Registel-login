let memoria = require("../../app/memoria");
const _fs = require("../../app/memoria/_fs");

module.exports = async ({
  json,
  json_new,
  json_old,
  ruta,
  query,
  nombre,
  usuario,
}) => {
  console.log("jsonXXXX", json);
  require("../@MACROS")["ESTAMPAS_DE_TIEMPO"]({
    json,
    ruta,
    usuario,
  });

  let LOGIN = ruta.replace(nombre, "@LOGIN.json");
  let loginAlmacenado = _fs.archivo.leer(LOGIN);
  if (!loginAlmacenado) {
    loginAlmacenado = {};
  }
  if (
    json_new["LOGIN"] != json_old["LOGIN"] ||
    !loginAlmacenado[json["LOGIN"]]
  ) {
    LOGIN = LOGIN.replace(memoria.config.RAIZ + "/", "");

    async function UPDATE(k, v) {
      if (k == undefined) {
        return;
      }
      let QUERY_UPDATE = {};
      let TQUERY_UPDATE = QUERY_UPDATE;
      LOGIN.split("/").forEach((item, index, array) => {
        if (index == array.length - 1) {
          TQUERY_UPDATE[item] = {
            [k]: v,
          };
          return;
        }
        TQUERY_UPDATE[item] = {};
        TQUERY_UPDATE = TQUERY_UPDATE[item];
      });
      await memoria.EXEC({
        DOC: QUERY_UPDATE,
      });
    }

    if (!loginAlmacenado[json["LOGIN"]]) {
      await UPDATE(json["LOGIN"], json["PK_USUARIO"]);
    } else if (json_new["LOGIN"]) {
      await UPDATE(json_old["LOGIN"]);
      await UPDATE(json_new["LOGIN"], json["PK_USUARIO"]);
    }
  }

  ["FECHA_CREACION", "FECHA_MODIFICACION", "USUARIOBD", "FECHA_ULTIMO_LOGIN"].forEach((item) => {
    delete json[item];
  } );

  return json;
};
