import { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { FaUserCircle } from 'react-icons/fa';
import * as sessionActions from '../../store/session';
import pbt from './ProfileButton.module.css';

function ProfileButton({ user }) {
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();

  const toggleMenu = (e) => {
    e.stopPropagation();
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

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout());
  };

  const divClassName = showMenu ? pbt.profileDropdown : pbt.hidden;

  return (
    <div className={pbt.profileButtonMainContainer}>
      <button onClick={toggleMenu}>
        <FaUserCircle />
      </button>
      <div className={divClassName} ref={ulRef}>
        <div>{user.username}</div>
        <div>{user.firstName} {user.lastName}</div>
        <div>{user.email}</div>
        <div>
          <button onClick={logout}>Log Out</button>
        </div>
      </div>
    </div>
  );
}

export default ProfileButton;