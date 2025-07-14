const doctorService =require("@v1_service/doctor/doctor.service")
const doctor_service=new doctorService();
const Responses=require("@constants/responses")
const responses=new Responses()


class DoctorController{

    create_dr_details=async(req,res,next)=>{
        try {
            const {education,specialization,token_price}=req.body;
            const doctor_id=req.user.id;
            const create_dr_details=await doctor_service.create_dr_details({education:education,specialization:specialization,token_price:token_price,doctor_id})
            const okres=responses.create_success_response(create_dr_details)
            return res.status(okres.status.code).json(okres)
        } catch (error) {
            next(error)
        }
    }

    update_dr_details=async(req,res,next)=>{
        try {
            const {education,specialization,token_price}=req.body;
            const doctor_id=req.user.id
            const updateDrDetails=await doctor_service.updare_dr_details({education,specialization,token_price,doctor_id})
            const sucRes=responses.update_success_response(updateDrDetails)
            return res.status(sucRes.status.code).json(sucRes)
        } catch (error) {
            next(error)
        }
    }

    home_screen=async(req,res,next)=>{
        try {
            
        } catch (error) {
            next(error)
        }
    }

}

module.exports=DoctorController