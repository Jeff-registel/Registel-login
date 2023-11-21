let memoria = require(root +"/app/memoria");
const _fs = require(root +"/app/memoria/_fs");

let tiempo_ultima_modificacion = 0;
let tiempo_espera_notificar_cambios = 3000;
let usuarios_modificados = [];

module.exports = async ({
  json,
  json_new,
  json_old,
  ruta,
  nombre,
  context,
  query,
}) => {
  require(root + "/BD/!SISTEMAS/SET")({
    json,
    context,
    query,
  });

  await ActualizarLOGIN(ruta, nombre, json_new, json_old, json);

  [
    "FECHA_CREACION",
    "FECHA_MODIFICACION",
    "USUARIOBD",
    "FECHA_ULTIMO_LOGIN",
    "EXPIRE_TOKEN",
    "TOKEN",
  ].forEach((item) => {
    json[item] = null;
  });

  avisar_cambios(json, context);

  return json;
};

function avisar_cambios(json, context) {
  if (!context.pack_app) {
    return;
  }
  usuarios_modificados.push(json);
  if (
    Date.now() - tiempo_ultima_modificacion <
    tiempo_espera_notificar_cambios
  ) {
    return;
  }
  tiempo_ultima_modificacion = Date.now();
  setTimeout(() => {
    let io = context.pack_app.io;
    console.log("avisar_cambios", usuarios_modificados.length);
    io.emit("usuarios_modificados", usuarios_modificados);
    usuarios_modificados = [];
  }, tiempo_espera_notificar_cambios);
}

async function ActualizarLOGIN(ruta, nombre, json_new, json_old, json) {
  let LOGIN = ruta.replace(nombre, "@ALIAS-LOGIN.json");
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
      await UPDATE(json["LOGIN"], json["PK"]);
    } else if (json_new["LOGIN"]) {
      await UPDATE(json_old["LOGIN"]);
      await UPDATE(json_new["LOGIN"], json["PK"]);
    }
  }
}
