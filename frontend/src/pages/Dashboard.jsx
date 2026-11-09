import { useState, useEffect } from "react";
import dayjs from "dayjs";
import {DateTime} from "luxon";

import api from "../utils/api.js";

import PageHeader from "../components/PageHeader";
import CashFlowChart from "../components/charts/CashFlow";
import RoundButtonSVG from "../components/buttons/RoundButtonSVG";
import AddTransactionButton from "../components/buttons/AddTransactionButton";
import { VisaLogo, MastercardLogo, AmexLogo } from "../assets/Logos";
import CustomSelect from "../components/CustomSelect.jsx";

export default function Dashboard({ user }) {
  const [refreshComponent, setRefreshComponent] = useState(false);

  return (
    <>
      <PageHeader title="Dashboard" showVisibilityButton={true}>
        <AddTransactionButton
          user={user}
          setRefreshComponent={setRefreshComponent}
        />
      </PageHeader>
      <div className="page-container min-height no-border dashboard">
        <BalanceStats refreshComponent={refreshComponent} />
        <CreditCards refreshComponent={refreshComponent} />
        <CashFlow refreshComponent={refreshComponent} />
        <Budgets refreshComponent={refreshComponent} />
        <Vaults refreshComponent={refreshComponent} />
        <RecentTransactions refreshComponent={refreshComponent} />
        <Investments refreshComponent={refreshComponent} />
      </div>
    </>
  );
}

function BalanceStats({ refreshComponent }) {
  const [balance, setBalance] = useState([]);
  const [income, setIncome] = useState([]);
  const [expense, setExpense] = useState([]);
  const [previousMonthIncome, setPreviousMonthIncome] = useState([]);
  const [previousMonthExpense, setPreviousMonthExpense] = useState([]);

  function notZero(n) {
    if (n === 0) return 1;
    return n;
  }

  const getAccountsBalance = () => {
    api.get("/api/accounts/stats").then((response) => {
      setBalance(response.data.total_balance);
      setIncome(response.data.current_month_income);
      setExpense(response.data.current_month_expense);
      setPreviousMonthIncome(response.data.previous_month_income);
      setPreviousMonthExpense(response.data.previous_month_expense);
    });
  };

  let incomeGrowthPerc =
    (income - previousMonthIncome) / notZero(previousMonthIncome);
  let expenseGrowthPerc =
    (expense - previousMonthExpense) / notZero(previousMonthExpense);
  let incomeDiff = income - previousMonthIncome;
  let expenseDiff = expense - previousMonthExpense;
  const icon = { 0: "", 1: "arrow_warm_up", "-1": "arrow_cool_down" };

  let incomeGrowth = {
    percentage: isNaN(incomeGrowthPerc) ? 0 : incomeGrowthPerc,
    absolute: incomeDiff,
    icon: icon[Math.sign(incomeDiff)],
  };
  let expenseGrowth = {
    percentage: isNaN(expenseGrowthPerc) ? 0 : expenseGrowthPerc,
    absolute: expenseDiff,
    icon: icon[Math.sign(expenseDiff)],
  };

  useEffect(() => {
    getAccountsBalance();
  }, [refreshComponent]);

  return (
    <>
      <div className="card balance frosted-glass">
        <div className="card-header">
          <h3 className="card-title">Balance</h3>
          <div className="card-actions"></div>
        </div>
        <div className="card-content">
          <div className="balance-summary">
            <h1 className="amount">
              {new Intl.NumberFormat("en-GB", {
                style: "currency",
                currency: "EUR",
              }).format(balance)}
            </h1>
          </div>
        </div>
      </div>
      <div className="card card-sm income frosted-glass">
        <div className="income-expense-grid">
          <div className="label">
            <span className="material-symbols-outlined">paid</span>
            <h3>Income</h3>
          </div>
          <div className="growth">
            <span className="material-symbols-outlined">
              {incomeGrowth.icon}
            </span>
            <span className={`growth-amount ${incomeGrowth.icon}`}>
              {incomeGrowth.percentage === 0
                ? "--"
                : new Intl.NumberFormat("pt-BR", {
                    style: "percent",
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 2,
                  }).format(incomeGrowth.percentage)}
            </span>
          </div>
          <span className="amount">
            {income === 0
              ? "--"
              : new Intl.NumberFormat("en-GB", {
                  style: "currency",
                  currency: "EUR",
                }).format(income)}
          </span>
          <span className="stat">
            {incomeGrowth.absolute === 0
              ? ""
              : new Intl.NumberFormat("en-GB", {
                  signDisplay: "exceptZero",
                  style: "currency",
                  currency: "EUR",
                }).format(incomeGrowth.absolute) + " than last month"}
          </span>
        </div>
      </div>
      <div className="card card-sm expense frosted-glass">
        <div className="income-expense-grid">
          <div className="label">
            <span className="material-symbols-outlined">paid</span>
            <h3>Expense</h3>
          </div>
          <div className="growth">
            <span className="material-symbols-outlined">
              {expenseGrowth.icon}
            </span>
            <span className={`growth-amount ${expenseGrowth.icon}`}>
              {expenseGrowth.percentage === 0
                ? "--"
                : new Intl.NumberFormat("pt-BR", {
                    style: "percent",
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 2,
                  }).format(expenseGrowth.percentage)}
            </span>
          </div>
          <span className="amount">
            {expense === 0
              ? "--"
              : new Intl.NumberFormat("en-GB", {
                  style: "currency",
                  currency: "EUR",
                }).format(expense)}
          </span>
          <span className="stat">
            {expenseGrowth.absolute === 0
              ? ""
              : new Intl.NumberFormat("en-GB", {
                  signDisplay: "exceptZero",
                  style: "currency",
                  currency: "EUR",
                }).format(expenseGrowth.absolute) + " than last month"}
          </span>
        </div>
      </div>
    </>
  );
}

function CreditCards() {
  return (
    <div className="card credit-cards frosted-glass">
      <div className="card-header">
        <h3 className="card-title">Credit Cards</h3>
        <div className="card-actions">
          <button type="button" className="btn sm link">
            <span className="material-symbols-outlined">more_vert</span>
          </button>
        </div>
      </div>
      <div className="card-content">
        <div className="carousel">
          <div className="cc-item">
            <div className="card-title">Revolut Credit Card</div>
            <div className="card-company">
              <VisaLogo />
            </div>
            <div className="balance">
              <span className="label">Available:</span>
              <span className="value">€1,415.00</span>
            </div>
            <div className="card-last-four-digits">**** **** **** 4810</div>
            <div className="card-expiry">09/30</div>
          </div>
          <div className="cc-item">
            <div className="card-title">Itaú Platinum</div>
            <div className="card-company">
              <MastercardLogo />
            </div>
            <div className="balance">
              <span className="label">Available:</span>
              <span className="value">€1,415.00</span>
            </div>
            <div className="card-last-four-digits">**** **** **** 4810</div>
            <div className="card-expiry">09/30</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CashFlow() {
  const [dataset, setDataset] = useState(null)
  const [period, setPeriod] = useState(7)

  useEffect(() => {
      let isFirstRender = true;

        function getBalanceHistory() {
          api
            .get("/api/accounts/balance-history/", {
              params: {
                date_range_start: dayjs().subtract(period, "day").format("YYYY-MM-DD"),
                date_range_end: dayjs().format("YYYY-MM-DD"),
              },
            })
            .then((res) => {
              if (isFirstRender) {
                const data = []
                res.data.forEach((element) => {
                  const date = new Intl.DateTimeFormat(
                            "en-GB", {
                              day: "numeric",
                              month: "short",
                              year: "2-digit"
                      }).format(new Date(element.date));
                  data.push(
                      {
                        "date": date,
                        "balance": element.balance,
                      }
                  );
                });
                setDataset(data);
              }
          });
        }

        getBalanceHistory();

        return () => {
            isFirstRender = false;
        }
    }, [period]);

  return (
    <div className="card cashflow frosted-glass">
      <div className="card-header">
        <h3 className="card-title">Cash Flow</h3>
        <div className="card-actions">
          <CustomSelect value={period}
              onChange={(event) => setPeriod(parseInt(event.target.value))}
              id="period"
              name="period"
          >
            <option value="7">
                <div className="custom-option">
                  <span className="option-text">Last 7 days</span>
                </div>
              </option>
              <option value="14">
                <div className="custom-option">
                  <span className="option-text">Last 14 days</span>
                </div>
              </option>
              <option value="30">
                <div className="custom-option">
                  <span className="option-text">Last 30 days</span>
                </div>
              </option>
          </CustomSelect>
        </div>
      </div>
      <div className="card-content chart">
        <CashFlowChart dataset={dataset}/>
      </div>
    </div>
  );
}

function Budgets({ refreshComponent }) {
  const [categories, setCategories] = useState([]);

  const getCategories = async () => {
    await api
      .get("/api/transaction/categories/stats", {
        params: { only_expenses: true },
      })
      .then((response) => {
        setCategories(response.data.category);
      });
  };

  const emptyRows = () => {
    const rows = [];
    for (let i = 0; i < 5 - categories.length; i++) {
      rows.push(
        <div className="category-item" key={i}>
          <div className="create-budget">
            <RoundButtonSVG width="48" height="48" />
          </div>
        </div>,
      );
    }
    return rows;
  };

  useEffect(() => {
    getCategories();
  }, [refreshComponent]);

  return (
    <div className="card budget-breakdown frosted-glass">
      <div className="card-header">
        <h3 className="card-title">Categories</h3>
        <div className="card-actions"></div>
      </div>
      <div className="card-content">
        <div className="category-container scrollable">
          {categories?.map((category) => (
            <div key={category.name} className="category-item">
              <div className="category-content">
                <div className="category-header">
                  <div className="category-label-group">
                    <span className="material-symbols-outlined">
                      {category.icon}
                    </span>
                    <span className="category-label">{category.name}</span>
                  </div>
                  <span className="category-amount">
                    €{category.total_expenses}
                  </span>
                </div>
                {category.budgets?.length > 0 ? (
                  <progress
                    className="category-progress-bar xs"
                    value={category.total_expenses * 100}
                    max={category.budgets[0].budget * 100}
                    style={{
                      "--value": category.total_expenses * 100,
                      "--max": category.budgets[0].budget * 100,
                    }}
                  />
                ) : (
                  <div className="no-budget">
                    No budget set for this category
                  </div>
                )}
              </div>
            </div>
          ))}
          {emptyRows()}
        </div>
      </div>
    </div>
  );
}

function Vaults({ refreshComponent }) {
  const [vaults, setVaults] = useState([]);
  const [total_contributed, setTotalContributed] = useState(0);

  const getVaults = async () => {
    await api.get("/api/savings/vaults/stats").then((response) => {
      setVaults(response.data.vaults);
      setTotalContributed(response.data.total_contributed);
    });
  };

  const emptyRows = () => {
    const rows = [];
    for (let i = 0; i < 3 - vaults.length; i++) {
      rows.push(
        <div className="vault-item" key={i}>
          <div className="create-vault">
            <RoundButtonSVG width="48" height="48" />
          </div>
        </div>,
      );
    }
    return rows;
  };

  useEffect(() => {
    getVaults();
  }, [refreshComponent]);

  return (
    <div className="card vaults frosted-glass">
      <div className="card-header">
        <h3 className="card-title">Vaults</h3>
        <div className="card-actions">
          <button type="button" className="btn sm link">
            <span className="material-symbols-outlined">more_vert</span>
          </button>
        </div>
      </div>
      <div className="card-content">
        <div className="vault-summary">
          <div className="label">Total Saved</div>
          <div className="amount">
            {new Intl.NumberFormat("en-GB", {
              style: "currency",
              currency: "EUR",
            }).format(total_contributed)}
          </div>
        </div>
        <div className="vault-list">
          {vaults.map((vault) => (
            <div className="vault-item" key={vault.name}>
              <div className="vault-label">
                <span>{vault.name}</span>
              </div>
              <div className="vault-progress">
                <progress
                  className="vault-progress-bar xs"
                  value={vault.total_contributed}
                  max={vault.target_amount}
                  style={{
                    "--value": vault.total_contributed * 100,
                    "--max": vault.target_amount * 100,
                  }}
                />
                <div className="vault-progress-info">
                  <div className="amount-target">
                    <span className="amount">
                      {new Intl.NumberFormat("en-GB", {
                        style: "currency",
                        currency: "EUR",
                      }).format(vault.total_contributed)}
                    </span>
                    <span className="target">
                      /{" "}
                      {new Intl.NumberFormat("en-GB", {
                        style: "currency",
                        currency: "EUR",
                      }).format(vault.target_amount)}
                    </span>
                  </div>
                  <span className="percent">{vault.progress}%</span>
                </div>
              </div>
            </div>
          ))}
          {emptyRows()}
        </div>
      </div>
    </div>
  );
}

function RecentTransactions({ refreshComponent }) {
  const [transactions, setTransactions] = useState([]);

  const getTransactions = async () => {
    await api
      .get("/api/transaction/transactions/", {
        params: { limit: true },
      })
      .then((response) => {
        setTransactions(response.data);
      });
  };

  useEffect(() => {
    getTransactions();
  }, [refreshComponent]);

  return (
    <div className="card recent-transactions frosted-glass">
      <div className="card-header">
        <h3 className="card-title">Recent Transactions</h3>
        <div className="card-actions">
          <button className="btn link">
            <span className="material-symbols-outlined">instant_mix</span>
          </button>
        </div>
      </div>
      <div className="card-content">
        <div className="grid-header">
          <div className="content">
            <span>Description</span>
            <span>Amount</span>
            <span>Date</span>
            <span>Account</span>
            <span>Type</span>
          </div>
        </div>
        <div className="grid-content">
          {transactions.map((transaction) => (
            <div className="grid-item" key={transaction.id}>
              <div className="transaction-label">
                <span className="transaction-name">
                  {transaction.description}
                </span>
                <span className="transaction-category">
                  {transaction.category?.name}
                </span>
              </div>
              <span className="transaction-amount">
                {new Intl.NumberFormat("en-GB", {
                  style: "currency",
                  currency: "EUR",
                }).format(transaction.amount)}
              </span>
              <span className="transaction-date">
                {new Date(transaction.date).toLocaleString("en-GB", {
                  dateStyle: "short",
                  timeStyle: "short",
                })}
              </span>
              <span className="transaction-account">
                {transaction.account?.name}
              </span>
              <span className={`transaction-type ${transaction.type}`}>
                {transaction.type_display}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Investments() {
  return (
    <div className="card investments frosted-glass">
      <div className="card-header">
        <h3 className="card-title">Investments</h3>
        <div className="card-actions"></div>
      </div>
      <div className="card-content">
        <div className="investments-summary">
          <div className="label">Total Invested</div>
          <div className="amount">€15,000.00</div>
        </div>
        <div className="investments-list">
          <div className="investment-item">
            <div className="investment-label">
              <span>Stocks</span>
            </div>
            <div className="investment-ratio">
              <progress
                className="investment-ratio-bar xs"
                value="10000"
                max="15000"
                style={{ "--value": 10000, "--max": 15000 }}
              />
              <div className="investment-ratio-info">
                <span className="amount">€10,000.00</span>
                <span className="percent">67%</span>
              </div>
            </div>
          </div>
          <div className="investment-item">
            <div className="investment-label">
              <span>Crypto</span>
            </div>
            <div className="investment-ratio">
              <progress
                className="investment-ratio-bar xs"
                value="3000"
                max="15000"
                style={{ "--value": 3000, "--max": 15000 }}
              />
              <div className="investment-ratio-info">
                <span className="amount">€3,000.00</span>
                <span className="percent">20%</span>
              </div>
            </div>
          </div>
          <div className="investment-item">
            <div className="investment-label">
              <span>Real Estate</span>
            </div>
            <div className="investment-ratio">
              <progress
                className="investment-ratio-bar xs"
                value="0"
                max="0"
                style={{ "--value": 0, "--max": 0 }}
              />
              <div className="investment-ratio-info">
                <span className="amount">-</span>
                <span className="percent">0%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
