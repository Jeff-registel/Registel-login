module.exports = ({ json = {}, seguro = true }) => {
  if (seguro) {
    delete json["CONTRASENA"];
  }
  return json;
};
