/*
  Esta macro se encarga de modificar los datos de un usuario en la base de datos.

  Recibe como parametro un objeto query que debe contener el PK del usuario a modificar y los datos a modificar.

  Compara los datos actuales en la base de datos con los datos que se quieren guardar y solo guarda los que son diferentes.

  PENDIENTE: notificar con una notificación al usuario que se ha modificado su usuario.
  PENDIENTE: notificar a los usuarios conectados con una emisión de socket.io que se ha modificado un usuario.
  PENIENTE: usar el usuario_peticion para verificar que el usuario que hace la petición tiene permisos para modificar el usuario.

  Retorna un objeto con un mensaje de confirmación o un error.  
*/
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

  return {
    ok: "Usuario modificado",
  };
};
