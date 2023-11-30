let _fs = require("../../app/memoria/_fs")

module.exports = ({ ruta }) => {
  let r = [JSONBD_ROOT, ruta].filter(Boolean).join("/").replaceAll("//", "/");
  console.log("EXIST", r, _fs.existe(r));
  return _fs.existe(r);
};
