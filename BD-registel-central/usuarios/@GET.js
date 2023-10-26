module.exports = (usuario) => {
        delete usuario["CONTRASENA"];
        return usuario;
}