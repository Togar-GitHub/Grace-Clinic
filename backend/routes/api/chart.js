const express = require('express');

const router = express.Router();

const { Chart, User, Appointment, CPT, Service } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');

// get charts (using POST) by firstName, lastName and DOB
router.post('/patientCharts', requireAuth, async (req, res) => {
  const { id } = req.user;
  const { firstName, lastName, dateOfBirth } = req.body;

  try {
    const patientCharts = await Chart.findAll({
      include: [
        {
          model: User,
          as: 'patient',
          where: {
            firstName: firstName,
            lastName: lastName,
            dateOfBirth: dateOfBirth
          },
          attributes: ['id', 'firstName', 'lastName', 'dateOfBirth', 'gender']
        },
        {
          model: User,
          as: 'doctor',
          attributes: ['id', 'firstName', 'lastName', 'position']
        },
        {
          model: Appointment,
          attributes: ['id', 'patientId', 'doctorId', 'dateTime', 'complaint', 'insurance']
        },
        {
          model: CPT,
          attributes: ['id', 'CPTCode', 'description', 'price']
        }
      ],
      order: [[ 'meetingDate', 'DESC' ]]
    })

    if (!patientCharts || patientCharts.length <= 0) {
      return res.status(200).json({})
    }

    // Collect all service IDs across all charts
    let serviceIds = [];
    patientCharts.forEach(chart => {
      if (Array.isArray(chart.services)) {
        // Assuming chart.services is an array of service IDs
        serviceIds = [...serviceIds, ...chart.services]; // Flatten all service IDs into a single array
      }
    });

    // Fetch services if there are service IDs
    let services = [];
    if (serviceIds.length > 0) {
      services = await Service.findAll({
        where: {
          id: serviceIds
        }
      });
    }

    // For each chart, assign the corresponding services
    patientCharts.forEach(chart => {
      // Filter services that match the service IDs in the chart
      const chartServices = services.filter(service => chart.services.includes(service.id));
      
      // Set the matched services for this chart
      chart.setDataValue('services', chartServices);
    });

    res.status(200).json({ charts: patientCharts })
  } catch (error) {
    return res.status(500).json({ message: "An error occurred while getting the Charts", error })
  }
})

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
          attributes: ['id', 'firstName', 'lastName', 'dateOfBirth'],
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
    let serviceDetails = [];
    
    if (serviceIds && Array.isArray(serviceIds) && serviceIds.length > 0) {
      // Fetch the service data from the Service table based on the serviceIds
      services = await Service.findAll({
        where: { id: serviceIds }
      });
    
      // Map the services into a detailed format for the 'serviceDetails' field
      serviceDetails = services.map((service) => ({
        id: service.id,
        name: service.name, // Assuming 'name' is the service name column, replace it with actual field name
        description: service.description, // Replace with actual field name if different
        // Add other service fields as necessary
      }));
    }
    
    // Set 'services' as the array of service IDs and 'serviceDetails' with the full service data
    oneChart.setDataValue('services', serviceIds);
    oneChart.setDataValue('serviceDetails', serviceDetails);
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

      if (!diagnosesICD10 || diagnosesDesc < 2 || diagnosesDesc > 200 ||
          !CPTId || !title || title.length < 2 || title.length > 100 ||
          !doctorNote || doctorNote.length < 2 || doctorNote.length > 2000) {
        return res.status(400).json({
          message: "Bad Input or Data",
          errors: {
            diagnosesICD10: "Need ICD10 Codes",
            diagnosesDesc: "Require a description of the 1st ICD10 Code",
            CPTId: "Require the CPT Code",
            title: "Require Title for the chart must be between 4 and 100 characters",
            doctorNote: "Require the note must be between 10 and 2000 characters",
            services: "Must be within an Array",
            nextAppointment: "Must have and in the future"
          }
        })
      }

      let sum = 0;

      const CPTData = await CPT.findOne({
        where: { id: CPTId }
      })
      if (!CPTData || CPTData.length <= 0) {
        return res.status(400).json({ message: "The CPT Code is invalid" })
      }
      sum += CPTData.price;
      console.log('after CPT > ', sum);
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
        sum += serviceSum;
      }
      console.log('after service > ', sum);
      updateChart.diagnosesICD10 = diagnosesICD10;
      updateChart.diagnosesDesc = diagnosesDesc;
      updateChart.CPTId = CPTId;
      updateChart.title = title;
      updateChart.doctorNote = doctorNote;
      updateChart.services = Array.isArray(services) ? services: [];
      updateChart.prescription = prescription;
      updateChart.insurance = insurance;
      updateChart.cost = sum;
      updateChart.nextAppointment = nextAppointment;
      console.log('ready to update chart cost > ', updateChart.cost)
      console.log('ready to update all fields > ', updateChart)
      const chartUpdated = await updateChart.save();

      return res.status(201).json(chartUpdated);

    } else {  

      // this is for staff to update - will handle in frontend for the specific input / screen

      const { insurance, nextAppointment } = req.body;
      // const todayDate = new Date();
      // const parsedNextAppointment = new Date(nextAppointment);

      // if (!nextAppointment || isNaN(parsedNextAppointment || parsedNextAppointment < todayDate)) {
      //   return res.status(400).json({
      //     message: "Bad Input or Data",
      //     errors: {
      //       nextAppointment: "Must have and in the future"
      //     }
      //   })
      // }

      updateChart.insurance = insurance;
      updateChart.nextAppointment = nextAppointment;

      const chartUpdated = await updateChart.save();

      return res.status(201).json(chartUpdated);
    }
  } catch (error) {
    return res.status(500).json({ message: "An error occurred while updating a Chart", error })
  }
})

router.delete('/:chartId', requireAuth, async (req, res) => {
  const { id } = req.user;
  const { chartId } = req.params;

  try {
    const deleteChart = await Chart.findByPk(chartId);

    if (!deleteChart || deleteChart.length <= 0) {
      return res.status(400).json({ message: 'Chart could not be found' })
    }

    if (deleteChart.doctorId !== id) {
      return res.status(403).json({ message: 'You are not Authorized to delete this Chart' })
    }

    await deleteChart.destroy();

    const updateAppointment = await Appointment.findByPk(deleteChart.appointmentId);
    updateAppointment.dateMet = null;
    await updateAppointment.save();

    return res.status(201).json({ message: 'Successfully deleted' })
  } catch (error) {
    return res.status(500).json({ message: 'An error occurred while deleting the Chart' })
  }
})

// create chart
router.post('/', requireAuth, async (req, res) => {
  const { id } = req.user;
  const { patientId, appointmentId, complaint, meetingDate, diagnosesICD10,
          diagnosesDesc, CPTId, title, doctorNote, services, 
          prescription, insurance, nextAppointment
  } = req.body;

  if (!patientId || !appointmentId ||
       !complaint || complaint < 2 || complaint > 200 || !meetingDate ||
       !diagnosesICD10 || diagnosesDesc < 2 || diagnosesDesc > 200 ||
       !CPTId || !title || title.length < 2 || title.length > 100 ||
       !doctorNote || doctorNote.length < 2 || doctorNote.length > 2000) {
    return res.status(400).json({
      message: "Bad Input or Data",
      errors: {
        patientId: "Require a patient",
        appointmentId: "Require an association with an Appointment",
        complaint: "Need to original complaint from Appointment",
        meetingDate: "Need meeting Date",
        diagnosesICD10: "Need ICD10 Codes",
        diagnosesDesc: "Require a description of the 1st ICD10 Code",
        CPTId: "Require the CPT Code",
        title: "Require Title for the chart must be between 4 and 100 characters",
        doctorNote: "Require the note must be between 10 and 2000 characters"
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
      where: { id: Number(CPTId) }
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
      meetingDate,
      diagnosesICD10,
      diagnosesDesc,
      CPTId,
      title,
      doctorNote,
      services: Array.isArray(services) ? services: [],
      prescription,
      insurance,
      cost: sum,
      nextAppointment
    })

    const updateAppointment = await Appointment.findByPk(newChart.appointmentId);
    updateAppointment.dateMet = newChart.meetingDate;
    await updateAppointment.save();

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