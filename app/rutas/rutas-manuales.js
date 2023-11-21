let memoria = require("../memoria");

module.exports = (app_pack) => {
  let { app, passport } = app_pack;

  app.get("/logout", function (req, res) {
    req.session.destroy(function (err) {
      res.redirect("/");
    });
  });

  app.post(
    "/login-verify",
    passport.authenticate("local", {
      successRedirect: "/",
      failureRedirect: "/logged",
    })
  );
};
