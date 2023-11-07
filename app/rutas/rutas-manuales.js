let memoria = require("../memoria");

module.exports = (app_pack) => {
  let { app, passport } = app_pack;

  app.get("/API/JSON-BD/:usuario/:contrasena", (req, res) => {
    let acceso_usuario = require(`../../${memoria.config.RAIZ}/usuarios/@MACROS`)({
      instruccion: "auth",
      args: {
        login: req.params.usuario,
        contraseña: req.params.contrasena,
      },
      url: "/usuarios/auth",
    })
    if (!acceso_usuario.auth) {
      return res.json({ auth: false, error: "Usuario o contraseña incorrectos" });
    }
    if (acceso_usuario.usuario["FK_PERFIL"] != 1) {
      return res.json({ auth: false, error: "No tienes permisos para acceder a esta información" });
    }
    res.json(memoria.PACK());
  });

  app.get("/API/login-usuario/:usuario/:contrasena", async (req, res) => {
    res.json(require(`../../${memoria.config.RAIZ}/usuarios/@MACROS`)({
      instruccion: "auth",
      args: {
        login: req.params.usuario,
        contraseña: req.params.contrasena,
      },
      url: "/usuarios/auth",
    })
    );
  });

  app.get("/logout", function (req, res) {
    req.session.destroy(function (err) {
      res.redirect("/");
    });
  });

  app.post(
    "/login-verify",
    passport.authenticate("local", {
      successRedirect: "/login",
      failureRedirect: "/",
    })
  );
};
