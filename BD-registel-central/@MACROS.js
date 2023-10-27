function ESTAMPAS_DE_TIEMPO({ json, ruta, usuario }) {
  let ahora = new Date();
  if (!json["__atributos__"]) {
    json["__atributos__"] = {};
  }
  let atributos = json["__atributos__"];
  atributos["MODIFICACION"] = {
    FECHA: ahora,
    USUARIO: usuario,
    CONTADOR: atributos["MODIFICACION"]
      ? atributos["MODIFICACION"]["CONTADOR"] + 1
      : 1,
  };
  if (!atributos["FECHA_CREACION"]) {
    atributos["FECHA_CREACION"] = ahora;
  }
  if (!usuario) {
    delete atributos["MODIFICACION"]["USUARIO"];
  }
}

module.exports = {
  ESTAMPAS_DE_TIEMPO,
};
