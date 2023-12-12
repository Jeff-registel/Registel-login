/*
  
  Esta macro se encarga de autenticar a un usuario en el sistema.

  Recibe como parámetros:
    - login: El login del usuario
    - contraseña: La contraseña del usuario

  Devuelve:
    - auth: true si el usuario se ha autenticado correctamente, false en caso contrario
    - error: En caso de que auth sea false, se devuelve el error que ha ocurrido
    - ok: En caso de que auth sea true, se devuelve un mensaje de éxito

  PENDIENTE: Sisitema de seguridad para evitar ataques de fuerza bruta.
*/

module.exports = async function ({ query }) {
  let { login, contraseña } = query;
  if (!login || !contraseña) {
    return {
      auth: false,
      error: "La macro requiere campos que no se han especificado",
    };
  }
  let user = await SQL.EXEC(
    `SELECT * FROM tbl_usuario WHERE LOGIN = '${login}' AND CONTRASENA = SHA2('${contraseña}', 256)`
  );
  if (!user.length) {
    return {
      auth: false,
      error: "Usuario o contraseña incorrectos",
    };
  }
  return {
    auth: true,
    ok: "Usuario autenticado correctamente",
  };
};
