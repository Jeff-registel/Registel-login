const memoria = require("../../../app/memoria");

module.exports = ({ json, ruta, seguro = true, context }) => {
  require(root + "/" + memoria.config.RAIZ + "/!SISTEMA/!GET")({
    json,
    ruta,
    context,
  });
  if (seguro) {
    delete json["CONTRASEÑA"];
  }
  return json;
};
