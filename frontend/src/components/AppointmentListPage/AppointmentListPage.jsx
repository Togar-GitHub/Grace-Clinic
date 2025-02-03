import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getAppointmentsAdminThunk, updateAppointmentAdminThunk, deleteAppointmentAdminThunk } from "../../store/appointment";
import AppointmentListDeleteModal from "../AppointmentListDeleteModal/AppointmentListDeleteModal";
import alp from './AppointmentListPage.module.css';

const AppointmentListPage = () => {
  const allAppointments = useSelector((state) => state.appointment.allAppointments.Appointment);
  const [loading, setLoading] = useState(true);
  const [appointmentId, setAppointmentId] = useState('');
  const [patientId, setPatientId] = useState('');
  const [doctorId, setDoctorId] = useState('');
  const [appointmentDate, setAppointmentDate] = useState('');
  const [appointmentTime, setAppointmentTime] = useState('');
  const [complaint, setComplaint] = useState('');
  const [insurance, setInsurance] = useState('');
  const [errors, setErrors] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [appointmentToDelete, setAppointmentToDelete] = useState(null);
  const [updateRecord, setUpdateRecord] = useState(false);
  const [noAppointment, setNoAppointment] = useState('');
  const dispatch = useDispatch();

  const todayPlusOne = new Date();
  todayPlusOne.setDate(todayPlusOne.getDate() + 1);
  const minDate = todayPlusOne.toISOString().split('T')[0];

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        setNoAppointment('');
        await dispatch(getAppointmentsAdminThunk());
      } catch (error) {
        console.error('Error fetching Appointments')
      } finally {
        setLoading(false);
      }
    }
    fetchAppointments();
  }, [dispatch])

  useEffect(() => {
    if (!allAppointments || allAppointments.length <= 0) {
      setNoAppointment('There is no Appointment Record');
    } else {
      setNoAppointment('');
    }
  }, [allAppointments])

  return (
    <div className={alp.mainContainer}>
      <h1 className={alp.mainTitle}>Appointment List Page</h1>



    </div>
  )
}

export default AppointmentListPage;