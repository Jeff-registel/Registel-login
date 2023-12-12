module.exports = ({ query }) => {
  let { diccionario } = query;
  if (!diccionario.startsWith("tbl_")) {
    diccionario = `tbl_${diccionario}`;
  }
  switch (diccionario) {
    //Diccionarios admitidos
    case "tbl_tipo_documento":
    case "tbl_perfil":
    case "tbl_empresa":
      break;
    default:
      return {
        error: "No se encontró el diccionario solicitado",
      };
  }
  return SQL.EXEC(`SELECT * FROM ${diccionario}`);
};
