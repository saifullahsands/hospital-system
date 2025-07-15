const { prisma } = require("@config/prisma");
const bcrypt = require("bcrypt");
const JWT = require("jsonwebtoken");
const { TOKEN_EXPIRY, SECRET_TOKEN_KEY } = require("@config/env.config");

class patientHelperService {
  checking_patient_already_exist = async ({ email, phone }) => {
    return prisma.users.findFirst({
      where: {
        OR: [{ email }, { phone }],
      },
    });
  };

  hashing_password = async ({ password, salt_round = 10 }) => {
    return await bcrypt.hash(password, salt_round);
  };
  comparing_password = async ({ password, hashing_password }) => {
    return await bcrypt.compare(password, hashing_password);
  };

  generate_token = async ({ user_id, role_type }) => {
    return JWT.sign({ id: user_id, role: role_type }, SECRET_TOKEN_KEY, {
      expiresIn: TOKEN_EXPIRY,
    });
  };

  pagination = async (req) => {
    const page = req.query.page || 1;
    const perPageRecord = req.query.perPageRecord || 10;
    const skip = (page - 1) * perPageRecord;
    return { page, perPageRecord, skip };
  };

  set_start_time_and_end_time = ({ start_time, end_time }) => {
  const today = new Date();

  const parseTime = (timeStr) => {
    const [hours, minutes, seconds] = timeStr.split(":").map(Number);
    const date = new Date(today);
    date.setHours(hours, minutes, seconds || 0, 0);
    return date;
  };

  const startDate = parseTime(start_time);
  const endDate = parseTime(end_time);

  return { startDate, endDate };
};

}

module.exports = patientHelperService;
