const patient_router = require("express").Router();
const AuthMiddleware = require("@v1_middleware/auth.middleware");
const auth_middleware = new AuthMiddleware();
const PatientController = require("@v1_controller/patients/patient.controller");
const patient_controller = new PatientController();

patient_router.get(
  "/home",
  auth_middleware.authenticated,
  patient_controller.patient_home_screen
);
patient_router.post(
  "/appointment",
  auth_middleware.authenticated,
  auth_middleware.verify_role("PATIENT"),
  patient_controller.create_appointment
);

patient_router.get(
  "/search",
  auth_middleware.authenticated,
  auth_middleware.verify_role("PATIENT"),
  patient_controller.search_doctor
);
module.exports = patient_router;
