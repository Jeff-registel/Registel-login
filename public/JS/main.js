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


async function* notificacionesCursor() {
    let cursor = await JSONBD({
            ruta: `usuarios/${user["PK"]}/notificaciones/end.json`
    });
    while (true) {
            if (!cursor.antecesor) {
                    break;
            }
            cursor = await JSONBD({
                    ruta: `usuarios/${user["PK"]}/notificaciones/${cursor.antecesor.file}.json`
            });
            yield cursor;
    }
}

function AGO(time){
    if (!time) {
        return "-"
    }
    if(Date.now() - time < 1000 * 60 * 60 * 24){ // Menos de 24 horas
        return moment(time).fromNow();
    }
    if (Date.now() - time < 1000 * 60 * 60 * 24 * 7) { // Menos de 7 días
        return moment(time).format("dddd");
    }
    return moment(time).format("DD/MM/YYYY");
}

async function JSONBD({
    ruta = "",
    query,
    async = false,
    some,
    every,
    find,
    filter,
    map,
    COL,
    NCOL,
} = {}) {
    if (!ruta && !query) {
        return {
            error: "No se especificó ruta ni query",
        };
    }
    if (!ruta.endsWith(".json") && !query) {
        return {
            error: "Sólo se puede obtener archivos json",
        };
    }

    if (ruta.endsWith(".json") && query) {
        return {
            error: "No se puede aplicar un query a un archivo json",
        };
    }
    async function fetchAsync() {
        let $ejecutor = user ? `&ejecutor=${JSON.stringify({ PK: user["PK"] })}` : "";
        let $filter = filter ? `&filter=${JSON.stringify(filter + "")}` : "";
        let $map = map ? `&map=${JSON.stringify(map + "")}` : "";
        let $some = some ? `&some=${JSON.stringify(some + "")}` : "";
        let $every = every ? `&every=${JSON.stringify(every + "")}` : "";
        let $find = find ? `&find=${JSON.stringify(find + "")}` : "";
        if (COL && !Array.isArray(COL)) {
            return {
                error: "COL debe ser un array",
            };
        }
        if (NCOL && !Array.isArray(NCOL)) {
            return {
                error: "NCOL debe ser un array",
            };
        }
        let $COL = COL
            ? `&COL=${JSON.stringify(COL)}`
            : "";
        let $NCOL = NCOL
            ? `&NCOL=${JSON.stringify(NCOL)}`
            : "";
        let URLQUERY = `/BD?json-query=${[ruta, query ? JSON.stringify(query) : ""].filter(Boolean).join("/")}${$ejecutor + $filter + $some + $every + $find + $COL + $NCOL + $map}`;
        console.log("URLQUERY", URLQUERY);
        let respuesta = await (await fetch(URLQUERY)).json();
        console.log(respuesta, "async", async);
        return respuesta;
    }

    if (async) {
        return await fetchAsync();
    }

    return new Promise(async (resolve) => {
        resolve(await fetchAsync());
    });
}

