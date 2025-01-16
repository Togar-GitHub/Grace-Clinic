import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateReviewThunk, deleteReviewThunk, createReviewThunk } from '../../store/review';
import { getCurrentReviewsThunk, getReviewByIdThunk } from '../../store/review';
import { FaRegStar, FaStar } from 'react-icons/fa';
import ReviewDeleteModal from '../ReviewDeleteModal/ReviewDeleteModal';
import rpg from './ReviewPage.module.css';

const ReviewPage = () => {
  const reviews = useSelector((state) => state.review.allReviews.Reviews);
  const [loading, setLoading] = useState(true);
  const [noReview, setNoReview] = useState('');
  const [reviewId, setReviewId] = useState('');
  const [updateRecord, setUpdateRecord] = useState('');
  const [reviewText, setReviewText] = useState('');
  const [stars, setStars] = useState(0);
  const [hoveredRating, setHoveredRating] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState(null);
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchReviews = async () => {
      try {
        setLoading(true);
        setNoReview('');
        await dispatch(getCurrentReviewsThunk());
      } finally {
        setLoading(false);
      }
    }
    fetchReviews();
  }, [dispatch])

  useEffect(() => {
    if (!reviews || reviews.length <= 0) {
      setNoReview('There is no Review Record')
    }
  }, [reviews]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = {};

    if (!reviewText) {
      validationErrors.reviewText = 'Please enter review'
    }
    if (!stars || stars < 1) {
      validationErrors.stars = 'Please provide star rating'
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});

    try {
      await dispatch(createReviewThunk({
        review: reviewText,
        stars
      }))

      setReviewText('');
      setStars('');
      await dispatch(getCurrentReviewsThunk());
      setNoReview('');
    } catch (error) {
      console.error('Error creating review:', error);
      setErrors({
        submit: 'There was an error creating the review. Please try again.'
      })
    }
  };

  const handleUpdateClick = async (reviewId) => {
    setLoading(true);
    setUpdateRecord(true);
    const updateReview = await dispatch(getReviewByIdThunk(reviewId));

    setReviewId(updateReview.Review.id);
    setReviewText(updateReview.Review.review);
    setStars(updateReview.Review.stars);
    setLoading(false);
    setErrors({});
    window.scrollTo(0, 0);
  }

  const handleUpdate = async (reviewId) => {
    try {
      const validationErrors = {};

      if (!reviewText) {
        validationErrors.reviewText = 'Please enter review'
      }
      if (!stars) {
        validationErrors.stars = 'Please provide star rating'
      }
  
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }
  
      setErrors({});

      await dispatch(updateReviewThunk(reviewId, {
        review: reviewText,
        stars
      }));

      setUpdateRecord(false);
      setReviewText('');
      setStars('');
      setLoading(true);
      setNoReview('');

      await dispatch(getCurrentReviewsThunk());

      setLoading(false);
      setUpdateRecord('');
    } catch (error) {
      console.error('Error updating review:', error);
      setErrors({
        general: 'An error occurred while updating the review.'
      });
      setLoading(false);
    }
  }

  // handling Stars
  const handleStarClick = (value) => {
    const newStars = Array(5).fill(false);
    for (let i = 0; i < value; i++) {
      newStars[i] = true;
    }
    setStars(value);
  }

  const handleMouseEnter = (value) => {
    setHoveredRating(value);
  }

  const handleMouseLeave = () => {
    setHoveredRating(0);
  }

  const renderStars = () => {
    const starElements = [];
    for (let i = 1; i <= 5; i++) {
      const isFilled = hoveredRating >= i || stars >= i;

      starElements.push(
        <span
          key={i}
          className={rpg.star}
          onClick={() => handleStarClick(i)}
          onMouseEnter={() => handleMouseEnter(i)}
          onMouseLeave={handleMouseLeave}
        >
          {/* {i <= (hoveredRating || rating) ? ( */}
          {isFilled ? (
            <FaStar className={rpg.filled} />
          ) : (
            <FaRegStar className={rpg.empty} />
          )}
        </span>
      )
    }
    return starElements;
  }

  const handleDeleteClick = (reviewId) => {
    setReviewToDelete(reviewId);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setReviewToDelete(null);
  }

  const confirmDeletion = async () => {
    if (reviewToDelete) {
      await deleteReview(reviewToDelete);
      closeModal();
    }
  }

  const deleteReview = async (reviewId) => {
    await dispatch(deleteReviewThunk(reviewId));
    await dispatch(getCurrentReviewsThunk());
    setUpdateRecord('');
    setErrors({});
    window.scrollTo(0, 0);
  }

  if (loading) {
    <p className={rpg.loading}>Loading...</p>
  }

  return (
    <div className={rpg.mainContainer}>
      <h1 className={rpg.reviewTitle}>Review Page</h1>

      <div className={rpg.createReviewContainer}>
        {updateRecord ? (
          <h2 className={rpg.createReviewTitle}>Update Review</h2>
        ) : (
          <h2 className={rpg.createReviewTitle}>Create New Review</h2>
        )}

        <div className={rpg.inputReview}>
          <input
            className={rpg.enterReview}
            type="text"
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            placeholder='Enter your reviews'
            required
          />
          {errors.reviewText && <p className={rpg.errors}>{errors.reviewText}</p>}
        </div>

        <div className={rpg.starRatingContainer}>
          <div className={rpg.starRating}>
            {renderStars()}
          </div>
          <h3 className={rpg.starRating}>Stars</h3>
          {errors.stars && <p className={rpg.errors}>{errors.stars}</p>}
        </div>

        <div className={rpg.submitContainer}>
          {updateRecord ? (
            <button className={rpg.submitButton} onClick={() => handleUpdate(reviewId)}>
              Update
            </button>
          ) : (
            <button className={rpg.submitButton} onClick={handleSubmit}>
              Submit
            </button>
          )}
        </div>
      </div>

      {/* Modal for confirming the deletion */}
      {showModal && (
        <ReviewDeleteModal
          onClose={closeModal} 
          onConfirm={confirmDeletion} 
        />
      )}

      <div className={rpg.noReview}>
        {noReview && (
          <h2 className={rpg.noReviewMessage}>{noReview}</h2>
        )}
      </div>

      <div className={rpg.reviewListContainer}>
        {reviews && reviews.length > 0 && (
          <h2 className={rpg.reviewListTitle}>Your Review List</h2>
        )}
        {reviews && reviews.length > 0 && (
          reviews.map((el) => (
            <div key={el.id}>
              <div className={rpg.reviewList}>
                <p className={rpg.listInfo}>Review: {el.review}</p>
                <p className={rpg.listInfo}>Stars: {el.stars}</p>
                <p className={rpg.listInfo}>Date: {el.updatedAt.slice(0, 10)}</p>
                <div className={rpg.updateDeleteButtonContainer}>
                  <button
                    className={rpg.updateButton}
                    onClick={() => handleUpdateClick(el.id)}
                    >
                      Update
                  </button>
                  <button
                    className={rpg.deleteButton}
                    onClick={() => handleDeleteClick(el.id)}
                    >
                      Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default ReviewPage;