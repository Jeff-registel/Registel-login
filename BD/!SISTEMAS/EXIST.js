let _fs = require("../../app/memoria/_fs")

module.exports = ({ ruta }) => {
  return _fs.existe([JSONBD_ROOT, ruta].filter(Boolean).join("/").replaceAll("//", "/"));
};
