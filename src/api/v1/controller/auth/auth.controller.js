const Responses = require("@constants/responses");
const responses = new Responses();
const patientHelperService = require("@v1_helper/index");
const patient_helper = new patientHelperService();
const PatientService = require("@v1_service/patient/patient.service");
const patient_service = new PatientService();
const TokenService = require("@v1_service/token.service");
const { SECRET_TOKEN_KEY } = require("@config/env.config");
const token_service = new TokenService(SECRET_TOKEN_KEY);

class AuthController {
  register_user = async (req, res, next) => {
    try {
      const { email, password, first_name, last_name, nic, gender, phone } =
        req.body;
      const existingUser = await patient_helper.checking_patient_already_exist({
        email: email,
        phone: phone,
      });
      if (existingUser) {
        const badres = responses.bad_request_error(
          "email or  phone is already in use",
          null
        );
        return res.status(badres.status.code).json(badres);
      }
      const hash_pass = await patient_helper.hashing_password({
        password: password,
      });
      const newUser = await patient_service.create_patient({
        email: email,
        password: hash_pass,
        first_name: first_name,
        last_name: last_name,
        nic: nic,
        gender: gender,
        phone: phone,
        role: "PATIENT",
      });
      const success_res = responses.create_success_response(newUser);
      return res.status(success_res.status.code).json(success_res);
    } catch (error) {
      next(error);
    }
  };

  login_user = async (req, res, next) => {
    try {
      const { identifier, password } = req.body;
      const existingUser = await patient_helper.checking_patient_already_exist({
        email: identifier,
        phone: identifier,
      });
      if (!existingUser) {
        const badres = responses.bad_request_error("Inavalid credientials");
        return res.status(badres.status.code).json(badres);
      }
      const isMatch = await patient_helper.comparing_password({
        password: password,
        hashing_password: existingUser.password,
      });
      if (!isMatch) {
        const badres = responses.bad_request_error("Invalid Credientials");
        return res.status(badres.status.code).json(badres);
      }
      const token = await token_service.generate_access_token({
        id: existingUser.id,
        role_type: existingUser.role,
      });
      const okres = responses.ok_response({ user: existingUser, token: token });
      return res.status(okres.status.code).json(okres);
    } catch (error) {
      next(error);
    }
  };
}

module.exports = AuthController;
