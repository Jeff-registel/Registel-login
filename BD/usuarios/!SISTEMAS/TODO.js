let GET_USUARIO = JSONBD_MODULE(`usuarios/!/GET`);

module.exports = ({ query, find, carpeta = "usuarios" }) => {
  let { usuarios, pks, findEmail, findLogin } = query;
  if (findEmail) {
    find = (usuario) => usuario["EMAIL"] == findEmail;
    usuarios = true;
  }
  if (findLogin) {
    find = (usuario) => usuario["LOGIN"] == findLogin;
    usuarios = true;
  }
  let retorno = {};
  retorno["pks"] = JSONBD_LIST("usuarios")
    .map((usuario) => usuario.name)
    .filter((usuario) => !usuario.startsWith("!"));
  if (usuarios) {
    let loadObj = (PK) => {
      ruta = `${PK}/usuario.json`;
      return GET_USUARIO(ruta);
    };
    if (find) { //Reducción de complejidad
      retorno["pks"].find((PK) => find(loadObj(PK))); //Busca el PK del usuario
      return GET_USUARIO({
        ruta,
      });
    }
    retorno["usuarios"] = retorno["pks"].map((PK) => {
      return GET_USUARIO({
        ruta: `${PK}/usuario.json`,
      });
    });
    if (!pks) {
      return retorno["usuarios"];
    }
  } else {
    return retorno["pks"];
  }
  return retorno;
};