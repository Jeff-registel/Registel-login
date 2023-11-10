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
  let tipo_documento = await execSql("SELECT * FROM tbl_tipo_documento");
  for (let i = 0; i < tipo_documento.length; i++) {
    const tipo = tipo_documento[i];
    let n = {};
    Object.assign(n, {
      "PK_TIPO_DOCUMENTO": tipo["id"],
      "NOMBRE": tipo["tipo"],
    });
    Object.keys(tipo).forEach((key) => {
      delete tipo[key];
    });
    Object.assign(tipo, n);
  }
  await memoria.EXEC({
    DOC: {
      diccionarios: {
        [`tipo-documento.json`]: {
          "tipo-documento": tipo_documento,
        },
      },
    },
  });
  setTimeout(() => {
        process.exit();
  }, 1000);
}

main();
