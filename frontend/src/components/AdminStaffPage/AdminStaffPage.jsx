import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getAllStaffThunk, deleteUserThunk  } from '../../store/user';
import AdminStaffDeleteModal from '../AdminStaffDeleteModal/AdminStaffDeleteModal';
import stf from './AdminStaffPage.module.css';

const AdminStaffPage = () => {
  const user = useSelector((state) => state.session.user);
  const allUsers = useSelector((state) => state.user.allUsers.allStaff);
  const [loading, setLoading] = useState(true);
  const [noUser, setNoUser] = useState('');
  // const [userId, setUserId] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchUser = async () => {
      try {
        setLoading(true);
        setNoUser('');
        await dispatch(getAllStaffThunk());
      } catch (error) {
        console.error("Error fetching Staff", error)
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, [dispatch]);

  useEffect(() => {
    if (!allUsers || allUsers.length <= 0) {
      setNoUser('There is no Staff Record')
    } else {
      setNoUser('')
    }
  }, [allUsers]);

  const formatPhoneNumber = (phoneNumber) => {
    // Ensure the phone number is a string and contains exactly 10 digits
    if (!phoneNumber || phoneNumber.length !== 10) return phoneNumber;
    
    // Format phone number as (xxx) xxx-xxxx
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6)}`;
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
    await dispatch(getAllStaffThunk());
    // setErrors({});
    window.scrollTo(0, 0);
  }

  if (loading) {
    <p className={stf.loading}>Loading...</p>
  }

  return (
    <div className={stf.mainContainer}>
      <h1 className={stf.mainTitle}>Admin Staff User Page</h1>

      {/* Modal for confirming the deletion */}
      {showModal && (
        <AdminStaffDeleteModal
          onClose={closeModal} 
          onConfirm={confirmDeletion} 
        />
      )}

      <div className={stf.noUser}>
        {noUser && (
          <h2 className={stf.noUserMsg}>{noUser}</h2>
        )}
      </div>

      <div className={stf.UserListContainer}>
        {allUsers && allUsers.length > 0 && (
          <h2 className={stf.userListTitle}>The Staff List</h2>
        )}
        {errors.forbidden && <p className={stf.errors}>{errors.forbidden}</p>}
        {allUsers && allUsers.length > 0 && (
          allUsers.map((el) => (
            <div key={el.id}>
              <div className={stf.userList}>
                <div className={stf.lineOne}>
                  <p className={stf.listInfo}>Name: {el.firstName} {el.lastName}</p>
                  <p className={stf.listInfo}>Date Of Birth: {el.dateOfBirth.slice(0, 10)}</p>
                  <p className={stf.listInfo}>Gender: {el.gender}</p>
                  <p className={stf.listInfo}>Username & Email: {el.username} & {el.email}</p>
                </div>
                <div className={stf.lineTwo}>
                  <p className={stf.listInfo}>Position: {el.position}</p>
                  <p className={stf.listInfo}>Address: {el.address} {el.city}, {el.state} {el.zip}</p>
                  <p className={stf.listInfo}>Phone: {formatPhoneNumber(el.phone)}</p>
                  <p className={stf.listInfo}>Allergy: {el.allergy}</p>
                </div>
                <div className={stf.updateDeleteButtonContainer}>
                  <button
                    className={stf.deleteButton}
                    onClick={() => handleDeleteClick(el.id)}
                    >
                      Delete Staff
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

export default AdminStaffPage;