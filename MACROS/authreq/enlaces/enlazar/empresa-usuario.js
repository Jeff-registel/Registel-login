module.exports = async ({ query }) => {
        let { usuario, empresa, estado } = query;
        if (!usuario || !empresa) {
                return {
                        error: "Faltan datos para enlazar empresa y usuario",
                };
        }
        let ENLACE = await SQL.EXEC(`SELECT * FROM tbl_enlace_empresa_usuario WHERE FK_USUARIO = ${usuario} AND FK_EMPRESA = ${empresa}`);
        if (ENLACE.length > 0 && !ENLACE[0]["error"]) {
                ENLACE = ENLACE[0];
        } else {
                ENLACE = {};
        }
        let data = {
                ...ENLACE,
                FK_USUARIO: usuario,
                FK_EMPRESA: empresa,
                ESTADO: estado,
        };
        let save = SQL.SAVE({
                table: "enlace_empresa_usuario",
                data
        });
        if (save["error"]) {
                return {
                        error: "No se pudo enlazar empresa y usuario",
                };
        }
        return {
                ok: "Empresa y usuario enlazados correctamente",
        };
}