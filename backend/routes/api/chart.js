const express = require('express');

const router = express.Router();

const { Chart, User, Appointment, CPT, Service } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');

// get a chart by chartId
router.get('/:chartId', requireAuth, async (req, res) => {
  const { id } = req.user;
  const { chartId } = req.params;

  try {
    // id should be a staff
    const oneUser = await User.findByPk(id);
    if (!oneUser || oneUser.length <= 0) {
      return res.status(403).json({ message: "The User is NOT Exist" })
    } else {
      if (oneUser.staff !== true) {
        return res.status(403).json({ message: "The User is NOT Authorized" })
      }
    }

    const oneChart = await Chart.findByPk(chartId, {
      include: [
        {
          model: User,
          attributes: ['id', 'firstName', 'lastName'],
          as: 'patient'
        },
        {
          model: User,
          attributes: ['id', 'firstName', 'lastName', 'position'],
          as: 'doctor'
        },
        {
          model: Appointment,
          attributes: ['id', 'patientId', 'doctorId', 'dateTime', 'complaint', 'insurance']
        },
        {
          model: CPT,
          attributes: ['id', 'CPTCode', 'description', 'price']
        },
        // {        // this can be for postgreSQL
        //   model: Service,  // Include the Service model
        //   attributes: ['id', 'service', 'price'],  // Adjust attributes as needed
        //   where: Sequelize.where(
        //     Sequelize.json('Chart.services'), // Access the 'services' JSON field in the Chart model
        //     Sequelize.Op.contains, // Use the 'contains' operator to match the services array
        //     Sequelize.col('Service.id') // Compare against the 'id' field in the Service model
        //   ),
        //   required: false  // This ensures that even if there are no services associated, the query will still return the chart
        // }
      ]
    });

    if (!oneChart || oneChart.length <= 0) {
      return res.status(400).json({ message: "Chart could not be found"})
    }

    // this following codes in getting services info using Sqlite3 - possible to replaced by directly access the model Service as within the query
    const serviceIds = oneChart.services;
    let services = [];
    if (serviceIds && Array.isArray(serviceIds) && serviceIds.length > 0) {
      services = await Service.findAll({
        where: { id: serviceIds }
      })
    }
    oneChart.setDataValue('services', services);
    // these codes are for Sqlite3

    return res.status(200).json({ Chart: oneChart })
  } catch (error) {
    return res.status(500).json({ message: "An error occurred while getting a Chart", error })
  }
})

// update chart by chartId
router.put('/:chartId', requireAuth, async (req, res) => {
  const { id } = req.user;
  const { chartId } = req.params;

  try {

    // id should be a doctor or a staff
    const oneUser = await User.findByPk(id);
    if (!oneUser || oneUser.length <= 0) {
      return res.status(403).json({ message: "The User is NOT Exist" })
    } else {
      if (oneUser.staff !== true) {
        return res.status(403).json({ message: "The User is NOT Authorized" })
      }
    }

    const updateChart = await Chart.findByPk(chartId);

    if (!updateChart || updateChart <= 0) {
      return res.status(400).json({ message: "Chart could not be found" })
    }

    if (oneUser.position === 'doctor') {

      // this is for doctor to update - will handle in frontend for the specific input / screen

      const { diagnosesICD10, diagnosesDesc, CPTId, 
        title, doctorNote, services, prescription, insurance, nextAppointment
      } = req.body;
      const todayDate = new Date();
      const parsedNextAppointment = new Date(nextAppointment);

      if (!diagnosesICD10 || diagnosesDesc < 4 || diagnosesDesc > 200 ||
          !CPTId || !title || title.length < 4 || title.length > 100 ||
          !doctorNote || doctorNote.length < 10 || doctorNote.length > 2000 ||
          !Array.isArray(services) || !nextAppointment ||
          isNaN(parsedNextAppointment || parsedNextAppointment < todayDate)) {
        return res.status(400).json({
          message: "Bad Input or Data",
          errors: {
            diagnosesICD10: "Need ICD10 Codes within an array",
            diagnosesDesc: "Require a description of the 1st ICD10 Code",
            CPTId: "Require the CPT Code",
            title: "Require Title for the chart must be between 4 and 100 characters",
            doctorNote: "Require the note must be between 10 and 2000 characters",
            services: "Must be within an Array",
            nextAppointment: "Must have and in the future"
          }
        })
      }

      const doctorId = id;
      let sum = 0;

      const CPTData = await CPT.findOne({
        where: { id: CPTId}
      })
      if (!CPTData || CPTData.length <= 0) {
        return res.status(400).json({ message: "The CPT Code is invalid" })
      }
      sum = sum + CPTData.price;

      if (services && services.length > 0 && Array.isArray(services)) {
        const serviceIds = services;
        let serviceArr = [];

        if (serviceIds && Array.isArray(serviceIds) && serviceIds.length > 0) {
          serviceArr = await Service.findAll({
            where: { id: serviceIds }
          })
        }

        if (!serviceArr || serviceArr.length <= 0) {
          return res.status(400).json({ message: "The Services are invalid" })
        }

        const serviceSum = serviceArr.reduce((sum, el) => sum + el.price, 0);
        sum = sum + serviceSum;
      }

      updateChart.doctorId = Number(doctorId);
      updateChart.diagnosesICD10 = diagnosesICD10;
      updateChart.diagnosesDesc = diagnosesDesc;
      updateChart.CPTId = CPTId;
      updateChart.title = title;
      updateChart.doctorNote = doctorNote;
      updateChart.services = services;
      updateChart.prescription = prescription;
      updateChart.insurance = insurance;
      updateChart.cost = sum;
      updateChart.nextAppointment = nextAppointment;

      const chartUpdated = await updateChart.save();

      return res.status(201).json(chartUpdated);

    } else {  

      // this is for staff to update - will handle in frontend for the specific input / screen

      const { insurance, nextAppointment } = req.body;
      const todayDate = new Date();
      const parsedNextAppointment = new Date(nextAppointment);

      if (!nextAppointment || isNaN(parsedNextAppointment || parsedNextAppointment < todayDate)) {
        return res.status(400).json({
          message: "Bad Input or Data",
          errors: {
            nextAppointment: "Must have and in the future"
          }
        })
      }

      updateChart.insurance = insurance;
      updateChart.nextAppointment = nextAppointment;

      const chartUpdated = await updateChart.save();

      return res.status(201).json(chartUpdated);
    }
  } catch (error) {
    return res.status(500).json({ message: "An error occurred while updating a Chart", error })
  }
})

// create chart
router.post('/', requireAuth, async (req, res) => {
  const { id } = req.user;
  const { patientId, appointmentId, complaint, diagnosesICD10,
          diagnosesDesc, CPTId, title, doctorNote, services, 
          prescription, insurance, nextAppointment
  } = req.body;
  const todayDate = new Date();
  const parsedNextAppointment = new Date(nextAppointment);

  if (!patientId || !appointmentId ||
       !complaint || complaint < 4 || complaint > 200 ||
       !diagnosesICD10 || diagnosesDesc < 4 || diagnosesDesc > 200 ||
       !CPTId || !title || title.length < 4 || title.length > 100 ||
       !doctorNote || doctorNote.length < 10 || doctorNote.length > 2000 ||
       !Array.isArray(services) || !nextAppointment ||
       isNaN(parsedNextAppointment || parsedNextAppointment < todayDate)) {
    return res.status(400).json({
      message: "Bad Input or Data",
      errors: {
        patientId: "Require a patient",
        appointmentId: "Require an association with an Appointment",
        complaint: "Need to original complaint from Appointment",
        diagnosesICD10: "Need ICD10 Codes within an array",
        diagnosesDesc: "Require a description of the 1st ICD10 Code",
        CPTId: "Require the CPT Code",
        title: "Require Title for the chart must be between 4 and 100 characters",
        doctorNote: "Require the note must be between 10 and 2000 characters",
        services: "Must be within an Array",
        nextAppointment: "Must have and in the future"
      }
    })
  }

  try {
    // id should be a doctor
    const oneUser = await User.findByPk(id);
    if (!oneUser || oneUser.length <= 0) {
      return res.status(403).json({ message: "The User is NOT Exist" })
    } else {
      if (oneUser.staff !== true || oneUser.position !== 'doctor') {
        return res.status(403).json({ message: "The User is NOT Authorized" })
      }
    }
    const doctorId = id;

    let sum = 0;

    const CPTData = await CPT.findOne({
      where: { id: CPTId}
    })
    if (!CPTData || CPTData.length <= 0) {
      return res.status(400).json({ message: "The CPT Code is invalid" })
    }
    sum = sum + CPTData.price;

    if (services && services.length > 0 && Array.isArray(services)) {
      const serviceIds = services;
      let serviceArr = [];

      if (serviceIds && Array.isArray(serviceIds) && serviceIds.length > 0) {
        serviceArr = await Service.findAll({
          where: { id: serviceIds }
        })
      }

      if (!serviceArr || serviceArr.length <= 0) {
        return res.status(400).json({ message: "The Services are invalid" })
      }

      const serviceSum = serviceArr.reduce((sum, el) => sum + el.price, 0);
      sum = sum + serviceSum;
    }

    const newChart = await Chart.create({
      patientId,
      doctorId,
      appointmentId,
      complaint,
      meetingDate: new Date(),
      diagnosesICD10,
      diagnosesDesc,
      CPTId,
      title,
      doctorNote,
      services,
      prescription,
      insurance,
      cost: sum,
      nextAppointment
    })

    return res.status(201).json(newChart);
  } catch (error) {
    return res.status(500).json({ message: "An error occurred while creating a Chart", error })
  }
})

// get All Charts
router.get('/', requireAuth, async (req, res) => {
  const { id } = req.user;

  try {

    // id should be a staff
    const oneUser = await User.findByPk(id);
    if (!oneUser || oneUser.length <= 0) {
      return res.status(403).json({ message: "The User is NOT Exist" })
    } else {
      if (oneUser.staff !== true) {
        return res.status(403).json({ message: "The User is NOT Authorized" })
      }
    }

    const allChart = await Chart.findAll({
      include: [
        {
          model: User,
          attributes: ['id', 'firstName', 'lastName'],
          as: 'patient'
        },
        {
          model: User,
          attributes: ['id', 'firstName', 'lastName', 'position'],
          as: 'doctor'
        },
        {
          model: Appointment,
          attributes: ['id', 'patientId', 'doctorId', 'dateTime', 'complaint', 'insurance']
        },
        {
          model: CPT,
          attributes: ['id', 'CPTCode', 'description', 'price']
        },
        // {        // this can be for postgreSQL
        //   model: Service,  // Include the Service model
        //   attributes: ['id', 'service', 'price'],  // Adjust attributes as needed
        //   where: Sequelize.where(
        //     Sequelize.json('Chart.services'), // Access the 'services' JSON field in the Chart model
        //     Sequelize.Op.contains, // Use the 'contains' operator to match the services array
        //     Sequelize.col('Service.id') // Compare against the 'id' field in the Service model
        //   ),
        //   required: false  // This ensures that even if there are no services associated, the query will still return the chart
        // }
      ]
    });

    if (!allChart || allChart.length <= 0) {
      return res.status(400).json({ message: "No Chart in the database" })
    }

    // Iterate over each chart and manually fetch related services
    const chartsWithServices = await Promise.all(allChart.map(async (chart) => {
      // Extract the services array from the chart (assuming it's an array of service IDs)
      const serviceIds = chart.services;  // Should be an array of service IDs e.g., [1, 2]

      let services = [];
      // If there are service IDs, query the Service model to get the related services
      if (serviceIds && Array.isArray(serviceIds) && serviceIds.length > 0) {
        services = await Service.findAll({
          where: {
            id: serviceIds // Fetch services where the id is in the services array
          }
        });
      }

      // Add services to the chart's data (this will be sent in the response)
      chart.setDataValue('services', services);  // Adds the 'services' to each chart object

      return chart;
    }));

    return res.status(200).json({ Charts: chartsWithServices })
  } catch (error) {
    return res.status(500).json({ message: "An error occurred while getting Charts", error })
  }
})

module.exports = router;