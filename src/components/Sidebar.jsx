import { NavLink } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  return (
    <aside className="employee-sidebar">
      <div className="employee-sidebar-brand">TRAKJOBS</div>

      <nav className="employee-sidebar-nav">
        <NavLink
          to="/time-tracking"
          className={({ isActive }) =>
            `employee-sidebar-link ${isActive ? 'active' : ''}`
          }
        >
          Time Tracking
        </NavLink>

        <NavLink
          to="/listings"
          className={({ isActive }) =>
            `employee-sidebar-link ${isActive ? 'active' : ''}`
          }
        >
          Listings
        </NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;
