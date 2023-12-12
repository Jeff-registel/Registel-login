/*
    Esta macro se encarga de buscar un usuario en la base de datos

    Recibe como parametro un objeto query-

    Si recibe un PK, busca el usuario con ese PK.

    Retorna un objeto usuario y lo procesa con la macro consultaGET.js
*/

let GET = require("./consultaGET");

module.exports = async ({query})=>{
    let { PK } = query;
    if (!PK) {
        return { error: "No se ha especificado el PK" };
    }
    let usuario = SQL.EXEC(`SELECT * FROM tbl_usuario WHERE PK = ${PK}`)[0];
    if (!usuario) {
        return { error: "No se ha encontrado el usuario" };
    }
    return GET(usuario);
}