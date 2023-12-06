module.exports = ({ query }) => {
  let { diccionario } = query;
  if (!diccionario.startsWith("tbl_")) {
    diccionario = `tbl_${diccionario}`;
  }
  switch (diccionario) {
    //Diccionarios admitidos
    case "tbl_tipo_documento":
      break;
    default:
      return {
        error: "No se encontró el diccionario solicitado",
      };
  }
  return SQL.EXEC(`SELECT * FROM ${diccionario}`);
};
