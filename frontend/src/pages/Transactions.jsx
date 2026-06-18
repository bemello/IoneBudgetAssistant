import CustomDatePicker from "../components/CustomDatePicker";

function Transactions({ user }) {
  return (
    <>
      <div className="page-header">
        <h2 className="page-title">Transactions</h2>
      </div>
      <div className="page-container transactions">
        <div className="actions">
          <div className="name-cat-acc-type-filter">
            <input type="search" placeholder="Search..."></input>
            <select className="no-checkmark no-border" defaultValue="all">
              <button className="select-button">
                <div>
                  <selectedcontent></selectedcontent>
                </div>
              </button>
              <div>
                <option value="all">
                  <div className="custom-option">
                    <span className="option-text">All Categories</span>
                  </div>
                </option>
                <option value="groceries">
                  <div className="custom-option">
                    <span className="option-text">Groceries</span>
                  </div>
                </option>
                <option value="food-drink">
                  <div className="custom-option">
                    <span className="option-text">Food & Drink</span>
                  </div>
                </option>
                <option value="subscriptions">
                  <div className="custom-option">
                    <span className="option-text">Subscriptions</span>
                  </div>
                </option>
                <option value="shopping">
                  <div className="custom-option">
                    <span className="option-text">Shopping</span>
                  </div>
                </option>
                <option value="bills">
                  <div className="custom-option">
                    <span className="option-text">Bills</span>
                  </div>
                </option>
              </div>
            </select>
            <select className="no-checkmark no-border" defaultValue="all">
              <button className="select-button">
                <div>
                  <selectedcontent></selectedcontent>
                </div>
              </button>
              <div>
                <option value="all">
                  <div className="custom-option">
                    <span className="option-text">All Accounts</span>
                  </div>
                </option>
                <option value="revolut">
                  <div className="custom-option">
                    <span className="option-text">Revolut</span>
                  </div>
                </option>
                <option value="aib">
                  <div className="custom-option">
                    <span className="option-text">AIB</span>
                  </div>
                </option>
                <option value="credit-card">
                  <div className="custom-option">
                    <span className="option-text">Credit Card</span>
                  </div>
                </option>
              </div>
            </select>
            <select className="no-checkmark no-border" defaultValue="all">
              <button className="select-button">
                <div>
                  <selectedcontent></selectedcontent>
                </div>
              </button>
              <div>
                <option value="all">
                  <div className="custom-option">
                    <span className="option-text">Income & Expenses</span>
                  </div>
                </option>
                <option value="income">
                  <div className="custom-option">
                    <span className="option-text">Income</span>
                  </div>
                </option>
                <option value="expenses">
                  <div className="custom-option">
                    <span className="option-text">Expenses</span>
                  </div>
                </option>
              </div>
            </select>
          </div>
          <div className="date-filter">
            <CustomDatePicker label="From" />
            <CustomDatePicker label="To" />
          </div>
        </div>
        <div className="grid-container">
          <div className="grid-header">
            <div>
              <input type="checkbox"></input>
            </div>
            <span>Transaction</span>
            <span>Account</span>
            <span>Date</span>
            <span>Amount</span>
            <span>Type</span>
            <span>Notes</span>
          </div>
          <div className="grid-content">
            <div className="grid-item">
              <div>
                <input type="checkbox"></input>
              </div>
              <div className="transaction-label">
                <span className="transaction-name">Bonobo Pub</span>
                <span className="transaction-category">Food & Drink</span>
              </div>
              <span className="transaction-account">Revolut</span>
              <span className="transaction-date">10/06/2026 21:09</span>
              <span className="transaction-amount">€43.99</span>
              <span className="transaction-type expense">Expense</span>
              <span className="transaction-notes">3 pints and a burger</span>
            </div>
            <div className="grid-item">
              <div>
                <input type="checkbox"></input>
              </div>
              <div className="transaction-label">
                <span className="transaction-name">Starbucks</span>
                <span className="transaction-category">Food & Drink</span>
              </div>
              <span className="transaction-account">Revolut</span>
              <span className="transaction-date">09/06/2026 17:34</span>
              <span className="transaction-amount">€4.89</span>
              <span className="transaction-type expense">Expense</span>
              <span className="transaction-notes">Flat white</span>
            </div>
            <div className="grid-item">
              <div>
                <input type="checkbox"></input>
              </div>
              <div className="transaction-label">
                <span className="transaction-name">Amazon</span>
                <span className="transaction-category">Shopping</span>
              </div>
              <span className="transaction-account">Revolut</span>
              <span className="transaction-date">09/06/2026 09:56</span>
              <span className="transaction-amount">€83.99</span>
              <span className="transaction-type expense">Expense</span>
              <span className="transaction-notes">Keyboard</span>
            </div>
            <div className="grid-item">
              <div>
                <input type="checkbox"></input>
              </div>
              <div className="transaction-label">
                <span className="transaction-name">Jobseeker's Benefit</span>
                <span className="transaction-category">Welfare</span>
              </div>
              <span className="transaction-account">Revolut</span>
              <span className="transaction-date">08/06/2026 13:32</span>
              <span className="transaction-amount">€423.42</span>
              <span className="transaction-type income">Income</span>
              <span className="transaction-notes"></span>
            </div>
            <div className="grid-item">
              <div>
                <input type="checkbox"></input>
              </div>
              <div className="transaction-label">
                <span className="transaction-name">Rent</span>
                <span className="transaction-category">Bills</span>
              </div>
              <span className="transaction-account">Revolut</span>
              <span className="transaction-date">01/06/2026 09:12</span>
              <span className="transaction-amount">€750.00</span>
              <span className="transaction-type expense">Expense</span>
              <span className="transaction-notes"></span>
            </div>
            <div className="grid-item">
              <div>
                <input type="checkbox"></input>
              </div>
              <div className="transaction-label">
                <span className="transaction-name">Bonobo Pub</span>
                <span className="transaction-category">Food & Drink</span>
              </div>
              <span className="transaction-account">Revolut</span>
              <span className="transaction-date">10/06/2026 21:09</span>
              <span className="transaction-amount">€43.99</span>
              <span className="transaction-type expense">Expense</span>
              <span className="transaction-notes">3 pints and a burger</span>
            </div>
            <div className="grid-item">
              <div>
                <input type="checkbox"></input>
              </div>
              <div className="transaction-label">
                <span className="transaction-name">Starbucks</span>
                <span className="transaction-category">Food & Drink</span>
              </div>
              <span className="transaction-account">Revolut</span>
              <span className="transaction-date">09/06/2026 17:34</span>
              <span className="transaction-amount">€4.89</span>
              <span className="transaction-type expense">Expense</span>
              <span className="transaction-notes">Flat white</span>
            </div>
            <div className="grid-item">
              <div>
                <input type="checkbox"></input>
              </div>
              <div className="transaction-label">
                <span className="transaction-name">Amazon</span>
                <span className="transaction-category">Shopping</span>
              </div>
              <span className="transaction-account">Revolut</span>
              <span className="transaction-date">09/06/2026 09:56</span>
              <span className="transaction-amount">€83.99</span>
              <span className="transaction-type expense">Expense</span>
              <span className="transaction-notes">Keyboard</span>
            </div>
            <div className="grid-item">
              <div>
                <input type="checkbox"></input>
              </div>
              <div className="transaction-label">
                <span className="transaction-name">Jobseeker's Benefit</span>
                <span className="transaction-category">Welfare</span>
              </div>
              <span className="transaction-account">Revolut</span>
              <span className="transaction-date">08/06/2026 13:32</span>
              <span className="transaction-amount">€423.42</span>
              <span className="transaction-type income">Income</span>
              <span className="transaction-notes"></span>
            </div>
            <div className="grid-item">
              <div>
                <input type="checkbox"></input>
              </div>
              <div className="transaction-label">
                <span className="transaction-name">Rent</span>
                <span className="transaction-category">Bills</span>
              </div>
              <span className="transaction-account">Revolut</span>
              <span className="transaction-date">01/06/2026 09:12</span>
              <span className="transaction-amount">€750.00</span>
              <span className="transaction-type expense">Expense</span>
              <span className="transaction-notes"></span>
            </div>
            <div className="grid-item">
              <div>
                <input type="checkbox"></input>
              </div>
              <div className="transaction-label">
                <span className="transaction-name">Bonobo Pub</span>
                <span className="transaction-category">Food & Drink</span>
              </div>
              <span className="transaction-account">Revolut</span>
              <span className="transaction-date">10/06/2026 21:09</span>
              <span className="transaction-amount">€43.99</span>
              <span className="transaction-type expense">Expense</span>
              <span className="transaction-notes">3 pints and a burger</span>
            </div>
            <div className="grid-item">
              <div>
                <input type="checkbox"></input>
              </div>
              <div className="transaction-label">
                <span className="transaction-name">Starbucks</span>
                <span className="transaction-category">Food & Drink</span>
              </div>
              <span className="transaction-account">Revolut</span>
              <span className="transaction-date">09/06/2026 17:34</span>
              <span className="transaction-amount">€4.89</span>
              <span className="transaction-type expense">Expense</span>
              <span className="transaction-notes">Flat white</span>
            </div>
            <div className="grid-item">
              <div>
                <input type="checkbox"></input>
              </div>
              <div className="transaction-label">
                <span className="transaction-name">Amazon</span>
                <span className="transaction-category">Shopping</span>
              </div>
              <span className="transaction-account">Revolut</span>
              <span className="transaction-date">09/06/2026 09:56</span>
              <span className="transaction-amount">€83.99</span>
              <span className="transaction-type expense">Expense</span>
              <span className="transaction-notes">Keyboard</span>
            </div>
            <div className="grid-item">
              <div>
                <input type="checkbox"></input>
              </div>
              <div className="transaction-label">
                <span className="transaction-name">Jobseeker's Benefit</span>
                <span className="transaction-category">Welfare</span>
              </div>
              <span className="transaction-account">Revolut</span>
              <span className="transaction-date">08/06/2026 13:32</span>
              <span className="transaction-amount">€423.42</span>
              <span className="transaction-type income">Income</span>
              <span className="transaction-notes"></span>
            </div>
            <div className="grid-item">
              <div>
                <input type="checkbox"></input>
              </div>
              <div className="transaction-label">
                <span className="transaction-name">Rent</span>
                <span className="transaction-category">Bills</span>
              </div>
              <span className="transaction-account">Revolut</span>
              <span className="transaction-date">01/06/2026 09:12</span>
              <span className="transaction-amount">€750.00</span>
              <span className="transaction-type expense">Expense</span>
              <span className="transaction-notes"></span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Transactions;
