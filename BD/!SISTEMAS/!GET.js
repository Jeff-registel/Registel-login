module.exports = ({ json, ruta, context }) => {
  ESTAMPAS_GET({
    json,
    ruta,
    context,
  });
  return json;
};

function ESTAMPAS_GET({ json, ruta, context = {}}) {
  let QUERY = {
    DOC: memoria.tools.array2Add(ruta, "__atributos__", {
      ...(json?.__atributos__ ?? {}),
      GET: {
        FECHA: new Date(),
        CONTADOR: (json?.__atributos__?.GET?.CONTADOR ?? 0) + 1,
      },
    }),
  };
  memoria.EXEC(QUERY, context);
}

