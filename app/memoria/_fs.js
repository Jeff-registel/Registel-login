const {
  writeFile,
  appendFile,
  readFile,
  rename,
  copyFile,
  unlink,
  mkdir,
  mkdtemp,
  rmdir,
} = require("fs/promises");
const { tmpdir } = require("os");
const fs = require("fs");
const fetch = require("node-fetch");
const { join } = require("path");

async function escribir(argumentos) {
  let {
    nombre,
    array,
    contenido
  } = argumentos;

  if (array) {
    nombre = array.join("/");
  }

  if (!nombre) {
    console.error("No se especificó el nombre del archivo")
    return;
  }
  if (!contenido && contenido != "") {
    console.error("No se especificó el contenido del archivo")
    return;
  }
  if (typeof contenido == "object") {
    contenido = JSON.stringify(contenido);
  }
  try {
    let nodos = nombre.split("/");
    let cabeza = nodos.pop();

    await crear_carpeta(nodos);

    let ruta = `${join(...nodos, cabeza)}`;
    fs.writeFileSync(ruta, contenido);
    return true;
  } catch (error) {
    console.log("Ocurrió un problema al escribir el archivo\n", error);
  }
}

async function concatenar(fileName, data) {
  try {
    fs.appendFileSync(fileName, data, { flag: "w" });
    return true;
  } catch (error) {
    console.error(
      "Ocurrió un problema al concatenar en el archivo\n",
      error.message
    );
  }
  return false;
}

function leer(archivo_ruta) {
  try {
    if (typeof archivo_ruta != "string") {
      archivo_ruta = join(...archivo_ruta);
    }
    const data = fs.readFileSync(archivo_ruta);
    let texto = data.toString();
    if (archivo_ruta.endsWith(".json")) {
      return JSON.parse(texto);
    }
    return texto;
  } catch (error) {}
}

/*
  const oldName = "rename-me.txt";
  const newName = "renamed.txt";
  renameFile(oldName, newName);
  */
async function renombrar(ruta_archivo_inicial, ruta_archivo_final) {
  try {
    fs.renameSync(ruta_archivo_inicial, ruta_archivo_final);
    return true;
  } catch (error) {}
}

async function mover(archivo_ruta_inicio, archivo_ruta_final) {
  try {
    fs.renameSync(archivo_ruta_inicio, archivo_ruta_final);
    return true;
  } catch (error) {}
}

/*
  copyAFile('friends.txt', 'friends-copy.txt');
  */
async function copiar(archivo_ruta_inicio, archivo_ruta_final) {
  try {
    fs.copyFileSync(archivo_ruta_inicio, archivo_ruta_final);
    return true;
  } catch (error) {
    console.log("Ocurrió un problema al copiar el archivo\n", error);
  }
  return false;
}

/*
  copyFiles('from', 'to', ['copyA.txt', 'copyB.txt']);
  */
async function copiarArchivos(carpeta_inicial, carpeta_final, nombre_archivos) {
  return Promise.all(
    nombre_archivos.map((filePath) => {
      return copiar(
        join(carpeta_inicial, filePath),
        join(carpeta_final, filePath)
      );
    })
  );
}

function carpeta_listar(ruta_carpeta) {
  try{
    return fs.readdirSync(ruta_carpeta, { withFileTypes: true });
  }catch(error){
  }
  return []
}

function esArchivo(ruta_archivo) {
  try {
    return fs.lstatSync(ruta_archivo).isFile();
  } catch (error) {}
}

function esCarpeta(ruta_carpeta) {
  try {
    return fs.lstatSync(ruta_carpeta).isDirectory();
  } catch (error) {}
}

/*
  deleteFile('delete-me.txt');
  */
async function eliminar(ruta_archivo) {
  try {
    if (fs.lstatSync(ruta_archivo).isFile()) {
      fs.unlinkSync(ruta_archivo);
    }else{
      fs.rmSync(ruta_archivo, { recursive: true, force: true });
    }
    return true;
  } catch (error) {}
}

function añadir_evento_de_cambio(file, callback) {
  fs.watch(file, callback);
}

function convertir_ruta_a_array(cadena) {
  let retorno;
  if (cadena.includes("/")) {
    retorno = cadena.split("/");
  } else if (cadena.includes("\\")) {
    retorno = cadena.split("\\");
  } else {
    retorno = [cadena];
  }
  return retorno.filter((e) => e);
}

async function crear_carpetas_SEGURO(ruta) {
  let nodos = ruta;
  if (typeof ruta == "string") {
    nodos = convertir_ruta_a_array(ruta);
  }
  nodos = nodos.filter((e) => e);
  let nodo;
  let nodos_recorridos = [];
  while (nodos.length) {
    nodo = nodos.shift();
    nodos_recorridos.push(nodo);
    if (!existe(nodos_recorridos)) {
      crear_carpeta(nodos_recorridos);
    }
  }
  return true;
}

async function crear_carpeta(ruta) {
  if (existe(ruta)) {
    return;
  }
  if (ruta.includes("/")) {
    ruta = ruta.split("/");
  }
  if (typeof ruta != "string") {
    ruta = join(...ruta);
  }
  try {
    fs.mkdirSync(ruta);
    return true;
  } catch (error) {
    return crear_carpetas_SEGURO(ruta);
  }
}

async function crear_carpeta_temporal(nombre_carpeta) {
  try {
    const ruta_carpeta_temporal = fs.mkdtempSync(join(tmpdir(), nombre_carpeta));
    return ruta_carpeta_temporal;
  } catch (error) {
    console.log("Ocurrió un problema al crear una carpeta temporal\n", error);
  }
}

async function eliminar_carpeta(path) {
  try {
    fs.rmdirSync(path);
    return true;
  } catch (error) {}
}

function existe(ruta) {
  if (typeof ruta != "string") {
    ruta = join(...ruta);
  }
  try {
    if (fs.existsSync(ruta)) {
      return true;
    }
  } catch (error) {}
}

async function desdeURL(URL, ruta) {
  let respuesta = await fetch(URL);
  let txt = await respuesta.text();
  return await escribir(ruta, txt);
}

module.exports = {
  existe,
  join,
  fetch,
  esArchivo,
  esCarpeta,
  archivo: {
    escribir,
    concatenar,
    leer,
    copiar,
    añadir_evento_de_cambio,
    eliminar,
    renombrar,
    mover,
    desdeURL,
  },
  carpeta: {
    copiarArchivos,
    nueva: crear_carpeta,
    crear_temporal: crear_carpeta_temporal,
    eliminar: eliminar_carpeta,
    listar: carpeta_listar,
  },
};
