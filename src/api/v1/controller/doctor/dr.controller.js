const patientHelperService = require("@v1_helper/index");
const patient_helper = new patientHelperService();
const doctorService = require("@v1_service/doctor/doctor.service");
const doctor_service = new doctorService();
const Responses = require("@constants/responses");
const responses = new Responses();

class DoctorController {
  home_screen = async (req, res, next) => {
    try {
      const doctor_id = req.user.id;
      const { skip, page, perPageRecord } = await patient_helper.pagination(
        req
      );
      const { appointment, totalCount } = await doctor_service.home_screen({
        doctor_id: doctor_id,
        skip: skip,
        perPageReord: perPageRecord,
      });

      const totalPage = Math.ceil(totalCount / perPageRecord);
      const okres = responses.ok_response(
        {
          appointment,
          page: {
            totalCount,
            totalPage,
            hasNextPage: page < totalPage,
          },
        },
        "successfully "
      );
      return res.status(okres.status.code).json(okres);
    } catch (error) {
      next(error);
    }
  };

  create_prescription = async (req, res, next) => {
    try {
      const { patient_name, dosage, patient_id, notes, medicine_name } =
        req.body;
      const doctor_id = req.user.id;
      const createPres = await doctor_service.create_prescription({
        patient_id,
        patient_name,
        dosage,
        notes,
        medicine_name,
        doctor_id,
      });
      const createRes = responses.create_success_response(createPres);
      return res.status(createRes.status.code).json(createRes);
    } catch (error) {
      next(error);
    }
  };

  update_prescription = async (req, res, next) => {
    try {
    } catch (error) {
      next(error);
    }
  };

  get_all_prescription = async (req, res, next) => {
    try {
      const doctor_id = req.user.id;
      const { skip, page, perPageRecord } = await patient_helper.pagination(
        req
      );
      const { perscriptions, totalCount } =
        await doctor_service.get_all_perscription({
          doctor_id: doctor_id,
          skip,
          perPageRecord,
        });
      const totalPage = Math.ceil(totalCount / perPageRecord);
      const okres = responses.ok_response(
        {
          perscriptions,
          page: {
            totalCount,
            totalPage,
            page,
            hasNextPage: page < totalPage,
          },
        },
        "successfully"
      );
      return res.status(okres.status.code).json(okres);
    } catch (error) {
      next(error);
    }
  };

  search_prescription_with_patient_name = async (req, res, next) => {
    try {
      const { patient_query } = req.query.patient_query || "";
      const { skip, perPageRecord, page } = await patient_helper.pagination(
        req
      );
      const doctor_id = req.user.id;
      const { prescriptions, totalCount } =
        await doctor_service.search_perscription_with_patient_name({
          skip,
          perPageRecord,
          doctor_id,
          patient_query,
        });
      const totalPage = Math.ceil(totalCount / perPageRecord);
      const okres = responses.ok_response(
        {
          prescriptions,
          pages: {
            page,
            totalCount,
            totalPage,
            hasNextPage: page < totalPage,
          },
        },
        "successfully"
      );
      return res.status(okres.status.code).json(okres);
    } catch (error) {
      next(error);
    }
  };
}

module.exports = DoctorController;
