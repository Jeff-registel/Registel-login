let mySQL = require("mysql");

let TABLE_REFERENCE = "bd_cooperativa_rdw";

let BasesDeDatos = [
  "bd_cooperativa_rdw",
  "bd_cootransar_rdw",
  "bd_empresas_rdw",
  "bd_lusitania_rdw",
  "bd_montebello_rdw",
  "bd_servitranstur_rdw",
  "bd_villavicencio_rdw",
];

var SLocal = mySQL.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "diseno&desarrollo",
});

let SRemote = mySQL.createConnection({
  host: "198.251.74.11",
  user: "root",
  password: "diseno&desarrollo",
});

global.SQL = {
  EXEC: async (sql, BD = SLocal) => {
    if (sql.includes(";\n")) {
      let queries = sql.split(";\n");
      let result = [];
      for (let query of queries) {
        if (query.trim() != "") {
          result.push(await SQL.EXEC(query));
        }
      }
      return result;
    }
    if (!sql.endsWith(";")) {
      sql += ";";
    }
    return await new Promise((resolve, reject) => {
      BD.query(sql, function (err, result, fields) {
        if (err) {
          console.log(sql);
          console.log(err);
          return resolve({
            error: err,
          });
        }
        resolve(result);
      });
    });
  },
  GET_COLUMNS: async (table) => {
    return (await SQL.EXEC(`DESCRIBE ${table}`)).map((column) => {
      return column.Field;
    });
  },
  SAVE: async ({ table, data }) => {
    if (data["error"]) {
      console.log(data);
      return data;
    }
    for (let key in data) {
      if (!data[key] || data[key] == "null") {
        delete data[key];
      }
    }
    let ahora = new Date().getTime().toString();
    data["TIME_CREACION"] = ahora;
    data["TIME_ACTUALIZACION"] = ahora;
    let coincide =
      (await SQL.EXEC(`SELECT * FROM ${table} WHERE PK = ${data["PK"] ?? -1}`))
        .length > 0;
    if (coincide) {
      delete data["TIME_CREACION"];
    }
    let columns_table = (await SQL.GET_COLUMNS(table)) ?? [];
    let columns_data = Object.keys(data);
    for (let column_data of columns_data) {
      if (!columns_table.includes(column_data)) {
        if (["TIME_CREACION", "TIME_ACTUALIZACION"].includes(column_data)) {
          await SQL.EXEC(`ALTER TABLE ${table} ADD ${column_data} BIGINT`);
        } else if (column_data.startsWith("FK_")) {
          await SQL.EXEC(`ALTER TABLE ${table} ADD ${column_data} INT`);
        } else {
          await SQL.EXEC(`ALTER TABLE ${table} ADD ${column_data} TEXT`);
        }
      }
    }
    if (coincide) {
      return await SQL.EXEC(`
                                UPDATE ${table}
                                SET ${columns_data
                                  .map((column) => {
                                    return `${column} = '${
                                      data[column] ?? ""
                                    }'`;
                                  })
                                  .join(", ")}
                                WHERE PK = ${data["PK"]}
                        `);
    } else {
      return await SQL.EXEC(`
                                INSERT INTO ${table} (${columns_data.join(
        ", "
      )})
                                VALUES (${columns_data
                                  .map((column) => {
                                    return `'${data[column]}'`;
                                  })
                                  .join(", ")})`);
    }
  },
  USE: async (database, BD = SLocal) => {
    return await SQL.EXEC(`USE ${database}`, BD);
  },
};

async function CLONAR({ modRow, tabla, BD }) {
  await SQL.USE(BD, SRemote);
  let datosRDW = await SQL.EXEC(`SELECT * FROM ${tabla}`, SRemote);

  if (datosRDW.error) {
    return;
  }

  await SQL.EXEC(`
                CREATE TABLE IF NOT EXISTS ${tabla} (
                        PK INT(10) NOT NULL PRIMARY KEY AUTO_INCREMENT
                )
        `);
  for (let row of datosRDW) {
    modRow(row);
    await SQL.SAVE({
      table: tabla,
      data: row,
    });
  }
}

(async () => {
  let BasesDeDatos = await SQL.EXEC("SHOW DATABASES", SRemote);
  if (BasesDeDatos.error) {
    return;
  }
  BasesDeDatos = BasesDeDatos.map((tabla) => tabla.Database).filter(
    (tabla) => tabla.startsWith("bd_") && tabla.endsWith("_rdw")
  );

  await SQL.EXEC("DROP SCHEMA IF EXISTS regislogin");
  await SQL.EXEC("CREATE DATABASE IF NOT EXISTS regislogin");
  await SQL.USE("regislogin");

  console.log("Combinación de los diferentes tipos de perfiles por PK");
  for (let BD of BasesDeDatos) {
    await CLONAR({
      modRow: (row) => {
        general(row);
        row["NOMBRE"] = row["NOMBRE_PERFIL"];
        row["NOMBRE_PERFIL"] = undefined;
      },
      tabla: "tbl_perfil",
      BD,
    });
  }

  console.log("Tratamiento de empresa");
  await tratamientoDeEmpresasInicial();

  console.log("Combinación de los diferentes tipos de empresa por PK");
  for (let BD of BasesDeDatos) {
    await CLONAR({
      modRow: (row) => {
        general(row);
      },
      tabla: "tbl_empresa",
      BD,
    });
  }

  console.log("Combinación de los diferentes tipos de documentos por PK");
  for (let BD of BasesDeDatos) {
    await CLONAR({
      modRow: (row) => {
        general(row);
        row["PK"] = row["ID"];
        row["ID"] = undefined;
        row["NOMBRE"] = row["TIPO"];
        row["TIPO"] = undefined;
      },
      tabla: "tbl_tipo_documento",
      BD,
    });
  }

  console.log("tratamiento de usuarios!");
  await tratamientoDeUsuarios();
  console.log("Llaves foraneas");
  await SQL.EXEC(`
                ALTER TABLE tbl_usuario ADD FOREIGN KEY (FK_PERFIL) REFERENCES tbl_perfil(PK);
                ALTER TABLE tbl_usuario ADD FOREIGN KEY (FK_EMPRESA) REFERENCES tbl_empresa(PK);
                ALTER TABLE tbl_usuario ADD FOREIGN KEY (FK_TIPO_DOCUMENTO) REFERENCES tbl_tipo_documento(PK);
        `);

  process.exit();

  async function tratamientoDeUsuarios() {
    let todos_los_usuarios = [];
    for (let BaseDeDatos of BasesDeDatos) {
      await SQL.USE(BaseDeDatos, SRemote);
      todos_los_usuarios = todos_los_usuarios.concat(
        await SQL.EXEC("SELECT * FROM tbl_usuario", SRemote)
      );
    }
    todos_los_usuarios = todos_los_usuarios.filter((usuario, index) => {
      if (
        todos_los_usuarios.find(
          (usuario2, index2) =>
            index < index2 &&
            (usuario2["CEDULA"] == usuario["CEDULA"] ||
              usuario2["LOGIN"] == usuario["LOGIN"])
        )
      ) {
        return false;
      }
      return true;
    });
    await SQL.EXEC(`
                CREATE TABLE IF NOT EXISTS tbl_usuario (
                        PK INT(10) NOT NULL PRIMARY KEY AUTO_INCREMENT
                )
        `);
    for (let usuario of todos_los_usuarios) {
      general(usuario);
      usuario["DOCUMENTO"] = usuario["CEDULA"];
      usuario["CEDULA"] = undefined;
      delete usuario["FECHA_ULTIMO_LOGIN"];
      delete usuario["USUARIOBD"];
      delete usuario["TOKEN"];
      delete usuario["EXPIRE_TOKEN"];
      delete usuario["PK"];
      await SQL.SAVE({
        table: "tbl_usuario",
        data: usuario,
      });
    }
  }

  function general(row) {
    delete row["PK_UNICA"];
    let K_PK = Object.keys(row).filter((key) => key.startsWith("PK_"))[0];
    if (K_PK && K_PK != "PK") {
      row["PK"] = row[K_PK];
      row[K_PK] = undefined;
    }
    Object.keys(row).forEach((key) => {
      if (key != key.toUpperCase()) {
        row[key.toUpperCase()] = row[key];
        row[key] = undefined;
      }
    });
    row["FECHA_MODIFICACION"] = undefined;
    row["FECHA_CREACION"] = undefined;
    row["MODIFICACION_LOCAL"] = undefined;
  }

  async function tratamientoDeEmpresasInicial() {
    console.log(
      await SQL.EXEC(`
                        CREATE TABLE IF NOT EXISTS tbl_empresa (
                                PK INT(10) NOT NULL PRIMARY KEY AUTO_INCREMENT
                        )
                `)
    );
    for (let [nombre, id] of Object.entries({
      autobuses: 2,
      cootransneiva: 3,
      cootranshuila: 4,
      flotahuila: 5,
      coomotor: 6,
      lusitania: 14,
      clientes: 7,
      montebello: 11,
      empresas: 15,
      rapidofenix: 13,
      contransmelgar: 21,
      coobusan: 16,
      interno: 17,
      cootransangil: 18,
      villavicencio: 19,
      cooperativa: 25,
      acusosa: 26,
      cañaveral: 27,
      servitranstur: 28,
      tunja: 29,
      cootranstur: 30,
      cootransar: 31,
      Yumbeños: 32,
      "lineas del valle": 33,
      cootranscota: 34,
    })) {
      await SQL.SAVE({
        table: "tbl_empresa",
        data: {
          PK: id,
          NOMBRE: nombre,
        },
      });
    }
  }
})();
