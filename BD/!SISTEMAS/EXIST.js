module.exports = ({ ruta }) => {
  return _fs.existe(JSONBD_PATH(ruta));
};
