/*
Se encarga de actualizar campos en el archivo.

Es mas lento que WRITE.js
*/
module.exports = ({ query }) => {
  let { ruta, valor } = query;

  console.log("UPDATE", query);

  if (!ruta.endsWith(".json")) {
    return {
      error: "El archivo debe ser .json",
    };
  }
  if (typeof valor != "object") {
    return {
      error: "El valor a escribir debe ser un objeto",
    };
  }
  let partes = ruta.split("/");
  let obj = {};
  let cabeza = obj;
  partes.forEach((parte, index) => {
    if (index == partes.length - 1) {
      if (!parte.endsWith(".json")) {
        return {
          error: "El archivo debe terminar en .json",
        };
      }
      cabeza[parte] = valor;
    } else {
      cabeza[parte] = {};
      cabeza = cabeza[parte];
    }
  });
  JSONBD_EXEC({
    DOC: obj,
  });
  return {
    ok: "Se ha actualizado el archivo",
  };
};
