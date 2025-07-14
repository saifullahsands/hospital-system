const globalMiddleware = require("@v1_middleware/globalMiddleware");
const auth_router = require("./auth/auth_router");
const patient_router = require("./patient/patient_router");
const admin_router = require("./admin/admin_router");
const doctor_router = require("./doctor/doctor_router");

const v1_router = require("express").Router();

v1_router.use("/auth",auth_router);
v1_router.use("/patient",patient_router)
v1_router.use("/admin",admin_router)
v1_router.use("/doctor",doctor_router)
v1_router.use(globalMiddleware);
module.exports = v1_router;
