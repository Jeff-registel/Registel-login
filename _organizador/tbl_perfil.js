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
        let perfiles = await execSql("SELECT * FROM tbl_perfil");
        for (let i = 0; i < perfiles.length; i++) {
                const perfil = perfiles[i];
                Object.entries(perfil).forEach(([key, value]) => {
                        if (!value || !["PK_PERFIL", "NOMBRE_PERFIL"].includes(key)) {
                                delete perfil[key];
                        }
                });
        }
        await JSONBD_EXEC({
                DOC: {
                        diccionarios: {
                                [`perfiles-usuario.json`]: {
                                        perfiles
                                }
                        },
                }
        })
}

main();