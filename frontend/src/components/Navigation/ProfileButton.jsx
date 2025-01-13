import { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigation, NavLink }from 'react-router-dom';
import { FaUser } from 'react-icons/fa';
import * as sessionActions from '../../store/session';
import OpenModalButton from '../OpenModalButton/OpenModalButton';
// import OpenModalMenuItem from '../OpenModalMenuItem/OpenModalMenuItem';
import LoginFormModal from '../LoginFormModal/LoginFormModal';
import SignupFormModal from '../SignupFormModal/SignupFormModal';
import pbt from './ProfileButton.module.css';

function ProfileButton({ user }) {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();

  const toggleMenu = (e) => {
    e.stopPropagation(); // Keep from bubbling up to document and triggering closeMenu
    setShowMenu(!showMenu);
  }

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (ulRef.current && !ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener('click', closeMenu);
    } else {
      document.removeEventListener('click', closeMenu);
    }

    return () => document.removeEventListener('click', closeMenu);
  }, [showMenu]);

  const closeMenu = () => setShowMenu(false);

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout());
  };

  const divClassName = showMenu ? pbt.profileDropdown : pbt.hidden;

  return (
    <div className={pbt.profileButtonMainContainer}>

      <div className={pbt.profileButtonMenuContainer}>
        {user && (
          <div className={pbt.userContainer}>
            <div className={pbt.loggedUser}>
              <p className={pbt.userList}>Name: {user.firstName} {user.lastName}</p>
              <p className={pbt.userList}>Username: {user.username}</p>
              <p className={pbt.userList}>Email: {user.email}</p>

              {user.staff && <p className={pbt.userList}>Position: {user.position}</p>}
            </div>
          </div>
        )}

        {user && user.staff && (
          <div className={pbt.adminButtonContainer}>
            <NavLink to='/adminPage' className={pbt.adminPage}>Admin</NavLink>
          </div>
        )}
      </div>

      <button className={pbt.homeImage} onClick={toggleMenu}>
        <FaUser size={50}/>
      </button>
      <div className={divClassName} ref={ulRef}>
        {user ? (
          <>
          <div className={pbt.loggedUser}>
            <div className={pbt.logOutButton}>
              <button className={pbt.logOutText} onClick={logout}>Log Out</button>
            </div>
          </div>
          </>
        ) : (
          <>
            <div className={pbt.logInButton}>
              <OpenModalButton
                className={pbt.logInText}
                buttonText="Log In"
                onButtonClick={closeMenu}
                modalComponent={<LoginFormModal />}
              />
            </div>
            <div className={pbt.signUpButton}>
              <OpenModalButton
                className={pbt.signUpText}
                buttonText="Sign Up"
                onButtonClick={closeMenu}
                modalComponent={<SignupFormModal />}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default ProfileButton;