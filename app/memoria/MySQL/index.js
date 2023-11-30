let mySQL = require('mysql');

var con = mySQL.createConnection({
        host: "localhost",
        user: "root",
        password: "diseno&desarrollo"
});

global.SQL = {
        EXEC: async (sql) => {
                return await new Promise((resolve, reject) => {
                        con.query(sql, function (err, result, fields) {
                                if (err) {
                                        return resolve({
                                                error: err
                                        });
                                }
                                resolve(result)
                        });
                });
        },
        GET_COLUMNS: async (table) => {
                return (await SQL.EXEC(`
                        SELECT COLUMN_NAME
                        FROM INFORMATION_SCHEMA.COLUMNS
                        WHERE TABLE_NAME = '${table}'
                `)).map((column) => {
                        return column.COLUMN_NAME;
                });
        },
        SAVE: async ({ table, data }) => {
                Object.keys(data).forEach((key) => {
                        if (!data[key] || data[key] == "null") {
                                delete data[key];
                        }
                });
                data["TIME_CREACION"] = new Date().getTime().toString();
                data["TIME_ACTUALIZACION"] = new Date().getTime().toString();
                let coincide = (await SQL.EXEC(`SELECT * FROM ${table} WHERE PK = ${data["PK"]}`)).length > 0;
                if (coincide) {
                        delete data["TIME_CREACION"];
                }
                let columns = await SQL.GET_COLUMNS(table);
                let columns_data = Object.keys(data);
                console.log("column_data", columns_data);
                for (let column of columns_data) {
                        if (!columns.includes(column)) {
                                await SQL.EXEC(`ALTER TABLE ${table} ADD ${column} VARCHAR(255)`);
                        }
                }
                if (coincide) {
                        return await SQL.EXEC(`
                                UPDATE ${table}
                                SET ${columns_data.map((column) => {
                                return `${column} = '${data[column] ?? ""}'`;
                        }).join(", ")}
                                WHERE PK = ${data["PK"]}
                        `);
                } else {
                        return await SQL.EXEC(`
                                INSERT INTO ${table} (${columns_data.join(", ")})
                                VALUES (${columns_data.map((column) => {
                                return `'${data[column]}'`;
                        }).join(", ")})`);
                }
        },
        USE: async (database) => {
                return await SQL.EXEC(`USE ${database}`);
        }
};

async function CLONAR({ modRow, tabla }) {
        await SQL.EXEC(`
                CREATE TABLE IF NOT EXISTS ${tabla} (
                        PK INT(10) NOT NULL PRIMARY KEY AUTO_INCREMENT
                )
        `);
        await SQL.USE("bd_cooperativa_rdw");
        let datosRDW = (await SQL.EXEC(`SELECT * FROM ${tabla}`));
        console.log(datosRDW);
        await SQL.USE("regislogin");
        datosRDW.forEach(async (row) => {
                modRow(row);
                console.log(await SQL.SAVE({
                        table: tabla,
                        data: row,
                }));
        });
}

(async () => {
        console.log(await SQL.EXEC("CREATE DATABASE IF NOT EXISTS regislogin"));

        CLONAR({
                modRow: (row) => {
                        row["PK"] = row["PK_USUARIO"];
                        row["PK_USUARIO"] = undefined;
                        row["FECHA_MODIFICACION"] = undefined;
                        row["FECHA_CREACION"] = undefined;
                        row["HABEAS_DATA"] = !!row["HABEAS_DATA"];
                },
                tabla: "tbl_usuarios",
        })
        CLONAR({
                modRow: (row) => {
                        row["PK"] = row["PK_PERFIL"];
                        row["PK_PERFIL"] = undefined;
                        row["FECHA_MODIFICACION"] = undefined;
                        row["FECHA_CREACION"] = undefined;
                },
                tabla: "tbl_perfil",
        })

})();