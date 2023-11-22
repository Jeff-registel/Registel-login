"use strict";
var path = require("path");

global.root = __dirname.split(path.sep).join("/");

require("./polyfills");

let templatesString = require("./templates-string");


const http = require("http");
const express = require("express");
const session = require("express-session");
const passport = require("passport");
const passportLocal = require("passport-local").Strategy;
const socketio = require("socket.io");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const memoria = require("./app/memoria");
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
  app,
  passport,
  urlencodedParser,
};

passport.use(
  new passportLocal(
    {
      usernameField: "usuario",
      passwordField: "contrasena",
    },
    async (usuario, contraseña, done) => {
      let login = require("./" + memoria.config.RAIZ + "/usuarios/!SISTEMA/!AUTENTICAR")({
        query: {
          login: usuario,
          contraseña
        }
      });
      if (!login || login.error) {
        return done(null, false);
      }
      return done(null, login);
    }
  )
);

passport.serializeUser(function (user, done) {
  done(null, user["LOGIN"]);
});

passport.deserializeUser(async function (LOGIN, done) {
  let login = require("./" + memoria.config.RAIZ + "/usuarios/!SISTEMA/!CONSULTA")({
    query: {
      login: LOGIN,
    }
  });
  if (login) {
    done(null, login);
  } else {
    done(null, false);
  }
});

server.listen(app.get("port"), () => {
  console.log("corriendo en el puerto:", app.get("port"));
});

require("./API_BD")(pack_app);

app.get("/stop-server", (req, res) => {
  let user = req.user;
  if (!user) {
    return res.send(
      templatesString.redirección({
        textoPrincipal: "No has iniciado sesión",
      })
    );
  }
  if (user["FK_PERFIL"] != 1) {
    return res.send(
      templatesString.redirección({
        textoPrincipal: "No tienes permiso para hacer esto",
      })
    );
  }
  res.send("Server stopped");
  setTimeout(() => {
    server.close();
    process.exit();
  }, 1000);
});

require("./app/rutas")(pack_app);

module.exports = pack_app;