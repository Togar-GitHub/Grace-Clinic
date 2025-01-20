import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getAllCptThunk, getCptByIdThunk, updateCptThunk, deleteCptThunk, createCptThunk } from '../../store/cpt';
import AdminCPTDeleteModal from '../AdminCPTDeleteModal/AdminCPTDeleteModal';
import acp from './AdminCPTPage.module.css';

const AdminCPTPage = () => {
  const allCpt = useSelector((state) => state.cpt.allCpt.CPT);
  const [loading, setLoading] = useState(true);
  const [noCpt, setNoCpt] = useState('');
  const [cptId, setCptId] = useState('');
  const [updateRecord, setUpdateRecord] = useState('');
  const [cptCode, setCptCode] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [cptToDelete, setCptToDelete] = useState(null);
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchCpt = async () => {
      try {
        setLoading(true);
        setNoCpt('');
        await dispatch(getAllCptThunk());
      } catch (error) {
        console.error('Error fetching CPT Records', error)
      } finally {
        setLoading(false);
      }
    }
    fetchCpt();
  }, [dispatch]);

  useEffect(() => {
    if (!allCpt || allCpt.length <= 0) {
      setNoCpt('There is no Cpt Code Record')
    } else {
      setNoCpt('')
    }
  }, [allCpt]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = {};

    if (!cptCode || cptCode < 90000 || cptCode > 99999) {
      validationErrors.cptCode = 'Please enter CPT Code or change the CPT Code'
    }
    if (!description) {
      validationErrors.description = 'Please enter the Description'
    }
    if (!price) {
      validationErrors.price = 'Please enter the Price'
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});

    try {
      await dispatch(createCptThunk({
        CPTCode: cptCode,
        description,
        price
      }))

      setCptCode('');
      setDescription('');
      setPrice('');
      await dispatch(getAllCptThunk());
      setNoCpt('');
    } catch (error) {
      console.error('Error creating CPT Record:', error);
      setErrors({
        submit: 'There was an error creating the CPT Record. Please try again.'
      })
    }
  };

  const handleUpdateClick = async (cptId) => {
    setLoading(true);
    setUpdateRecord(true);
    const updateCpt = await dispatch(getCptByIdThunk(cptId));

    setCptId(updateCpt.CPT.id);
    setCptCode(updateCpt.CPT.CPTCode);
    setDescription(updateCpt.CPT.description);
    setPrice(updateCpt.CPT.price);
    setLoading(false);
    setErrors({});
    window.scrollTo(0, 0);
  }

  const handleUpdate = async (cptId) => {
    try {
      const validationErrors = {};

      if (!cptCode) {
        validationErrors.cptCode = 'Please enter CPT Code'
      }
      if (!description) {
        validationErrors.description = 'Please enter the Description'
      }
      if (!price) {
        validationErrors.price = 'Please enter the Price'
      }
  
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }
  
      setErrors({});

      await dispatch(updateCptThunk(cptId, {
        CPTCode: cptCode,
        description,
        price
      }));

      setCptCode('');
      setDescription('');
      setPrice('');
      setLoading(true);
      setNoCpt('');

      await dispatch(getAllCptThunk());

      setLoading(false);
      setUpdateRecord('');
    } catch (error) {
      console.error('Error updating CPT Record:', error);
      setErrors({
        general: 'An error occurred while updating the CPT Record.'
      });
      setLoading(false);
    }
  }

  const handleDeleteClick = (cptId) => {
    setCptToDelete(cptId);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setCptToDelete(null);
  }

  const confirmDeletion = async () => {
    if (cptToDelete) {
      await deleteCpt(cptToDelete);
      closeModal();
    }
  }

  const deleteCpt = async (cptId) => {
    await dispatch(deleteCptThunk(cptId));
    await dispatch(getAllCptThunk());
    setUpdateRecord('');
    setErrors({});
    window.scrollTo(0, 0);
  }

  if (loading) {
    <p className={acp.loading}>Loading...</p>
  }

  return (
    <div className={acp.mainContainer}>
      <h1 className={acp.mainTitle}>Admin CPT Table Page</h1>

      <div className={acp.createCptContainer}>
        {updateRecord ? (
          <h2 className={acp.createCptTitle}>Update CPT Record</h2>
        ) : (
          <h2 className={acp.createCptTitle}>Create a new CPT Record</h2>
        )}

        <div className={acp.inputCpt}>
          <input
            className={acp.enterCptCode}
            type="number"
            value={cptCode}
            onChange={(e) => setCptCode(e.target.value)}
            placeholder='Enter CPT Code'
            required
          />
          {errors.cptCode && <p className={acp.errors}>{errors.cptCode}</p>}

          <input
            className={acp.enterDescription}
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder='Enter description'
            required
          />
          {errors.description && <p className={acp.errors}>{errors.description}</p>}          

          <input
            className={acp.enterPrice}
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder='Enter Price'
            required
          />
          {errors.cptPrice && <p className={acp.errors}>{errors.cptPrice}</p>}
        </div>

        <div className={acp.submitContainer}>
          {updateRecord ? (
            <button className={acp.submitButton} onClick={() => handleUpdate(cptId)}>
              Update
            </button>
          ) : (
            <button className={acp.submitButton} onClick={handleSubmit}>
              Submit
            </button>
          )}
        </div>
      </div>

      {/* Modal for confirming the deletion */}
      {showModal && (
        <AdminCPTDeleteModal
          onClose={closeModal} 
          onConfirm={confirmDeletion} 
        />
      )}

      <div className={acp.noCpt}>
        {noCpt && (
          <h2 className={acp.noCptMsg}>{noCpt}</h2>
        )}
      </div>

      <div className={acp.cptListContainer}>
        {allCpt && allCpt.length > 0 && (
          <h2 className={acp.cptListTitle}>The CPT Code List</h2>
        )}
        {allCpt && allCpt.length > 0 && (
          allCpt.map((el) => (
            <div key={el.id}>
              <div className={acp.cptList}>
                <p className={acp.listInfo}>CPT Code: {el.CPTCode}</p>
                <p className={acp.listInfo}>Description: {el.description}</p>
                <p className={acp.listInfo}>Price: ${el.price}</p>

                <div className={acp.updateDeleteButtonContainer}>
                  <button
                    className={acp.updateButton}
                    onClick={() => handleUpdateClick(el.id)}
                    >
                      Update
                  </button>
                  <button
                    className={acp.deleteButton}
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

export default AdminCPTPage;