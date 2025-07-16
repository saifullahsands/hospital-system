const doctor_router = require("express").Router();
const DoctorDetailsController = require("@v1_controller/doctor/details/dr.details.controller");
const doctor_details_controller = new DoctorDetailsController();
const AuthMiddleware = require("@v1_middleware/auth.middleware");
const auth_middleware = new AuthMiddleware();
const DoctorController = require("@v1_controller/doctor/dr.controller");
const doctor_controller = new DoctorController();

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
  doctor_controller.home_screen
);

doctor_router.post(
  "/prescription",
  auth_middleware.authenticated,
  auth_middleware.verify_role("DOCTOR"),
  doctor_controller.create_prescription
);

doctor_router.get(
  "/all-prescription",
  auth_middleware.authenticated,
  auth_middleware.verify_role("DOCTOR"),
  doctor_controller.get_all_prescription
);
doctor_router.get(
  "/search/prescription",
  auth_middleware.authenticated,
  auth_middleware.verify_role("DOCTOR"),
  doctor_controller.search_prescription_with_patient_name
);
module.exports = doctor_router;
