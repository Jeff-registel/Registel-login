"use strict";
require("./settings");

var mysql = require("mysql");
let host = "198.251.74.11";

var conexion = mysql.createConnection({
  host,
  user: "root",
  password: "diseno&desarrollo",
  database: "bd_cooperativa_rdw",
});

function execSql(statement) {
  let p = new Promise(function (res, rej) {
    conexion.query(statement, function (err, result) {
      if (err) rej(err);
      else res(result);
    });
  });
  return p;
}

const memoria = require("./app/memoria");

(async () => {
  let bases_de_datos = await execSql("SHOW DATABASES");
  bases_de_datos = bases_de_datos.map((x) => x["Database"]);
  bases_de_datos = bases_de_datos.filter(
    (x) => x.startsWith("bd_") && x.endsWith("rdw")
  );
  console.log(bases_de_datos);
  bases_de_datos.forEach(async (BD) => {
    let tablas = await execSql("SHOW TABLES FROM " + BD);
    tablas = Object.values(tablas).map((x) => x["Tables_in_" + BD]);
    console.log(tablas);
    tablas.forEach(async (Tabla) => {
      let datos = await execSql("SELECT * FROM " + BD + "." + Tabla);
      if (!datos.length) {
        return;
      }
      let PK = Object.keys(datos[0]).find((x) => x.startsWith("PK"));
      if (!PK) {
        PK = Object.keys(datos[0]).find((x) => x.startsWith("id"));
      }
      if (!PK) {
        return;
      }

      datos.forEach(async (dato) => {
        console.log(host, BD, Tabla, dato[PK]);
        await memoria.EXEC({
          DOC: {
            [host]: {
              [BD]: {
                [Tabla]: {
                  [dato[PK] + ".json"]: dato,
                },
              },
            },
          },
        });
      });
    });
  });
})();

const http = require("http");
const express = require("express");
const session = require("express-session");
const passport = require("passport");
const passportLocal = require("passport-local").Strategy;
const socketio = require("socket.io");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const urlencodedParser = bodyParser.urlencoded({ extended: false });
const app = express();
const server = http.createServer(app);
const io = socketio.listen(server);
app.set("port", process.env.PORT || 3000);
app.use(express.static("public"));
app.use(express.static("views"));
app.use(urlencodedParser);
app.set("view engine", "ejs");

app.use(cookieParser("clave"));
app.use(
  session({
    secret: "clave",
    resave: true,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(require("morgan")("combined"));

const pack_app = {
  io,
  execSql,
  app,
  passport,
  urlencodedParser,
};

pack_app.socketio_sql = require("./app/socket.io-sql")(pack_app);

passport.use(
  new passportLocal(
    {
      usernameField: "usuario",
      passwordField: "contrasena",
    },
    async (usuario, contraseña, done) => {
      let user = await pack_app.socketio_sql.verificarUsuario(
        usuario,
        contraseña
      );
      if (!user) {
        return done(null, false);
      }
      return done(null, user);
    }
  )
);

passport.serializeUser(function (user, done) {
  done(null, user["NOMBRE"]);
});

passport.deserializeUser(async function (NOMBRE, done) {
  let user = await pack_app.socketio_sql.usuarioInformacion(NOMBRE);
  delete user["CONTRASENA"];
  if (user) {
    done(null, user);
  } else {
    done(null, false);
  }
});

server.listen(app.get("port"), () => {
  console.log("corriendo en el puerto:", app.get("port"));
});

app.get("/stop-server", (req, res) => {
  let user = req.user;
  if (!user) {
    return res.send("No tienes permiso para hacer esto");
  }
  if (user["FK_PERFIL"] != 1) {
    return res.send("No tienes permiso para hacer esto");
  }
  res.send("Server stopped");
  setTimeout(() => {
    server.close();
    process.exit();
  }, 1000);
});

require("./app/rutas")(pack_app);
