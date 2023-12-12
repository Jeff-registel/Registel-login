/*
    Este macro retorna todos los usuarios de la base de datos.

    Retorna un array de objetos usuario y los procesa con la macro consultaGET.js
*/

let GET = require("./consultaGET");

module.exports = async function () {
  let usuarios = (await SQL.EXEC("SELECT * FROM tbl_usuario")).map((usuario) =>
    GET(usuario)
  );
  return usuarios;
};
