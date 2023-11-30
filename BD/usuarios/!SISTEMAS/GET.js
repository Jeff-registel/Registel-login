module.exports = ({ ruta }) => {
  if (!ruta.startsWith("usuarios")) {
    ruta = `usuarios/${ruta}`;
  }
  let json = JSONBD_MODULE("!/GET")({ ruta });
  ["CONTRASEÑA"].forEach((key) => {
    delete json[key];
  });
  return json;
};
