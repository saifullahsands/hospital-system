const PatientService = require("@v1_service/patient/patient.service");
const patient_service = new PatientService();
const patientHelperService = require("@v1_helper/index");
const patient_helper = new patientHelperService();
const Responses = require("@constants/responses");
const responses = new Responses();

class PatientController {
  patient_home_screen = async (req, res, next) => {
    try {
      const { skip, page, perPageRecord } = await patient_helper.pagination(
        req
      );

      const { doctors, totalCount } = await patient_service.get_all_doctor({
        skip: skip,
        perPageRecord: perPageRecord,
      });
      const totalPage = Math.ceil(totalCount / perPageRecord);

      const response = responses.ok_response(
        {
          doctors: doctors,
          Page: {
            page,
            totalCount,
            totalPage: totalPage,
            isNextPage: page < totalPage,
          },
        },
        "get all doctors"
      );
      return res.status(response.status.code).json(response);
    } catch (error) {
      next(error);
    }
  };

  create_appointment = async (req, res, next) => {
    try {
      const { doctor_name, doctor_id, appointment_date, patient_name } =
        req.body;

      const dr=await patient_service.checking_doctor_available({doctor_id:doctor_id})
      if(!dr || !dr.is_available){
        const badres=responses.bad_request_error("this time we cannot provide appointments")
      return res.status(badres.status.code).json(badres)
      }

      const patient_id = req.user.id;
      const creatAppointment = await patient_service.create_appointment({
        patient_name: patient_name,
        patient_id: `${patient_id}`,
        doctor_name: doctor_name,
        appointment_date: appointment_date,
        doctor_id: doctor_id,
      });
      const createdRes = responses.create_success_response(creatAppointment);
      return res.status(createdRes.status.code).json(createdRes);
    } catch (error) {
      next(error);
    }
  };

  search_doctor = async (req, res, next) => {
    try {
      const { skip, page, perPageRecord } = await patient_helper.pagination(
        req
      );
      const searchdr = req.query.search_doctor || "";
      const { doctors, totalCount } = await patient_service.search_doctor(
        searchdr,
        skip,
        perPageRecord
      );
      const totalPage = Math.ceil(totalCount / perPageRecord);
      const okres = responses.ok_response({
        doctors: doctors,
        Pages: {
          totalCount,
          totalPage,
          hasNextPage: page < totalPage,
        },
      });
      return res.status(okres.status.code).json(okres);
    } catch (error) {
      next(error);
    }
  };
}

module.exports = PatientController;
