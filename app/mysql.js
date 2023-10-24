var mysql = require('mysql');

var conexion = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "diseno&desarrollo",
        database: "centralizacion_usuarios"
});

empresas = {
        Autobuses: 2,
        Cootransneiva: 3,
        Cootranshuila: 4,
        Flotahuila: 5,
        Coomotor: 6,
        Lusitania: 14,
        Clientes: 7,
        Montebello: 11,
        Empresas: 15,
        Rapidofenix: 13,
        Contransmelgar: 21,
        Coobusan: 16,
        Interno: 17,
        Cootransangil: 18,
        Villavicencio: 19,
        Cooperativa: 25,
        Acusosa: 26,
        Cañaveral: 27,
        Servitranstur: 28,
        Tunja: 29,
        Cootranstur: 30,
        Cootransar: 31,
        Yumbeños: 32,
        "Lineas del valle": 33,
        Cootranscota: 34,
};

async function existeUsuario(usuario) {
        let result = await execSql(`SELECT * FROM tbl_usuario WHERE NOMBRE = '${usuario}'`);
        if (result.length > 0) {
                return true;
        } else {
                return false;
        }
}

async function verificarUsuario(usuario, contraseña) {
        let result = await execSql(`SELECT * FROM tbl_usuario WHERE NOMBRE = '${usuario}' AND CONTRASENA = SHA2('${contraseña}', 256)`);
        if (result.length > 0) {
                let user = result[0];
                delete user["CONTRASENA"];
                return user;
        } else {
                let result2 = await execSql(`SELECT * FROM tbl_usuario WHERE NOMBRE = '${usuario}' AND CONTRASENA = '${contraseña}'`);
                if (result2.length > 0) {
                        let user = result2[0];
                        delete user["CONTRASENA"];
                        return user;
                }
                return false;
        }
}

async function usuarioInformacion(usuario) {
        let result = await execSql(`SELECT * FROM tbl_usuario WHERE NOMBRE = '${usuario}'`);
        if (result.length != 1) {
                return false;
        } else {
                delete result[0]["CONTRASENA"];
                return result[0];
        }
}

async function consultarTablaCompleta(tabla) {
        let result = await execSql(`SELECT * FROM ${tabla}`);
        return result;
}

function execSql(statement) {
        let p = new Promise(function (res, rej) {
                conexion.query(statement, function (err, result) {
                        if (err) rej(err);
                        else res(result);
                });
        });
        return p;
}

module.exports = {
        existeUsuario,
        verificarUsuario,
        usuarioInformacion,
        consultarTablaCompleta,
}