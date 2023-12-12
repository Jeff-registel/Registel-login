module.exports = ({ usuarioPK  }) => {
        if (usuarioPK) {
                return SQL.EXEC(`SELECT * FROM tbl_enlace_empresa_usuario WHERE FK_USUARIO = ${usuarioPK}`);
        }
        return SQL.EXEC(`SELECT * FROM tbl_enlace_empresa_usuario`);
}