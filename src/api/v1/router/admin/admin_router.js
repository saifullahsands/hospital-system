const admin_router = require("express").Router();
const AuthMiddleware = require("@v1_middleware/auth.middleware");
const auth_middleware = new AuthMiddleware();
const AdminController = require("@v1_controller/admin/admin.controller");
const admin_controller = new AdminController();
console.log(typeof auth_middleware.authenticated);
console.log(typeof auth_middleware.verify_role("ADMIN"))
admin_router.get(
  "/home",
  auth_middleware.authenticated,
  auth_middleware.verify_role("ADMIN"),
  admin_controller.admin_home_screen
);

admin_router.post("/create",auth_middleware.authenticated,auth_middleware.verify_role("ADMIN"),admin_controller.admin_create_doctors)

module.exports = admin_router;
