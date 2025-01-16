import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import Navigation from './components/Navigation/Navigation';
import LandingPage from './components/LandingPage/LandingPage';
import AppointmentPage from './components/AppointmentPage/AppointmentPage';
import ReviewPage from './components/ReviewPage/ReviewPage';
import AdminPage from './components/AdminPage/AdminPage';
import AdminPatientPage from './components/AdminPatientPage/AdminPatientPage';
import AdminStaffPage from './components/AdminStaffPage/AdminStaffPage';
import AdminCPTPage from './components/AdminCPTPage/AdminCPTPage';
import AdminServicePage from './components/AdminServicePage/AdminServicePage';
import ChartingPage from './components/ChartingPage/ChartingPage';
import * as sessionActions from './store/session';

function Layout() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => {
      setIsLoaded(true)
    });
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && <Outlet />}
    </>
  );
}

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <LandingPage />
      },
      {
        path: '/adminPage',
        element: <AdminPage />
      },
      {
        path: '/chartingPage',
        element: <ChartingPage />
      },
      {
        path: '/appointmentPage',
        element: <AppointmentPage />
      },
      {
        path: '/reviewPage',
        element: <ReviewPage />
      },
      {
        path: '/adminPatientPage',
        element: <AdminPatientPage />
      },
      {
        path: '/adminStaffPage',
        element: <AdminStaffPage />
      },
      {
        path: '/adminCPTPage',
        element: <AdminCPTPage />
      },
      {
        path: '/adminServicePage',
        element: <AdminServicePage />
      }
    ]
  }
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
