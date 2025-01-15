import { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useModal } from '../../context/Modal';
import { getUserByIdThunk } from '../../store/user';
import * as sessionActions from '../../store/session';
import sfm from './SignupFormModal.module.css';

function SignupFormModal() {
  const dispatch = useDispatch();
  const customProp = useSelector((state) => state.customProp.customProp);
  const [loading, setLoading] = useState('');
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [gender, setGender] = useState('');
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zip, setZip] = useState('');
  const [phone, setPhone] = useState('');
  const [allergy, setAllergy] = useState('');
  const [staff, setStaff] = useState(false);
  const [position, setPosition] = useState('');
  const [managerCredential, setManagerCredential] = useState('');
  const [managerPassword, setManagerPassword] = useState('');
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();
  const modalRef = useRef();
  
  useEffect(() => {
    const handleClickOutside = (e) => {
      const navBar = document.querySelector('.navbar');
      if (modalRef.current && !modalRef.current.contains(e.target) && navBar.contains(e.target)) {
        closeModal();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [closeModal]);

  useEffect(() => {
    if (customProp) {
      const getUserData = async () => {
        setLoading(true);
        try {
          const userData = await dispatch(getUserByIdThunk(customProp.id));

          setFirstName(userData.user.firstName);
          setLastName(userData.user.lastName);
          setDateOfBirth(userData.user.dateOfBirth.slice(0, 10));
          setGender(userData.user.gender);
          setUsername(userData.user.username);
          setEmail(userData.user.email);
          setAddress(userData.user.address);
          setCity(userData.user.city);
          setState(userData.user.state);
          setZip(userData.user.zip);

          const formattedPhone = reformatPhoneForDisplay(userData.user.phone);
          setPhone(formattedPhone);

          setAllergy(userData.user.allergy);
          setStaff(userData.user.staff);
          setPosition(userData.user.position);
        } catch (error) {
          setErrors({ general: 'Error fetching User data.' });
        } finally {
          setLoading(false);
        }
      };
      getUserData();
    }
  }, [customProp, dispatch])

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === confirmPassword) {
      setErrors({});
      if (staff) {
        setShowManagerModal(true); // Show modal for manager login if staff is true
      } else {
        // Proceed with regular form submission for patient
        const phoneForDB = phone.replace(/\D/g, '');

        dispatch(
          sessionActions.signup({
            firstName,
            lastName,
            dateOfBirth,
            gender,
            username,
            email,
            password,
            address,
            city,
            state,
            zip,
            phone: phoneForDB,
            allergy,
            staff,
            position
          })
        )
          .then(closeModal)
          .catch(async (res) => {
            const data = await res.json();
            if (data?.errors) {
              setErrors(data.errors);
            }
          });
      }
    } else {
      setErrors({
        confirmPassword: "Confirm Password field must be the same as the Password field"
      });
    }
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    if (password === confirmPassword) {
      setErrors({});
      if (staff) {
        setShowManagerModal(true); // Show modal for manager login if staff is true
      } else {
        // Proceed with regular form submission for patient
        const phoneForDB = phone.replace(/\D/g, '');

        dispatch(
          sessionActions.update(customProp.id, {
            firstName,
            lastName,
            dateOfBirth,
            gender,
            username,
            email,
            password,
            address,
            city,
            state,
            zip,
            phone: phoneForDB,
            allergy,
            staff,
            position
          })
        )
          .then(closeModal)
          .catch(async (res) => {
            const data = await res.json();
            if (data?.errors) {
              setErrors(data.errors);
            }
          });
      }
    } else {
      setErrors({
        confirmPassword: "Confirm Password field must be the same as the Password field"
      });
    }
  };

  // Modal for manager to input username and password
  const [showManagerModal, setShowManagerModal] = useState(false);

  const handleManagerSubmit = async () => {
    setLoading(true);

    try {
      // Attempt manager login first
      const managerLogin = await dispatch(sessionActions.managerUser({
        credential: managerCredential, 
        password: managerPassword
      }));

      // Check if login was successful and if the logged-in user is a manager
      if (!managerLogin.user || managerLogin.user.staff !== true ||
          (managerLogin.user.position !== 'manager' && managerLogin.user.position !== 'doctor')) {
        if (!managerLogin.status) {
          setErrors({ manager: `Approval must be by a Manager or Doctor` });
        } else {
          setErrors({ manager: `Invalid Credential or Password, status: ${managerLogin.status}` });
        }
        setLoading(false);
        return;
      }

      // Proceed with form submission for staff (after manager is validate)
      const phoneForDB = phone.replace(/\D/g, '');

      if (customProp) {
        dispatch(
          sessionActions.update(customProp.id, {
            firstName,
            lastName,
            dateOfBirth,
            gender,
            username,
            email,
            password,
            address,
            city,
            state,
            zip,
            phone: phoneForDB,
            allergy,
            staff,
            position
          })
        )
      } else {
        await dispatch(
          sessionActions.signup({
            firstName,
            lastName,
            dateOfBirth,
            gender,
            username,
            email,
            password,
            address,
            city,
            state,
            zip,
            phone: phoneForDB,
            allergy,
            staff,
            position
          })
        );
      }
      closeModal();
    } catch (error) {  
      // Handle errors (login or signup failure)
      if (error?.data?.errors) {
        setErrors(error.data.errors);
      }
    } finally {
      // Reset loading state and close manager modal
      setLoading(false);
    }
  };

  const handlePhoneChange = (e) => {
    let value = e.target.value;
  
    // Remove all non-numeric characters to clean the phone number
    value = value.replace(/\D/g, '');
  
    // Limit to 10 digits (in case the user types more than 10 digits)
    if (value.length > 10) {
      value = value.slice(0, 10);
    }
  
    // Set the formatted phone number for user input (with parentheses, spaces, hyphen)
    let formattedValue = value;
  
    if (value.length <= 3) {
      formattedValue = `(${value}`;
    } else if (value.length <= 6) {
      formattedValue = `(${value.slice(0, 3)}) ${value.slice(3)}`;
    } else {
      formattedValue = `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6, 10)}`;
    }
  
    // Update the state with the formatted value
    setPhone(formattedValue);
  };

  const reformatPhoneForDisplay = (phoneForDb) => {
    // Ensure the phone number is a string and contains only 10 digits
    let cleanedPhoneNumber = phoneForDb.replace(/\D/g, ''); // Remove non-numeric characters (in case any are present)
  
    // Apply formatting: (xxx) xxx-xxxx
    let formattedPhoneNumber = cleanedPhoneNumber;
  
    if (cleanedPhoneNumber.length <= 3) {
      formattedPhoneNumber = `(${cleanedPhoneNumber}`;
    } else if (cleanedPhoneNumber.length <= 6) {
      formattedPhoneNumber = `(${cleanedPhoneNumber.slice(0, 3)}) ${cleanedPhoneNumber.slice(3)}`;
    } else {
      formattedPhoneNumber = `(${cleanedPhoneNumber.slice(0, 3)}) ${cleanedPhoneNumber.slice(3, 6)}-${cleanedPhoneNumber.slice(6, 10)}`;
    }
  
    return formattedPhoneNumber;
  };

  const handleManagerCancel = () => {
    setShowManagerModal(false);
    setManagerCredential('');
    setManagerPassword('');
  }

  if (loading) {
    return <p className={sfm.loading}>Loading Data ... </p>
  }

  return (
    <div className={sfm.mainContainer}>
      <form className={sfm.formSignUp} onSubmit={handleSubmit}>
        {customProp ? (
          <h1 className={sfm.titleSignUp}>Update User Data</h1>
        ) : (
          <h1 className={sfm.titleSignUp}>Sign Up</h1>
        )}

        {/* First Line: First Name, Last Name, Date of Birth, and Gender */}
        <div className={sfm.line1}>
          <label className={sfm.label}>
            First Name
            <input
              className={sfm.inputFirstName}
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Enter your first name"
              required
            />
          </label>
          {errors.firstName && <p className={sfm.errors}>{errors.firstName}</p>}

          <label className={sfm.label}>
            Last Name
            <input
              className={sfm.inputLastName}
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Enter your last name"
              required
            />
          </label>
          {errors.lastName && <p className={sfm.errors}>{errors.lastName}</p>}

          <label className={sfm.label}>
            Date Of Birth
            <input
              className={sfm.inputDateOfBirth}
              type="date"
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
              required
            />
          </label>
          {errors.dateOfBirth && <p className={sfm.errors}>{errors.dateOfBirth}</p>}

          <div>
            <label className={sfm.label}>
              Gender
              <div className={sfm.radioContainer}>
                <label className={sfm.label}>
                  <input
                    className={sfm.inputGender}
                    type="radio"
                    value="male"
                    checked={gender === "male"}
                    onChange={(e) => setGender(e.target.value)}
                    required
                  />
                  Male
                </label>
                <label className={sfm.label}>
                  <input
                    className={sfm.inputGender}
                    type="radio"
                    value="female"
                    checked={gender === "female"}
                    onChange={(e) => setGender(e.target.value)}
                    required
                  />
                  Female
                </label>
              </div>
            </label>
            {errors.gender && <p className={sfm.errors}>{errors.gender}</p>}
          </div>
        </div>

        {/* Second Line: Username, Email, Password, Confirm Password */}
        <div className={sfm.line2}>
          <label className={sfm.label}>
            Username
            <input
              className={sfm.inputUsername}
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              required
              disabled={customProp}
            />
          </label>
          {errors.username && <p className={sfm.errors}>{errors.username}</p>}

          <label className={sfm.label}>
            Email
            <input
              className={sfm.inputEmail}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              disabled={customProp}
            />
          </label>
          {errors.email && <p className={sfm.errors}>{errors.email}</p>}

          <label className={sfm.label}>
            Password
            <input
              className={sfm.inputPassword}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your Password"
              required
              disabled={customProp}
            />
          </label>
          {errors.password && <p>{errors.password}</p>}

          <label className={sfm.label}>
            Confirm Password
            <input
              className={sfm.inputPassword}
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter your Password to confirm"
              required
              disabled={customProp}
            />
          </label>
          {errors.confirmPassword && (
            <p className={sfm.errors}>{errors.confirmPassword}</p>
          )}
        </div>

        {/* Third Line: Address, City, State, Zip */}
        <div className={sfm.line3}>
          <label className={sfm.label}>
            Address
            <input
              className={sfm.inputAddress}
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter your address"
              required
            />
          </label>
          {errors.address && <p className={sfm.errors}>{errors.address}</p>}

          <label className={sfm.label}>
            City
            <input
              className={sfm.inputCity}
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Enter the city"
              required
            />
          </label>
          {errors.city && <p className={sfm.errors}>{errors.city}</p>}

          <label className={sfm.label}>
            State
            <input
              className={sfm.inputState}
              type="text"
              value={state}
              onChange={(e) => setState(e.target.value)}
              placeholder="Enter the state"
              required
            />
          </label>
          {errors.state && <p className={sfm.errors}>{errors.state}</p>}

          <label className={sfm.label}>
            Zip Code
            <input
              className={sfm.inputZip}
              type="text"
              value={zip}
              onChange={(e) => {
                const value = e.target.value;
                if (/^\d{0,5}$/.test(value)) {
                  setZip(value);
                }
              }}
              placeholder="Enter the zip Code"
              required
            />
          </label>
          {errors.zip && <p className={sfm.errors}>{errors.zip}</p>}
        </div>

        {/* Fourth Line: Phone, Allergy */}
        <div className={sfm.line4}>
          <label className={sfm.label}>
            Phone (w/ area code)
            <input
              className={sfm.inputPhone}
              type="text"
              value={phone}
              onChange={handlePhoneChange}
              placeholder="Enter the phone number including area code"
              maxLength="14"
              required
            />
          </label>
          {errors.phone && <p className={sfm.errors}>{errors.phone}</p>}

          <label className={sfm.label}>
            Allergy
            <input
              className={sfm.inputAllergy}
              type="text"
              value={allergy}
              onChange={(e) => setAllergy(e.target.value)}
              placeholder="Enter IF you have any allergy"
            />
          </label>
          {errors.allergy && <p className={sfm.errors}>{errors.allergy}</p>}
        </div>

        {/* Fifth Line: Staff, Position, Submit Button */}
        <div className={sfm.line5}>
          <div>
            <label className={sfm.label}>
              User Type
              <div className={sfm.radioContainer}>
                <label className={sfm.label}>
                  <input
                    className={sfm.inputStaff}
                    type="radio"
                    value="false"
                    checked={staff === false}
                    onChange={(e) => setStaff(e.target.value === 'true')}
                    required
                  />
                  Patient
                </label>
                <label className={sfm.label}>
                  <input
                    className={sfm.inputStaff}
                    type="radio"
                    value="true"
                    checked={staff === true}
                    onChange={(e) => setStaff(e.target.value === 'true')}
                    required
                  />
                  Staff
                </label>
              </div>
            </label>
            {errors.staff && <p className={sfm.errors}>{errors.staff}</p>}
          </div>

          {staff && (
            <>
              <label className={sfm.label}>
                Position
                <div className={sfm.radioContainer}>
                  <label className={sfm.label}>
                    <input
                      className={sfm.inputPosition}
                      type="radio"
                      value="staff"
                      checked={position === "staff"}
                      onChange={(e) => setPosition(e.target.value)}
                      required
                    />
                    Staff
                  </label>
                  <label className={sfm.label}>
                    <input
                      className={sfm.inputPosition}
                      type="radio"
                      value="nurse"
                      checked={position === "nurse"}
                      onChange={(e) => setPosition(e.target.value)}
                      required
                    />
                    Nurse
                  </label>
                  <label className={sfm.label}>
                    <input
                      className={sfm.inputPosition}
                      type="radio"
                      value="doctor"
                      checked={position === "doctor"}
                      onChange={(e) => setPosition(e.target.value)}
                      required
                    />
                    Doctor
                  </label>
                  <label className={sfm.label}>
                    <input
                      className={sfm.inputPosition}
                      type="radio"
                      value="manager"
                      checked={position === "manager"}
                      onChange={(e) => setPosition(e.target.value)}
                      required
                    />
                    Manager
                  </label>
                </div>
              </label>
              {errors.position && <p className={sfm.errors}>{errors.position}</p>}
            </>
          )}

          {customProp ? (
            <button className={sfm.submitButton} onClick={handleUpdate}>
              Update
            </button>
          ) : (
            <button className={sfm.submitButton} type="submit">
              Sign Up
            </button>
          )}

        </div>

        {/* Sixth Line: Manager Credential, Manager Password, Submit and Cancel Buttons */}
        {showManagerModal && (
          <div className={sfm.modalMgr} ref={modalRef}>
            <h2 className={sfm.titleMgr}>Manager Login</h2>
            <div className={sfm.managerInputs}>
              <label className={sfm.labelMgr}>
                Credential
                <input
                  className={sfm.inputCredentialMgr}
                  type="text"
                  value={managerCredential}
                  onChange={(e) => setManagerCredential(e.target.value)}
                  placeholder="Enter Manager Username or Email"
                  required
                />
              </label>
              <label className={sfm.labelMgr}>
                Password
                <input
                  className={sfm.inputPasswordMgr}
                  type="password"
                  value={managerPassword}
                  onChange={(e) => setManagerPassword(e.target.value)}
                  placeholder="Enter Manager Password"
                  required
                />
              </label>
              {errors.manager && <p className={sfm.errorsMgr}>{errors.manager}</p>} {/* show manager error */}
            </div>

            <div className={sfm.buttonMgr}>
              <button type="button" className={sfm.submitButtonMgr} onClick={handleManagerSubmit}>
                Submit
              </button>
              <button type="button" className={sfm.cancelButtonMgr} onClick={handleManagerCancel}>
                Cancel
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}

export default SignupFormModal;