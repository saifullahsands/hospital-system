const { prisma}=require("@config/prisma")
class AdminService{

    total_patient=async()=>{
        return await prisma.users.count({
            where:{
                role:"PATIENT"
            }
        })
    }

    total_doctor=async()=>{
        return await prisma.users.count({
            where:{
                role:"DOCTOR"
            }
        })
    }
    total_admin=async({excludeId})=>{
        return await prisma.users.count({
            where:{
                role:"ADMIN",
                NOT:{
                    id:excludeId
                }
            },
        })
    }
}

module.exports=AdminService;