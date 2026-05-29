function Dashboard({ user }) {
  return (
    <>
      <h2 className="page-title">Dashboard</h2>
      <div className="dashboard-container">
        <div className="top half-section">
          <section className="secondary">
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Balance</h3>
                <div className="card-actions"></div>
              </div>
              <div className="card-content">
                <div className="balance-summary">
                  <h1 className="amount">€31,115.00</h1>
                  <span className="material-symbols-outlined">
                    visibility_off
                  </span>
                </div>
              </div>
            </div>
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Credit Cards</h3>
                <div className="card-actions"></div>
              </div>
              <div className="card-content"></div>
            </div>
          </section>
          <section className="main">
            <div className="card card-sm">
              <div className="income-expense-grid">
                <div className="totals justify-left">
                  <div className="label-group">
                    <span className="material-symbols-outlined">paid</span>
                    <span className="label">Income</span>
                  </div>
                  <span className="amount">€450.00</span>
                </div>
                <div className="statistics justify-right">
                  <div className="growth">
                    <span className="material-symbols-outlined">
                      arrow_warm_up
                    </span>
                    <span className="growth-amount positive">5.7%</span>
                  </div>
                  <span className="absolute">
                    <b>+ €42.00</b> than last week
                  </span>
                </div>
              </div>
            </div>
            <div className="card card-sm">
              <div className="income-expense-grid">
                <div className="totals justify-left">
                  <div className="label-group">
                    <span className="material-symbols-outlined">paid</span>
                    <span className="label">Expense</span>
                  </div>
                  <span className="amount">€335.00</span>
                </div>
                <div className="statistics justify-right">
                  <div className="growth">
                    <span className="material-symbols-outlined">
                      arrow_cool_down
                    </span>
                    <span className="growth-amount negative">10.2%</span>
                  </div>
                  <span className="absolute">
                    <b>- €30.20</b> than last week
                  </span>
                </div>
              </div>
            </div>
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Cashflow</h3>
                <div className="card-actions"></div>
              </div>
              <div className="card-content"></div>
            </div>
          </section>
          <section className="secondary">
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Expense Breakdown</h3>
                <div className="card-actions"></div>
              </div>
              <div className="card-content"></div>
            </div>
          </section>
        </div>
        <div className="bottom half-section">
          <section className="secondary">
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Vaults</h3>
                <div className="card-actions"></div>
              </div>
              <div className="card-content"></div>
            </div>
          </section>
          <section className="secondary">
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Recent Transactions</h3>
                <div className="card-actions"></div>
              </div>
              <div className="card-content"></div>
            </div>
          </section>
          <section className="secondary">
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Investments</h3>
                <div className="card-actions"></div>
              </div>
              <div className="card-content"></div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
