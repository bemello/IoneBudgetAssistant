import {useState, useEffect} from "react";
import dayjs from "dayjs";
import objectSupport from "dayjs/plugin/objectSupport";
import api from "../utils/api.js";
import CustomSelect from "../components/CustomSelect";

dayjs.extend(objectSupport);

import AddTransactionButton from "../components/buttons/AddTransactionButton";
import ButtonGlow from "../components/buttons/ButtonGlow";
import PageHeader from "../components/PageHeader";
import CashFlow from "../components/charts/CashFlow";
import AccountForm from "../components/forms/AccountForm";

let monthYear;

export default function Accounts({user}) {
    const [month, setMonth] = useState(new Date().getMonth());
    const [year, setYear] = useState(new Date().getFullYear());
    const [refreshComponent, setRefreshComponent] = useState(false);
    const [selectedAccount, setSelectedAccount] = useState(null);

    const months = [
        {key: 0, label: "January"},
        {key: 1, label: "February"},
        {key: 2, label: "March"},
        {key: 3, label: "April"},
        {key: 4, label: "May"},
        {key: 5, label: "June"},
        {key: 6, label: "July"},
        {key: 7, label: "August"},
        {key: 8, label: "September"},
        {key: 9, label: "October"},
        {key: 10, label: "November"},
        {key: 11, label: "December"},
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
            <PageHeader title="Accounts" showVisibilityButton={true}>
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
            <div className="page-container min-height no-border accounts">
                <AccountList
                    user={user}
                    selectedAccount={selectedAccount}
                    setSelectedAccount={setSelectedAccount}
                    setRefreshComponent={setRefreshComponent}
                    refreshComponent={refreshComponent}
                    month={month}
                    year={year}
                />
                <div className="account-info">
                    <Chart
                        user={user}
                        selectedAccount={selectedAccount}
                        refreshComponent={refreshComponent}
                        month={month}
                        year={year}
                    />
                    <Transactions
                        user={user}
                        selectedAccount={selectedAccount}
                        refreshComponent={refreshComponent}
                        setRefreshComponent={setRefreshComponent}
                        month={month}
                        year={year}
                    />
                </div>
            </div>
        </>
    );
}

function AccountList({
                         user,
                         selectedAccount,
                         setSelectedAccount,
                         setRefreshComponent,
                         refreshComponent,
                         month,
                         year
                     }) {
    const [accounts, setAccounts] = useState([]);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        let isFirstRender = true;

        function getAccounts() {
            api.get("/api/accounts/").then((res) => {
                setAccounts(res.data);
                if (isFirstRender) {
                    setSelectedAccount(res.data[0]);
                }
                if (selectedAccount != null) {
                    const accountId = selectedAccount.id;
                    setSelectedAccount(null);
                    setSelectedAccount(res.data.find((acc) => acc.id === accountId));
                }
            });
        }

        getAccounts();
        return () => {
            isFirstRender = false;
        }
    }, [month, year, refreshComponent]);

    const addAccount = () => {
        setIsEditing(false);
        document.getElementById("dialog-account").showModal();
    };

    const editAccount = () => {
        setIsEditing(true);
        document.getElementById("dialog-account").showModal();
    };

    const confirmDelete = (id) => {
        document.getElementById(`delete-confirmation-${id}`).classList.add("show");
    };

    const cancel = (id) => {
        document
            .getElementById(`delete-confirmation-${id}`)
            .classList.remove("show");
    };

    const deleteAccount = (account) => {
        api.delete(`/api/accounts/${account.id}/`).then(() => {
            setSelectedAccount(null);
            setRefreshComponent((prev) => !prev);
        });
    };

    return (
        <div className="accounts-grid card frosted-glass">
            <div className="card-header">
                <h3 className="card-title">My Accounts</h3>
            </div>
            <dialog
                id="dialog-account"
                style={{"--dialog-width": "50vw", "--dialog-max-width": "500px"}}
            >
                <div className="dialog-header">
                    <h3 autoFocus>{isEditing ? "Update Account" : "Add Account"}</h3>
                </div>
                <div className="dialog-content">
                    <AccountForm
                        account={isEditing ? selectedAccount : null}
                        setSelectedAccount={setSelectedAccount}
                        setRefreshComponent={setRefreshComponent}
                        isEditing={isEditing}
                    />
                </div>
            </dialog>
            <div className="card-content">
                <div className="accounts-list scrollable">
                    {accounts?.map((account) => (
                        <div
                            key={account.id}
                            className={`item ${selectedAccount?.id === account.id ? "active" : ""}`}
                            onClick={() => setSelectedAccount(account)}
                        >
                            <div className="icon">
                                <span className="material-symbols-outlined">
                                  {account.icon}
                                </span>
                            </div>
                            <div className="label">
                                <span className="account-name">{account.name}</span>
                                <span className="account-type">{account.type_display}</span>
                            </div>
                            <span className="balance">
                                {new Intl.NumberFormat("en-GB", {
                                    style: "currency",
                                    currency: account.currency,
                                }).format(account.current_balance)}
                              </span>
                        </div>
                    ))}
                </div>
                <div className="action-container">
                    <ButtonGlow
                        label="Add Account"
                        onClick={addAccount}
                        className="symbol full"
                        symbol="add"
                    />
                </div>
            </div>
        </div>
    );
}

function Chart({selectedAccount, month, year}) {
    const [dataset, setDataset] = useState(null);

    useEffect(() => {
        let isFirstRender = true;

        function getBalanceHistory() {
            api
                .get("/api/accounts/balance-history/", {
                    params: {
                        account_id: selectedAccount?.id,
                        month: month + 1,
                        year: year,
                    },
                })
                .then((res) => {
                    if (isFirstRender) {
                        const data = [];
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
    }, [selectedAccount, month, year]);

    // useEffect(() => {
    //   getBalanceHistory();
    // }, [monthYear]);
    // useEffect(() => {
    //   getBalanceHistory();
    // }, [refreshComponent]);

    return (
        <div className="card frosted-glass chart">
            <div className="card-header">
                <h3 className="card-title">Cash Flow</h3>
            </div>
            <div className="card-content chart">
                {dataset?.length > 0 ? (
                    <CashFlow dataset={dataset}/>
                ) : (
                    <div className="grid-no-content">
                        <span>No data to display.</span>
                    </div>
                )}
            </div>
        </div>
    );
}

function Transactions({
                          user,
                          selectedAccount,
                          setRefreshComponent,
                          month,
                          year,
                      }) {
    const getFilteredTransactions = () => {
        const result = selectedAccount?.transactions.filter(
            (transaction) =>
                new Date(transaction.date).getMonth() === month &&
                new Date(transaction.date).getFullYear() === year,
        );
        return result ? result : [];
    };

    return (
        <div className="card frosted-glass transactions">
            <div className="card-header">
                <h3 className="card-title">Recent Transactions</h3>
                <div className="cta-container">
                    <AddTransactionButton
                        user={user}
                        selectedAccount={selectedAccount}
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
                        <span>Type</span>
                        <span>Notes</span>
                    </div>
                </div>
                {getFilteredTransactions().length > 0 ? (
                    <div className="grid-content">
                        {getFilteredTransactions().map((transaction) => (
                            <div className="grid-item">
                                <div className="transaction-label">
                  <span className="transaction-name">
                    {transaction.description}
                  </span>
                                    <span className="transaction-category">
                    {transaction.category?.name
                        ? transaction.category?.name
                        : "Uncategorized"}
                  </span>
                                </div>
                                <span className="transaction-amount">
                  {new Intl.NumberFormat("en-GB", {
                      style: "currency",
                      currency: transaction.account ? transaction.account.currency : "EUR",
                  }).format(transaction.amount)}
                </span>
                                <span className="transaction-date">
                  {new Date(transaction.date).toLocaleDateString("pt-PT", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                  })}
                </span>
                                <span className="transaction-account">
                  {transaction.type_display}
                </span>
                                <span className="transaction-note">{transaction.notes}</span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="grid-no-content">
                        <span>No transactions for the selected period.</span>
                    </div>
                )}
            </div>
        </div>
    );
}
