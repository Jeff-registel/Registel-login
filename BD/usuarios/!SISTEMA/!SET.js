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

  if (nombre == "usuario.json") {
    let PK = ruta.split("/").at(-2);

    let fecha = new Date();
    let fechaString = fecha.getFullYear() + "-" + (fecha.getMonth() + 1).toString().padStart(2, "0") + "-" + fecha.getDate().toString().padStart(2, "0") + " " + fecha.getHours().toString().padStart(2, "0") + ":" + fecha.getMinutes().toString().padStart(2, "0") + ":" + fecha.getSeconds().toString().padStart(2, "0");

    if (json_new["NOMBRE"] != json_old["NOMBRE"]) {
      require("./!NOTIFICAR")({
        usuario: {
          PK,
        },
        notificacion: {
          titulo: "Nombre de usuario",
          mensaje: "Se ha cambiado el nombre de usuario",
          tipo: "info",
          icono: "fas fa-user-edit",
          swal: {
            title: "Nombre de usuario",
            html: `
              El nombre de usuario ha sido cambiado de <b>${json_old["NOMBRE"]}</b> a <b>${json_new["NOMBRE"]}</b>
              <br>
              <br>
              ${fechaString}
            `
          }
        }
      });
    }

    if (json_new["HABEAS_DATA"] && !json_old["HABEAS_DATA"]) {
      require("./!NOTIFICAR")({
        usuario: {
          PK,
        },
        notificacion: {
          titulo: "Habeas Data",
          mensaje: "Se ha aceptado el habeas data",
          tipo: "info",
          icono: "fas fa-user-shield",
        }
      });
    }
  }

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

  if (nombre == "usuario.json") {
    avisar_cambios(json);
  }

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