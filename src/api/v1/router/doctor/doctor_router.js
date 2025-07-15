const doctor_router = require("express").Router();
const DoctorDetailsController = require("@v1_controller/doctor/details/dr.details.controller");
const doctor_details_controller = new DoctorDetailsController();
const AuthMiddleware = require("@v1_middleware/auth.middleware");
const auth_middleware = new AuthMiddleware();

doctor_router.post(
  "/details",
  auth_middleware.authenticated,
  auth_middleware.verify_role("DOCTOR"),
  doctor_details_controller.create_dr_details
);
doctor_router.patch(
  "/details",
  auth_middleware.authenticated,
  auth_middleware.verify_role("DOCTOR"),
  doctor_details_controller.update_dr_details
);

doctor_router.patch(
  "/timing",
  auth_middleware.authenticated,
  auth_middleware.verify_role("DOCTOR"),
  doctor_details_controller.create_dr_timings
);
doctor_router.patch(
  "/update-timing",
  auth_middleware.authenticated,
  auth_middleware.verify_role("DOCTOR"),
  doctor_details_controller.update_dr_timings
);

doctor_router.get(
  "/home",
  auth_middleware.authenticated,
  auth_middleware.verify_role("DOCTOR"),
  doctor_details_controller.home_screen
);

module.exports = doctor_router;
