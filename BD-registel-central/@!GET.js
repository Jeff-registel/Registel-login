module.exports = ({ json, ruta, context }) => {
  require("./@MACROS")[`ESTAMPAS_GET`]({
    json,
    ruta,
    context
  });
  return json;
};