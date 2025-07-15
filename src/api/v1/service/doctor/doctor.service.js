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
        start_time:start_time,
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

  update_dr_details_timings = async ({
   id,
    day,
    start_time,
    end_time,
  }) => {
    return await prisma.doctor_timings.update({
      where: {
        id:parseInt(id),
      },
      data: {
        start_time: start_time,
        end_time: end_time,
        day,
      },
    });
  };

  home_screen = async ({ doctor_id,skip,perPageReord}) => {
    const [appointment, totalCount] = await Promise.all([
      prisma.appointment.findMany({
        where: {
          doctor_id: `${doctor_id}`,
        },
        skip,
        take: perPageReord,
        select: {
          patient_name: true,
        },
        orderBy: {
          appointment_date:"desc",
        },
      }),
      prisma.appointment.count({
        where:{doctor_id:`${doctor_id}`}
      })
    ]);
    return {appointment, totalCount}
  };
}

module.exports = doctorService;
