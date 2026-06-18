import VaultBalanceGraph from "../components/VaultBalanceGraph";

function Vaults({ user }) {
  return (
    <>
      <div className="page-header">
        <h2 className="page-title">Vaults</h2>
      </div>
      <div className="page-container no-border min-height vaults">
        <div className="vaults-totals">
          <div className="total-savings">
            <div className="total-label">Total Saved</div>
            <div className="total-amount">€23,250.00</div>
            <div className="icon">
              <span className="material-symbols-outlined">money_bag</span>
            </div>
          </div>
          <div className="total-target">
            <div className="total-label">Total Target</div>
            <div className="total-amount">€45,000.00</div>
            <div className="icon">
              <span className="material-symbols-outlined">target</span>
            </div>
          </div>
          <div className="total-progress">
            <div className="total-label">Total Progress</div>
            <div className="total-amount">78%</div>
            <div className="icon">
              <span className="material-symbols-outlined">speed</span>
            </div>
          </div>
          <div className="total-plans">
            <div className="total-label">Total Vaults</div>
            <div className="total-amount">2</div>
            <div className="icon">
              <span className="material-symbols-outlined">savings</span>
            </div>
          </div>
        </div>
        <div className="divider"></div>
        <div className="vaults-info">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Vaults</h3>
            </div>
            <div className="card-content">
              <div className="vault-list-container">
                <div className="vault-list">
                  <div className="item active">
                    <div className="icon">
                      <span className="material-symbols-outlined">house</span>
                    </div>
                    <div className="vault-name">Sweet Home</div>
                    <div className="vault-progress">55%</div>
                    <div className="vault-amount">
                      <span className="current">€22,000.00</span> /{" "}
                      <span className="target">€40,000.00</span>
                    </div>
                    <div className="vault-status">In Progress</div>
                    <div className="vault-progress-bar">
                      <progress
                        className="vault-progress-bar"
                        value="22000"
                        max="40000"
                      />
                    </div>
                  </div>
                  <div className="item">
                    <div className="icon">
                      <span className="material-symbols-outlined">travel</span>
                    </div>
                    <div className="vault-name">Holidays</div>
                    <div className="vault-progress">25%</div>
                    <div className="vault-amount">
                      <span className="current">€1,250.00</span> /{" "}
                      <span className="target">€5,000.00</span>
                    </div>
                    <div className="vault-status">In Progress</div>
                    <div className="vault-progress-bar">
                      <progress
                        className="vault-progress-bar"
                        value="1250"
                        max="5000"
                      />
                    </div>
                  </div>
                  <div className="item empty"></div>
                  <div className="item empty"></div>
                  <div className="item empty"></div>
                </div>
              </div>
              <div className="action-container">
                <button className="btn symbol full">
                  <span className="material-symbols-outlined">add</span>
                  <span className="label">Create New Vault</span>
                </button>
              </div>
            </div>
          </div>
          <div className="vault-details">
            <div className="info">
              <div className="header">
                <div className="icon">
                  <span className="material-symbols-outlined">house</span>
                </div>
                <div className="name">Sweet Home</div>
              </div>
              <div className="progress">
                <div className="amount">
                  <span className="current">€22,000</span>/
                  <span className="target">€40,000</span>
                </div>
                <div className="progress-bar">
                  <progress value="22000" max="40000" />
                </div>
                <div className="progress-percentage">
                  <span className="status">In Progress</span>
                  <span className="percentage">55%</span>
                </div>
              </div>
              <div className="general-info">
                <div className="due-date">
                  <div className="label">Due Date:</div>
                  <div className="date">31 December, 2027</div>
                </div>
                <div className="remaining-days">
                  <div className="label">Remaining:</div>
                  <div className="days">565 days</div>
                </div>
                <div className="number-of-contributions">
                  <div className="label">Contributions:</div>
                  <div className="count">5</div>
                </div>
              </div>
            </div>
            <div className="analytics">
              <div className="header">
                <h3 className="title">Balance</h3>
                <select
                  className="no-checkmark no-border"
                  defaultValue="this-year"
                >
                  <button className="select-button">
                    <div>
                      <selectedcontent></selectedcontent>
                    </div>
                  </button>
                  <div>
                    <option value="since-beginning">
                      <div className="custom-option">
                        <span className="option-text">Always</span>
                      </div>
                    </option>
                    <option value="this-month">
                      <div className="custom-option">
                        <span className="option-text">This Month</span>
                      </div>
                    </option>
                    <option value="this-year">
                      <div className="custom-option">
                        <span className="option-text">This Year</span>
                      </div>
                    </option>
                    <option value="last-month">
                      <div className="custom-option">
                        <span className="option-text">Last Month</span>
                      </div>
                    </option>
                    <option value="last-year">
                      <div className="custom-option">
                        <span className="option-text">Last Year</span>
                      </div>
                    </option>
                  </div>
                </select>
              </div>
              <div className="graph">
                <VaultBalanceGraph />
              </div>
            </div>
            <div className="contributions">
              <h3>Contributions</h3>
              <div className="tile">
                <span className="label">Highest</span>
                <span className="amount">€5,250.00</span>
              </div>
              <div className="tile">
                <span className="label">Lowest</span>
                <span className="amount">€3,250.00</span>
              </div>
              <div className="tile">
                <span className="label">Average</span>
                <span className="amount">€4,400.00</span>
              </div>
            </div>
            <div className="insights">
              <div className="tips-container">
                <h3>Insights</h3>
                <div className="tips">
                  <span>Save €1,000.00 per month to reach your goal.</span>
                  <span>Set up automatic deposits to consistently save.</span>
                  <span>Payday is Save Day! </span>
                  <span>Take a closer look at your subscriptions.</span>
                  <span>Review your spending habits.</span>
                </div>
              </div>
              <div className="tools">
                <div className="label"></div>
                <button type="button" className="btn full">
                  Simulate
                </button>
              </div>
            </div>
            <div className="transactions">
              <div className="grid-header">
                <span>Transaction</span>
                <span>From</span>
                <span>Date</span>
                <span>Amount</span>
              </div>
              <div className="grid-content">
                <div className="grid-item">
                  <span className="type">Deposit</span>
                  <span className="account">Revolut</span>
                  <span className="date">10/06/2026 21:09</span>
                  <span className="amount">€5,000.00</span>
                </div>
                <div className="grid-item">
                  <span className="type">Deposit</span>
                  <span className="account">Bank of Ireland</span>
                  <span className="date">10/05/2026 18:30</span>
                  <span className="amount">€4,500.00</span>
                </div>
                <div className="grid-item">
                  <span className="type">Deposit</span>
                  <span className="account">Bank of Ireland</span>
                  <span className="date">10/04/2026 19:00</span>
                  <span className="amount">€4,000.00</span>
                </div>
                <div className="grid-item">
                  <span className="type">Deposit</span>
                  <span className="account">Revolut</span>
                  <span className="date">10/03/2026 10:30</span>
                  <span className="amount">€3,250.00</span>
                </div>
                <div className="grid-item">
                  <span className="type">Deposit</span>
                  <span className="account">Revolut</span>
                  <span className="date">10/02/2026 13:00</span>
                  <span className="amount">€5,250.00</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Vaults;
