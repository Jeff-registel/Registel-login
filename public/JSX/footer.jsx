let ocultar_efecto = document.createElement("style");
ocultar_efecto.innerHTML = `
    body {
        .menu-izquierda-contenedor, .App{
            animation: fadeIn 0.5s ease-in-out;
        }
    }
`;
setTimeout(() => {
    ocultar_efecto.innerHTML = ``;
}, 600);
document.head.appendChild(ocultar_efecto);

document.querySelector("#ocultar-inicio").remove();