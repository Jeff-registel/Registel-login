
const sha256 = require('sha256');

console.log(sha256('registel'));

var mysql = require("mysql");
let memoria = require("../app/memoria");

let SQL_config = require("../app/SQL-config");

var conexion = mysql.createConnection(SQL_config);

function execSql(statement) {
        let p = new Promise(function (res, rej) {
                conexion.query(statement, function (err, result) {
                        if (err) rej(err);
                        else res(result);
                });
        });
        return p;
}

async function main() {
        console.log("Creando archivos JSON de usuarios...");
        let usuarios = await execSql("SELECT * FROM tbl_usuario");
        for (let i = 0; i < usuarios.length; i++) {
                const usuario = usuarios[i];
                console.log(`Creando archivo JSON de ${usuario["PK_USUARIO"]}`);
                Object.entries(usuario).forEach(([key, value]) => {
                        if (!value) {
                                delete usuario[key];
                        }
                });
                if (usuario["EMPRESAS_ACCESO"]) {
                        usuario["EMPRESAS_ACCESO"] = JSON.parse(usuario["EMPRESAS_ACCESO"]);
                }
                await memoria.EXEC({
                        DOC: {
                                usuarios: {
                                        [`${usuario["PK_USUARIO"]}.json`]: usuario
                                },
                        }
                })
        }
}

main();