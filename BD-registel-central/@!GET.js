module.exports = ({ json, ruta }) => {
  require("./@MACROS")[`ESTAMPAS_GET`]({
    json,
    ruta,
  });
  return json;
};