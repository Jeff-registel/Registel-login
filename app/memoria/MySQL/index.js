require("../../../API_BD_SQL")(true);


async function CLONAR({ modRow, tabla }) {
        await SQL.USE(TABLE_REFERENCE);
        let datosRDW = (await SQL.EXEC(`SELECT * FROM ${tabla}`));
        await SQL.USE("regislogin");
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
        };
}

(async () => {
        await SQL.EXEC("DROP SCHEMA IF EXISTS regislogin");
        await SQL.EXEC("CREATE DATABASE IF NOT EXISTS regislogin");

        for (let tabla of ALL_TABLES) {
                TABLE_REFERENCE = tabla;
                await SQL.USE(TABLE_REFERENCE);
                await CLONAR({
                        modRow: (row) => {
                                general(row);
                                row["NOMBRE"] = row["NOMBRE_PERFIL"];
                                row["NOMBRE_PERFIL"] = undefined;
                        },
                        tabla: "tbl_perfil",
                });
        }
        TABLE_REFERENCE = "bd_cooperativa_rdw";
        await SQL.USE(TABLE_REFERENCE);
        await CLONAR({
                modRow: (row) => {
                        general(row);
                        row["NOMBRE"] = row["NOMBRE_PERFIL"];
                        row["NOMBRE_PERFIL"] = undefined;
                },
                tabla: "tbl_perfil",
        });

        await tratamientoDeEmpresasInicial();

        await CLONAR({
                modRow: (row) => {
                        general(row);
                },
                tabla: "tbl_empresa",
        });
        await CLONAR({
                modRow: (row) => {
                        general(row);
                        row["PK"] = row["ID"];
                        row["ID"] = undefined;
                        row["NOMBRE"] = row["TIPO"];
                        row["TIPO"] = undefined;
                },
                tabla: "tbl_tipo_documento",
        });

        await tratamientoDeUsuarios();

        await SQL.EXEC(`
                ALTER TABLE tbl_usuario ADD FOREIGN KEY (FK_PERFIL) REFERENCES tbl_perfil(PK);
                ALTER TABLE tbl_usuario ADD FOREIGN KEY (FK_EMPRESA) REFERENCES tbl_empresa(PK);
                ALTER TABLE tbl_usuario ADD FOREIGN KEY (FK_TIPO_DOCUMENTO) REFERENCES tbl_tipo_documento(PK);
        `)

        process.exit();

        async function tratamientoDeUsuarios() {
                let todos_los_usuarios = [];
                for (let tabla of ALL_TABLES) {
                        await SQL.USE(tabla);
                        todos_los_usuarios = todos_los_usuarios.concat(await SQL.EXEC("SELECT * FROM tbl_usuario"));
                }
                todos_los_usuarios = todos_los_usuarios.filter((usuario, index) => {
                        if (todos_los_usuarios.find((usuario2, index2) => index < index2 && (usuario2["CEDULA"] == usuario["CEDULA"] || usuario2["LOGIN"] == usuario["LOGIN"]))) {
                                return false;
                        }
                        return true;
                });
                await SQL.USE("regislogin");
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
                        console.log(usuario);
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
                await SQL.USE("regislogin");
                console.log(await SQL.EXEC(`
                        CREATE TABLE IF NOT EXISTS tbl_empresa (
                                PK INT(10) NOT NULL PRIMARY KEY AUTO_INCREMENT
                        )
                `));
                for (let [nombre, id] of Object.entries({
                        "autobuses": 2,
                        "cootransneiva": 3,
                        "cootranshuila": 4,
                        "flotahuila": 5,
                        "coomotor": 6,
                        "lusitania": 14,
                        "clientes": 7,
                        "montebello": 11,
                        "empresas": 15,
                        "rapidofenix": 13,
                        "contransmelgar": 21,
                        "coobusan": 16,
                        "interno": 17,
                        "cootransangil": 18,
                        "villavicencio": 19,
                        "cooperativa": 25,
                        "acusosa": 26,
                        "cañaveral": 27,
                        "servitranstur": 28,
                        "tunja": 29,
                        "cootranstur": 30,
                        "cootransar": 31,
                        "Yumbeños": 32,
                        "lineas del valle": 33,
                        "cootranscota": 34,
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