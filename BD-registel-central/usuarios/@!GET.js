module.exports = ({ json, ruta, seguro = true }) => {
  require("../@!GET")({
      json,
      ruta,
  });
  require("./@!GET-SEGURIDAD")({
    json,
    seguro
  });
  return json;
};