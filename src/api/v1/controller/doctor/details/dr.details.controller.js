const doctorService = require("@v1_service/doctor/doctor.service");
const doctor_service = new doctorService();
const Responses = require("@constants/responses");
const responses = new Responses();
const patientHelperService = require("@v1_helper/index");
const patient_helper = new patientHelperService();
class DoctorDetailsController {
  create_dr_details = async (req, res, next) => {
    try {
      const { education, specialization, token_price } = req.body;
      const doctor_id = req.user.id;
      const create_dr_details = await doctor_service.create_dr_details({
        education: education,
        specialization: specialization,
        token_price: token_price,
        doctor_id,
      });
      const okres = responses.create_success_response(create_dr_details);
      return res.status(okres.status.code).json(okres);
    } catch (error) {
      next(error);
    }
  };

  update_dr_details = async (req, res, next) => {
    try {
      const { education, specialization, token_price } = req.body;
      const doctor_id = req.user.id;
      const updateDrDetails = await doctor_service.update_dr_details({
        education,
        specialization,
        token_price,
        doctor_id,
      });
      const sucRes = responses.update_success_response(updateDrDetails);
      return res.status(sucRes.status.code).json(sucRes);
    } catch (error) {
      next(error);
    }
  };

  create_dr_timings = async (req, res, next) => {
    try {
      const { day, start_time, end_time } = req.body;
      const doctor_id = req.user.id;
    
      const create_timings = await doctor_service.create_dr_details_timings({
        doctor_id: doctor_id,
        day: day,
        start_time:start_time,
        end_time: end_time,
      });

      await doctor_service.dr_is_profile_completed({ doctor_id: doctor_id });

      const sucRes = responses.create_success_response(create_timings);
      return res.status(sucRes.status.code).json(sucRes);
    } catch (error) {
      next(error);
    }
  };

  update_dr_timings = async (req, res, next) => {
    try {
      const { day, start_time, end_time,id } = req.body;
      
      const doctor_id=req.user.id
      const update_dr_timings = await doctor_service.update_dr_details_timings({
       id:id,
        day: day,
        start_time: start_time,
        end_time: end_time,
      });
      const sucRes = responses.update_success_response(update_dr_timings);
      return res.status(sucRes.status.code).json(sucRes);
    } catch (error) {
      next(error);
    }
  };

  home_screen = async (req, res, next) => {
    try {
      const doctor_id=req.user.id
     const {skip,page,perPageRecord}= await patient_helper.pagination(req)
      const {appointment,totalCount }=await doctor_service.home_screen({doctor_id:doctor_id,skip:skip,perPageReord:perPageRecord})

      const totalPage=Math.ceil(totalCount/perPageRecord)
      const okres=responses.ok_response({appointment,page:{
        totalCount,
        totalPage,
        hasNextPage:page < totalPage
      }},"successfully ")
      return res.status(okres.status.code).json(okres)
    } catch (error) {
      next(error);
    }
  };
}

module.exports = DoctorDetailsController;
