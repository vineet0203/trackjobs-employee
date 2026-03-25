import { useMemo } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import './MainLayout.css';

const MainLayout = () => {
  const navigate = useNavigate();

  const employee = useMemo(() => {
    try {
      const raw = localStorage.getItem('employee_auth_employee');
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  }, []);

  const displayName = useMemo(() => {
    if (employee?.full_name) return employee.full_name;
    if (employee?.first_name && employee?.last_name) {
      return `${employee.first_name} ${employee.last_name}`;
    }
    if (employee?.first_name) return employee.first_name;
    if (employee?.email) return employee.email.split('@')[0];
    return 'Employee';
  }, [employee]);

  const initials = useMemo(() => {
    return displayName
      .split(' ')
      .map((chunk) => chunk[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  }, [displayName]);

  const handleLogout = () => {
    localStorage.removeItem('employee_token');
    localStorage.removeItem('employee_auth_employee');
    navigate('/login', { replace: true });
  };

  return (
    <div className="employee-layout">
      <Sidebar />

      <div className="employee-layout-main">
        <header className="employee-layout-header">
          <div className="employee-layout-header-right">
            <button type="button" className="employee-notification-btn" aria-label="Notifications">
              <span className="employee-notification-icon">!</span>
            </button>

            <button type="button" className="employee-profile-pill" onClick={handleLogout}>
              <span className="employee-profile-avatar">{initials}</span>
              <span className="employee-profile-name">{displayName}</span>
            </button>
          </div>
        </header>

        <main className="employee-layout-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
