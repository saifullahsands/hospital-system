const Responses = require("@constants/responses");
const responses = new Responses();
const AdminService = require("@v1_service/admin/admin.service");
const admin_service = new AdminService();
const AdminHelper = require("@api/v1/helper/index");
const admin_helper = new AdminHelper();
const DoctorService = require("@v1_service/patient/patient.service");
const doctor_service = new DoctorService();

class AdminController {
  admin_home_screen = async (req, res, next) => {
    try {
      const [totalPatient, totalDoctor, totalAdmin] = await Promise.all([
        admin_service.total_patient(),
        admin_service.total_doctor(),
        admin_service.total_admin(req.user.id),
      ]);
      const response = responses.ok_response(
        {
          total_patient: totalPatient,
          total_doctor: totalDoctor,
          total_admin: totalAdmin,
        },
        "get admin home screen successfully"
      );
      return res.status(response.status.code).json(response);
    } catch (error) {
      next(error);
    }
  };

  admin_create_doctors = async (req, res, next) => {
    try {
      const {
        email,
        password,
        phone,
        gender,
        nic,
        first_name,
        last_name,
        role,
      } = req.body;
      const existingDoctor = await admin_helper.checking_patient_already_exist({
        email: email,
        phone: phone,
      });
      if (existingDoctor) {
        const response = responses.bad_request_error(
          "email or phone number is already in use"
        );
        return res.status(response.status.code).json(response);
      }
      const hash_pass = await admin_helper.hashing_password({
        password: password,
      });
      await doctor_service.create_patient({
        email: email,
        password: hash_pass,
        gender: gender,
        phone: phone,
        nic: nic,
        first_name: first_name,
        last_name: last_name,
        role: role,
      });
      const response = responses.ok_response(
        null,
        `${role} is created successfully`
      );
      return res.status(response.status.code).json(response);
    } catch (error) {
      next(error);
    }
  };
}
