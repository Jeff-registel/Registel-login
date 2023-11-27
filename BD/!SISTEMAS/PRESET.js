module.exports = ({ query, carpeta }) => {
  let { archivo, valor, update = true } = query;
  if (!archivo.endsWith(".json")) {
    return {
      error: "El archivo debe terminar en .json",
    };
  }
  if (typeof valor != "object") {
    return {
      error: "El valor a escribir debe ser un objeto",
    };
  }
  let valor_antiguo = {};
  if (update) {
    valor_antiguo = JSONBD_GET([carpeta, archivo].join("/"));
  }
  let nuevo_valor = {
    ...valor_antiguo,
    ...valor,
  };

  return {
    query,
    carpeta,
    archivo,
    valor,
    valor_antiguo,
    nuevo_valor,
  };
};