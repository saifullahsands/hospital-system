const AuthController = require("@v1_controller/auth/auth.controller");
const auth_controller = new AuthController();
const auth_router = require("express").Router();
const Authmiddleware = require("@v1_middleware/auth.middleware");
const auth_middleware = new Authmiddleware();

auth_router.post("/register", auth_controller.register_user);
auth_router.post("/login", auth_controller.login_user);
auth_router.patch(
  "/update-user",
  auth_middleware.authenticated,
  auth_controller.update_user
);
auth_router.patch(
  "/update-password",
  auth_middleware.authenticated,
  auth_controller.update_password
);

module.exports = auth_router;
