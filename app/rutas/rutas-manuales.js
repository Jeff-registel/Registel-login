let sql = require("../mysql.js");

module.exports = (app, passport) => {
  app.get("/API/login-usuario/:usuario/:contrasena", async (req, res) => {
    res.json({
      acceso: !!(await sql.verificarUsuario(req.params.usuario, req.params.contrasena)),
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
    }),
    (req, res) => {
      console.log(req.user);
    }
  );
};
