let tiempo_ultima_modificacion = 0;
let tiempo_espera_notificar_cambios = 3000;
let usuarios_modificados = [];

let NOTIFICAR = JSONBD_MODULE("usuarios/!/NOTIFICAR");

module.exports = ({
  query,
  carpeta,
  ejecutor,
}) => {

  let { aplicacion, archivo } = query;

  if (!aplicacion || aplicacion["PK"] < 1) {
    return {
      error: "No se ha especificado un usuario para modificar",
    }
  }

  carpeta = [carpeta, aplicacion["PK"]].join("/");

  let {
    valor_antiguo,
    nuevo_valor,
  } = JSONBD_MODULE("!/PRESET")({
    query,
    carpeta,
  });

  if (archivo == "usuario.json") {
    //Casos especiales de cambio de datos
    if (hayCambio("LOGIN")) {
      let login = JSONBD_MODULE("usuarios/!/TODO")({
        query: {
          findLogin: nuevo_valor["LOGIN"],
        },
      });
      if (login) {
        return {
          error: "El login de usuario ya existe",
        }
      }
    }
    if (hayCambio("EMAIL")) {
      let email = JSONBD_MODULE("usuarios/!/TODO")({
        query: {
          findEmail: nuevo_valor["EMAIL"],
        },
      });
      if (email) {
        return {
          error: "El correo electrónico de usuario ya existe",
        }
      }
    }
    notificarCambio("NOMBRE", "Nombre");
    notificarCambio("APELLIDO", "Apellido");
    notificarCambio("FK_TIPO_DOCUMENTO", "Tipo de documento");
    notificarCambio("CEDULA", "Número de documento");
    notificarCambio("EMAIL", "Correo electrónico");
    notificarCambio("MOVIL", "Número de celular");
    notificarCambio("TELEFONO", "Número de teléfono");
    notificarCambio("DIRECCION", "Dirección");
    notificarCambioDeHabeasData();

    avisar_cambios(nuevo_valor);
  }

  JSONBD_UPDATE({
    ruta: `${[carpeta, archivo].filter(Boolean).join("/")}`,
    valor: nuevo_valor
  });

  return {
    ok: "Todo bien!"
  }

  function notificarCambioDeHabeasData() {
    if (nuevo_valor["HABEAS_DATA"] && !valor_antiguo["HABEAS_DATA"]) {
      NOTIFICAR({
        ejecutor,
        query: {
          ...query,
          notificacion: {
            titulo: "Habeas Data",
            mensaje: "Se ha aceptado el habeas data",
            tipo: "info",
            icono: "fas fa-user-shield",
          },
        },
      });
    }
  }

  function hayCambio(Llave) {
    return nuevo_valor[Llave] != undefined && valor_antiguo[Llave] != undefined && nuevo_valor[Llave] != valor_antiguo[Llave];
  }

  function notificarCambio(Llave, Label) {
    let fechaString = new Date().SQL();

    if (hayCambio(Llave)) {
      NOTIFICAR({
        ejecutor,
        query: {
          ...query,
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
          },
        },
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
    MENSAJE_GLOBAL("global: usuarios modificados", usuarios_modificados);
    usuarios_modificados = [];
  }, tiempo_espera_notificar_cambios);
}