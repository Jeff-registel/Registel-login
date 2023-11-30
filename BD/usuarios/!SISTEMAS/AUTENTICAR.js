const sha256 = require("sha256");

module.exports = ({ query }) => {
  let { login, contraseña } = query;

  if (!login || !contraseña) {
    return {
      error: "Faltan datos para la autenticacion",
    };
  }
  let usuarioLogin = JSONBD_MODULE("usuarios/!/TODO")({
    query: {
      findLogin: login,
    },
  });
  if (!usuarioLogin) {
    return {
      error: "El login de usuario no se ha encontrado " + login,
    };
  }
  let usuario = JSONBD_MODULE("!/GET")({
    ruta: `usuarios/${usuarioLogin["PK"]}/usuario.json`,
  });

  if (!usuario) {
    return {
      error:
        "No se ha encontrado el usuario " + login + " " + usuarioLogin["PK"],
    };
  }

  let { CONTRASEÑA, CRYPTOPASS } = usuario;

  switch (CRYPTOPASS) {
    case "CESAR":
      contraseña = JSONBD_MODULE("!/CESAR")({
        query: {
          text: contraseña,
        },
      });
      break;
    default:
      contraseña = sha256(contraseña);
      break;
  }

  if (CONTRASEÑA != contraseña) {
    return {
      error: "La contraseña es incorrecta",
    };
  }

  let retorno = JSONBD_MODULE("usuarios/!/GET")({
    ruta,
    json: usuario,
  });

  return retorno;
};