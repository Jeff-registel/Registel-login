module.exports = async function (){
    let usuarios = await SQL.EXEC('SELECT * FROM tbl_usuario');
    usuarios.forEach(usuario => {
        delete usuario["CONTRASENA"]
    });
    return usuarios;
}