let memoria = require(root + "/app/memoria");
const _fs = require(root + "/app/memoria/_fs");

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
  require(root + "/BD/!SISTEMA/!SET")({
    json,
    context,
    query,
  });

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

  avisar_cambios(json);

  return json;
};

function avisar_cambios(json) {
  console.log("avisar_cambios", json);
  usuarios_modificados.push(json);
  if (
    Date.now() - tiempo_ultima_modificacion <
    tiempo_espera_notificar_cambios
  ) {
    return;
  }
  tiempo_ultima_modificacion = Date.now();
  setTimeout(() => {
    console.log("avisar_cambios", usuarios_modificados.length);
    require(root + "/index").io.emit("global: usuarios modificados", usuarios_modificados);
    usuarios_modificados = [];
  }, tiempo_espera_notificar_cambios);
}