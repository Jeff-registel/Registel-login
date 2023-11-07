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

function descifradoCesar(frase, clave = 3) {
    if (!frase) {
        return "";
    }
    let letra, respuesta = '';
    let cifrado = alfabetoCesar.slice(-clave);
    cifrado += alfabetoCesar.slice(0, alfabetoCesar.length - clave)
    for (let i = 0; i < frase.length; i++) {
        letra = frase[i];
        if (letra == ' ') {
            letra = ' ';
        }
        else {
            letra = alfabetoCesar[cifrado.indexOf(letra)];
        }
        respuesta += letra;
    }
    return respuesta;
} 