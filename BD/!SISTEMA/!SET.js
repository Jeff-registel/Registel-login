module.exports = async ({ json, context = {}, query }) => {
  /* ESTAMPAS_DE_TIEMPO({
    json,
    context,
    query,
  }); */
  return json;
};

function ESTAMPAS_DE_TIEMPO({ json, context = {}, query }) {
  let ahora = new Date();
  if (!json["__atributos__"]) {
    json["__atributos__"] = {};
  }
  let atributos = json["__atributos__"];
  let SET = atributos["SET"] ?? {};
  atributos["SET"] = SET;

  if (context.usuario) {
    let ACTUALIZACIÓN = SET["ACTUALIZACIÓN"] ?? [];
    ACTUALIZACIÓN.push({
      FECHA: ahora,
      USUARIO: context.usuario,
      //QUERY: query,
    });
    if (ACTUALIZACIÓN.length > 3) {
      ACTUALIZACIÓN.shift();
    }
    SET["ACTUALIZACIÓN"] = ACTUALIZACIÓN;
  }
  SET["FECHA_MODIFICACION"] = ahora;
  SET["CONTADOR"] = (SET["CONTADOR"] ?? 0) + 1;
  if (!atributos["FECHA_CREACION"]) {
    atributos["FECHA_CREACION"] = ahora;
  }
}
