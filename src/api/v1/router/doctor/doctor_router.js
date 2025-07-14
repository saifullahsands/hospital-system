const doctor_router = require("express").Router();
const DoctorController = require("@v1_controller/doctor/doctor.controller");
const doctor_controller = new DoctorController();
const AuthMiddleware = require("@v1_middleware/auth.middleware");
const auth_middleware = new AuthMiddleware();

doctor_router.post(
  "/details",
  auth_middleware.authenticated,
  auth_middleware.verify_role("DOCTOR"),
  doctor_controller.create_dr_details
);
doctor_router.patch(
  "/details",
  auth_middleware.authenticated,
  auth_middleware.verify_role("DOCTOR"),
  doctor_controller.update_dr_details
);

module.exports = doctor_router;
