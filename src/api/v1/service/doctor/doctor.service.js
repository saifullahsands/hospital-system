const {prisma }=require("@config/prisma")

class doctorService {

create_dr_details=async({education,specialization,token_price,doctor_id})=>{
    return await prisma.doctor_details.create({
        data:{
            education:education,
            specialization:specialization,
             token_price:token_price,
            user_id:doctor_id
        }
    })
}

updare_dr_details=async({education,specialization,token_price,doctor_id})=>{
    return await prisma.doctor_details.update({
        where:{
            user_id:`${doctor_id}`
        },
        data:{
            specialization,
            education,
            token_price
        }
    })
}

    home_screen=async({doctor_id})=>{
        const [appointment,totalCount] =await Promise.all([
         prisma.appointment.findMany({
            where:{
                doctor_id:`${doctor_id}`
            },
            skip,
            take:perPageReord,
            select:{
                patient_name:true,
            }
        }),
    
    ])
    }

}

module.exports=doctorService;