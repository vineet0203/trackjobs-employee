import { NavLink } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  return (
    <aside className="employee-sidebar">
      <div className="employee-sidebar-brand">TRAKJOBS</div>

      <nav className="employee-sidebar-nav">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `employee-sidebar-link ${isActive ? 'active' : ''}`
          }
        >
          Dashboard
        </NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;
