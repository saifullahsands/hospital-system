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

  checking_doctor_available=async({doctor_id})=>{
    return await prisma.users.findUnique({
      where:{
        id:`${doctor_id}`
      },
      select:{
        is_available:true
      }
    })
  }
  create_appointment = async ({
    patient_name,
    patient_id,
    doctor_name,
    appointment_date,
    doctor_id,
  }) => {

    const date=new Date(appointment_date)
    const startDate=new Date(date.setHours(0,0,0,0))
    const endDate=new Date(date.setHours(23,59,59,999))

    const existingCount=await prisma.appointment.count({
      where:{
        doctor_id:`${doctor_id}`,
        appointment_date:{
          gte:startDate,
          lt:endDate
        }
      }
    })
    if(existingCount >= 20){
      const error=new Error("Doctor already has 20 appointments for the day.")
      error.status=400
      throw error
    }
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
