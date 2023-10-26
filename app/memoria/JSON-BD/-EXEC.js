let READ = require("./_READ");
let DOC = require("./_DOC");
let DELETE = require("./_DELETE");

function GENERAL(json, instruccion) {
  if (!json) {
    throw new Error("No se ha especificado el json");
  }
  if (!instruccion) {
    instruccion = Object.keys(json)[0];
    json = json[instruccion];
  }
  if (json instanceof Array) {
    return MANY({
      instruccion,
      array: json,
    });
  } else {
    return ONE({
      instruccion,
      json,
    });
  }
}

function MANY({ instruccion, array }) {
  if (!array) {
    throw new Error("No se ha especificado el array");
  }
  if (!instruccion) {
    instruccion = Object.keys(array)[0];
    array = array[instruccion];
  }
  return array.map((json) =>
    ONE({
      instruccion,
      json,
    })
  );
}

function ONE({ instruccion, json }) {
  if (!json) {
    throw new Error("No se ha especificado el json");
  }
  if (!instruccion) {
    instruccion = Object.keys(json)[0];
    json = json[instruccion];
  }
  switch (instruccion) {
    case "READ":
      return READ(json);
    case "DOC":
      DOC(json);
      break;
    case "DELETE":
      DELETE(json);
      break;
  }
}

module.exports = GENERAL;
