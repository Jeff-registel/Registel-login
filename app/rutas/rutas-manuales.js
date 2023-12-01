module.exports = () => {
  let { app, passport } = APP_PACK;

  app.get("/logout", function (req, res) {
    req.session.destroy(function (err) {
      res.redirect("/");
    });
  });

  app.post(
    "/login-verify",
    passport.authenticate("local", {
      successRedirect: "/logged",
      failureRedirect: "/",
    })
  );
};
