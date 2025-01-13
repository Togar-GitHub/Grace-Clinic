const express = require('express');

const router = express.Router();

const { CPT, User } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');

// get a CPT by CPTId
router.get('/:cptId', requireAuth, async (req, res) => {
  const { id } = req.user;
  const { cptId } = req.params;

  try {
    const oneUser = await User.findByPk(id);
    if (!oneUser || oneUser.staff !== true) {
      return res.status(403).json({ message: "You are not Authorized to get a CPT Code" })
    }

    const oneCPT = await CPT.findByPk(cptId);

    if (!oneCPT || oneCPT.length <= 0) {
      return res.status(400).json({ message: "CPT could not be found" })
    }

    return res.status(200).json({ CPT: oneCPT });
  } catch (error) {
    return res.status(500).json({ message: "An error occurred while getting a CPT", error })
  }
})

// update a CPT record by cptId
router.put('/:cptId', requireAuth, async (req, res) => {
  const { id } = req.user;
  const { cptId } = req.params;
  const { CPTCode, description, price } = req.body;

  if (!CPTCode || isNaN(CPTCode) || CPTCode < 10000 || CPTCode > 99999 ||
      !description || description.length < 4 || description > 200 ||
      !price || isNaN(price) || price <= 0) {
    return res.status(400).json({
      message: "Bad Input or Data",
      errors: {
        CPTCode: "CPTCode must be 5 digit number",
        description: "Description must be between 4 and 200 characters",
        price: "Price must be a positive integer"
      }
    })
  }

  try {
    const oneUser = await User.findByPk(id);
    if (!oneUser || oneUser.staff !== true) {
      return res.status(403).json({ message: "You are not Authorized to update a CPT Code" })
    }

    const updateCPT = await CPT.findByPk(cptId);

    if (!updateCPT || updateCPT.length <= 0) {
      return res.status(400).json({ message: "CPT record could not be found" })
    }

    updateCPT.CPTCode = CPTCode;
    updateCPT.description = description;
    updateCPT.price = price;

    const cptUpdated = await updateCPT.save();

    return res.status(201).json(cptUpdated);
  } catch (error) {
    return res.status(500).json({ message: "An error occurred while updating a CPT Code", error })
  }
})

// delete a CPT record by cptId
router.delete('/:cptId', requireAuth, async (req, res) => {
  const { id } = req.user;
  const { cptId } = req.params;

  try {
    const oneUser = await User.findByPk(id);
    if (!oneUser || oneUser.staff !== true) {
      return res.status(403).json({ message: "You are not Authorized to delete a CPT Code" })
    }

    const deleteCPT = await CPT.findByPk(cptId);

    if (!deleteCPT || deleteCPT.length <= 0) {
      return res.status(400).json({ message: "CPT record could not be found" })
    }

    await deleteCPT.destroy();

    return res.status(201).json({ message: "Successfully deleted "});
  } catch (error) {
    return res.status(500).json({ message: "An error occurred while deleting a CPT Code", error })
  }
})

// create a CPT record
router.post('/', requireAuth, async (req, res) => {
  const { id } = req.user;
  const { CPTCode, description, price } = req.body;

  if (!CPTCode || isNaN(CPTCode) || CPTCode < 10000 || CPTCode > 99999 ||
      !description || description.length < 4 || description > 200 ||
      !price || isNaN(price) || price <= 0) {
    return res.status(400).json({
      message: "Bad Input or Data",
      errors: {
        CPTCode: "CPTCode must be 5 digit number",
        description: "Description must be between 4 and 200 characters",
        price: "Price must be a positive integer"
      }
    })
  }

  try {
    const oneUser = await User.findByPk(id);
    if (!oneUser || oneUser.staff !== true) {
      return res.status(403).json({ message: "You are not Authorized to create a CPT Code" })
    }

    const newCPT = await CPT.create({ CPTCode, description, price });

    return res.status(201).json(newCPT);
  } catch (error) {
    return res.status(500).json({ message: "An error occurred while creating a CPT Code", error })
  }
})

// get All CPT
router.get('/', async (req, res) => {
  try {
    const allCPT = await CPT.findAll();

    if (!allCPT || allCPT.length <= 0) {
      return res.status(400).json({ message: "No CPT in the database" })
    }

    return res.status(200).json({ CPT: allCPT });
  } catch (error) {
    return res.status(500).json({ message: "An error occurred while getting CPTs", error })
  }
})

module.exports = router;