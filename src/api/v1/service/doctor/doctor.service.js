const { prisma } = require("@config/prisma");

class doctorService {
  create_dr_details = async ({
    education,
    specialization,
    token_price,
    doctor_id,
  }) => {
    return await prisma.doctor_details.create({
      data: {
        education: education,
        specialization: specialization,
        token_price: token_price,
        user_id: doctor_id,
      },
    });
  };

  update_dr_details = async ({
    education,
    specialization,
    token_price,
    doctor_id,
  }) => {
    return await prisma.doctor_details.update({
      where: {
        user_id: `${doctor_id}`,
      },
      data: {
        specialization,
        education,
        token_price,
      },
    });
  };

  create_dr_details_timings = async ({
    doctor_id,
    day,
    start_time,
    end_time,
  }) => {
    return await prisma.doctor_timings.create({
      data: {
        doctor_id: `${doctor_id}`,
        day: day,
        start_time: start_time,
        end_time: end_time,
      },
    });
  };

  dr_is_profile_completed = async ({ doctor_id }) => {
    return await prisma.users.update({
      where: {
        id: `${doctor_id}`,
      },
      data: {
        is_profile_complete: true,
      },
    });
  };

  update_dr_details_timings = async ({ id, day, start_time, end_time }) => {
    return await prisma.doctor_timings.update({
      where: {
        id: parseInt(id),
      },
      data: {
        start_time: start_time,
        end_time: end_time,
        day,
      },
    });
  };

  home_screen = async ({ doctor_id, skip, perPageReord }) => {
    const [appointment, totalCount] = await Promise.all([
      prisma.appointment.findMany({
        where: {
          doctor_id: `${doctor_id}`,
        },
        skip,
        take: perPageReord,
        select: {
          patient_id: true,
          patient_name: true,
        },
        orderBy: {
          appointment_date: "desc",
        },
      }),
      prisma.appointment.count({
        where: { doctor_id: `${doctor_id}` },
      }),
    ]);
    return { appointment, totalCount };
  };

  create_prescription = async ({
    patient_name,
    doctor_id,
    dosage,
    patient_id,
    notes,
    medicine_name,
  }) => {
    return await prisma.prescriptions.create({
      data: {
        patient_name,
        doctor_id: `${doctor_id}`,
        dosage,
        patient_id: `${patient_id}`,
        notes,
        medicine_name,
      },
    });
  };

  update_prescription = async ({ medicine_name, dosage, notes }) => {
    return await prisma.prescriptions.update({
      where: {
        id: `${id}`,
        doctor_id: `${doctor_id}`,
      },
      data: {
        medicine_name,
        dosage,
        notes,
      },
    });
  };

  search_perscription_with_patient_name = async ({
    doctor_id,
    skip,
    perPageRecord,
    patient_query,
  }) => {
    const where = {
      doctor_id: `${doctor_id}`,
      patient_name: { contains: patient_query },
    };
    const [prescriptions, totalCount] = await Promise.all([
      prisma.prescriptions.findMany({
        where,
        skip,
        take: perPageRecord,
        select: {
          prescribed_at: true,
          patient_name: true,
          medicine_name: true,
          dosage: true,
          notes: true,
        },
        orderBy: {
          prescribed_at: "desc",
        },
      }),
      prisma.appointment.count({
        where,
      }),
    ]);

    return { prescriptions, totalCount };
  };

  get_all_perscription = async ({ doctor_id, skip, perPageRecord }) => {
    const where = {
      doctor_id: `${doctor_id}`,
    };
    const [perscriptions, totalCount] = await Promise.all([
      prisma.prescriptions.findMany({
        where,
        select: {
          medicine_name: true,
          dosage: true,
          patient_name: true,
          notes: true,
        },
        skip,
        take: perPageRecord,
      }),
      prisma.prescriptions.count({
        where,
      }),
    ]);
    return { perscriptions, totalCount };
  };
}

module.exports = doctorService;
