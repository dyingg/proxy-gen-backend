function logged(req, resp, next) {
  if (req.session.userId) {
    next();
  } else {
    // return res.json({
    //     fail: "Not authenticated",
    //     code: 102
    // })
  return resp.redirect("/");
    //Dev;
   // req.session.userId = "5c20f8384a73eb334cfede06";
   // next();
  }
}

module.exports = logged;
