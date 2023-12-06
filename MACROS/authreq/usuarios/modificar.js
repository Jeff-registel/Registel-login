module.exports = async ({ query, usuario_peticion }) => {
  if (!query["PK"]) {
    return {
      error: "No hay PK de usuario",
    };
  }
  let datos_actuales = (
    await SQL.EXEC(`SELECT * FROM tbl_usuario WHERE PK = ${query["PK"]}`)
  )[0];
  if (!datos_actuales) {
    return {
      error: "No se encotrarón datos de este usuario",
    };
  }
  let datosModificados = {};
  for (let [key, value] of Object.entries(query)) {
    if (typeof value == "object" || Array.isArray(value)) {
      return {
        error: "Los valores a guardar no pueden ser datos complejos, ni objetos, ni Arrays",
      };
    }
    if (!Object.keys(datos_actuales)) {
        datosModificados[key] = value;
    }else{
        if (datos_actuales[key] != query[key]) {
            datosModificados[key] = value;
        }
    }
  }
  await SQL.SAVE({
    data: datosModificados,
    table: "usuario",
  });
};
