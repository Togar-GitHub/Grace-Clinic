const express = require('express');
const { Op, fn, col, Sequelize } = require('sequelize');

const router = express.Router();

const { Appointment, User } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');

// get appointments (using POST) by firstName, lastName and DOB
router.post('/patientAppointments', requireAuth, async (req, res) => {
  const { id } = req.user;
  const { firstName, lastName, dateOfBirth } = req.body;

  try {
    const patientAppointments = await Appointment.findAll({
      where: { 
        doctorId: Number(id),
        dateMet: null 
      },
      include: [
        {
          model: User,
          as: 'patient',
          where: {
            firstName: firstName,
            lastName: lastName,
            dateOfBirth: dateOfBirth
          },
          attributes: ['id', 'firstName', 'lastName', 'dateOfBirth', 'gender'],
        },
        {
          model: User,
          attributes: ['id', 'firstName', 'lastName', 'position'],
          as: 'doctor'
        }
      ],
      order: [['dateTime', 'DESC']]
    });

    if (!patientAppointments || patientAppointments.length <= 0) {
      return res.status(200).json({})
    }

    return res.status(200).json({ Appointment: patientAppointments })
  } catch (error) {
    return res.status(500).json({ message: "An error occurred while getting Appointments", error })
  }
})

// delete passed appointment by admin which dateMet = null
router.delete('/admin/:appointmentId', requireAuth, async (req, res) => {
  const { id } = req.user;
  const { appointmentId } = req.params;
  const todayDate = new Date();

  try {
    const oneUser = await User.findByPk(id);
    if (!oneUser || oneUser.staff !== true) {
      return res.status(403).json({ message: "You are not Authorized to get an Appointment" })
    }

    const deleteAppointment = await Appointment.findByPk(appointmentId);

    if (!deleteAppointment || deleteAppointment.length <= 0) {
      return res.status(400).json({ message: "Appointment could not be found" })
    }
    if (todayDate <= new Date(deleteAppointment.dateTime)) {
      return res.status(403).json({ message: "You are not allowed to delete passed Appointment" })
    }
    if (deleteAppointment.dateMet) {
      return res.status(403).json({ message: "You are not allowed to delete Appointment that have met" })
    }

    await deleteAppointment.destroy();

    return res.status(201).json({ message: "Successfully deleted" })
  } catch (error) {
    return res.status(500).json({ message: "An error occurred while deleting an Appointment", error })
  }
})

// update appointment by admin - usually by phone call
router.put('/admin/:appointmentId', requireAuth, async (req, res) => {
  const { id } = req.user;
  const { appointmentId } = req.params;
  const { doctorId, dateTime, complaint, insurance } = req.body;
  const todayDate = new Date();
  const parsedDateTime = new Date(dateTime);

  if (!doctorId || !dateTime || isNaN(parsedDateTime) || parsedDateTime < todayDate ||
      !complaint || complaint.length < 4 || complaint > 200) {
    return res.status(400).json({
      message: "Bad Input or Data",
      errors: {
        doctorId: "Required to choose a Doctor",
        dateTime: "Require to choose a date and a time and can't be today or pass",
        complaint: "Complaint must be between 4 and 200 characters"
      }
    })
  }

  try {
    const oneUser = await User.findByPk(id);
    if (!oneUser || oneUser.staff !== true) {
      return res.status(403).json({ message: "You are not Authorized to update an Appointment" })
    }

    const updateAppointment = await Appointment.findByPk(appointmentId);

    if (!updateAppointment || updateAppointment.length <= 0) {
      return res.status(400).json({ message: "Appointment could not be found" })
    }

    updateAppointment.doctorId = Number(doctorId);
    updateAppointment.dateTime = dateTime;
    updateAppointment.complaint = complaint;
    updateAppointment.insurance = insurance;

    const appointmentUpdated = await updateAppointment.save();

    return res.status(201).json(appointmentUpdated);
  } catch (error) {
    return res.status(500).json({ message: "An error occurred while updating an Appointment", error })
  }
})

// update appointment for the dateMet when chart is created by appointmentId
router.put('/chart/:appointmentId', requireAuth, async (req, res) => {
  const { id } = req.user;
  const { appointmentId } = req.params;
  const { dateMet } = req.body;

  try {
    const oneUser = await User.findByPk(id);
    if (!oneUser || oneUser.staff !== true) {
      return res.status(403).json({ message: "You are not Authorized to update an Appointment" })
    }

    const updateAppointment = await Appointment.findByPk(appointmentId);

    if (!updateAppointment || updateAppointment.length <= 0) {
      return res.status(400).json({ message: "Appointment could not be found" })
    }

    updateAppointment.dateMet = dateMet;

    const appointmentUpdated = await updateAppointment.save();

    return res.status(201).json(appointmentUpdated);
  } catch (error) {
    return res.status(500).json({ message: "An error occurred while updating an Appointment", error })
  }
})

// get All appointments by admin or staff with dateMet === null and date === req.body
router.post('/admin', requireAuth, async (req, res) => {
  const { id } = req.user;
  const { date } = req.body;

  console.log('backend date > ', date);

  try {
    const userAppointment = await Appointment.findAll({
      where: { 
        dateMet: null,
        [Sequelize.Op.and]: Sequelize.where(
          Sequelize.fn('DATE', Sequelize.col('dateTime')), 
          '=', 
          date
        )
      },
      include: [
        {
          model: User,
          attributes: ['id', 'firstName', 'lastName', 'dateOfBirth', 'gender'],
          as: 'patient'
        },
        {
          model: User,
          attributes: ['id', 'firstName', 'lastName', 'position'],
          as: 'doctor'
        }
      ],
      order: [['dateTime', 'ASC']]
    });

    if (!userAppointment || userAppointment.length <= 0) {
      return res.status(200).json({})
    }

    return res.status(200).json({ Appointment: userAppointment })
  } catch (error) {
    return res.status(500).json({ message: "An error occurred while getting Appointments", error })
  }
})

// get All appointments by current user
router.get('/current', requireAuth, async (req, res) => {
  const { id } = req.user;

  try {
    const userAppointment = await Appointment.findAll({
      where: { patientId: id },
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
        }
      ],
      order: [['dateTime', 'DESC']]
    });

    if (!userAppointment || userAppointment.length <= 0) {
      return res.status(200).json({})
    }

    return res.status(200).json({ Appointment: userAppointment })
  } catch (error) {
    return res.status(500).json({ message: "An error occurred while getting Appointments", error })
  }
})

// check if any appointment similar doctor and date and time
router.post('/specAppointment', requireAuth, async (req, res) => {
  const { id } = req.user;
  const { doctorId, dateTime } = req.body;

  try {
    const specAppointment = await Appointment.findOne({
      where: { 
        doctorId: doctorId,
        dateTime: dateTime
      },
    });

    if (!specAppointment) {
      return res.status(200).json({})
    }

    return res.status(200).json({ Appointment: specAppointment })
  } catch (error) {
    return res.status(500).json({ message: "An error occurred while getting Appointments", error })
  }
})

// get an appointment by appointmentId
router.get('/:appointmentId', requireAuth, async (req, res) => {
  const { id } = req.user;
  const { appointmentId } = req.params;

  try {
    const oneUser = await User.findByPk(id);
    if (!oneUser) {
      return res.status(403).json({ message: "You are not Authorized to get an Appointment" })
    }

    const oneAppointment= await Appointment.findByPk(appointmentId, {
      include: [
        {
          model: User,
          attributes: ['id', 'firstName', 'lastName', 'dateOfBirth', 'gender'],
          as: 'patient'
        },
        {
          model: User,
          attributes: ['id', 'firstName', 'lastName', 'position'],
          as: 'doctor'
        }
      ]
    });

    if (!oneAppointment || oneAppointment.length <= 0) {
      return res.status(400).json({ message: "Appointment could not be found" })
    }

    return res.status(200).json({ Appointment: oneAppointment })
  } catch (error) {
    return res.status(500).json({ message: "An error occurred while getting an Appointment", error })
  }
})

// update appointment by current user by appointmentId
router.put('/:appointmentId', requireAuth, async (req, res) => {
  const { id } = req.user;
  const { appointmentId } = req.params;
  const { doctorId, dateTime, complaint, insurance } = req.body;
  const patientId = id;
  const todayDate = new Date();
  const parsedDateTime = new Date(dateTime);

  if (!doctorId || !dateTime || isNaN(parsedDateTime) || parsedDateTime < todayDate ||
      !complaint || complaint.length < 2 || complaint > 200) {
    return res.status(400).json({
      message: "Bad Input or Data",
      errors: {
        doctorId: "Required to choose a Doctor",
        dateTime: "Require to choose a date and a time and can't be today or pass",
        complaint: "Complaint must be between 4 and 200 characters"
      }
    })
  }

  try {
    const updateAppointment = await Appointment.findByPk(appointmentId);

    if (!updateAppointment || updateAppointment.length <= 0) {
      return res.status(400).json({ message: "Appointment could not be found" })
    }
    if (updateAppointment.patientId !== Number(id)) {
      return res.status(403).json({ message: "You are not authorized to edit this Appointment" })
    }

    updateAppointment.patientId = Number(patientId);
    updateAppointment.doctorId = Number(doctorId);
    updateAppointment.dateTime = dateTime;
    updateAppointment.complaint = complaint;
    updateAppointment.insurance = insurance;

    const appointmentUpdated = await updateAppointment.save();

    return res.status(201).json(appointmentUpdated);
  } catch (error) {
    return res.status(500).json({ message: "An error occurred while updating an Appointment", error })
  }
})

// delete appointment by current user using appointmentId
router.delete('/:appointmentId', requireAuth, async (req, res) => {
  const { id } = req.user;
  const { appointmentId } = req.params;
  const todayDate = new Date();

  try {
    const deleteAppointment = await Appointment.findByPk(appointmentId);

    if (!deleteAppointment || deleteAppointment.length <= 0) {
      return res.status(400).json({ message: "Appointment could not be found" })
    }
    if (deleteAppointment.patientId !== Number(id)) {
      return res.status(403).json({ message: "You are not authorized to delete this Appointment" })
    }
    if (todayDate >= new Date(deleteAppointment.dateTime)) {
      return res.status(403).json({ message: "You are not allowed to delete passed Appointment" })
    }

    await deleteAppointment.destroy();

    return res.status(201).json({ message: "Successfully deleted" })
  } catch (error) {
    return res.status(500).json({ message: "An error occurred while deleting an Appointment", error })
  }
})

// create appointment by current user
router.post('/', requireAuth, async (req, res) => {
  const { id } = req.user;
  const { doctorId, dateTime, complaint, insurance } = req.body;
  const patientId = id;
  const todayDate = new Date();
  const parsedDateTime = new Date(dateTime);

  if (!doctorId || !dateTime || isNaN(parsedDateTime) || parsedDateTime < todayDate ||
      !complaint || complaint.length < 2 || complaint > 200) {
    return res.status(400).json({
      message: "Bad Input or Data",
      errors: {
        doctorId: "Require to choose a Doctor",
        dateTime: "Require to choose a date and a time and can't be today or pass",
        complaint: "Complaint must be between 4 and 200 characters"
      }
    })
  }

  try {
    const newAppointment = await Appointment.create({
      patientId, doctorId, dateTime, complaint, insurance
    });

    return res.status(201).json(newAppointment);
  } catch (error) {
    return res.status(500).json({ message: "An error occurred while creating an Appointment", error })
  }
})

// get All appointments
router.get('/', async (req, res) => {
  try {
    const allAppointment= await Appointment.findAll({
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
        }
      ]
    });

    if (!allAppointment || allAppointment.length <= 0) {
      return res.status(400).json({ message: "No Appointment exist" })
    }

    return res.status(200).json({ Appointments: allAppointment })
  } catch (error) {
    return res.status(500).json({ message: "An error occurred while getting Appointments", error })
  }
})

module.exports = router;