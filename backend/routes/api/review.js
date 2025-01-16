const express = require('express');

const router = express.Router();

const { Review, User } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');

// get all reviews for current user
router.get('/current', requireAuth, async (req, res) => {
  const { id } = req.user;

  try {
    const userReviews = await Review.findAll({
      where: { patientId: Number(id) },
      include: [
        {
          model: User,
          attributes: ['id', 'firstName', 'lastName']
        }
      ],
      order: [['updatedAt', 'DESC']]
    })

    if (!userReviews || userReviews.length <= 0) {
      return res.status(200).json({})
    }

    return res.status(200).json({ Reviews: userReviews })
  } catch (error) {
    return res.status(500).json({ message: "An error occurred while getting Reviews", error })
  }
})

// get review by reviewId
router.get('/:reviewId', requireAuth, async (req, res) => {
  const { id } = req.user;
  const { reviewId } = req.params;

  try {
    const oneUser = await User.findByPk(id);
    if (!oneUser || oneUser.length <= 0) {
      return res.status(403).json({ message: "You are not Authorized to get a Review" })
    }

    const userReviews = await Review.findByPk(reviewId, {
      include: [
        {
          model: User,
          attributes: ['id', 'firstName', 'lastName']
        }
      ]
    })

    if (!userReviews || userReviews.length <= 0) {
      return res.status(400).json({ message: "No review record for this User" })
    }

    return res.status(200).json({ Review: userReviews })
  } catch (error) {
    return res.status(500).json({ message: "An error occurred while getting Reviews", error })
  }
})

// update review by current user and reviewId
router.put('/:reviewId', requireAuth, async (req, res) => {
  const { id } = req.user;
  const { reviewId } = req.params;
  const { review, stars } = req.body;
  const patientId = id;

  if (!review || review.length < 10 || review.length > 200 || isNaN(stars) || stars < 1 || stars > 5) {
    return res.status(400).json({
      message: "Bad Input or Data",
      errors: {
        review: "Review must be between 10 and 200 characters",
        stars: "Stars must be between 1 and 5"
      }
    })
  }

  try {
    const updateReview = await Review.findByPk(reviewId);

    if (!updateReview || updateReview.length <= 0) {
      return res.status(400).json({ message: "Review could not be found" })
    }
    if (updateReview.patientId !== Number(id)) {
      return res.status(403).json({ message: "You are not authorized to edit this Review" })
    }

    updateReview.patientId = patientId;
    updateReview.review = review;
    updateReview.stars = parseFloat(stars);

    const reviewUpdated = await updateReview.save();

    return res.status(201).json(reviewUpdated);
  } catch (error) {
    return res.status(500).json({ message: "An error occurred while updating a Review", error })
  }
})

// delete review by current user and reviewId
router.delete('/:reviewId', requireAuth, async (req, res) => {
  const { id } = req.user;
  const { reviewId } = req.params;

  try {
    const oneUser = await User.findByPk(id);
    if (!oneUser || oneUser.length <= 0) {
      return res.status(403).json({ message: "You are not a listed User"})
    }

    const deleteReview = await Review.findByPk(reviewId);

    if (!deleteReview || deleteReview.length <= 0) {
      return res.status(400).json({ message: "Review could not be found" })
    }
    if (!(oneUser.staff === true || deleteReview.patientId === Number(id))) {
      return res.status(403).json({ message: "You are not authorized to delete this Review" })
    }

    await deleteReview.destroy();

    return res.status(201).json({ message: "Successfully deleted" })
  } catch (error) {
    return res.status(500).json({ message: "An error occurred while deleting a Review", error })
  }
})

// create review by current user
router.post('/', requireAuth, async (req, res) => {
  const { id } = req.user;
  const { review, stars } = req.body;
  const patientId = id;

  if (!review || review.length < 10 || review.length > 200 || isNaN(stars) || stars < 1 || stars > 5) {
    return res.status(400).json({
      message: "Bad Input or Data",
      errors: {
        review: "Review must be between 10 and 200 characters",
        stars: "Stars must be between 1 and 5"
      }
    })
  }

  try {
    const newReview = await Review.create({ patientId, review, stars });

    return res.status(201).json(newReview)
  } catch (error) {
    return res.status(500).json({ message: "An error occurred while creating a Review", error })
  }
})

// get all reviews descending by stars and updated date
router.get('/', async (req, res) => {

  try {
    const userReviews = await Review.findAll({
      include: [
        {
          model: User,
          attributes: ['id', 'firstName', 'lastName']
        }
      ],
      order: [
        ['stars', 'DESC'],
        ['updatedAt', 'DESC']
      ]
    })

    if (!userReviews || userReviews.length <= 0) {
      return res.status(400).json({ message: "No review record for this User" })
    }

    return res.status(200).json({ Reviews: userReviews })
  } catch (error) {
    return res.status(500).json({ message: "An error occurred while getting Reviews", error })
  }
})

module.exports = router;