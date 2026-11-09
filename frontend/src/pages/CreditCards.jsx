import PageHeader from "../components/PageHeader";
import BalanceHistory from "../components/charts/BalanceHistory";
import { VisaLogo, MastercardLogo, AmexLogo } from "../assets/Logos";

function CreditCards({ user }) {
  return (
    <>
      <PageHeader title="Credit Cards" showVisibilityButton={true} />
      <div className="page-container min-height no-border credit-cards">
        <div className="my-cards card frosted-glass">
          <div className="card-header">
            <h3 className="card-title">My Cards</h3>
            <div className="card-actions">
              <button className="btn no-border sm link symbol">
                <span className="material-symbols-outlined">add</span>
                <span>Add</span>
              </button>
            </div>
          </div>
          <div className="card-content">
            <div className="cc-item active">
              <div className="card-title">Revolut Credit Card</div>
              <div className="card-company">
                <VisaLogo />
              </div>
              <div className="balance"></div>
              <div className="card-last-four-digits">**** **** **** 3456</div>
              <div className="card-expiry">07/30</div>
            </div>
            <div className="cc-item">
              <div className="card-title">Itaú Platinum</div>
              <div className="card-company">
                <MastercardLogo />
              </div>
              <div className="balance"></div>
              <div className="card-last-four-digits">**** **** **** 4810</div>
              <div className="card-expiry">09/30</div>
            </div>
            <div className="cc-item">
              <div className="card-title">American Express</div>
              <div className="card-company">
                <AmexLogo />
              </div>
              <div className="balance"></div>
              <div className="card-last-four-digits">**** **** **** 1001</div>
              <div className="card-expiry">03/25</div>
            </div>
          </div>
        </div>
        <div className="card-details card frosted-glass">
          <div className="card-header">
            <button type="button" className="btn">
              <span className="material-symbols-outlined">add</span>
              <span className="label">New Transaction</span>
            </button>
            <button type="button" className="btn">
              <span className="material-symbols-outlined">payments</span>
              <span className="label">Make a Payment</span>
            </button>
          </div>
          <div className="card-content">
            <div className="card-number">
              <span className="label">Card Number</span>
              <span className="value">1234 5678 9012 3456</span>
            </div>
            <div className="card-expiry">
              <span className="label">Expiry Date</span>
              <span className="value">07/30</span>
            </div>
            <div className="card-cvv">
              <span className="label">CVV</span>
              <span className="value">123</span>
            </div>
            <div className="payment-day">
              <span className="label">Payment Day</span>
              <span className="value">28</span>
            </div>
          </div>
        </div>
        <div className="spending-limits card frosted-glass">
          <div className="card-header">
            <h3 className="card-title">Spending Limits</h3>
            <div className="card-actions"></div>
          </div>
          <div className="card-content">
            <div className="progress-bar">
              <progress
                className="lg"
                value="2345"
                max="5500"
                style={{ "--value": 2345, "--max": 5500 }}
              ></progress>
            </div>
            <div className="progress-label">
              <span className="current">€2,345</span>
              <span className="target"> / €5,500</span>
            </div>
            <div className="progress-percentage">43%</div>
          </div>
        </div>
        <div className="cashflow card frosted-glass">
          <div className="card-header">
            <h3 className="card-title">Monthly Comparison</h3>
            <div className="card-actions">
              <select
                className="no-checkmark no-border"
                defaultValue="last-3-months"
              >
                <button className="select-button">
                  <div>
                    <selectedcontent></selectedcontent>
                  </div>
                </button>
                <div>
                  <option value="last-3-months">
                    <div className="custom-option">
                      <span className="option-text">Last 3 Months</span>
                    </div>
                  </option>
                  <option value="last-6-months">
                    <div className="custom-option">
                      <span className="option-text">Last 6 Months</span>
                    </div>
                  </option>
                  <option value="last-12-months">
                    <div className="custom-option">
                      <span className="option-text">Last 12 months</span>
                    </div>
                  </option>
                </div>
              </select>
            </div>
          </div>
          <div className="card-content chart">
            <BalanceHistory />
          </div>
        </div>
        <div className="transactions card frosted-glass">
          <div className="card-header">
            <h3 className="card-title">Transactions</h3>
            <div className="card-actions">
              <button className="btn outline sm square">
                <span className="material-symbols-outlined">instant_mix</span>
              </button>
            </div>
          </div>
          <div className="card-content scrollable">
            <div className="grid-header">
              <div className="content">
                <span>Merchant</span>
                <span>Date</span>
                <span>Amount</span>
                <span>Installment</span>
                <span>Note</span>
              </div>
            </div>
            <div className="grid-content">
              <div className="grid-item">
                <div className="transaction-label">
                  <span className="transaction-name">Bonobo Pub</span>
                  <span className="transaction-category">Food & Drink</span>
                </div>
                <span className="transaction-date">10/06/2026 21:09</span>
                <span className="transaction-amount">€43.99</span>
                <span className="transaction-installment">1/4</span>
                <span className="transaction-note">Bonobo Pub</span>
              </div>
              <div className="grid-item">
                <div className="transaction-label">
                  <span className="transaction-name">Starbucks</span>
                  <span className="transaction-category">Food & Drink</span>
                </div>
                <span className="transaction-date">10/06/2026 21:09</span>
                <span className="transaction-amount">€43.99</span>
                <span className="transaction-installment">1/4</span>
                <span className="transaction-note">Bonobo Pub</span>
              </div>
              <div className="grid-item">
                <div className="transaction-label">
                  <span className="transaction-name">Amazon</span>
                  <span className="transaction-category">Shopping</span>
                </div>
                <span className="transaction-date">09/06/2026 09:56</span>
                <span className="transaction-amount">€83.99</span>
                <span className="transaction-installment">1/4</span>
                <span className="transaction-note"></span>
              </div>
              <div className="grid-item">
                <div className="transaction-label">
                  <span className="transaction-name">Jobseeker's Benefit</span>
                  <span className="transaction-category">Welfare</span>
                </div>
                <span className="transaction-date">08/06/2026 13:32</span>
                <span className="transaction-amount">€423.42</span>
                <span className="transaction-installment">1/4</span>
                <span className="transaction-note"></span>
              </div>
              <div className="grid-item">
                <div className="transaction-label">
                  <span className="transaction-name">Rent</span>
                  <span className="transaction-category">Bills</span>
                </div>
                <span className="transaction-date">01/06/2026 09:12</span>
                <span className="transaction-amount">€750.00</span>
                <span className="transaction-installment">1/4</span>
                <span className="transaction-note"></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default CreditCards;
