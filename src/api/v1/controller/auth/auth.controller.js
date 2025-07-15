const Responses = require("@constants/responses");
const responses = new Responses();
const patientHelperService = require("@v1_helper/index");
const patient_helper = new patientHelperService();
const PatientService = require("@v1_service/patient/patient.service");
const patient_service = new PatientService();
const TokenService = require("@v1_service/token.service");
const { SECRET_TOKEN_KEY } = require("@config/env.config");
const token_service = new TokenService(SECRET_TOKEN_KEY);
const AuthService = require("@v1_service/auth.service");
const auth_service = new AuthService();
class AuthController {
  register_user = async (req, res, next) => {
    try {
      const {
        email,
        password,
        first_name,
        last_name,
        nic,
        gender,
        phone,
        dob,
      } = req.body;
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
        dob: dob,
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


update_user = async (req, res, next) => {
  try {
    const { first_name, last_name } = req.body;
    const user_id = req.user.id;
    const updateUser = await auth_service.update_user({
      last_name: last_name,
      first_name: first_name,
      user_id: user_id,
    });

    const updres = responses.update_success_response(updateUser);
    return res.status(updres.status.code).json(updres);
  } catch (error) {
    next(error);
  }
}
  update_password = async (req, res, next) => {
    try {
      const { current_password, new_password } = req.body;
      const user_id = req.user.id;
      const check_user = await auth_service.check_user({ user_id: user_id });
      const match_password = await patient_helper.comparing_password({
        password: current_password,
        hashing_password: check_user.password,
      });
      if (!match_password) {
        const badres = responses.bad_request_error("invalid current password");
        return res.status(badres.status.code).json(badres);
      }

      const hash_pass = await patient_helper.hashing_password({
        password: new_password,
      });
      const update_user = await auth_service.change_password({
        user_id: user_id,
        password: hash_pass,
      });
      const success_res = responses.update_success_response(update_user);
      return res.status(success_res.status.code).json(success_res);
    } catch (error) {
      next(error);
    }
  };
  }

module.exports = AuthController;
