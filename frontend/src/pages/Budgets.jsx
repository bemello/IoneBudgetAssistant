import { useState, useEffect } from "react";
import dayjs from "dayjs";
import objectSupport from "dayjs/plugin/objectSupport";
import api from "../utils/api.js";
import CustomSelect from "../components/CustomSelect";
dayjs.extend(objectSupport);

import AddTransactionButton from "../components/buttons/AddTransactionButton";
import ButtonGlow from "../components/buttons/ButtonGlow";
import PageHeader from "../components/PageHeader";
import BudgetChart from "../components/charts/BudgetChart";
import BudgetForm from "../components/forms/BudgetForm";
import CategoryForm from "../components/forms/CategoryForm.jsx";

let monthYear;

export default function Budgets({ user }) {
  const [month, setMonth] = useState(new Date().getMonth());
  const [year, setYear] = useState(new Date().getFullYear());
  const [refreshComponent, setRefreshComponent] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  monthYear = month + "-" + year;

  const months = [
    { key: 0, label: "January" },
    { key: 1, label: "February" },
    { key: 2, label: "March" },
    { key: 3, label: "April" },
    { key: 4, label: "May" },
    { key: 5, label: "June" },
    { key: 6, label: "July" },
    { key: 7, label: "August" },
    { key: 8, label: "September" },
    { key: 9, label: "October" },
    { key: 10, label: "November" },
    { key: 11, label: "December" },
  ];

  const getYears = () => {
    const startingYear = user?.starting_date
      ? new Date(user.starting_date).getFullYear()
      : new Date().getFullYear();
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = startingYear; i <= currentYear; i++) {
      years.push(i);
    }
    return years;
  };

  return (
    <>
      <PageHeader title="Categories" showVisibilityButton={true}>
        <div className="date-period-filter">
          <CustomSelect
            value={month}
            onChange={(event) => setMonth(parseInt(event.target.value))}
            id="month"
            name="month"
          >
            {months.map((value) => (
              <option key={value.key} value={value.key}>
                <div className="custom-option">
                  <span className="option-text">{value.label}</span>
                </div>
              </option>
            ))}
          </CustomSelect>
          <CustomSelect
            value={year}
            onChange={(event) => setYear(event.target.value)}
            id="year"
            name="year"
          >
            {getYears().map((value) => (
              <option key={value} value={value}>
                <div className="custom-option">
                  <span className="option-text">{value}</span>
                </div>
              </option>
            ))}
          </CustomSelect>
        </div>
      </PageHeader>
      <div className="page-container min-height no-border budgets">
        <CategoryList
          month={month}
          year={year}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          refreshComponent={refreshComponent}
          setRefreshComponent={setRefreshComponent}
        />
        <BudgetDetails
          user={user}
          selectedCategory={selectedCategory}
          month={month}
          year={year}
          refreshComponent={refreshComponent}
          setRefreshComponent={setRefreshComponent}
        />
        <Transactions
          user={user}
          selectedCategory={selectedCategory}
          month={month}
          year={year}
          refreshComponent={refreshComponent}
          setRefreshComponent={setRefreshComponent}
        />
        <Chart
          selectedCategory={selectedCategory}
          month={month}
          year={year}
          refreshComponent={refreshComponent}
        />
      </div>
    </>
  );
}

function CategoryList({
  month,
  year,
  selectedCategory,
  setSelectedCategory,
  setRefreshComponent,
  refreshComponent,
}) {
  const [categories, setCategories] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isFirstRender, setIsFirstRender] = useState(true);

  useEffect(() => {
    getCategories();
  }, [monthYear]);

  useEffect(() => {
    getCategories();
  }, [refreshComponent]);

  const getCategories = async () => {
    const startDate = dayjs({ month: month, year: year });
    const endDate = dayjs({
      day: startDate.daysInMonth(),
      month: month,
      year: year,
    });

    await api
      .get("/api/transaction/categories/", {
        params: {
          only_expenses: true,
          start_date: startDate.toDate(),
          end_date: endDate.toDate(),
        },
      })
      .then((res) => {
        setCategories(res.data);
        if (isFirstRender) {
          setSelectedCategory(res.data[0]);
          setIsFirstRender(false);
        }
        if (selectedCategory != null) {
          const categoryId = selectedCategory.id;
          setSelectedCategory(null);
          setSelectedCategory(res.data.find((c) => c.id === categoryId));
        }
      });
  };

  const addCategory = () => {
    setIsEditing(false);
    document.getElementById("dialog-category").showModal();
  };

  const editCategory = () => {
    setIsEditing(true);
    document.getElementById("dialog-category").showModal();
  };

  const confirmDelete = (id) => {
    document.getElementById(`delete-confirmation-${id}`).classList.add("show");
  };

  const cancel = (id) => {
    document
      .getElementById(`delete-confirmation-${id}`)
      .classList.remove("show");
  };

  const deleteCategory = (category) => {
    api.delete(`/api/transaction/categories/${category.id}/`).then(() => {
      getCategories();
      setSelectedCategory(null);
    });
  };

  return (
    <div className="categories-grid card frosted-glass">
      <div className="card-header">
        <h3 className="card-title">My Categories</h3>
      </div>
      <dialog
        id="dialog-category"
        style={{ "--dialog-width": "50vw", "--dialog-max-width": "500px" }}
      >
        <div className="dialog-header">
          <h3 autoFocus>{isEditing ? "Edit Category" : "Create Category"}</h3>
        </div>
        <div className="dialog-content">
          <CategoryForm
            category={isEditing ? selectedCategory : null}
            setSelectedCategory={setSelectedCategory}
            setRefreshComponent={setRefreshComponent}
            isEditing={isEditing}
          />
        </div>
      </dialog>
      <div className="card-content">
        <div className="categories-list scrollable">
          {categories?.map((category) => (
            <div
              key={category.id}
              className={`category-item ${selectedCategory?.id === category.id ? "active" : ""}`}
              onClick={() => setSelectedCategory(category)}
            >
              <div className="label-wrapper">
                <span className="material-symbols-outlined">
                  {category.icon}
                </span>
                <span className="label">{category.name}</span>
              </div>
              {getBudgetAmount(category, month, year) > 0 ? (
                <div
                  className="progress-info"
                  style={{
                    "--percent": `${(getExpenses(category, month, year) / getBudgetAmount(category, month, year)) * 100}%`,
                  }}
                >
                  <div className="label">
                    <span className="spent">
                      {new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "EUR",
                      }).format(getExpenses(category, month, year))}
                    </span>
                    <span className="limit">
                      /{" "}
                      {new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "EUR",
                      }).format(getBudgetAmount(category, month, year))}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="progress-info no-budget">
                  <div className="label">
                    <span className="spent">
                      {new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "EUR",
                      }).format(getExpenses(category, month, year))}
                    </span>
                    <span className="limit">-</span>
                  </div>
                </div>
              )}
              <div className="action-buttons edit">
                <span
                  onClick={editCategory}
                  className="material-symbols-outlined"
                >
                  edit_square
                </span>
              </div>
              <div className="action-buttons delete">
                <span
                  onClick={() => confirmDelete(category.id)}
                  className="material-symbols-outlined"
                >
                  delete
                </span>
              </div>
              <div
                className="delete-confirmation"
                id={`delete-confirmation-${category.id}`}
              >
                <span>
                  Delete {category.name}? <br />
                  <span className="dimmed">
                    (This action cannot be undone.)
                  </span>
                </span>
                <div className="buttons">
                  <button
                    type="button"
                    onClick={() => cancel(category.id)}
                    className="btn sm outline symbol"
                  >
                    <span className="label">Cancel</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteCategory(category)}
                    className="btn sm delete"
                  >
                    <span className="label">Delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="action-container">
          <ButtonGlow
            label="Create Category"
            onClick={addCategory}
            className="symbol full"
            symbol="add"
          />
        </div>
      </div>
    </div>
  );
}

function BudgetDetails({
  user,
  selectedCategory,
  month,
  year,
  refreshComponent,
  setRefreshComponent,
}) {
  useEffect(() => {}, [selectedCategory]);
  useEffect(() => {}, [monthYear]);
  useEffect(() => {}, [refreshComponent]);

  return (
    <>
      <dialog
        id="dialog"
        style={{ "--dialog-width": "50vw", "--dialog-max-width": "400px" }}
      >
        <div className="dialog-header">
          <h3 autoFocus>
            {getBudgetAmount(selectedCategory, month, year) > 0
              ? "Change Budget"
              : "Set Budget"}
          </h3>
        </div>
        <div className="dialog-content">
          <BudgetForm
            user={user}
            category={selectedCategory}
            // month={month}
            // year={year}
            setRefreshComponent={setRefreshComponent}
          />
        </div>
      </dialog>
      <div className="budget-details card frosted-glass">
        {selectedCategory == null ? (
          <div className="empty">
            <p className="description">No Category Selected.</p>
          </div>
        ) : (
          <>
            <div className="card-header">
              <span className="material-symbols-outlined">
                {selectedCategory?.icon}
              </span>
              <h3 className="card-title">{selectedCategory?.name}</h3>
            </div>
            <div className="card-content">
              <div className="progress">
                <span className="spent">
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "EUR",
                  }).format(getExpenses(selectedCategory, month, year))}
                </span>
                {getBudgetAmount(selectedCategory, month, year) > 0 && (
                  <>
                    <span className="slash">/</span>
                    <span className="limit">
                      {new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "EUR",
                      }).format(getBudgetAmount(selectedCategory, month, year))}
                    </span>
                  </>
                )}
                <progress
                  className="xs"
                  value={getExpenses(selectedCategory, month, year) * 100}
                  max={getBudgetAmount(selectedCategory, month, year) * 100}
                  style={{
                    "--value": getExpenses(selectedCategory, month, year) * 100,
                    "--max":
                      getBudgetAmount(selectedCategory, month, year) * 100,
                  }}
                />
                {getBudgetAmount(selectedCategory, month, year) > 0 ? (
                  <span className="percentage">
                    {new Intl.NumberFormat("en-US", {
                      style: "percent",
                    }).format(
                      getExpenses(selectedCategory, month, year) /
                        getBudgetAmount(selectedCategory, month, year),
                    )}
                  </span>
                ) : (
                  <span className="percentage">--</span>
                )}
              </div>
              <ButtonGlow
                command="show-modal"
                commandfor="dialog"
                className="full"
                label={
                  getBudgetAmount(selectedCategory, month, year) > 0
                    ? "Change Budget"
                    : "Set Budget"
                }
              />
              <div className="info">
                <div className="item">
                  <span className="label">Budget Left:</span>
                  {getBudgetAmount(selectedCategory, month, year) > 0 ? (
                    <span className="value bold">
                      {new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "EUR",
                      }).format(
                        getBudgetAmount(selectedCategory, month, year) -
                          getExpenses(selectedCategory, month, year),
                      )}
                    </span>
                  ) : (
                    <span className="value">-</span>
                  )}
                </div>
                <div className="item">
                  <span className="label">Days Left:</span>
                  {getBudgetAmount(selectedCategory, month, year) > 0 ? (
                    <span className="value">
                      {new Date(
                        new Date().getFullYear(),
                        new Date().getMonth() + 1,
                        0,
                      ).getDate() - new Date().getDate()}
                    </span>
                  ) : (
                    <span className="value">-</span>
                  )}
                </div>
                <div className="item">
                  <span className="label">Transactions:</span>
                  <span className="value">
                    {getNumberOfTransactions(selectedCategory, month, year) > 0
                      ? getNumberOfTransactions(selectedCategory, month, year)
                      : "-"}
                  </span>
                </div>
                <div className="item indented">
                  <span className="label">Highest:</span>
                  <span className="value">
                    {getHighestTransaction(selectedCategory, month, year) !==
                      NaN &&
                    getHighestTransaction(selectedCategory, month, year) > 0
                      ? new Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: "EUR",
                        }).format(
                          getHighestTransaction(selectedCategory, month, year),
                        )
                      : "-"}
                  </span>
                </div>
                <div className="item indented">
                  <span className="label">Lowest:</span>
                  <span className="value">
                    {getLowestTransaction(selectedCategory, month, year) !==
                      NaN &&
                    getLowestTransaction(selectedCategory, month, year) > 0
                      ? new Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: "EUR",
                        }).format(
                          getLowestTransaction(selectedCategory, month, year),
                        )
                      : "-"}
                  </span>
                </div>
                <div className="item indented">
                  <span className="label">Average:</span>
                  <span className="value">
                    {getAverageTransaction(selectedCategory, month, year) !==
                      NaN &&
                    getAverageTransaction(selectedCategory, month, year) > 0
                      ? new Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: "EUR",
                        }).format(
                          getAverageTransaction(selectedCategory, month, year),
                        )
                      : "-"}
                  </span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}

function Transactions({
  user,
  selectedCategory,
  month,
  year,
  refreshComponent,
  setRefreshComponent,
}) {
  useEffect(() => {}, [selectedCategory]);
  useEffect(() => {}, [refreshComponent]);
  useEffect(() => {}, [monthYear]);

  return (
    <div className="budget-transactions card frosted-glass">
      {selectedCategory == null ? (
        <div className="empty">
          <p className="description">No Category Selected.</p>
        </div>
      ) : (
        <>
          <div className="card-header">
            <h3 className="card-title">Transactions</h3>
            <div className="cta-container">
              <AddTransactionButton
                user={user}
                selectedCategory={selectedCategory}
                setRefreshComponent={setRefreshComponent}
              />
            </div>
          </div>
          <div className="card-content scrollable">
            <div className="grid-header">
              <div className="content">
                <span>Description</span>
                <span>Amount</span>
                <span>Date</span>
                <span>Account</span>
                <span>Note</span>
              </div>
            </div>
            {selectedCategory?.transactions.length > 0 ? (
              <div className="grid-content">
                {selectedCategory?.transactions
                  .filter(
                    (transaction) =>
                      new Date(transaction.date).getMonth() === month &&
                      new Date(transaction.date).getFullYear() === year,
                  )
                  .map((transaction) => (
                    <div className="grid-item">
                      <span className="transaction-name">
                        {transaction.description}
                      </span>
                      <span className="transaction-amount">
                        {new Intl.NumberFormat("en-GB", {
                          style: "currency",
                          currency: "EUR",
                        }).format(transaction.amount)}
                      </span>
                      <span className="transaction-date">
                        {new Date(transaction.date).toLocaleDateString(
                          "pt-PT",
                          {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          },
                        )}
                      </span>
                      <span className="transaction-account">
                        {transaction.account.name}
                      </span>
                      <span className="transaction-note">
                        {transaction.notes}
                      </span>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="grid-no-content">
                <span>No transactions for the selected period.</span>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

function Chart({ selectedCategory }) {
  const [dataset, setDataset] = useState(null);
  const [budgets, setBudgets] = useState(null);

  useEffect(() => {
    api
      .get("/api/transaction/categories/stats/", {
        params: {
          name: selectedCategory?.name,
          only_expenses: true,
        },
      })
      .then((res) => {
        setDataset(res.data);
      });
    api
      .get("/api/transaction/category_budgets/", {
        params: {
          category: selectedCategory?.id,
        },
      })
      .then((res) => {
        setBudgets(res.data);
      });
  }, [selectedCategory]);

  return (
    <div className="budget-history card frosted-glass">
      {selectedCategory == null ? (
        <div className="empty">
          <p className="description">No Category Selected.</p>
        </div>
      ) : (
        <>
          <div className="card-header">
            <h3 className="card-title">Monthly Comparison (Last 12 Months)</h3>
            <div className="card-actions"></div>
          </div>
          <div className="card-content chart">
            {dataset?.monthly_breakdown?.length > 0 ? (
              <BudgetChart
                dataset={dataset?.monthly_breakdown}
                budgets={budgets}
              />
            ) : (
              <div className="grid-no-content">
                <span>No transactions for this category.</span>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

const getExpenses = (category, month, year) => {
  let result = category?.transactions
    .filter(
      (transaction) =>
        new Date(transaction.date).getMonth() === month &&
        new Date(transaction.date).getFullYear() === year,
    )
    .reduce(
      (acc, transaction) =>
        Number.parseFloat(acc) + Number.parseFloat(transaction.amount),
      0,
    )
    .toFixed(2);
  return result;
};

const getBudgetAmount = (category, month, year) => {
  const amount = category?.category_budgets.filter(
    (budget) => budget.month <= month + 1 && budget.year <= year,
  )[0]?.amount;

  if (!amount) return 0;

  return amount;
};

const getNumberOfTransactions = (category, month, year) => {
  return category?.transactions.filter(
    (transaction) =>
      new Date(transaction.date).getMonth() === month &&
      new Date(transaction.date).getFullYear() === year,
  ).length;
};

const getHighestTransaction = (category, month, year) => {
  return category?.transactions
    .filter(
      (transaction) =>
        new Date(transaction.date).getMonth() === month &&
        new Date(transaction.date).getFullYear() === year,
    )
    .reduce((acc, transaction) => {
      if (Number.parseFloat(transaction.amount) > Number.parseFloat(acc)) {
        return transaction.amount;
      }
      return acc;
    }, 0);
};

const getLowestTransaction = (category, month, year) => {
  let transactions = category?.transactions.filter(
    (transaction) =>
      new Date(transaction.date).getMonth() === month &&
      new Date(transaction.date).getFullYear() === year,
  );
  if (
    transactions === undefined ||
    transactions === null ||
    transactions.length === 0
  ) {
    return 0;
  }
  let lowest = Math.min(
    ...transactions.map((transaction) => Number.parseFloat(transaction.amount)),
  );

  return lowest;
};

const getAverageTransaction = (category, month, year) => {
  return (
    category?.transactions
      .filter(
        (transaction) =>
          new Date(transaction.date).getMonth() === month &&
          new Date(transaction.date).getFullYear() === year,
      )
      .reduce(
        (acc, transaction) =>
          Number.parseFloat(acc) + Number.parseFloat(transaction.amount),
        0,
      ) /
    category?.transactions.filter(
      (transaction) =>
        new Date(transaction.date).getMonth() === month &&
        new Date(transaction.date).getFullYear() === year,
    ).length
  );
};
