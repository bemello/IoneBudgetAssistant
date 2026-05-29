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
            <span class="material-symbols-outlined">dashboard</span>
            <span>Dashboard</span>
          </NavLink>
        </li>
        <li className="nav-item">
          <div className="spacer"></div>
          <NavLink to="/transactions">
            <span class="material-symbols-outlined">receipt_long</span>
            <span>Transactions</span>
          </NavLink>
        </li>
        <li className="nav-item">
          <div className="spacer"></div>
          <NavLink to="/payments">
            <span class="material-symbols-outlined">payments</span>
            <span>Payments</span>
          </NavLink>
        </li>
        <li className="nav-item">
          <div className="spacer"></div>
          <NavLink to="/budgets">
            <span class="material-symbols-outlined">
              account_balance_wallet
            </span>
            <span>Budgets</span>
          </NavLink>
        </li>
        <li className="nav-item">
          <div className="spacer"></div>
          <NavLink to="/cards">
            <span class="material-symbols-outlined">payment</span>
            <span>Cards</span>
          </NavLink>
        </li>
        <li className="nav-item">
          <div className="spacer"></div>
          <NavLink to="/investments">
            <span class="material-symbols-outlined">finance_mode</span>
            <span>Investments</span>
          </NavLink>
        </li>
        <li className="nav-item">
          <div className="spacer"></div>
          <NavLink to="/vaults">
            <span class="material-symbols-outlined">savings</span>
            <span>Vaults</span>
          </NavLink>
        </li>
        <li className="nav-item">
          <div className="spacer"></div>
          <NavLink to="/reports">
            <span class="material-symbols-outlined">insert_chart</span>
            <span>Reports</span>
          </NavLink>
        </li>
        <li className="nav-item">
          <div className="spacer"></div>
          <NavLink to="/settings">
            <span class="material-symbols-outlined">settings</span>
            <span>Settings</span>
          </NavLink>
        </li>
      </ul>
      <div className="nav-footer">
        <NavLink to="/logout">
          <span class="material-symbols-outlined">logout</span>
          Logout
        </NavLink>
      </div>
    </nav>
  );
}

export default Navbar;
