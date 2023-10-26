module.exports = (usuario) => {
        let ahora = new Date();
        usuario["FECHA_MODIFICACION"] = ahora;
        if (!usuario["FECHA_CREACION"]) {
                usuario["FECHA_CREACION"] = ahora;
        }
        return usuario;
}