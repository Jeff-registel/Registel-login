let READ = require("./_READ");
let DOC = require("./_DOC");
let DELETE = require("./_DELETE");

function GENERAL(json, args = {}) {
  if (!json) {
    throw new Error("No se ha especificado el json");
  }
  let instruccion = Object.keys(json)[0];
  
  json = json[instruccion];
  
  if (json instanceof Array) {
    return MANY({
      instruccion,
      array: json,
      ...args,
    });
  } else {
    return ONE({
      instruccion,
      json,
      ...args,
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

function ONE({ instruccion, json, context = {} }) {
  if (!json) {
    throw new Error("No se ha especificado el json");
  }
  switch (instruccion) {
    case "READ":
      return READ(json, { context });
    case "DOC":
      return DOC(json, { context });
    case "DELETE":
      DELETE(json, { context });
      break;
  }
}

module.exports = GENERAL;
