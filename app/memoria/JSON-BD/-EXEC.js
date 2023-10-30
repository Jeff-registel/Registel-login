let READ = require("./_READ");
let DOC = require("./_DOC");
let DELETE = require("./_DELETE");

function GENERAL(json, args = {}) {
  if (!json) {
    throw new Error("No se ha especificado el json");
  }
  let instruccion = Object.keys(json)[0];
  console.log("instruccion", instruccion);
  json = json[instruccion];
  if (json instanceof Array) {
    return MANY({
      instruccion,
      array: json,
      context: args.context,
    });
  } else {
    return ONE({
      instruccion,
      json,
      context: args.context,
    });
  }
}

function MANY({ instruccion, array, context }) {
  if (!array) {
    throw new Error("No se ha especificado el array");
  }
  return array.map((json) =>
    ONE({
      instruccion,
      json,
      context,
    })
  );
}

function ONE({ instruccion, json, context ={}}) {
  if (!json) {
    throw new Error("No se ha especificado el json");
  }
  console.log("Ejecutando instrucción", instruccion);
  console.log("context", context);
  switch (instruccion) {
    case "READ":
      return READ(json, context);
    case "DOC":
      DOC(json, context);
      break;
    case "DELETE":
      DELETE(json, context);
      break;
  }
}

module.exports = GENERAL;
