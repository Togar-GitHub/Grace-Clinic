import { useState, useRef, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import * as sessionActions from '../../store/session';
import lgm from './LoginFormModal.module.css';

function LoginFormModal() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const modalRef = useRef();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        closeModal();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [closeModal]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    return dispatch(sessionActions.login({ credential, password }))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
          setErrors(data.errors);
        }
      });
  };

  const demoPatient = (e) => {
    e.preventDefault();
    setErrors({});
    return dispatch(sessionActions.login({ credential: 'michaeltaylor', password: 'passmichaeltaylor' }))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
          setErrors(data.errors);
        }
      });
  };

    const demoStaff = (e) => {
    e.preventDefault();
    setErrors({});
    return dispatch(sessionActions.login({ credential: 'johndoe', password: 'passjohndoe' }))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
          setErrors(data.errors);
        }
      });
  };
  
  const demoDoctor = (e) => {
    e.preventDefault();
    setErrors({});
    return dispatch(sessionActions.login({ credential: 'janesmith', password: 'passjanesmith' }))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
          setErrors(data.errors);
        }
      });
  };
    
  const demoManager = (e) => {
    e.preventDefault();
    setErrors({});
    return dispatch(sessionActions.login({ credential: 'alicejohnson', password: 'passalicejohnson' }))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
          setErrors(data.errors);
        }
      });
  };

  return (
    <div>
      <form className={lgm.form} onSubmit={handleSubmit}>
      <h1 className={lgm.titleLogin}>Log In</h1>
        <label className={lgm.label}>
          Username or Email
          <input
            className={lgm.inputList}
            type="text"
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
            placeholder='Enter your username or email'
            required
          />
        </label>
        <label className={lgm.label}>
          Password
          <input
            className={lgm.inputList}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder='Enter your password'
            required
          />
        </label>
        {errors.credential && (
          <p className={lgm.errors}>{errors.credential}</p>
        )}
        <button className={lgm.submitButton} type="submit">Log In</button>

        <div className={lgm.demoUserContainer}>
          <span className={lgm.demoUserSpan} onClick={demoPatient}>Demo Patient</span>
          <span className={lgm.demoUserSpan} onClick={demoStaff}>Demo Staff</span>
          <span className={lgm.demoUserSpan} onClick={demoDoctor}>Demo Doctor</span>
          <span className={lgm.demoUserSpan} onClick={demoManager}>Demo Manager</span>
        </div>
      </form>
    </div>
  );
}

export default LoginFormModal;