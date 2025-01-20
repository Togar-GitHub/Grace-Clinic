import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { createChartThunk } from '../../store/chart';
import { getPatientAppointmentsThunk, resetAppointments, getAppointmentByIdThunk, updateAppointmentChartThunk } from '../../store/appointment';
import { getAllCptThunk } from '../../store/cpt';
import { getAllServicesThunk } from '../../store/service';
import crc from './CreateChart.module.css';

const CreateChart = () => {
  // const user = useSelector((state) => state.session.user);
  const allAppointments = useSelector((state) => state.appointment.allAppointments.Appointment);
  const appointment = useSelector((state) => state.appointment.appointment.Appointment)
  // const chart = useSelector((state) => state.chart.chart.Chart);
  const allServices = useSelector((state) => state.service.allServices.Services);
  const allCpt = useSelector((state) => state.cpt.allCpt.CPT);
  const [inputFirstName, setInputFirstName] = useState('');
  const [inputLastName, setInputLastName] = useState('');
  const [inputDOB, setInputDOB] = useState('');
  // const [chartId, setChartId] = useState('');
  const [patientId, setPatientId] = useState('');
  const [patientFirstName, setPatientFirstName] = useState('');
  const [patientLastName, setPatientLastName] = useState('');
  const [patientDateOfBirth, setPatientDateOfBirth] = useState('');
  const [patientGender, setPatientGender] = useState('');
  const [doctorId, setDoctorId] = useState('');
  const [doctorFirstName, setDoctorFirstName] = useState('');
  const [doctorLastName, setDoctorLastName] = useState('');
  const [appointmentId, setAppointmentId] = useState('');
  const [appointmentDateTime, setAppointmentDateTime] = useState('');
  const [complaint, setComplaint] = useState('');
  const [meetingDate, setMeetingDate] = useState('');
  const [diagnosesICD10, setDiagnosesICD10] = useState('');
  const [diagnosesDesc, setDiagnosesDesc] = useState('');
  const [CPTId, setCPTId] = useState('');
  const [title, setTitle] = useState('');
  const [doctorNote, setDoctorNote] = useState('');
  const [services, setServices] = useState([]);
  const [prescription, setPrescription] = useState('');
  const [insurance, setInsurance] = useState('');
  const [cost, setCost] = useState('');
  const [nextAppointment, setNextAppointment] = useState('');
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  // const [updateRecord, setUpdateRecord] = useState(false);
  const [createRecord, setCreateRecord] = useState(false);
  const [noAppointment, setNoAppointment] = useState('');
  const [showIframe, setShowIframe] = useState(false);
  const dispatch = useDispatch();
  const toggleIframe = () => setShowIframe(!showIframe);

  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    setNoAppointment('');
    setErrors({});
    setLoading(false);
    dispatch(resetAppointments());
  }, [dispatch, appointment]);

  useEffect(() => {
    if (!allAppointments || allAppointments.length <= 0) {
      setNoAppointment('Please enter a Patient Info, or there is no Appointment for the requested Patient')
    } else {
      setNoAppointment('');
    }
  }, [allAppointments, noAppointment]);

  const getPatientAppointment = async (e) => {
    e.preventDefault();
    setNoAppointment('');
    setErrors({});
    setLoading(true);

    const validationErrors = {};
    if (!inputFirstName) {
      validationErrors.inputFirstName = "Please enter Patient's First Name"
    }
    if (!inputLastName) {
      validationErrors.inputLastName = "Please enter Patient's Last Name"
    }
    if (!inputDOB) {
      validationErrors.inputDOB = "Please enter patient's Date of Birth"
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setLoading(false);
      return;
    }

    try {
      await dispatch(resetAppointments())

      const patientAppointments = await dispatch(getPatientAppointmentsThunk({
        firstName: inputFirstName,
        lastName: inputLastName,
        dateOfBirth: `${inputDOB}T00:00:00Z`
      }))

      setInputFirstName('');
      setInputLastName('');
      setInputDOB('');
      
      if (!patientAppointments || patientAppointments.length <= 0) {
        setNoAppointment('Please enter a Patient Info, or there is no Appointments for the requested Patient')
      } else {
        setNoAppointment('')
      }

    } catch (error) {
      console.error("Error getting patient's appointments", error);
      setErrors({
        submit: "There was an error getting patient's appointments. Please try again."
      })
    }
  }

  const getAge = (dateOfBirth) => {
    const birthDate = new Date(dateOfBirth);
    const currentDate = new Date();
    
    let age = currentDate.getFullYear() - birthDate.getFullYear();
    const monthDifference = currentDate.getMonth() - birthDate.getMonth();
  
    // If the birthday hasn't occurred yet this year, subtract one year from age
    if (monthDifference < 0 || (monthDifference === 0 && currentDate.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  const handleCreateClick = async (appointmentId) => {
    setLoading(true);
    setCreateRecord(true);
    // setUpdateRecord(false);

    await dispatch(getAllCptThunk());
    await dispatch(getAllServicesThunk());
    const infoAppointment = await dispatch(getAppointmentByIdThunk(appointmentId));

    setAppointmentId(infoAppointment.Appointment.id)
    setPatientId(infoAppointment.Appointment.patientId);
    setPatientFirstName(infoAppointment.Appointment.patient.firstName);
    setPatientLastName(infoAppointment.Appointment.patient.lastName);
    setPatientDateOfBirth(infoAppointment.Appointment.patient.dateOfBirth);
    setPatientGender(infoAppointment.Appointment.patient.gender);
    setDoctorId(infoAppointment.Appointment.doctorId);
    setDoctorFirstName(infoAppointment.Appointment.doctor.firstName);
    setDoctorLastName(infoAppointment.Appointment.doctor.lastName);
    setAppointmentDateTime(infoAppointment.Appointment.dateTime);
    setComplaint(infoAppointment.Appointment.complaint);
    setInsurance(infoAppointment.Appointment.insurance);
    setMeetingDate('');
    setDiagnosesICD10('');
    setDiagnosesDesc('');
    setCPTId('');
    setTitle('');
    setDoctorNote('');
    setServices([]);
    setPrescription('');
    setCost('');
    setNextAppointment('');

    setLoading(false);
    setErrors({});

    window.scrollTo(0, 0);
  }

  const handleCreate = async () => {
    setLoading(true);

    try {
      const validationErrors = {};
      if (!diagnosesICD10) {
        validationErrors.diagnosesICD10 = 'Please enter diagnoses ICD10 Code'
      }
      if (!diagnosesDesc) {
        validationErrors.diagnosesDesc = 'Please enter diagnoses description'
      }
      if (!CPTId) {
        validationErrors.CPTId = 'Please choose the CPT Code'
      }
      if (!title) {
        validationErrors.title = 'Please enter the Title'
      }
      if (!doctorNote) {
        validationErrors.doctorNote = 'Please enter the Note'
      }

      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }
      setErrors({});

      const newChart = await dispatch(createChartThunk({
        patientId,
        doctorId,
        appointmentId,
        complaint,
        meetingDate,
        diagnosesICD10,
        diagnosesDesc,
        CPTId,
        title,
        doctorNote,
        services,
        prescription,
        insurance,
        nextAppointment
      }))
            
      await dispatch(updateAppointmentChartThunk(newChart.Chart.appointmentId, {
        dateMet: meetingDate
      }))

      // await dispatch(getChartByIdThunk(newChart.Chart.id));

      setLoading(false);
      setCreateRecord(false);
      window.scrollTo(0, 0);
    } catch (error) {
      console.error('Error creating the Chart:', error);
      setErrors({
        general: 'An error occurred while creating the Chart.'
      });
      setLoading(false);
    }
  }

  const handleServiceChange = (e) => {
    const { value, checked } = e.target;
    const serviceId = parseInt(value, 10); // Ensure the value is treated as a number
  
    setServices((prevServices) => {
      if (checked) {
        // Add the service ID if checked
        return [...prevServices, serviceId];
      } else {
        // Remove the service ID if unchecked
        return prevServices.filter((id) => id !== serviceId);
      }
    });
  };

  
  // const handleUpdate = async (appointmentId) => {
  // }

  // const handleDelete = async (appointmentId) => {
  // }

  if (loading) {
    <p className={crc.loading}>Loading...</p>
  }

  return (
    <div className={crc.mainContainer}>
      <h1 className={crc.mainTitle}>Create Chart Page</h1>

      {createRecord ? (
        <div className={crc.updateContainer}>
          <h2 className={crc.updateTitle}>Create Chart</h2>

          <form className={crc.patientInfoInputContainer}>
            <div className={crc.topInfoInputContainer}>
              <div className={crc.chartLineInputOne}>
                <p className={crc.listInfo}>Name: {patientFirstName} {patientLastName}</p>
                <p className={crc.listInfo}>DOB: {patientDateOfBirth.slice(0, 10)} (Age: {getAge(patientDateOfBirth)})</p>
                <p className={crc.listInfo}>Gender: {patientGender}</p>
                <p className={crc.listInfo}>Doctor: {doctorFirstName} {doctorLastName}</p>
              </div>
              <div className={crc.chartLineInputTwo}>
                <p className={crc.listInfo}>Appointment Date & Time: {appointmentDateTime.slice(0, 10)} & {appointmentDateTime.slice(11, 16)}</p>
                <p className={crc.listInfo}>Complaint: {complaint}</p>
                <p></p>
                <p className={crc.listInfo}>Total Cost: ${cost}</p>
              </div>
            </div>

            <div className={crc.inputChart}>

              <label className={crc.label}>Enter Meeting Date: </label>
              <input
                className={crc.inputList}
                type="date"
                value={meetingDate.slice(0 ,10)}
                onChange={(e) => setMeetingDate(e.target.value)}
                placeholder='Enter Meeting Date'
                required
                max={today}
              />
              {errors.meetingDate && <p className={crc.errors}>{errors.meetingDate}</p>} 

              <div className={crc.icd10Container}>
                <label className={crc.label}>Enter diagnoses ICD10 Code</label>
                <input
                  className={crc.inputList}
                  type="text"
                  value={diagnosesICD10}
                  onChange={(e) => setDiagnosesICD10(e.target.value)}
                  placeholder='Enter diagnoses ICD10 Codes'
                  required
                />
                {errors.diagnosesICD10 && <p className={crc.errors}>{errors.diagnosesICD10}</p>} 

                {/* Button to open ICD-10 data in a new window */}
                <button
                  type="button"
                  className={crc.openICDButton}
                  onClick={toggleIframe}
                >
                  Open / Close ICD-10 Data
                </button> 

                {showIframe && (
                  <div className={crc.icdIframeContainer}>
                    <iframe
                      src="https://www.icd10data.com/ICD10CM/Codes"
                      width='100%'
                      height='400px'
                      title='ICD-10 Data'
                      frameBorder='0'
                    />
                  </div>
                )}
              </div>

              <label className={crc.label}>Enter diagnoses ICD10 Description</label>
              <input
                className={crc.inputList}
                type="text"
                value={diagnosesDesc}
                onChange={(e) => setDiagnosesDesc(e.target.value)}
                placeholder='Enter diagnoses description (based on first ICD10)'
                required
              />
              {errors.diagnosesDesc && <p className={crc.errors}>{errors.diagnosesDesc}</p>} 

              <label className={crc.label}>Enter the Title</label>
              <input
                className={crc.inputList}
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder='Enter Title to the Doctor Note'
                required
              />
              {errors.title && <p className={crc.errors}>{errors.title}</p>} 

              <label className={crc.label}>Enter Doctor Note</label>
              <input
                className={crc.inputList}
                type="text"
                value={doctorNote}
                onChange={(e) => setDoctorNote(e.target.value)}
                placeholder='Enter the Doctor Note'
                required
              />
              {errors.doctorNote && <p className={crc.errors}>{errors.doctorNote}</p>}

              <label className={crc.label}>Enter Prescription</label>
              <input
                className={crc.inputList}
                type="text"
                value={prescription}
                onChange={(e) => setPrescription(e.target.value)}
                placeholder='Enter the Prescription'
              />
              {errors.prescription && <p className={crc.errors}>{errors.prescription}</p>}

              <div className={crc.cptOptions}>
                <p>Please choose the CPT Code</p>
                <div className={crc.selectContainer}>
                  <select
                    value={CPTId || ''}  // This stores the selected CPT IDs
                    onChange={(e) => setCPTId(Number(e.target.value))}
                    className={crc.scrollableSelect}
                    required
                  >
                    <option value='' disabled>Select CPT Code</option>
                    {allCpt?.map((el) => (
                      <option key={el.id} value={el.id}>
                        {el.CPTCode}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className={crc.servicesOptions}>
                <p>Please choose the Services if needed</p>
                <div className={crc.checkboxList}>
                  {allServices?.map((service) => (
                    <label key={service.id}>
                      <input
                        type="checkbox"
                        id={`service-${service.id}`}
                        name="service"
                        value={service.id}
                        checked={services.includes(service.id)}
                        onChange={handleServiceChange}
                      />
                      <span></span>
                      {service.service}
                    </label>
                  ))}
                </div>
              </div>

              <label className={crc.label}>Enter Insurance</label>
              <input
                className={crc.inputList}
                type="text"
                value={insurance}
                onChange={(e) => setInsurance(e.target.value)}
                placeholder='Enter Insurance'
              />
              {errors.insurance && <p className={crc.errors}>{errors.insurance}</p>} 

              <label className={crc.label}>Enter Next Appointment</label>
              <input
                className={crc.inputList}
                type="date"
                value={nextAppointment.slice(0 ,10)}
                onChange={(e) => setNextAppointment(e.target.value || null)}
                placeholder='Enter next Appointment Date'
                min={today}
              />
              {errors.nextAppointment && <p className={crc.errors}>{errors.nextAppointment}</p>} 
            </div>

            {createRecord && (
              <div className={crc.createButtonContainer}>
                <button 
                  className={crc.createButton}
                  onClick={() => handleCreate()}
                  >
                    Create Chart
                </button>
              </div>
            )}
            {/* {updateRecord && (
            <>
              <div className={crc.updateButtonContainer}>
                <button 
                  className={crc.updateButton}
                  onClick={() => handleUpdate(chartId)}
                  >
                    Update
                </button>
              </div>
              <div className={crc.deleteButtonContainer}>
                <button 
                  className={crc.deleteButton}
                  onClick={() => handleDelete(chartId)}
                  >
                    Delete
                </button>
              </div>
            </>
            )} */}
          </form>
        </div>
      ) : (
        <>
          <div className={crc.patientInfoContainer}>
            <h2 className={crc.patientInfoTitle}>Enter Patient Info to get Appointments</h2>
            
            <form onSubmit={getPatientAppointment} className={crc.patientInfoList}>
              <input
                className={crc.enterFirstName}
                type="text"
                value={inputFirstName}
                onChange={(e) => setInputFirstName(e.target.value)}
                placeholder='Enter Patient First Name'
                required
              />
              {errors.inputFirstName && <p className={crc.errors}>{errors.inputFirstName}</p>} 

              <input
                className={crc.enterLastName}
                type="text"
                value={inputLastName}
                onChange={(e) => setInputLastName(e.target.value)}
                placeholder='Enter Patient Last Name'
                required
              />
              {errors.inputLastName && <p className={crc.errors}>{errors.inputLastName}</p>} 

              <input
                className={crc.enterDOB}
                type="date"
                value={inputDOB}
                onChange={(e) => setInputDOB(e.target.value)}
                placeholder='Enter Patient Date of Birth'
                required
              />
              {errors.inputDOB && <p className={crc.errors}>{errors.inputDOB}</p>} 

              <div className={crc.getAppointmentButtonContainer}>
                <button className={crc.getAppointmentButton} type="submit">
                  Get Patient Appointments
                </button>
              </div>
            </form>
          </div>

          <div className={crc.noAppointment}>
            {noAppointment && (
              <h2 className={crc.noAppointmentMsg}>{noAppointment}</h2>
            )}
          </div>

          <div className={crc.ListContainer}>
            {allAppointments && allAppointments.length > 0 && (
              <h2 className={crc.chartListTitle}>The Appointment List</h2>
            )}
            {allAppointments && allAppointments.length > 0 && (
              allAppointments.map((el) => (
                <div key={el.id} className={crc.eachChart}>
                  <div className={crc.chartLineOne}>
                    <p className={crc.listInfo}>Name: {el.patient.firstName} {el.patient.lastName}</p>
                    <p className={crc.listInfo}>DOB: {el.patient.dateOfBirth.slice(0, 10)} (Age: {getAge(el.patient.dateOfBirth)})</p>
                    <p className={crc.listInfo}>Gender: {el.patient.gender}</p>
                  </div>
                  <div className={crc.chartLineTwo}>
                    <p className={crc.listInfo}>Doctor: {el.doctor.firstName} {el.doctor.lastName}</p>
                    <p className={crc.listInfo}>Appointment Date & Time: {el.dateTime.slice(0, 10)} & {el.dateTime.slice(11, 16)}</p>
                    <p className={crc.listInfo}>Complaint: {el.complaint}</p>
                  </div>
                   <div className={crc.chartLineThree}>
                    <p className={crc.listInfo}>Insurance: {el.insurance}</p>
                    <div className={crc.updateButtonContainer}>
                      <button className={crc.updateButton} onClick={() => handleCreateClick(el.id)}>
                        Create Chart
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  )
}

export default CreateChart;