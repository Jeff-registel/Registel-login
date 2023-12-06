module.exports = async function({ query }){
        let { login, contraseña } = query;
        if (!login || !contraseña) {
                return {
                        auth: false,
                        error: "La macro requiere campos que no se han especificado"
                };
        }
        let user = await SQL.EXEC(`SELECT * FROM tbl_usuario WHERE LOGIN = '${login}' AND CONTRASENA = SHA2('${contraseña}', 256)`);
        if (!user.length) {
                return {
                        auth: false,
                        error: "Usuario o contraseña incorrectos"
                };
        }
        return {
                auth: true,
                ok: "Usuario autenticado correctamente",
        };
}