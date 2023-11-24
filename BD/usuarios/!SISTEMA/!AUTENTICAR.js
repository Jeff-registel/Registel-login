const sha256 = require('sha256')
const memoria = require("../../../app/memoria");

let alfabetoCesar = 'xnpoYBrJjdEZ9lKQAUMRb4zVÑ32wPvtCFaOLs1XefHI6NykTcSD87Gh0imqguW5'; //abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNÑOPQRSTUVWXYZ1234567890

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

module.exports = ({ query }) => {
    let { login, contraseña } = query;


    if (!login || !contraseña) {
        return {
            error: "Faltan datos para la autenticacion",
        };
    }

    let { PK } = memoria.tools.Array2Nodo(`usuarios/!SISTEMA/ALIAS/LOGIN/${login}.json`).cabeza;
    if (!PK) {
        return {
            error: "El nombre de usuario no existe",
        };
    }
    let ruta = `usuarios/${PK}/usuario.json`;
    let usuario = memoria.tools.Array2Nodo(ruta).cabeza;
    if (!usuario) {
        return {
            error: "No se ha encontrado el usuario",
        };
    }
    let { "CONTRASEÑA": CONTRASEÑA, CRYPTOPASS } = usuario;
    
    if (!CRYPTOPASS) {
        contraseña = sha256(contraseña);
    }
    if (CRYPTOPASS == "CESAR") {
        contraseña = cifradoCesar(contraseña);
    }

    if (CONTRASEÑA != contraseña) {
        return {
            error: "La contraseña es incorrecta",
        };
    }

    return require("./!GET")({
        json: usuario,
        ruta,
    });
}