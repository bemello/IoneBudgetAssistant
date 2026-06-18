import { NavLink } from "react-router-dom";

function Navbar({ user }) {
  return (
    <nav className="navbar">
      <NavLink to="/">
        <div className="brand-header">
          <div className="brand-name">
            <div className="brand-title">Ione</div>
            <div className="brand-subtitle">Budget Assistant</div>
          </div>
        </div>
      </NavLink>
      <ul className="nav-list">
        <li className="nav-item">
          <div className="spacer"></div>
          <NavLink to="/dashboard">
            <span className="material-symbols-outlined">dashboard</span>
            <span>Dashboard</span>
          </NavLink>
        </li>
        <li className="nav-item">
          <div className="spacer"></div>
          <NavLink to="/transactions">
            <span className="material-symbols-outlined">receipt_long</span>
            <span>Transactions</span>
          </NavLink>
        </li>
        <li className="nav-item">
          <div className="spacer"></div>
          <a href="#">
            <span className="material-symbols-outlined">payments</span>
            <span>Payments</span>
          </a>
        </li>
        <li className="nav-item">
          <div className="spacer"></div>
          <NavLink to="/budgets">
            <span className="material-symbols-outlined">money_range</span>
            <span>Budgets</span>
          </NavLink>
        </li>
        <li className="nav-item">
          <div className="spacer"></div>
          <NavLink to="/accounts">
            <span className="material-symbols-outlined">
              account_balance_wallet
            </span>
            <span>Accounts</span>
          </NavLink>
        </li>
        <li className="nav-item">
          <div className="spacer"></div>
          <NavLink to="/cards">
            <span className="material-symbols-outlined">payment</span>
            <span>Credit Cards</span>
          </NavLink>
        </li>
        <li className="nav-item">
          <div className="spacer"></div>
          <NavLink to="/investments">
            <span className="material-symbols-outlined">finance_mode</span>
            <span>Investments</span>
          </NavLink>
        </li>
        <li className="nav-item">
          <div className="spacer"></div>
          <NavLink to="/vaults">
            <span className="material-symbols-outlined">savings</span>
            <span>Vaults</span>
          </NavLink>
        </li>
        <li className="nav-item">
          <div className="spacer"></div>
          <NavLink to="/reports">
            <span className="material-symbols-outlined">insert_chart</span>
            <span>Reports</span>
          </NavLink>
        </li>
        <li className="nav-item">
          <div className="spacer"></div>
          <NavLink to="/settings">
            <span className="material-symbols-outlined">settings</span>
            <span>Settings</span>
          </NavLink>
        </li>
      </ul>
      <div className="nav-footer">
        <NavLink to="/logout" className="btn symbol link">
          <span className="material-symbols-outlined">logout</span>
          <span className="label">Logout</span>
        </NavLink>
      </div>
    </nav>
  );
}

export default Navbar;
