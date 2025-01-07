const express = require('express');

const router = express.Router();

const { Service } = require('../../db/models');

// get a service by serviceId
router.get('/:serviceId', async (req, res) => {
  const { serviceId } = req.params;

  try {
    const oneService = await Service.findByPk(serviceId);

    if (!oneService || oneService.length <= 0) {
      return res.status(400).json({ message: "Service could not be found" })
    }

    return res.status(200).json({ Service: oneService });
  } catch (error) {
    return res.status(500).json({ message: "An error occurred while getting a Service" })
  }
})

// update a service by serviceId
router.put('/:serviceId', async (req, res) => {
  const { serviceId } = req.params;
  const { service, price } = req.body;

  if (!service || service.length < 4 || service.length > 200 || isNaN(price) || price <= 0) {
    return res.status(400).json({
      message: "Bad Input or Data",
      errors: {
        service: "Service description must be between 4 and 200 characters",
        price: "Price must be positive integer"
      }
    })
  }

  try {
    const updateService = await Service.findByPk(serviceId);

    if (!updateService || updateService.length <= 0) {
      return res.status(400).json({ message: "Service could not be found" })
    }

    updateService.service = service;
    updateService.price = parseFloat(price);

    const serviceUpdated = await updateService.save();

    return res.status(201).json(serviceUpdated)
  } catch (error) {
    return res.status(500).json({ message: "An error occurred while updating a Service" })
  }
})

// delete a service by serviceId
router.delete('/:serviceId', async (req, res) => {
  const { serviceId } = req.params;

  try {
    const deleteService = await Service.findByPk(serviceId);

    if (!deleteService || deleteService.length <= 0) {
      return res.status(400).json({ message: "Service could not be found" })
    }

    await deleteService.destroy();

    return res.status(201).json({ message: "Successfully deleted" })
  } catch (error) {
    return res.status(500).json({ message: "An error occurred while deleting a Service" })
  }
})

// create a service
router.post('/', async (req, res) => {
  const { service, price } = req.body;

  if (!service || service.length < 4 || service.length > 200 || isNaN(price) || price <= 0) {
    return res.status(400).json({
      message: "Bad Input or Data",
      errors: {
        service: "Service description must be between 4 and 200 characters",
        price: "Price must be positive integer"
      }
    })
  }

  try {
    const newService = await Service.create({ service, price });

    return res.status(201).json(newService)
  } catch (error) {
    return res.status(500).json({ message: "An error occurred while creating a Service" })
  }
})

// get All service
router.get('/', async (req, res) => {
  try {
    const allService = await Service.findAll();

    if (!allService || allService.length <= 0) {
      return res.status(400).json({ message: "No service in the database" })
    }

    return res.status(200).json({ Services: allService });
  } catch (error) {
    return res.status(500).json({ message: "An error occurred while getting services" })
  }
})

module.exports = router;