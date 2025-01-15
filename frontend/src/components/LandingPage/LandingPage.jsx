import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom';
import { getAllServicesThunk } from "../../store/service";
import { getAllReviewsThunk } from "../../store/review";
import lpg from './LandingPage.module.css';

function LandingPage() {
  const [loading, setLoading] = useState(true);
  const review = useSelector((state) => state.review.allReviews);
  const service = useSelector((state) => state.service.allServices);
  const user = useSelector((state) => state.session.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try{
        await dispatch(getAllServicesThunk());
        await dispatch(getAllReviewsThunk());
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [dispatch])

  const manageReview = () => {
    if (user) {
      navigate('/reviewPage');
    } else {
      alert("Please log in to proceed to the Review Page.")
    }
  };

  if (loading) {
    return <p>Loading Data ... </p>
  }

  return (
    <>
    <div className={lpg.mainContainer}>

      <div className={lpg.whoWeAreContainer}>
        <h2 className={lpg.whoWeAreTitle}>We are here for You</h2>
        <p className={lpg.whoWeAreDesc}>
          At Grace Clinic, we are committed to providing exceptional healthcare to our
          patients in a warm, welcoming environment. Our dedicated team of skilled healthcare
          professionals works together to offer comprehensive medical care tailored to each
          individual&apos;s needs.
        </p>
        <p className={lpg.whoWeAreDesc}>
          We understand that choosing a healthcare provider is an important decision, and we strive
          to create a compassionate space where you can feel comfortable, valued, and confident in
          the care you receive. From routine checkups to specialized treatments, we are here to 
          support your health and well-being at every stage of life.
        </p>
        <p className={lpg.whoWeAreDesc}>
          With a focus on patient-centered care, we use the latest medical technology and 
          evidence-based practices to deliver high-quality services. Our team is passionate about educating
          patients, building trust, and empowering you to make informed decisions about your health.
        </p>
        <p className={lpg.whoWeAreDesc}>
          Whether you&apos;re visiting us for the first time or are a long-time patient, we are honored to
          be a part of your healthcare journey and look forward to providing you with the 
          exceptional care you deserve.
        </p>
        {/* <button className={lpg.whoWeAreButton}>More Information</button> */}
      </div>

      <div className={lpg.imageContainer}>
        <img className={lpg.imageWithKid} src='/docWithKid.jpg' />
      </div>

      <div className={lpg.servicesContainer}>
        <h2 className={lpg.servicesTitle}>List of Services</h2>
        {service?.Services?.map((el) => (
          <div key={el.id} className={lpg.serviceDetails}>
            <p>{el.service}</p>
          </div>
        ))}
      </div>

      <div className={lpg.insuranceContainer}>
        <h2 className={lpg.insuranceTitle}>Acceptable Insurances</h2>
        <h3 className={lpg.insuranceH3Title}>more to come</h3>
        <div className={lpg.listOfInsurance}>
          <img className={lpg.insLogo} src='/Aetna.png' />
          <img className={lpg.insLogo} src='/Anthem.png' />
          <img className={lpg.insLogo} src='/Blue.png' />
          <img className={lpg.insLogo} src='/Cigna.png' />
          <img className={lpg.insLogo} src='/Humana.png' />
          <img className={lpg.insLogo} src='/UHC.png' />
        </div>
      </div>
      
      <div className={lpg.reviewsContainer}>
        <h2 className={lpg.reviewsTitle}>Top 5 Reviews</h2>
        {review?.Reviews?.slice(0, 5).map((el) => (
          <div key={el.id} className={lpg.reviewDetails}>
            <p>Patient: {el.User.firstName}</p>
            <p>Review: {el.review}</p>
            <p>Stars: {el.stars}</p>
          </div>
        ))}
        <button 
          className={lpg.reviewButton}
          onClick={manageReview}
          >
            Go to Review Page
        </button>
      </div>

    </div>
    </>
  )
}

export default LandingPage;