import PageHeader from "../components/PageHeader";
import VaultBalanceGraph from "../components/charts/VaultBalanceGraph";
import { quotes } from "../utils/quotes";
import { useState, useEffect } from "react";

function Vaults({ user }) {
  const temp_quotes = quotes.slice(0);
  const [items, setItems] = useState(() => {
    let data = [
      {
        id: 1,
        icon: "house",
        name: "Sweet Home",
        amount: 22000.0,
        target: 40000.0,
        progress: 55,
        status: "In Progress",
      },
      {
        id: 2,
        icon: "travel",
        name: "Holidays",
        amount: 1250.0,
        target: 5000.0,
        progress: 25,
        status: "In Progress",
      },
      {
        id: 3,
        icon: "directions_car",
        name: "New Car",
        amount: 0,
        target: 35000.0,
        progress: 0,
        status: "Not Started",
      },
      {
        id: 4,
        icon: "elderly",
        name: "Retirement",
        amount: 0,
        target: 200000.0,
        progress: 0,
        status: "Not Started",
      },
      {
        id: 5,
        icon: "siren",
        name: "Emergency Fund",
        amount: 0,
        target: 15000.0,
        progress: 0,
        status: "Not Started",
      },
    ];
    return data;
  });

  function getRandomQuotes() {
    const maxQuotes = 4;
    const randomQuotes = [];
    for (let i = 0; i < maxQuotes - items.length; i++) {
      randomQuotes.push(
        temp_quotes.splice(
          [Math.floor(Math.random() * temp_quotes.length)],
          1,
        )[0],
      );
    }

    return randomQuotes;
  }

  return (
    <>
      <PageHeader title="Vaults" showVisibilityButton={true} />
      <div className="page-container no-border min-height vaults">
        <div className="vaults-totals">
          <div className="total-savings frosted-glass">
            <div className="total-label">Total Saved</div>
            <div className="total-amount">€23,250.00</div>
            <div className="icon">
              <span className="material-symbols-outlined">money_bag</span>
            </div>
          </div>
          <div className="total-target frosted-glass">
            <div className="total-label">Total Target</div>
            <div className="total-amount">€45,000.00</div>
            <div className="icon">
              <span className="material-symbols-outlined">target</span>
            </div>
          </div>
          <div className="total-progress frosted-glass">
            <div className="total-label">Total Progress</div>
            <div className="total-amount">78%</div>
            <div className="icon">
              <span className="material-symbols-outlined">speed</span>
            </div>
          </div>
          <div className="total-plans frosted-glass">
            <div className="total-label">Total Vaults</div>
            <div className="total-amount">2</div>
            <div className="icon">
              <span className="material-symbols-outlined">savings</span>
            </div>
          </div>
        </div>
        <div className="divider"></div>
        <div className="vaults-info">
          <div className="my-vaults card frosted-glass">
            <div className="card-header">
              <h3 className="card-title">My Vaults</h3>
            </div>
            <div className="card-content">
              <div className="vault-list-container scrollable">
                <div className="vault-list">
                  {items.map((item, index) => (
                    <div
                      key={index}
                      className={`item ${item.id === 1 ? "active" : ""}`}
                    >
                      <div className="icon">
                        <span className="material-symbols-outlined">
                          {item.icon}
                        </span>
                      </div>
                      <div className="vault-name">{item.name}</div>
                      <div className="vault-progress">{item.progress}%</div>
                      <div className="vault-amount">
                        <span className="current">€{item.amount}</span> /{" "}
                        <span className="target">€{item.target}</span>
                      </div>
                      <div className="vault-status">{item.status}</div>
                      <div className="vault-progress-bar">
                        <progress
                          className="vault-progress-bar"
                          style={{
                            "--value": item.amount,
                            "--max": item.target,
                          }}
                          value={item.amount}
                          max={item.target}
                        />
                      </div>
                    </div>
                  ))}
                  {getRandomQuotes().map((quote, index) => (
                    <>
                      <div className="item empty" key={index}>
                        <div className="quote">
                          <span className="message">{`"${quote.message}"`}</span>
                          <span className="author">{`- ${quote.author}`}</span>
                        </div>
                      </div>
                    </>
                  ))}
                </div>
              </div>
              <div className="action-container">
                <button className="btn outline symbol full">
                  <span className="material-symbols-outlined">add</span>
                  <span className="label">Create New Vault</span>
                </button>
              </div>
            </div>
          </div>
          <div className="vault-details card" data-vault-id="1">
            <div className="info card frosted-glass">
              <div className="header">
                <div className="icon">
                  <span className="material-symbols-outlined">house</span>
                </div>
                <div className="name">Sweet Home</div>
              </div>
              <div className="progress">
                <div className="amount">
                  <span className="current">€22,000</span>
                  <span className="slash">/</span>
                  <span className="target">€40,000</span>
                </div>
                <div className="progress-bar">
                  <progress
                    className="lg"
                    value="22000"
                    max="40000"
                    style={{ "--value": 22000, "--max": 40000 }}
                  />
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
                <div className="highest-contribution">
                  <div className="label">Highest:</div>
                  <div className="count">€5,250.00</div>
                </div>
                <div className="lowest-contribution">
                  <div className="label">Lowest:</div>
                  <div className="count">€3,250.00</div>
                </div>
              </div>
            </div>
            <div className="analytics card chart frosted-glass">
              <div className="card-header">
                <h3 className="card-title">Balance</h3>
                <div className="card-actions">
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
              </div>
              <div className="graph">
                <VaultBalanceGraph />
              </div>
            </div>
            <div className="transactions card frosted-glass">
              <div className="card-header">
                <h3 className="card-title">Transactions</h3>
                <div className="card-actions"></div>
              </div>
              <div className="card-content scrollable">
                <div className="grid-header">
                  <div className="content">
                    <span>Type</span>
                    <span>Account</span>
                    <span>Date</span>
                    <span>Amount</span>
                    <span>Note</span>
                  </div>
                </div>
                <div className="grid-content">
                  <div className="grid-item">
                    <span className="type">Deposit</span>
                    <span className="account">Revolut</span>
                    <span className="date">10/06/2026 21:09</span>
                    <span className="amount">€5,000.00</span>
                    <span className="note">Bonus received</span>
                  </div>
                  <div className="grid-item">
                    <span className="type">Deposit</span>
                    <span className="account">Bank of Ireland</span>
                    <span className="date">10/05/2026 18:30</span>
                    <span className="amount">€4,500.00</span>
                    <span className="note">Monthly contribution</span>
                  </div>
                  <div className="grid-item">
                    <span className="type">Deposit</span>
                    <span className="account">Bank of Ireland</span>
                    <span className="date">10/04/2026 19:00</span>
                    <span className="amount">€4,000.00</span>
                    <span className="note">Monthly contribution</span>
                  </div>
                  <div className="grid-item">
                    <span className="type">Deposit</span>
                    <span className="account">Revolut</span>
                    <span className="date">10/03/2026 10:30</span>
                    <span className="amount">€3,250.00</span>
                    <span className="note">Bonus received</span>
                  </div>
                  <div className="grid-item">
                    <span className="type">Deposit</span>
                    <span className="account">Revolut</span>
                    <span className="date">10/02/2026 13:00</span>
                    <span className="amount">€5,250.00</span>
                    <span className="note">Initial contribution</span>
                  </div>
                  <div className="grid-item">
                    <span className="type">Deposit</span>
                    <span className="account">Bank of Ireland</span>
                    <span className="date">10/04/2026 19:00</span>
                    <span className="amount">€4,000.00</span>
                    <span className="note">Monthly contribution</span>
                  </div>
                  <div className="grid-item">
                    <span className="type">Deposit</span>
                    <span className="account">Revolut</span>
                    <span className="date">10/03/2026 10:30</span>
                    <span className="amount">€3,250.00</span>
                    <span className="note">Bonus received</span>
                  </div>
                  <div className="grid-item">
                    <span className="type">Deposit</span>
                    <span className="account">Revolut</span>
                    <span className="date">10/02/2026 13:00</span>
                    <span className="amount">€5,250.00</span>
                    <span className="note">Initial contribution</span>
                  </div>
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
