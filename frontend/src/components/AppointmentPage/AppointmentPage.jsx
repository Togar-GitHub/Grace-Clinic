import { useEffect, useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getDoctorsThunk } from '../../store/user';
import { getAppointmentCurrentThunk, getAppointmentByIdThunk, getSpecAppointmentThunk } from '../../store/appointment';
import { createAppointmentCurrentThunk, updateAppointmentCurrentThunk, deleteAppointmentCurrentThunk } from '../../store/appointment';
import AppointmentDeleteModal from '../AppointmentDeleteModal/AppointmentDeleteModal';
import apg from './AppointmentPage.module.css';

const AppointmentPage = () => {
  const doctors = useSelector((state) => state.user.doctors.user);
  const appointmentList = useSelector((state) => state.appointment.allAppointments.Appointment);
  const [loading, setLoading] = useState(true);
  const [appointId, setAppointId] = useState('');
  const [doctor, setDoctor] = useState('');
  const [appointmentDate, setAppointmentDate] = useState('');
  const [appointmentTime, setAppointmentTime] = useState('');
  const [complaint, setComplaint] = useState('');
  const [insurance, setInsurance] = useState('');
  const [errors, setErrors] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [appointmentToDelete, setAppointmentToDelete] = useState(null);
  const [updateRecord, setUpdateRecord] = useState(false);
  const [noAppointment, setNoAppointment] = useState('');
  const dispatch = useDispatch();

  const today = useMemo(() => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    return date;
  }, [])

  const todayPlusOne = new Date();
  todayPlusOne.setDate(todayPlusOne.getDate() + 1);

  // Format date to "YYYY-MM-DD"
  const minDate = todayPlusOne.toISOString().split('T')[0];

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        setNoAppointment('');
        await dispatch(getDoctorsThunk())
        await dispatch(getAppointmentCurrentThunk());
      } catch (error) {
        console.error('Error fetching Appointment')
      } finally {
        setLoading(false);
      }
    }
    fetchAppointments();
  }, [dispatch]);

  useEffect(() => {
    if (!appointmentList || appointmentList.length <= 0) {
      setNoAppointment('There is no Appointment Record');
    } else {
      setNoAppointment('')
    }
  }, [appointmentList]);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Initialize an empty error object
    const validationErrors = {};
  
    // Validate inputs
    if (!doctor) {
      validationErrors.doctor = 'Please select a doctor.';
    }
    if (!appointmentDate) {
      validationErrors.appointmentDate = 'Please select an appointment date.';
    }
    if (!appointmentTime) {
      validationErrors.appointmentTime = 'Please select a time.';
    }
    if (!complaint) {
      validationErrors.complaint = 'Please provide a complaint.';
    }
    
    const specAppointment = await dispatch(getSpecAppointmentThunk({
      doctorId: Number(doctor),
      dateTime: `${appointmentDate}T${appointmentTime}:00Z`,
    }))
    if (Object.keys(specAppointment).length > 0) {
      validationErrors.doctor = 'The doctor already has appointment.';
      validationErrors.appointmentDate = 'Please choose another doctor, date or time.'
    }
  
    // If there are validation errors, set the errors state and stop form submission
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
  
    // Clear previous errors
    setErrors({});
  
    try {
      // Dispatch the action to create a new appointment
      await dispatch(createAppointmentCurrentThunk({
        doctorId: Number(doctor),
        dateTime: `${appointmentDate}T${appointmentTime}:00Z`,
        complaint,
        insurance
      }));
  
      // Optionally, you can reset form values if submission is successful
      setDoctor('');
      setAppointmentDate('');
      setAppointmentTime('');
      setComplaint('');
      setInsurance('');
      await dispatch(getAppointmentCurrentThunk());
      setNoAppointment('');
    } catch (error) {
      // Handle any errors that occur during the dispatch
      console.error('Error creating appointment:', error);
      setErrors({
        submit: 'There was an error creating the appointment. Please try again.',
      });
    }
  };

  const handleUpdateClick = async (appointmentId) => {
    setLoading(true);
    setUpdateRecord(true);
    const updateAppoint = await dispatch(getAppointmentByIdThunk(appointmentId));

    setAppointId(updateAppoint.Appointment.id)
    setDoctor(updateAppoint.Appointment.doctorId);
    setAppointmentDate(updateAppoint.Appointment.dateTime.slice(0, 10));
    setAppointmentTime(updateAppoint.Appointment.dateTime.slice(11, 16));
    setComplaint(updateAppoint.Appointment.complaint);
    setInsurance(updateAppoint.Appointment.insurance);
    setLoading(false);
    setErrors({});
  }

  const handleUpdate = async (appointId) => {
    try {
      const validationErrors = {};
  
      // Validate inputs
      if (!doctor) {
        validationErrors.doctor = 'Please select a doctor.';
      }
      if (!appointmentDate) {
        validationErrors.appointmentDate = 'Please select an appointment date.';
      }
      if (!appointmentTime) {
        validationErrors.appointmentTime = 'Please select a time.';
      }
      if (!complaint) {
        validationErrors.complaint = 'Please provide a complaint.';
      }
  
      // If validation errors exist, return early with errors
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }
  
      // Proceed with checking for existing appointments
      const specAppointment = await dispatch(getSpecAppointmentThunk({
        doctorId: Number(doctor),
        dateTime: `${appointmentDate}T${appointmentTime}:00Z`
      }));
  
      // Check if an appointment exists for the doctor at the specified time
      if (Object.keys(specAppointment).length > 0) {
        validationErrors.doctor = 'The doctor already has an appointment.';
        validationErrors.appointmentDate = 'Please choose another doctor, date, or time.';
        setErrors(validationErrors);
        return;  // Stop execution if appointment already exists
      }
  
      // Clear any previous errors
      setErrors({});
  
      // Proceed with updating the appointment if no validation errors or conflicts
      await dispatch(updateAppointmentCurrentThunk(appointId, {
        doctorId: Number(doctor),
        dateTime: `${appointmentDate}T${appointmentTime}:00Z`,
        complaint,
        insurance
      }));
  
      // Reset form and state after successful update
      setUpdateRecord(false);
      setDoctor('');
      setAppointmentDate('');
      setAppointmentTime('');
      setComplaint('');
      setInsurance('');
      setLoading(true);
      setNoAppointment('');
  
      // Fetch updated appointment data
      await dispatch(getAppointmentCurrentThunk());
      
      setLoading(false); // Set loading state to false once data is fetched
  
    } catch (error) {
      // Handle any errors that occur during the process
      console.error('Error updating appointment:', error);
      setErrors({
        general: 'An error occurred while updating the appointment.'
      });
      setLoading(false); // Ensure loading is false in case of error
    }
  };
  
  const handleDeleteClick = (appointmentId) => {
    setAppointmentToDelete(appointmentId);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setAppointmentToDelete(null);
  }

  const confirmDeletion = async () => {
    if (appointmentToDelete) {
      await deleteAppointment(appointmentToDelete);
      closeModal();
    }
  }

  const deleteAppointment = async (appointmentId) => {
    await dispatch(deleteAppointmentCurrentThunk(appointmentId));
    await dispatch(getAppointmentCurrentThunk());
    setErrors({});
  }

  const handleDoctorChange = (e) => {
    setDoctor(Number(e.target.value));
  }
  
  if (loading) {
    <p className={apg.loading}>Loading...</p>
  }

  return (
    <div className={apg.mainContainer}>
      <h1 className={apg.appointmentTitle}>Appointment Page</h1>

      <div className={apg.createAppointmentContainer}>
        {updateRecord ? (
          <h2 className={apg.createAppointmentTitle}>Update Appointment</h2>
        ) : (
          <h2 className={apg.createAppointmentTitle}>Create New Appointment</h2>
        )}
        
        <div className={apg.chooseDoctor}>
          {doctors?.map((doc) => (
            <label key={doc.id}>
              <input
                className={apg.doctorRadioButton}
                type='radio'
                id={`doc-${doc.id}`}
                name='doctor'
                value={doc.id}
                checked={doctor === doc.id}
                onChange={handleDoctorChange}
                required
              />
              {doc.firstName} {doc.lastName}
            </label>
          ))}
          {errors.doctor && <p className={apg.errors}>{errors.doctor}</p>}
        </div>

        <div className={apg.chooseDateTime}>
          <input
            className={apg.chooseDate}
            type="date"
            min={minDate}
            value={appointmentDate}
            onChange={(e) => setAppointmentDate(e.target.value)}
            required
          />
          {errors.appointmentDate && <p className={apg.errors}>{errors.appointmentDate}</p>} 
          <select className={apg.chooseTime}
            value={appointmentTime}
            onChange={(e) => setAppointmentTime(e.target.value)}
            required
          >
            <option value="">Select a time</option>
            <option value="10:00">10:00</option>
            <option value="11:00">11:00</option>
            <option value="12:00">12:00</option>
            <option value="13:00">13:00</option>
            <option value="14:00">14:00</option>
            <option value="15:00">15:00</option>
            <option value="16:00">16:00</option>
            <option value="17:00">17:00</option>
            <option value="18:00">18:00</option>
          </select>
          {errors.appointmentTime && <p className={apg.errors}>{errors.appointmentTime}</p>} 
        </div>

        <div className={apg.complaint}>
          <form className={apg.formComplaint}>
            <input
              className={apg.inputComplaint}
              type="text"
              value={complaint}
              onChange={(e) => setComplaint(e.target.value)}
              placeholder="Enter your physical or mental complaint"
              required
            />
            {errors.complaint && <p className={apg.errors}>{errors.complaint}</p>} 
            <input
              className={apg.inputInsurance}
              type="text"
              value={insurance}
              onChange={(e) => setInsurance(e.target.value)}
              placeholder="Enter your healthcare Insurance"
            />
            {errors.insurance && <p className={apg.errors}>{errors.insurance}</p>} 
          </form>
        </div>

        <div className={apg.submitContainer}>
          {updateRecord ? (
            <button className={apg.submitButton} onClick={() => handleUpdate(appointId)}>
              Update
            </button>
          ) : (
            <button className={apg.submitButton} onClick={handleSubmit}>
              Submit
            </button>
          )}

        </div>
      </div>

      {/* Modal for confirming the deletion */}
      {showModal && (
        <AppointmentDeleteModal 
          onClose={closeModal} 
          onConfirm={confirmDeletion} 
        />
      )}

      <div className={apg.noAppointment}>
        {noAppointment && (
          <h2 className={apg.noAppointmentMessage}>{noAppointment}</h2>
        )}
      </div>

      <div className={apg.currentAppointmentContainer}>
        {appointmentList && appointmentList.length > 0 && (
          <h2 className={apg.currentAppointmentTitle}>Your Appointment List</h2>
        )}
        {appointmentList && appointmentList.length > 0 && (
          appointmentList.map((el) => (
            <div key={el.id}>
              <div className={apg.currentAppointmentList}>
                <p className={apg.listInfo}>Doctor: {el.doctor.firstName} {el.doctor.lastName}</p>
                <p className={apg.listInfo}>Date & Time: {el.dateTime.slice(0, 10)} & {el.dateTime.slice(11, 16)}</p>
                <p className={apg.listInfo}>Complaint: {el.complaint}</p>
                <p className={apg.listInfo}>Insurance: {el.insurance}</p>
                {el.dateMet !== null && (
                  <p className={apg.listInfo}>Date Met: {el.dateMet.slice(0, 10)}</p>
                )}
                {el.dateMet === null && new Date(el.dateTime.slice(0, 10)) < today && (
                  <p className={apg.listInfo}>Date Met: Did not come to the Appointment</p>
                )}
                {new Date(el.dateTime.slice(0, 10)) > today && el.dateMet === null && (
                  <div className={apg.updateDeleteButtonContainer}>
                    <button 
                      className={apg.updateButton}
                      onClick={() => handleUpdateClick(el.id)}
                      >
                        Update
                    </button>
                    <button 
                      className={apg.deleteButton}
                      onClick={() => handleDeleteClick(el.id)}
                      >
                        Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
        )))}
      </div>
    </div>
  )
}

export default AppointmentPage;