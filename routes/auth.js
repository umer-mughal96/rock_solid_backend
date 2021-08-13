const express = require("express");
const router = express.Router();
const {
  registerUser, userLogin, userGoogleLogin, userFacebookLogin, status, logout,
} = require("../controllers/auth");
const { authenticated } = require("../middleware/auth");

router.post("/register", registerUser);



// router.post("/login", userLogin);


// router.post("/google", userGoogleLogin);
// router.post("/facebook", userFacebookLogin);


// router.get("/status", authenticated, status);
// router.get("/logout", authenticated, logout);



module.exports = router;
