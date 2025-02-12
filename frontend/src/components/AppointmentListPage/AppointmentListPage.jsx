import { useEffect, useState, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getAppointmentsAdminThunk } from "../../store/appointment";
// import { getAppointmentsAdminThunk, updateAppointmentAdminThunk, deleteAppointmentAdminThunk } from "../../store/appointment";
// import AppointmentListDeleteModal from "../AppointmentListDeleteModal/AppointmentListDeleteModal";
import alp from './AppointmentListPage.module.css';

const AppointmentListPage = () => {
  const allAppointments = useSelector((state) => state.appointment.allAppointments.Appointment);
  const [loading, setLoading] = useState(true);
  // const [appointmentId, setAppointmentId] = useState('');
  // const [patientId, setPatientId] = useState('');
  // const [doctorId, setDoctorId] = useState('');
  // const [appointmentDate, setAppointmentDate] = useState('');
  // const [appointmentTime, setAppointmentTime] = useState('');
  // const [complaint, setComplaint] = useState('');
  // const [insurance, setInsurance] = useState('');
  const [getDate, setGetDate] = useState('');
  // const [errors, setErrors] = useState('');
  // const [showModal, setShowModal] = useState(false);
  // const [appointmentToDelete, setAppointmentToDelete] = useState(null);
  // const [updateRecord, setUpdateRecord] = useState(false);
  const [noAppointment, setNoAppointment] = useState('');
  const dispatch = useDispatch();

  const today = useMemo(() => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    const formattedDate = date.toISOString().split('T')[0];
    return formattedDate;
  }, [])

  // const todayPlusOne = new Date();
  // todayPlusOne.setDate(todayPlusOne.getDate() + 1);
  // const minDate = todayPlusOne.toISOString().split('T')[0];

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        setNoAppointment('');
        if (!getDate) {
          setGetDate(today);
        }
        if (getDate) {
          await dispatch(getAppointmentsAdminThunk(getDate));
        }
      } catch (error) {
        console.error('Error fetching Appointments', error)
      } finally {
        setLoading(false);
      }
    }

    fetchAppointments();
  }, [dispatch, getDate, today])

  useEffect(() => {
    if (!allAppointments || allAppointments.length <= 0) {
      setNoAppointment('There is no Appointment Record');
    } else {
      setNoAppointment('');
    }
  }, [allAppointments]);

  if (loading) {
    <p className={alp.loading}>Loading...</p>
  }

  return (
    <div className={alp.mainContainer}>
      <h1 className={alp.mainTitle}>Appointment List Page</h1>

      <div className={alp.chooseDateContainer}>
        <input
          className={alp.chooseDate}
          type="date"
          min={today}
          value={getDate}
          onChange={(e) => setGetDate(e.target.value)}
        />
      </div>

      <div className={alp.noAppointment}>
        {noAppointment && (
          <h2 className={alp.noAppointmentMessage}>{noAppointment}</h2>
        )}
      </div>

      <div className={alp.currentAppointmentContainer}>
        {allAppointments && allAppointments.length > 0 && (
          <>
            <h2 className={alp.currentAppointmentTitle}>The Appointment List</h2>

            {allAppointments.map((el) => (
              <div key={el.id}>
                <div className={alp.currentAppointmentList}>
                  <div className={alp.firstLine}>
                    <p className={alp.listInfo}>Patient: {el.patient.firstName} {el.patient.lastName}</p>
                    <p className={alp.listInfo}>Date of Birth: {el.patient.dateOfBirth.slice(0, 10)}</p>
                    <p className={alp.listInfo}>Gender: {el.patient.gender}</p>
                    <p className={alp.listInfo}>Doctor: {el.doctor.firstName} {el.doctor.lastName}</p>
                  </div>
                  <div className={alp.secondLine}>
                    <p className={alp.listInfo}>Date & Time Appointment: {el.dateTime.slice(0, 10)} & {el.dateTime.slice(11, 16)}</p>
                    <p className={`${alp.listInfo} ${alp.listInfoComplaint}`}>Complaint: {el.complaint}</p>
                    <p className={alp.listInfo}>Insurance: {el.insurance}</p>
                  </div>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  )
}

export default AppointmentListPage;