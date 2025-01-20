import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getAllPatientsThunk, updateUserThunk, deleteUserThunk  } from '../../store/user';
import AdminPatientDeleteModal from '../AdminStaffDeleteModal/AdminStaffDeleteModal';
import ptn from './AdminPatientPage.module.css';

const AdminPatientPage = () => {
  const user = useSelector((state) => state.session.user);
  const allUsers = useSelector((state) => state.user.allUsers.allPatients);
  const [loading, setLoading] = useState(true);
  const [noUser, setNoUser] = useState('');
  const [userId, setUserId] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [errors, setErrors] = useState({});
  const [updateRecord, setUpdateRecord] = useState(false);
  const [dateInactive, setDateInactive] = useState(null);
  const dispatch = useDispatch();

  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchUser = async () => {
      try {
        setLoading(true);
        setNoUser('');
        await dispatch(getAllPatientsThunk());
      } catch (error) {
        console.error("Error fetching patients:", error)
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, [dispatch]);

  useEffect(() => {
    if (!allUsers || allUsers.length <= 0) {
      setNoUser('There is no Patient Record')
    } else {
      setNoUser('');
    }
  }, [allUsers]);

  const formatPhoneNumber = (phoneNumber) => {
    // Ensure the phone number is a string and contains exactly 10 digits
    if (!phoneNumber || phoneNumber.length !== 10) return phoneNumber;
    
    // Format phone number as (xxx) xxx-xxxx
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6)}`;
  };

  const handleUpdateClick = (userId, dateInactive) => {
    setUpdateRecord(true);
    setUserId(userId);
    setDateInactive(dateInactive);
  }

  const handleUpdate = async (userId) => {
    try {
      setLoading(true);
      // const validationErrors = {};

      if (!dateInactive) {
        setDateInactive(null);
      }

      // if (Object.keys(validationErrors).length > 0) {
      //   setErrors(validationErrors);
      //   return;
      // }
  
      // setErrors({});

      await dispatch(updateUserThunk(userId, {
        dateInactive
      }));

      await dispatch(getAllPatientsThunk());

      setUpdateRecord(false);
      setLoading(false);
    } catch (error) {
      console.error('Error updating User Record', error);
      setErrors({
        general: 'An error occurred while updating a User Record.'
      });
      setLoading(false);
    }
  }

  const isDeleteButtonVisible = (dateInactive) => {
    // If dateInactive is null or empty, don't show delete button
    if (!dateInactive) return false;

    const inactiveDate = new Date(dateInactive);
    const currentDate = new Date();
    const diffInYears = (currentDate - inactiveDate) / (1000 * 60 * 60 * 24 * 365); // Difference in years

    // Show delete button if the dateInactive is more than 5 years ago
    return diffInYears > 5;
  };

  const handleDeleteClick = (userId) => {
    if (userId === user.id) {
      setErrors({ forbidden: "You can't delete your own User Record"})
      return
    }
    setErrors({});
    setUserToDelete(userId);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setUserToDelete(null);
  }

  const confirmDeletion = async () => {
    if (userToDelete) {
      await deleteUser(userToDelete);
      closeModal();
    }
  }

  const deleteUser = async (userId) => {
    await dispatch(deleteUserThunk(userId));
    await dispatch(getAllPatientsThunk());
    setErrors({});
    window.scrollTo(0, 0);
  }

  if (loading) {
    <p className={ptn.loading}>Loading...</p>
  }

  return (
    <div className={ptn.mainContainer}>
      <h1 className={ptn.mainTitle}>Admin Patient User Page</h1>

      {/* Modal for confirming the deletion */}
      {showModal && (
        <AdminPatientDeleteModal
          onClose={closeModal} 
          onConfirm={confirmDeletion} 
        />
      )}

      <div className={ptn.noUser}>
        {noUser && (
          <h2 className={ptn.noUserMsg}>{noUser}</h2>
        )}
      </div>

      <div className={ptn.UserListContainer}>
        {allUsers && allUsers.length > 0 && (
          <h2 className={ptn.userListTitle}>The Patient List</h2>
        )}
        {errors.forbidden && <p className={ptn.errors}>{errors.forbidden}</p>}
        {allUsers && allUsers.length > 0 && (
          allUsers.map((el) => (
            <div key={el.id}>
              <div className={ptn.userList}>
                <div className={ptn.lineOne}>
                  <p className={ptn.listInfo}>Name: {el.firstName} {el.lastName}</p>
                  <p className={ptn.listInfo}>Date Of Birth: {el.dateOfBirth.slice(0, 10)}</p>
                  <p className={ptn.listInfo}>Gender: {el.gender}</p>
                  <p className={ptn.listInfo}>Username & Email: {el.username} & {el.email}</p>
                </div>
                <div className={ptn.lineTwo}>
                  <p className={ptn.listInfo}>
                    Inactive Date: {el.dateInactive ? el.dateInactive.slice(0, 10) : 'Active'}</p>
                  <p className={ptn.listInfo}>Address: {el.address} {el.city}, {el.state} {el.zip}</p>
                  <p className={ptn.listInfo}>Phone: {formatPhoneNumber(el.phone)}</p>
                  <p className={ptn.listInfo}>Allergy: {el.allergy}</p>
                </div>
                <div className={ptn.updateDeleteButtonContainer}>

                  <button
                    className={ptn.updateButton}
                    onClick={() => handleUpdateClick(el.id, el.dateInactive)}
                    >
                      Update Inactive Date
                  </button>

                  {updateRecord && userId === el.id && (
                    <>
                      <input
                        className={ptn.enterDateInactive}
                        type="date"
                        value={dateInactive?.slice(0, 10)}
                        onChange={(e) => setDateInactive(e.target.value)}
                        placeholder='Choose a date'
                        max={today}
                      />
                      {errors.dateInactive && <p className={ptn.errors}>{errors.dateInactive}</p>}

                      <button
                        className={ptn.confirmUpdateButton}
                        onClick={() => handleUpdate(el.id)}
                        >
                          Confirm Update
                      </button>
                    </>
                  )}

                  {isDeleteButtonVisible(el.dateInactive) && (
                    <button
                    className={ptn.deleteButton}
                    onClick={() => handleDeleteClick(el.id)}
                    >
                      Delete Patient
                  </button>
                  )}
                </div>
              </div>
            </div>  
          ))
        )}
      </div>
    </div>
  )
}

export default AdminPatientPage;