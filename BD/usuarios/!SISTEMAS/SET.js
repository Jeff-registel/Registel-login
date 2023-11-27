let tiempo_ultima_modificacion = 0;
let tiempo_espera_notificar_cambios = 3000;
let usuarios_modificados = [];


module.exports = ({
  query,
  carpeta,
  ejecutor,
}) => {

  let { aplicacion, archivo } = query;
  let PK = aplicacion["PK"];

  if (!aplicacion) {
    return {
      error: "No se ha especificado un usuario para modificar",
    }
  }

  carpeta = [carpeta, aplicacion["PK"]].join("/");

  let PRESET = JSONBD_MODULE("!/PRESET")({
    query,
    carpeta,
  });


  let {
    valor_antiguo,
    nuevo_valor,
  } = PRESET;

  let fechaString = new Date().SQL();

  if (archivo == "usuario.json") {

    notificarCambio("NOMBRE", "Nombre");
    notificarCambio("APELLIDO", "Apellido");
    notificarCambio("FK_TIPO_DOCUMENTO", "Tipo de documento");
    notificarCambio("CEDULA", "Número de documento");
    notificarCambio("EMAIL", "Correo electrónico");
    notificarCambio("MOVIL", "Número de celular");
    notificarCambio("TELEFONO", "Número de teléfono");
    notificarCambio("DIRECCION", "Dirección");
    notificarCambioDeHabeasData(PK);

    avisar_cambios(nuevo_valor);

    return {
      ok: "Se ha modificado el usuario"
    }
  }

  JSONBD_UPDATE({
    ruta: `${[carpeta, archivo].filter(Boolean).join("/")}`,
    valor: nuevo_valor
  });

  return {
    error: "Todo bien!"
  }

  function notificarCambioDeHabeasData(PK) {
    if (nuevo_valor["HABEAS_DATA"] && !valor_antiguo["HABEAS_DATA"]) {
      JSONBD_MODULE("usuarios/!/NOTIFICAR")({
        aplicacion: {
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
  function notificarCambio(Llave, Label) {
    if (nuevo_valor[Llave] != undefined && valor_antiguo[Llave] != undefined && nuevo_valor[Llave] != valor_antiguo[Llave]) {
      require("./NOTIFICAR")({
        ejecutor,
        query,
        usuario: {
          PK,
        },
        notificacion: {
          titulo: "Nombre de usuario",
          mensaje: `Se ha cambiado "${Label}" de usuario`,
          tipo: "info",
          icono: "fas fa-user-edit",
          swal: {
            title: `${Label} de usuario`,
            parametros: {
              inicial: valor_antiguo[Llave],
              final: nuevo_valor[Llave],
              fecha: fechaString,
              modificador: ejecutor,
            },
            html: HTML_MINIFY(`
              ha cambiado de <b>${valor_antiguo[Llave]}</b> a <b>${nuevo_valor[Llave]}</b>
              <br><br>
              ${fechaString}
              <br><br>
              <div class="ta-right">
              Por: ${JSONBD_GET(`usuarios/${ejecutor["PK"]}/usuario.json`)["LOGIN"]}
              </div>
            `)
          }
        }
      });
    }
  }
};

function avisar_cambios(json) {
  usuarios_modificados.push(json);
  if (
    Date.now() - tiempo_ultima_modificacion <
    tiempo_espera_notificar_cambios
  ) {
    return;
  }
  tiempo_ultima_modificacion = Date.now();
  setTimeout(() => {
    APP_PACK.io.emit("global: usuarios modificados", usuarios_modificados);
    usuarios_modificados = [];
  }, tiempo_espera_notificar_cambios);
}