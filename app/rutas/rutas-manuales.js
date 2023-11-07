let memoria = require("../memoria");

module.exports = (app_pack) => {
  let { app, passport } = app_pack;

  let sql = require("../SQL-socket.io")(app_pack);
  
  app.get("/API/login-usuario/:usuario/:contrasena", async (req, res) => {
    res.json({
      acceso: !!(await sql.verificarUsuario(
        req.params.usuario,
        req.params.contrasena
      )),
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
