const memoria = require("../app/memoria");

function ESTAMPAS_GET({ json, ruta }) {
  let QUERY = {
    DOC: memoria.tools.array2Add(ruta, "__atributos__", {
      ...(json?.__atributos__ ?? {}),
      GET: {
        FECHA: new Date(),
        CONTADOR: (json?.__atributos__?.GET?.CONTADOR ?? 0) + 1,
      },
    }),
  };
  memoria.EXEC(QUERY);
}

function ESTAMPAS_DE_TIEMPO({ json }) {
  let ahora = new Date();
  if (!json["__atributos__"]) {
    json["__atributos__"] = {};
  }
  let atributos = json["__atributos__"];
  let SET = atributos["SET"] ?? {};
  atributos["SET"] = SET;
  SET["FECHA_MODIFICACION"] = ahora;
  SET["CONTADOR"] = (SET["CONTADOR"] ?? 0) + 1;
  if (!atributos["FECHA_CREACION"]) {
    atributos["FECHA_CREACION"] = ahora;
  }
}

module.exports = {
  ESTAMPAS_DE_TIEMPO,
  ESTAMPAS_GET,
};
