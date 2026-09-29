const express = require("express"); 
const router = express.Router();
const userControllers = require("../../controllers/user-controllers.js");
const verifyAuthentication = require("../../utils/auth.js");

router.get("/", verifyAuthentication, userControllers.getUser);
router.post("/register", userControllers.registerUser);
router.post("/login", userControllers.loginUser);

module.exports = router;