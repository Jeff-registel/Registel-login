let sha256 = require("sha256");
const memoria = require("../../app/memoria");
const fs = require("../../app/memoria/_fs");

module.exports = (query) => {
  switch (query.instruccion) {
    case "todo":
      //http://localhost:3000/BD?queryURL2JSON=usuarios/:i=todo
      return TODO(query);
    case "auth":
      //http://localhost:3000/BD?queryURL2JSON=usuarios/:i=auth;login=alexmacias;contraseña=registel
      return AUTH(query);
    case "alias":
      //http://localhost:3000/BD?queryURL2JSON=usuarios/:i=alias;login=alexmacias
      return ALIAS({
        estilo: query.args.login ? "login" : "",
        alias: query.args.login,
        url: query.url,
      });
    default:
      return {};
  }
};

function TODO(query) {
  let retorno = [];
  let url = query.url;
  let cabeza = url.split("/").at(-1);
  Object.values(require("./@ALIAS-LOGIN.json")).forEach((PK) => {
    try {
      let usuario = fs.archivo.leer(
        memoria.config.RAIZ + "/" + url.replace(cabeza, `${PK}.json`)
      );
      delete usuario["__atributos__"];
      let clon = structuredClone(usuario);
      require("./@!GET-SEGURIDAD")({
        json: clon,
      });
      retorno.push(clon);
    } catch (error) {}
  });
  return retorno;
}

function ALIAS({ estilo, alias, url }) {
  let cabeza = url.split("/").at(-1);
  switch (estilo) {
    case "login":
      let PK = fs.archivo.leer(
        memoria.config.RAIZ + "/" + url.replace(cabeza, `@ALIAS-LOGIN.json`)
      )[alias];
      return memoria.tools.Array2Nodo(
        url.replace(cabeza, `${PK}.json`).split("/")
      ).cabeza;
    default:
      return {};
  }
}

function AUTH(query) {
  let auth = false;

  let PK = query.args["PK_USUARIO"];
  let PW = query.args["contraseña"] ?? "";
  PW = sha256(PW);

  let usuario;

  let LOGIN = query.args["login"];

  let url = query.url;
  let cabeza = url.split("/").at(-1);

  if (LOGIN) {
    PK = fs.archivo.leer(
      memoria.config.RAIZ + "/" + url.replace(cabeza, `@ALIAS-LOGIN.json`)
    )[LOGIN];
  }
  if (PK) {
    usuario = fs.archivo.leer(
      memoria.config.RAIZ + "/" + url.replace(cabeza, `${PK}.json`)
    );
  }
  if (usuario) {
    if (!usuario["__atributos__"]) {
      usuario["__atributos__"] = {};
    }
    let atributos = usuario["__atributos__"];

    let AUTH = atributos["AUTH"] ?? {};
    atributos["AUTH"] = AUTH;
    let INTENTOS_FALLIDOS_DE_SEGUIDO =
      AUTH["INTENTOS_FALLIDOS_DE_SEGUIDO"] ?? [];

    if (INTENTOS_FALLIDOS_DE_SEGUIDO.length >= 3) {
      //Penalización por intentos fallidos de seguido
      let FECHA = new Date(INTENTOS_FALLIDOS_DE_SEGUIDO.at(-1)["FECHA"]);
      let FECHA_ACTUAL = new Date();
      let DIFERENCIA = FECHA_ACTUAL.getTime() - FECHA.getTime();
      let segundos = 30 * Math.min(INTENTOS_FALLIDOS_DE_SEGUIDO.length - 2, 5);
      let cuentaRegresiva = segundos - DIFERENCIA / 1000;
      if (DIFERENCIA < segundos * 1000) {
        return {
          auth: false,
          segundos: cuentaRegresiva,
          intentos: INTENTOS_FALLIDOS_DE_SEGUIDO.length,
          error: `Demasiados intentos fallidos de seguido. Intente de nuevo en ${cuentaRegresiva.toFixed(
            0
          )} segundos.`,
        };
      }
    }

    auth = usuario["CONTRASENA"] == PW;

    if (!auth) {
      INTENTOS_FALLIDOS_DE_SEGUIDO.push({
        FECHA: new Date(),
        CONTRASENA_INTENTADA: query.args["contraseña"],
      });
      usuario = {};
      AUTH["FECHA_ERROR"] = new Date();
    } else {
      INTENTOS_FALLIDOS_DE_SEGUIDO = [];
      AUTH["FECHA_OK"] = new Date();
    }

    AUTH["INTENTOS_FALLIDOS_DE_SEGUIDO"] = INTENTOS_FALLIDOS_DE_SEGUIDO;

    let url = query.url.split("/");
    url.pop();
    url = url.join("/") + "/" + PK + ".json";

    memoria.EXEC({
      DOC: memoria.tools.array2Add(url, "__atributos__", atributos),
    });
  }
  let clon = structuredClone(usuario);
  require("./@!GET-SEGURIDAD")({
    json: clon,
  });
  return { auth, usuario: clon };
}
