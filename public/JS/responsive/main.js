const replaces = {
    A: "*", //asterisc
    S: "/", //slash
    P: "%", //porcent
    L: "(", //leftBracket
    R: ")", //rightBracket
    C: ",", //comma
    D: ".", //dot
    M: "+", //more
    H: "#", //hash
};

const post_replaces = {
    G: "--", //guión (doble)
}

let style_responsive = document.createElement("style")

function updateResponsive() {
    style_responsive.innerHTML = "";
    style_responsive.innerHTML += generateStyleCSS_ifw()
    style_responsive.innerHTML += generateStyleCSS_lerpw()
    style_responsive.innerHTML += generateStyleCSS_switchw()
    let head = document.head || document.getElementsByTagName('head')[0]
    head.appendChild(style_responsive)
}

setTimeout(() => {
    updateResponsive();
}, 100);