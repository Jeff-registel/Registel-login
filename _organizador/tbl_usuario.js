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
  let usuarios = await execSql("SELECT * FROM tbl_usuario");
  for (let i = 0; i < usuarios.length; i++) {
    const usuario = usuarios[i];
    usuario["PK"] = usuario["PK_USUARIO"];
    usuario["PK_USUARIO"] = undefined;
    usuario["PK_UNICA"] = undefined;
    usuario["ESTADO"] = !!usuario["ESTADO"];
    if (usuario["EMPRESAS_ACCESO"]) {
      usuario["EMPRESAS_ACCESO"] = JSON.parse(usuario["EMPRESAS_ACCESO"]);
      if (!usuario["EMPRESAS_ACCESO"] || !usuario["EMPRESAS_ACCESO"].length) {
        delete usuario["EMPRESAS_ACCESO"];
      }
    } else {
      let empresas =
        require("../BD-registel-central/diccionarios/empresas.json")[
          "empresas"
        ];
      let lugares = Object.keys(empresas);
      lugares.forEach((lugar) => {
        let servicios = empresas[lugar]["Servicios"];
        let nombresServicios = Object.keys(servicios);
        nombresServicios.forEach((nombreServicio) => {
          let servicio = servicios[nombreServicio];
          if (servicio["ID"] == usuario["FK_EMPRESA"]) {
            delete usuario["FK_EMPRESA"];
            usuario["EMPRESAS_ACCESO"] = [
              {
                NOMBRE_SERVICIO: nombreServicio,
                ...servicio,
              },
            ];
          }
        });
      });
    }
    await memoria.EXEC({
      DOC: {
        usuarios: {
          [`${usuario["PK"]}.json`]: usuario,
        },
      },
    });

    setTimeout(() => {
      process.exit();
    }, 1000);
  }
}

main();
