const { prisma}=require("@config/prisma")
class AuthService{
    update_user=async({first_name,last_name,user_id})=>{
        return await prisma.users.update({
            where:{
                id:`${user_id}`
            },
            data:{
                last_name:last_name,
                first_name:first_name
            }
        })
    }
    change_password=async({user_id,password})=>{
        return await prisma.users.update({
            where:{
                id:`${user_id}`
            },
            data:{
                password:password
            }
        })
    }
}
module.exports=AuthService;