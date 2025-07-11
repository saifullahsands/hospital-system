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

      const { doctors, totalCount } = await patient_service.patient_home_screen(
        { skip: skip, perPageRecord: perPageRecord }
      );
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
}

module.exports = PatientController;
