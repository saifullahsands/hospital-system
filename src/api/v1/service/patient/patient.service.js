const { prisma } = require("@config/prisma");
class PatientService {
  create_patient = async ({
    email,
    password,
    first_name,
    last_name,
    nic,
    phone,
    gender,
    role,
    dob,
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
        dob: new Date(dob),
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
          id: true,
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
      prisma.users.count({
        where: {
          role: "DOCTOR",
        },
      }),
    ]);

    return { doctors, totalCount };
  };

  create_appointment = async ({
    patient_name,
    patient_id,
    doctor_name,
    appointment_date,
    doctor_id,
  }) => {
    return await prisma.appointment.create({
      data: {
        patient_name,
        doctor_name,
        appointment_date: new Date(appointment_date),
        doctor_id,
        patient_id,
      },
    });
  };

  search_doctor = async (searchdr, skip, perPageRecord) => {
    const where = {
      role: "DOCTOR",
      OR: [
        {
          last_name: {
            contains:searchdr,
          },
        },
        {
          first_name: {
            contains: searchdr,
          },
        },
      ],
    };
    const [doctors, totalCount] = await Promise.all([
      prisma.users.findMany({
        where,
        skip: skip,
        take: perPageRecord,
        select: {
          id: true,
          first_name: true,
          last_name: true,
          doctor_details: true,
        },
      }),
      prisma.users.count({
        where,
      }),
    ]);

    return { doctors, totalCount };
  };
}

module.exports = PatientService;
