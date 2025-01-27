const express = require('express');

const router = express.Router();

const { Service, User } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');

// get a service by serviceId
router.get('/:serviceId', requireAuth, async (req, res) => {
  const { id } = req.user;
  const { serviceId } = req.params;

  try {
    const oneUser = await User.findByPk(id);
    if (!oneUser || oneUser.staff !== true) {
      return res.status(403).json({ message: "You are not Authorized to get a Service" })
    }

    const oneService = await Service.findByPk(serviceId);

    if (!oneService || oneService.length <= 0) {
      return res.status(400).json({ message: "Service could not be found" })
    }

    return res.status(200).json({ Service: oneService });
  } catch (error) {
    return res.status(500).json({ message: "An error occurred while getting a Service", error })
  }
})

// update a service by serviceId
router.put('/:serviceId', requireAuth, async (req, res) => {
  const { id } = req.user;
  const { serviceId } = req.params;
  const { service, price } = req.body;

  if (!service || service.length < 2 || service.length > 200 || isNaN(price) || price <= 0) {
    return res.status(400).json({
      message: "Bad Input or Data",
      errors: {
        service: "Service description must be between 4 and 200 characters",
        price: "Price must be a positive integer"
      }
    })
  }

  try {
    const oneUser = await User.findByPk(id);
    if (!oneUser || oneUser.staff !== true) {
      return res.status(403).json({ message: "You are not Authorized to update a Service" })
    }

    const updateService = await Service.findByPk(serviceId);

    if (!updateService || updateService.length <= 0) {
      return res.status(400).json({ message: "Service could not be found" })
    }

    updateService.service = service;
    updateService.price = parseFloat(price);

    const serviceUpdated = await updateService.save();

    return res.status(201).json(serviceUpdated)
  } catch (error) {
    return res.status(500).json({ message: "An error occurred while updating a Service", error })
  }
})

// delete a service by serviceId
router.delete('/:serviceId', requireAuth, async (req, res) => {
  const { id } = req.user
  const { serviceId } = req.params;

  try {
    const oneUser = await User.findByPk(id);
    if (!oneUser || oneUser.staff !== true) {
      return res.status(403).json({ message: "You are not Authorized to delete a Service" })
    }

    const deleteService = await Service.findByPk(serviceId);

    if (!deleteService || deleteService.length <= 0) {
      return res.status(400).json({ message: "Service could not be found" })
    }

    await deleteService.destroy();

    return res.status(201).json({ message: "Successfully deleted" })
  } catch (error) {
    return res.status(500).json({ message: "An error occurred while deleting a Service", error })
  }
})

// create a service
router.post('/', requireAuth, async (req, res) => {
  const { id } = req.user;
  const { service, price } = req.body;

  if (!service || service.length < 2 || service.length > 200 || isNaN(price) || price <= 0) {
    return res.status(400).json({
      message: "Bad Input or Data",
      errors: {
        service: "Service description must be between 4 and 200 characters",
        price: "Price must be a positive integer"
      }
    })
  }

  try {
    const oneUser = await User.findByPk(id);
    if (!oneUser || oneUser.staff !== true) {
      return res.status(403).json({ message: "You are not Authorized to create a Service" })
    }

    const newService = await Service.create({ service, price });

    return res.status(201).json(newService)
  } catch (error) {
    return res.status(500).json({ message: "An error occurred while creating a Service", error })
  }
})

// get All service
router.get('/', async (req, res) => {
  try {
    const allService = await Service.findAll({
      order: [['id', 'ASC']]
    });

    if (!allService || allService.length <= 0) {
      return res.status(400).json({ message: "No Service in the database" })
    }

    return res.status(200).json({ Services: allService });
  } catch (error) {
    return res.status(500).json({ message: "An error occurred while getting Services", error })
  }
})

module.exports = router;