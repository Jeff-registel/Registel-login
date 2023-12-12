/*
    Esta macro se encarga de modificar los datos de un usuario antes de enviarlos al cliente.

    Recibe como parametro un objeto usuario.
    
    Remueve la contraseña del usuario.

    Retorna el usuario modificado.
*/

module.exports = (usuario)=>{
    delete usuario["CONTRASENA"]
    return usuario;
}