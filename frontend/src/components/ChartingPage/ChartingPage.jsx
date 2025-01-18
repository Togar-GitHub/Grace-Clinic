import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getPatientChartsThunk, resetCharts, getChartByIdThunk, updateChartThunk } from '../../store/chart';
import { getAllCptThunk } from '../../store/cpt';
import { getAllServicesThunk } from '../../store/service';
import cpg from './ChartingPage.module.css';

const ChartingPage = () => {
  const user = useSelector((state) => state.session.user);
  const allCharts = useSelector((state) => state.chart.allCharts.charts);
  const chart = useSelector((state) => state.chart.chart.Chart);
  const allServices = useSelector((state) => state.service.allServices.Services);
  const allCpt = useSelector((state) => state.cpt.allCpt.CPT);
  const [inputFirstName, setInputFirstName] = useState('');
  const [inputLastName, setInputLastName] = useState('');
  const [inputDOB, setInputDOB] = useState('');
  const [chartId, setChartId] = useState('');
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
  const [updateRecord, setUpdateRecord] = useState(false);
  const [noChart, setNoChart] = useState('');
  const [showIframe, setShowIframe] = useState(false);
  const dispatch = useDispatch();
  const toggleIframe = () => setShowIframe(!showIframe);
  
  const disabled = user.id !== doctorId

  useEffect(() => {
    setNoChart('');
    setErrors({});
    setLoading(false);
    dispatch(resetCharts());
  }, [dispatch, chart]);

  useEffect(() => {
    if (!allCharts || allCharts.length <= 0) {
      setNoChart('Please enter a Patient Info, or there is no Record for the requested Patient')
    } else {
      setNoChart('');
    }
  }, [allCharts, noChart]);

  const getPatientChart = async (e) => {
    e.preventDefault();
    setNoChart('');
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
      console.log('second resetting');
      await dispatch(resetCharts())

      const patientCharts = await dispatch(getPatientChartsThunk({
        firstName: inputFirstName,
        lastName: inputLastName,
        dateOfBirth: `${inputDOB}T00:00:00Z`
      }))

      setInputFirstName('');
      setInputLastName('');
      setInputDOB('');
      
      if (!patientCharts || patientCharts.length <= 0) {
        setNoChart('Please enter a Patient Info, or there is no Record for the requested Patient')
      } else {
        setNoChart('')
      }

    } catch (error) {
      console.error("Error getting patient's charts", error);
      setErrors({
        submit: "There was an error getting patient's charts. Please try again."
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

  const handleUpdateClick = async (chartId) => {
    setLoading(true);
    setUpdateRecord(true);

    await dispatch(getAllCptThunk());
    await dispatch(getAllServicesThunk());
    const updateChart = await dispatch(getChartByIdThunk(chartId));
    
    setChartId(updateChart.Chart.id);
    setPatientId(updateChart.Chart.patientId);
    setPatientFirstName(updateChart.Chart.patient.firstName);
    setPatientLastName(updateChart.Chart.patient.lastName);
    setPatientDateOfBirth(updateChart.Chart.patient.dateOfBirth)
    setPatientGender(updateChart.Chart.patient.gender);
    setDoctorId(updateChart.Chart.doctorId);
    setDoctorFirstName(updateChart.Chart.doctor.firstName);
    setDoctorLastName(updateChart.Chart.doctor.lastName);
    setAppointmentId(updateChart.Chart.appointmentId);
    setAppointmentDateTime(updateChart.Chart.Appointment.dateTime);
    setComplaint(updateChart.Chart.complaint);
    setMeetingDate(updateChart.Chart.meetingDate);
    setDiagnosesICD10(updateChart.Chart.diagnosesICD10);
    setDiagnosesDesc(updateChart.Chart.diagnosesDesc);
    setCPTId(updateChart.Chart.CPTId);
    setTitle(updateChart.Chart.title);
    setDoctorNote(updateChart.Chart.doctorNote);
    setServices(updateChart.Chart.services);
    setPrescription(updateChart.Chart.prescription);
    setInsurance(updateChart.Chart.insurance);
    setCost(updateChart.Chart.cost);
    setNextAppointment(updateChart.Chart.nextAppointment);

    setLoading(false);
    setErrors({});
    window.scrollTo(0, 0);
  }

  const handleUpdate = async (chartId) => {
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
        validationErrors.title = 'Please enter the Note'
      }

      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }
      setErrors({});

      await dispatch(updateChartThunk(chartId, {
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

      console.log('ready to dispatch after update');
      const patientCharts = await dispatch(getPatientChartsThunk({
        firstName: patientFirstName,
        lastName: patientLastName,
        dateOfBirth: patientDateOfBirth
      }))
      console.log('patient Charts 2 > ', patientCharts)
      if (!patientCharts || patientCharts.length <= 0) {
        setNoChart('Please enter a Patient Info, or there is no Record for the requested Patient')
      } else {
        setNoChart('')
      }
      setUpdateRecord(false);

      setChartId('');
      setPatientId('');
      setPatientFirstName('');
      setPatientLastName('');
      setPatientDateOfBirth('')
      setPatientGender('');
      setDoctorId('');
      setDoctorFirstName('');
      setDoctorLastName('');
      setAppointmentId('');
      setAppointmentDateTime('');
      setComplaint('');
      setMeetingDate('');
      setDiagnosesICD10('');
      setDiagnosesDesc('');
      setCPTId('');
      setTitle('');
      setDoctorNote('');
      setServices([]);
      setPrescription('');
      setInsurance('');
      setCost('');
      setNextAppointment('');

      setLoading(false);
      window.scrollTo(0, 0);
    } catch (error) {
      console.error('Error updating the Chart:', error);
      setErrors({
        general: 'An error occurred while updating the Chart.'
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

  if (loading) {
    <p className={cpg.loading}>Loading...</p>
  }

  return (
    <div className={cpg.mainContainer}>
      <h1 className={cpg.mainTitle}>The Charting Page</h1>

      {updateRecord ? (
        <div className={cpg.updateContainer}>
          <h2 className={cpg.updateTitle}>Review and Update the Chart</h2>

          <form className={cpg.patientInfoInputContainer}>
            <div className={cpg.topInfoInputContainer}>
              <div className={cpg.chartLineInputOne}>
                <p className={cpg.listInfo}>Name: {patientFirstName} {patientLastName}</p>
                <p className={cpg.listInfo}>DOB: {patientDateOfBirth.slice(0, 10)} (Age: {getAge(patientDateOfBirth)})</p>
                <p className={cpg.listInfo}>Gender: {patientGender}</p>
                <p className={cpg.listInfo}>Doctor: {doctorFirstName} {doctorLastName}</p>
              </div>
              <div className={cpg.chartLineInputTwo}>
                <p className={cpg.listInfo}>Appointment Date & Time: {appointmentDateTime.slice(0, 10)} & {appointmentDateTime.slice(11, 16)}</p>
                <p className={cpg.listInfo}>Complaint: {complaint}</p>
                <p className={cpg.listInfo}>Meeting Date: {meetingDate.slice(0, 10)}</p>
                <p className={cpg.listInfo}>Total Cost: ${cost}</p>
              </div>
            </div>

            <div className={cpg.inputChart}>
              <div className={cpg.icd10Container}>
                <label className={cpg.label}>Enter diagnoses ICD10 Code</label>
                <input
                  className={cpg.inputList}
                  type="text"
                  value={diagnosesICD10}
                  onChange={(e) => setDiagnosesICD10(e.target.value)}
                  placeholder='Enter diagnoses ICD10 Codes'
                  required
                  disabled={disabled}
                />
                {errors.diagnosesICD10 && <p className={cpg.errors}>{errors.diagnosesICD10}</p>} 

                {/* Button to open ICD-10 data in a new window */}
                <button
                  type="button"
                  className={cpg.openICDButton}
                  onClick={toggleIframe}
                  disabled={disabled}
                >
                  Open / Close ICD-10 Data
                </button> 

                {showIframe && (
                  <div className={cpg.icdIframeContainer}>
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

              <label className={cpg.label}>Enter diagnoses ICD10 Description</label>
              <input
                className={cpg.inputList}
                type="text"
                value={diagnosesDesc}
                onChange={(e) => setDiagnosesDesc(e.target.value)}
                placeholder='Enter diagnoses description (based on first ICD10)'
                required
                disabled={disabled}
              />
              {errors.diagnosesDesc && <p className={cpg.errors}>{errors.diagnosesDesc}</p>} 

              <label className={cpg.label}>Enter the Title</label>
              <input
                className={cpg.inputList}
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder='Enter Title to the Doctor Note'
                required
                disabled={disabled}
              />
              {errors.title && <p className={cpg.errors}>{errors.title}</p>} 

              <label className={cpg.label}>Enter Doctor Note</label>
              <input
                className={cpg.inputList}
                type="text"
                value={doctorNote}
                onChange={(e) => setDoctorNote(e.target.value)}
                placeholder='Enter the Doctor Note'
                required
                disabled={disabled}
              />
              {errors.doctorNote && <p className={cpg.errors}>{errors.doctorNote}</p>}

              <label className={cpg.label}>Enter Prescription</label>
              <input
                className={cpg.inputList}
                type="text"
                value={prescription}
                onChange={(e) => setPrescription(e.target.value)}
                placeholder='Enter the Prescription'
                disabled={disabled}
              />
              {errors.prescription && <p className={cpg.errors}>{errors.prescription}</p>}

              <div className={cpg.cptOptions}>
                <p>Current CPT, please update if needed</p>
                <div className={cpg.selectContainer}>
                  <select
                    // multiple
                    value={CPTId}  // This stores the selected CPT IDs
                    onChange={(e) => setCPTId(Array.from(e.target.selectedOptions, option => option.value))}
                    className={cpg.scrollableSelect}
                    disabled={disabled}
                  >
                    {allCpt?.map((el) => (
                      <option key={el.id} value={el.id}>
                        {el.CPTCode}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className={cpg.servicesOptions}>
                <p>Current Services: Please Update if needed</p>
                <div className={cpg.checkboxList}>
                  {allServices?.map((service) => (
                    <label key={service.id}>
                      <input
                        type="checkbox"
                        id={`service-${service.id}`}
                        name="service"
                        value={service.id}
                        checked={services.includes(service.id)}
                        onChange={handleServiceChange}
                        disabled={disabled}
                      />
                      <span></span>
                      {service.service}
                    </label>
                  ))}
                </div>
              </div>

              <label className={cpg.label}>Enter Insurance</label>
              <input
                className={cpg.inputList}
                type="text"
                value={insurance}
                onChange={(e) => setInsurance(e.target.value)}
                placeholder='Enter Insurance'
              />
              {errors.insurance && <p className={cpg.errors}>{errors.insurance}</p>} 

              <label className={cpg.label}>Enter Next Appointment</label>
              <input
                className={cpg.inputList}
                type="date"
                value={nextAppointment.slice(0 ,10)}
                onChange={(e) => setNextAppointment(e.target.value)}
                placeholder='Enter next Appointment Date'
              />
              {errors.nextAppointment && <p className={cpg.errors}>{errors.nextAppointment}</p>} 
            </div>

            <div className={cpg.updateButtonContainer}>
              <button 
                className={cpg.updateButton}
                onClick={() => handleUpdate(chartId)}
                >
                  Confirm Update
              </button>
            </div>

          </form>
        </div>
      ) : (
        <>
          <div className={cpg.patientInfoContainer}>
            <h2 className={cpg.patientInfoTitle}>Enter Patient Info to get Charts</h2>
            
            <form onSubmit={getPatientChart} className={cpg.patientInfoList}>
              <input
                className={cpg.enterFirstName}
                type="text"
                value={inputFirstName}
                onChange={(e) => setInputFirstName(e.target.value)}
                placeholder='Enter Patient First Name'
                required
              />
              {errors.inputFirstName && <p className={cpg.errors}>{errors.inputFirstName}</p>} 

              <input
                className={cpg.enterLastName}
                type="text"
                value={inputLastName}
                onChange={(e) => setInputLastName(e.target.value)}
                placeholder='Enter Patient Last Name'
                required
              />
              {errors.inputLastName && <p className={cpg.errors}>{errors.inputLastName}</p>} 

              <input
                className={cpg.enterDOB}
                type="date"
                value={inputDOB}
                onChange={(e) => setInputDOB(e.target.value)}
                placeholder='Enter Patient Date of Birth'
                required
              />
              {errors.inputDOB && <p className={cpg.errors}>{errors.inputDOB}</p>} 

              <div className={cpg.getChartButtonContainer}>
                <button className={cpg.getChartButton} type="submit">
                  Get Patient Charts
                </button>
              </div>
            </form>
          </div>

          <div className={cpg.noChart}>
            {noChart && (
              <h2 className={cpg.noChartMsg}>{noChart}</h2>
            )}
          </div>

          <div className={cpg.ListContainer}>
            {allCharts && allCharts.length > 0 && (
              <h2 className={cpg.chartListTitle}>The Chart List</h2>
            )}
            {allCharts && allCharts.length > 0 && (
              allCharts.map((el) => (
                <div key={el.id} className={cpg.eachChart}>
                  <div className={cpg.chartLineOne}>
                    <p className={cpg.listInfo}>Name: {el.patient.firstName} {el.patient.lastName}</p>
                    <p className={cpg.listInfo}>DOB: {el.patient.dateOfBirth.slice(0, 10)} (Age: {getAge(el.patient.dateOfBirth)})</p>
                    <p className={cpg.listInfo}>Gender: {el.patient.gender}</p>
                    <p className={cpg.listInfo}>Doctor: {el.doctor.firstName} {el.doctor.lastName}</p>
                  </div>
                  <div className={cpg.chartLineTwo}>
                    <p className={cpg.listInfo}>Appointment Date & Time: {el.Appointment.dateTime.slice(0, 10)} & {el.Appointment.dateTime.slice(11, 16)}</p>
                    <p className={cpg.listInfo}>Complaint: {el.complaint}</p>
                  </div>
                  <div className={cpg.chartLineThree}>
                    <p className={cpg.listInfo}>Diagnoses: {el.diagnosesICD10} Desc: {el.diagnosesDesc}</p>
                    <p className={cpg.listInfo}>Prescription: {el.prescription}</p>
                  </div>
                  <div className={cpg.chartLineFour}>
                    <p className={cpg.listInfo}>Doctor Note Title: {el.title}</p>
                    <p className={cpg.listInfo}>Doctor Note Detail: {el.doctorNote}</p>
                  </div>
                  <div className={cpg.chartLineFive}>
                    <p className={cpg.listInfo}>
                      Services:{" "} 
                      {el.services && el.services.length > 0
                        ? el.services.map((service, index) => (
                            <span key={service.id}>
                              {service.service}
                              {index < el.services.length - 1 && ", "}
                            </span>
                          ))
                        : "No Service Required"}
                    </p>
                    <p className={cpg.listInfo}>CPTCode {el.CPT.CPTCode} Desc: {el.CPT.description}</p>
                  </div>
                  <div className={cpg.chartLineSix}>
                    <p className={cpg.listInfo}>Insurance: {el.insurance}</p>
                    <p className={cpg.listInfo}>Total Cost: ${el.cost}</p>
                    <p className={cpg.listInfo}>Meeting Date: {el.meetingDate.slice(0, 10)}</p>
                    <p className={cpg.listInfo}>Next Appointment Date: {el.nextAppointment.slice(0, 10)}</p>
                  </div>
                  <div className={cpg.updateButtonContainer}>
                    <button className={cpg.updateButton} onClick={() => handleUpdateClick(el.id)}>
                      Update Chart
                    </button>
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

export default ChartingPage;