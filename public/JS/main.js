function JS2CSS(estilo) {
    const estiloConvertido = {};

    for (const [key, value] of Object.entries(estilo)) {
        const kebabCaseKey = key.replace(
            /[A-Z]/g,
            (match) => `-${match.toLowerCase()}`
        );
        estiloConvertido[kebabCaseKey] =
            typeof value === "object"
                ? JS2CSS(value)
                : typeof value === "number" && kebabCaseKey != "z-index"
                    ? `${value}px`
                    : value;
    }

    return estiloConvertido;
}

function crearEstilo(estilo, style) {
    const estiloConvertido = JS2CSS(estilo);

    let estiloCSS = JSON.stringify(estiloConvertido, null, "\t");
    estiloCSS = estiloCSS.replaceAll("},", "}");
    estiloCSS = estiloCSS.replace(/,\n/g, ";\n");
    estiloCSS = estiloCSS.replaceAll(":{", "{");
    estiloCSS = estiloCSS.replaceAll(": {", "{");
    estiloCSS = estiloCSS.replaceAll(":", ":");
    estiloCSS = estiloCSS.replaceAll('"', "");

    estiloCSS = estiloCSS.substring(1, estiloCSS.length - 1);
    if (!style) {
        style = document.createElement("style");
        document.head.appendChild(style);
    }
    style.innerHTML = estiloCSS;

    return estiloCSS;
}

function addScript({
    src,
    type = "text/javascript",
    defer = false,
    onload,
}) {
    var script = document.createElement("script");
    script.setAttribute("src", src);
    script.setAttribute("type", type);
    script.setAttribute("defer", defer);
    script.onload = onload;
    document.head.appendChild(script);
};

function addLink(href, rel = "stylesheet") {
    var link = document.createElement("link");
    link.setAttribute("href", href);
    link.setAttribute("rel", rel);
    document.head.appendChild(link);
};

addLink(
    "https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css"
);
addScript({ src: "/JS/ventana-flotante/index.js" });

Iconos_fa_bs();
SweetAlert2();

function SweetAlert2() {
    addScript({
        src: "https://cdn.jsdelivr.net/npm/sweetalert2@11.7.27/dist/sweetalert2.all.min.js",
    });
    if (localStorage.getItem("theme") == "dark") {
        addLink("https://cdn.jsdelivr.net/npm/@sweetalert2/theme-dark/dark.css");
    } else {
        addLink(
            "https://cdn.jsdelivr.net/npm/@sweetalert2/theme-material-ui/material-ui.css"
        );
    }
}

function Iconos_fa_bs() {
    addLink(
        "https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css"
    );
    addLink(
        "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css"
    );
}

async function JSONBD(ruta, query) {
    try {
        if (ruta.includes("\n")) {
            ruta = ruta.split("\n").map((e) => e.trim()).join("");
        }
        console.log("ruta", ruta);
        let json_query = `/BD?json-query=${ruta}${query ? JSON.stringify(query) : ""}`;
        let retorno = (await (await fetch(json_query)).json());
        console.log("json_query", json_query);
        console.log("retorno", retorno);
        return retorno;
    } catch (error) {
    }
}
