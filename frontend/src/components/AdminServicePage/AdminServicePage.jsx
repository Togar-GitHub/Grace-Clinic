import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getAllServicesThunk, getServiceByIdThunk, updateServiceThunk, deleteServiceThunk, createServiceThunk } from '../../store/service';
import AdminServiceDeleteModal from '../AdminServiceDeleteModal/AdminServiceDeleteModal';
import asp from './AdminServicePage.module.css';

const AdminServicePage = () => {
  const allServices = useSelector((state) => state.service.allServices.Services);
  const [loading, setLoading] = useState(true);
  const [noService, setNoService] = useState('');
  const [serviceId, setServiceId] = useState('');
  const [updateRecord, setUpdateRecord] = useState('');
  const [service, setService] = useState('');
  const [price, setPrice] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState(null);
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchCpt = async () => {
      try {
        setLoading(true);
        setNoService('');
        await dispatch(getAllServicesThunk());
      } finally {
        setLoading(false);
      }
    }
    fetchCpt();
  }, [dispatch]);

  useEffect(() => {
    if (!allServices || allServices.length <= 0) {
      setNoService('There is no Service Record')
    }
  }, [allServices]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = {};

    if (!service) {
      validationErrors.description = 'Please enter the Service'
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
      await dispatch(createServiceThunk({
        service,
        price
      }))

      setService('');
      setPrice('');
      await dispatch(getAllServicesThunk());
      setNoService('');
    } catch (error) {
      console.error('Error creating Service Record:', error);
      setErrors({
        submit: 'There was an error creating the Service Record. Please try again.'
      })
    }
  };

  const handleUpdateClick = async (serviceId) => {
    setLoading(true);
    setUpdateRecord(true);
    const updateService = await dispatch(getServiceByIdThunk(serviceId));
    console.log('updateService > ', updateService);
    setServiceId(updateService.Service.id);
    setService(updateService.Service.service);
    setPrice(updateService.Service.price);
    setLoading(false);
    setErrors({});
    window.scrollTo(0, 0);
  }

  const handleUpdate = async (serviceId) => {
    try {
      const validationErrors = {};

      if (!service) {
        validationErrors.description = 'Please enter the Service'
      }
      if (!price) {
        validationErrors.price = 'Please enter the Price'
      }
  
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }
  
      setErrors({});

      await dispatch(updateServiceThunk(serviceId, {
        service,
        price
      }));

      setService('');
      setPrice('');
      setLoading(true);
      setNoService('');

      await dispatch(getAllServicesThunk());

      setLoading(false);
      setUpdateRecord('');
    } catch (error) {
      console.error('Error updating Service Record:', error);
      setErrors({
        general: 'An error occurred while updating the Service Record.'
      });
      setLoading(false);
    }
  }

  const handleDeleteClick = (serviceId) => {
    setServiceToDelete(serviceId);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setServiceToDelete(null);
  }

  const confirmDeletion = async () => {
    if (serviceToDelete) {
      await deleteService(serviceToDelete);
      closeModal();
    }
  }

  const deleteService = async (serviceId) => {
    await dispatch(deleteServiceThunk(serviceId));
    await dispatch(getAllServicesThunk());
    setUpdateRecord('');
    setErrors({});
    window.scrollTo(0, 0);
  }

  if (loading) {
    <p className={asp.loading}>Loading...</p>
  }

  return (
    <div className={asp.mainContainer}>
      <h1 className={asp.mainTitle}>Admin Service Table Page</h1>

      <div className={asp.createServiceContainer}>
        {updateRecord ? (
          <h2 className={asp.createServiceTitle}>Update Service Record</h2>
        ) : (
          <h2 className={asp.createServiceTitle}>Create a new Service Record</h2>
        )}

        <div className={asp.inputService}>
          <input
            className={asp.enterService}
            type="text"
            value={service}
            onChange={(e) => setService(e.target.value)}
            placeholder='Enter Service'
            required
          />
          {errors.service && <p className={asp.errors}>{errors.service}</p>}          

          <input
            className={asp.enterPrice}
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder='Enter Price'
            required
          />
          {errors.price && <p className={asp.errors}>{errors.price}</p>}
        </div>

        <div className={asp.submitContainer}>
          {updateRecord ? (
            <button className={asp.submitButton} onClick={() => handleUpdate(serviceId)}>
              Update
            </button>
          ) : (
            <button className={asp.submitButton} onClick={handleSubmit}>
              Submit
            </button>
          )}
        </div>
      </div>

      {/* Modal for confirming the deletion */}
      {showModal && (
        <AdminServiceDeleteModal
          onClose={closeModal} 
          onConfirm={confirmDeletion} 
        />
      )}

      <div className={asp.noService}>
        {noService && (
          <h2 className={asp.noServiceMsg}>{noService}</h2>
        )}
      </div>

      <div className={asp.serviceListContainer}>
        {allServices && allServices.length > 0 && (
          <h2 className={asp.serviceListTitle}>The Service List</h2>
        )}
        {allServices && allServices.length > 0 && (
          allServices.map((el) => (
            <div key={el.id}>
              <div className={asp.serviceList}>
                <p className={asp.listInfo}>Service: {el.service}</p>
                <p className={asp.listInfo}>Price: ${el.price}</p>

                <div className={asp.updateDeleteButtonContainer}>
                  <button
                    className={asp.updateButton}
                    onClick={() => handleUpdateClick(el.id)}
                    >
                      Update
                  </button>
                  <button
                    className={asp.deleteButton}
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

export default AdminServicePage;