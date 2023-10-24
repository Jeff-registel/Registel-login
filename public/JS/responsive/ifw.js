let less_than_medias = {};
let up_than_medias = {};
let between_medias = {};

function ifw(propiedad, valor, operador, sz) {
  let clase = `${propiedad}_${valor}-${operador}-${sz}${sz.toString().endsWith("px") ? "" : "px"}`;
  for (const r in replaces) {
    clase = clase.replaceAll(replaces[r], r);
  }
  switch (operador) {
    case "less":
      less_than(propiedad, valor, sz, clase);
      break;
    case "up":
      up_than(propiedad, valor, sz, clase);
      break;
    case "between":
      between(propiedad, valor, sz[0], sz[1], clase);
      break;
  }
  return clase.replaceAll(" ", "_");
}

function less_than(propiedad, valores, sz, clase) {
  if (!less_than_medias[sz]) {
    less_than_medias[sz] = {};
  }
  if (!less_than_medias[sz][clase]) {
    less_than_medias[sz][clase] = new Set();
  }
  for (const r in post_replaces) {
    valores = valores.replaceAll(r, post_replaces[r]);
  }
  less_than_medias[sz][clase].add(
    propiedad + ": " + valores + " !important;"
  );
}

function up_than(propiedad, valores, sz, clase) {
  if (!up_than_medias[sz]) {
    up_than_medias[sz] = {};
  }
  if (!up_than_medias[sz][clase]) {
    up_than_medias[sz][clase] = new Set();
  }
  for (const r in post_replaces) {
    valores = valores.replaceAll(r, post_replaces[r]);
  }
  up_than_medias[sz][clase].add(
    propiedad + ": " + valores + " !important;"
  );
}

function between(propiedad, valores, min, max, clase) {
  if (!between_medias[min]) {
    between_medias[min] = {};
  }
  if (!between_medias[min][max]) {
    between_medias[min][max] = [];
  }
  if (!between_medias[min][max][clase]) {
    between_medias[min][max][clase] = new Set();
  }
  for (const r in post_replaces) {
    valores = valores.replaceAll(r, post_replaces[r]);
  }
  between_medias[min][max][clase].add(
    propiedad + ": " + valores + " !important;"
  );
}

function extractInfoOfClase_ifw(clase) {
  let input = clase;
  for (const r in replaces) {
    input = input.replaceAll(r, replaces[r]);
  }
  if (clase.startsWith("lerpw") || clase.startsWith("switchw")) {
    return;
  }
  let type = /.+_.+-less-\d+px/g.test(clase)
    ? "less"
    : /.+_.+-up-\d+px/g.test(clase)
      ? "up"
      : /.+_.+-between-\d+px-\d+px/g.test(clase)
        ? "between"
        : "unknown";
  if (type == "unknown") {
    return;
  }
  let elm0 = input.split(`-${type}-`);
  let elm1 = elm0[0];
  let elm2;
  let elm3;
  let propiedad;
  let valores;
  switch (type) {
    case "less":
    case "up":
      elm2 = elm0[1];
      elm3 = elm1.replace("_", ";").split(";");
      propiedad = elm3[0];
      valores = elm3[1];
      (type == "less" ? less_than : up_than)(
        propiedad,
        valores.replaceAll("_", " "),
        elm2,
        clase
      );
      break;
    case "between":
      elm2 = elm0[1].split("-");
      elm3 = elm1.replace("_", ";").split(";");
      propiedad = elm3[0];
      valores = elm3[1];
      between(propiedad, valores.replaceAll("_", " "), elm2[0], elm2[1], clase);
      break;
  }
}

function extractInfoOfClases(extractInfoOfClase) {
  document.querySelectorAll("*").forEach(function (node) {
    Array.from(node.classList).forEach(extractInfoOfClase);
  });
}

function generateStyleCSS_ifw() {
  less_than_medias = {};
  up_than_medias = {};
  between_medias = {};

  extractInfoOfClases(extractInfoOfClase_ifw);

  let html = "";
  for (const sz in less_than_medias) {
    html += `
                @media (max-width: ${sz}) {`;
    for (const cls in less_than_medias[sz]) {
      html += `
                    .${cls} {
                `;
      less_than_medias[sz][cls] = Array.from(less_than_medias[sz][cls]);
      for (const property of less_than_medias[sz][cls]) {
        html += property + "\n";
      }
      html += `}
                `;
    }
    html += `
                }`;
  }

  for (const sz in up_than_medias) {
    html += `
                @media (min-width: ${sz}) {`;
    for (const cls in up_than_medias[sz]) {
      html += `
                    .${cls} {
                `;
      up_than_medias[sz][cls] = Array.from(up_than_medias[sz][cls]);
      for (const property of up_than_medias[sz][cls]) {
        html += property + "\n";
      }
      html += `}
                `;
    }
    html += `
                }`;
  }

  for (const min in between_medias) {
    for (const max in between_medias[min]) {
      html += `
                @media (max-width: ${max}) and (min-width: ${min}) {`;
      for (const cls in between_medias[min][max]) {
        html += `
                    .${cls} {
                    `;
        between_medias[min][max][cls] = Array.from(
          between_medias[min][max][cls]
        );
        for (const property of between_medias[min][max][cls]) {
          html += property + "\n";
        }
        html += `
                    }
                    `;
      }
      html += `
                }`;
    }
  }
  return html;
}
