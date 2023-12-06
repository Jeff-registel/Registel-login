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

function addScript({ src, type = "text/javascript", defer = false, onload }) {
  var script = document.createElement("script");
  script.setAttribute("src", src);
  script.setAttribute("type", type);
  script.setAttribute("defer", defer);
  script.onload = onload;
  document.head.appendChild(script);
}

function addLink(href, rel = "stylesheet") {
  var link = document.createElement("link");
  link.setAttribute("href", href);
  link.setAttribute("rel", rel);
  document.head.appendChild(link);
}

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

async function* notificacionesCursor(limite = 15) {
  let cursor = await JSONBD({
    ruta: `usuarios`,
    query: {
      "NOTIFICACIONES-BLOQUE": {
        aplicacion: {
          PK: user["PK"],
        },
        limite,
      },
    },
  });
  while (true) {
    if (!cursor.length) {
      break;
    }
    yield cursor;
    cursor = await JSONBD({
      ruta: `usuarios`,
      query: {
        "NOTIFICACIONES-BLOQUE": {
          aplicacion: {
            PK: user["PK"],
          },
          limite,
          inicio: cursor.at(-1).cursor.file,
        },
      },
    });
  }
}

function AGO(time) {
  if (!time) {
    return "-";
  }
  if (Date.now() - time < 1000 * 60 * 60 * 24 * 3) {
    // Menos de 2 días
    retorno = moment(time).fromNow();
    return retorno == "hace un día" ? "ayer" : retorno;
  }
  if (Date.now() - time < 1000 * 60 * 60 * 24 * 7) {
    // Menos de 7 días
    return moment(time).format("dddd");
  }
  return moment(time).format("DD/MM/YYYY");
}

async function MACRO({
  macro,
  parametros = {},
  some,
  every,
  find,
  filter,
  map,
  COL,
  NCOL,
} = {}) {
  if (!macro) {
    return {
      error: "No se especificó macro",
    };
  }
  if(!parametros){
    return {
        error: "Debe haber parametros para la macro"
    }
  }

  return await fetchAsync();

  async function fetchAsync() {
    let $usuario_peticion = user
      ? `&usuario-peticion=${JSON.stringify({ PK: user["PK"] })}`
      : "";
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
    let $COL = COL ? `&COL=${JSON.stringify(COL)}` : "";
    let $NCOL = NCOL ? `&NCOL=${JSON.stringify(NCOL)}` : "";
    let URLQUERY = `/API?macro=${[macro, parametros ? JSON.stringify(parametros) : ""]
      .filter(Boolean)
      .join("/")}${
      $usuario_peticion + $filter + $some + $every + $find + $COL + $NCOL + $map
    }`;
    URLQUERY = URLQUERY.replaceAll("//", "/");
    console.log("URLQUERY", URLQUERY);
    let respuesta = await (await fetch(URLQUERY)).json();
    console.log(respuesta);
    return respuesta;
  }
}

function noEsperar() {
  let carga = document.querySelector(".carga-espera");
  let clases = ["animate__animated", "animate__fadeOut", "animate__faster"];
  clases.forEach((e) => carga.classList.add(e));
  setTimeout(() => {
    console.log("hola");
    carga.style.PointerEvent = "none";
    carga.classList.remove(...clases);
    carga.classList.add("d-none");
  }, 500);
}

function esperar() {
  let carga = document.querySelector(".carga-espera");
  carga.style.PointerEvent = "auto";
  carga.classList.remove("d-none");
  let clases = ["animate__animated", "animate__fadeIn", "animate__faster"];
  clases.forEach((e) => carga.classList.add(e));
  setTimeout(() => {
    clases.forEach((e) => carga.classList.remove(e));
  }, 500);
}

async function efectoEsperar(f) {
  esperar();
  await f();
  noEsperar();
}
