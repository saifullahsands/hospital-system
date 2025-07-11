const AuthController = require("@v1_controller/auth/auth.controller");
const auth_controller = new AuthController();
const auth_router = require("express").Router();

auth_router.post("/register", auth_controller.register_user);
auth_router.post("/login", auth_controller.login_user);
module.exports = auth_router;
