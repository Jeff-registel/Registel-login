const sha256 = require('sha256')

let alfabetoCesar = 'xnpoYBrJjdEZ9lKQAUMRb4zVÑ32wPvtCFaOLs1XefHI6NykTcSD87Gh0imqguW5'; //abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNÑOPQRSTUVWXYZ1234567890

module.exports = ({ query }) => {
    let { login, contraseña } = query;

    if (!login || !contraseña) {
        return {
            error: "Faltan datos para la autenticacion",
        };
    }
    let usuario = JSONBD_MODULE("!/GET")({
        ruta: `usuarios/${JSONBD_MODULE("usuarios/!/TODO")({
            query: {
                findLogin: login,
            },
        })["PK"]}/usuario.json`,
    });
    
    if (!usuario) {
        return {
            error: "No se ha encontrado el usuario",
        };
    }

    let { CONTRASEÑA, CRYPTOPASS } = usuario;

    console.log("usuario", usuario);

    switch (CRYPTOPASS) {
        case "CESAR":
            contraseña = JSONBD_MODULE("!/CESAR")({
                query: {
                    text: contraseña,
                },
            });
            break;
        default:
            contraseña = sha256(contraseña);
            break;
    }

    console.log("CONTRASEÑA", CONTRASEÑA);

    if (CONTRASEÑA != contraseña) {
        return {
            error: "La contraseña es incorrecta",
        };
    }

    let retorno = JSONBD_MODULE("usuarios/!/GET")({
        ruta,
        json: usuario,
    });

    return retorno;
}

function cifradoCesar(frase, clave = 3) {
    if (!frase) {
        return;
    }
    let letra, respuesta = '';
    let cifrado = alfabetoCesar.slice(-clave);
    cifrado += alfabetoCesar.slice(0, alfabetoCesar.length - clave);
    for (let i = 0; i < frase.length; i++) {
        letra = frase[i];
        if (letra == ' ') {
            letra = ' ';
        } else {
            let index = alfabetoCesar.indexOf(letra);
            if (index != -1) {
                letra = cifrado[index];
            }
        }
        respuesta += letra;
    }
    return respuesta;
}