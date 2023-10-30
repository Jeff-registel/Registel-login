module.exports = ({ json, ruta, seguro = true, context }) => {
  require("../@!GET")({
      json,
      ruta,
      context,
  });
  require("./@!GET-SEGURIDAD")({
    json,
    seguro
  });
  return json;
};