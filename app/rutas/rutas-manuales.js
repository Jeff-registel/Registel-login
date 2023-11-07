let memoria = require("../memoria");

module.exports = (app_pack) => {
  let { app, passport } = app_pack;

  app.get("/API/login-usuario/:usuario/:contrasena", async (req, res) => {
    res.json({
      acceso: require("../../BD-registel-central/usuarios/@MACROS")({
        instruccion: "auth",
        args: {
          login: req.params.usuario,
          contraseña: req.params.contrasena,
        },
        url: "/usuarios/auth",
      }),
      usuario: req.params.usuario,
    });
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
