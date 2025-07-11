const { prisma } = require("@config/prisma");
class PatientService {
  create_patient = async ({
    email,
    password,
    first_name,
    last_name,
    nic,
    phone,
    dob,
    gender,
    role,
  }) => {
    return prisma.users.create({
      data: {
        first_name,
        last_name,
        email,
        password,
        nic,
        phone,
        dob,
        gender,
        role,
      },
    });
  };

  get_all_doctor = async ({ skip, perPageRecord }) => {
    const [doctors, totalCount] = await Promise.all([
      prisma.users.findMany({
        where: {
          role: "DOCTOR",
        },
        skip,
        take: perPageRecord,
        select: {
          first_name: true,
          last_name: true,
          doctor_details: {
            select: {
              token_price: true,
              specialization: true,
            },
          },
        },
      }),
      prisma.users.findMany({
        where: {
          role: "DOCTOR",
        },
      }),
    ]);

    return { doctors, totalCount };
  };
}

module.exports = PatientService;
