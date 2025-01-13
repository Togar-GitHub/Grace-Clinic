import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import nvg from './Navigation.module.css';

function Navigation({ isLoaded }){
  const sessionUser = useSelector(state => state.session.user);

  return (
    <div className={nvg.mainContainer}>
      <div className={nvg.logoHome}>
        <NavLink to="/">
          <img src="/graceclinicsmall.jpg" />
        </NavLink>
      </div>
      {isLoaded && (
        <div className={nvg.profileButton}>
          <ProfileButton user={sessionUser} />
        </div>
      )}
    </div>
  );
}

export default Navigation;