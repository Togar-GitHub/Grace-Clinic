import { useSelector } from 'react-redux';
import { NavLink } from "react-router-dom";
import adm from './AdminPage.module.css';

const AdminPage = () => {
  const user = useSelector((state) => state.session.user);

  return (
    <div className={adm.mainContainer}>
      <h1 className={adm.mainTitle}>Admin Page</h1>

      {user.position === 'doctor' && (
        <NavLink
          to='/createChart'
          className={adm.linkingChart}
          >
          Create New Chart
        </NavLink>
      )}

      <NavLink
        to='/adminPatientPage'
        className={adm.linking}
        >
        Maintain Patient User
      </NavLink>

      <NavLink
        to='/adminStaffPage'
        className={adm.linking}
        >
        Maintain Staff User
      </NavLink>

      <NavLink
        to='/adminCPTPage'
        className={adm.linking}
        >
        Maintain CPT Code Table
      </NavLink>

      <NavLink
        to='/adminServicePage'
        className={adm.linking}
        >
        Maintain Service Table
      </NavLink>

    </div>
  )
}

export default AdminPage;