let memoria = require("../../app/memoria");

module.exports = ({ json, ruta, query, nombre, usuario, seguro }) => {
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
  if (seguro) {
    delete json["CONTRASENA"];
  }
  return json;
};
