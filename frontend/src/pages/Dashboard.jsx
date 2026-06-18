import CashFlow from "../components/CashFlow";
import RoundButtonSVG from "../components/RoundButtonSVG";

function Dashboard({ user }) {
  return (
    <>
      <div className="page-header">
        <h2 className="page-title">Dashboard</h2>
        <div className="page-header-actions">
          <div className="cta-container">
            <div className="border"></div>
            <button className="btn outline glow">
              Add Transaction
              <svg className="glow-container">
                <rect
                  pathLength="100"
                  strokeLinecap="round"
                  className="glow-blur"
                ></rect>
                <rect
                  pathLength="100"
                  strokeLinecap="round"
                  className="glow-line"
                ></rect>
              </svg>
            </button>
          </div>
        </div>
      </div>
      <div className="page-container min-height no-border">
        <div className="dashboard-container">
          <div className="card balance">
            <div className="card-header">
              <h3 className="card-title">Balance</h3>
              <div className="card-actions"></div>
            </div>
            <div className="card-content">
              <div className="balance-summary">
                <h1 className="amount">€31,415.00</h1>
                <span className="material-symbols-outlined">
                  visibility_off
                </span>
              </div>
            </div>
          </div>
          <div className="card credit-cards">
            <div className="card-header">
              <h3 className="card-title">Credit Cards</h3>
              <div className="card-actions">
                <button type="button" className="btn sm link">
                  <span className="material-symbols-outlined">more_vert</span>
                </button>
              </div>
            </div>
            <div className="card-content">
              <div className="cc-summary">
                <div className="label">Balance</div>
                <div className="amount">€1,415.00</div>
              </div>
              <div className="carousel">
                <div className="cc-item">
                  <div className="card-title">
                    <svg
                      className="revolut-logo"
                      viewBox="0 0 145 32"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="m98.8039 0h5.6871v31.7312h-5.6871zm46.0571 13.3685v-4.92408h-5.881v-6.41996h-5.687v23.40534c0 2.1506.541 3.7895 1.608 4.8714 1.066 1.0828 2.728 1.6317 4.939 1.6317h5.021v-4.924h-3.674c-.799 0-1.372-.1757-1.704-.5226-.305-.3175-.503-1.1195-.503-2.043v-11.0748zm-84.6893 12.1865 5.8804-17.11125h5.9749l-8.4889 23.28775h-6.7327l-8.489-23.28775h5.9749zm63.8513-5.4451c0 1.4743-.224 2.7569-.664 3.8121-.437 1.0495-1.063 1.8541-1.861 2.3908s-1.779.8089-2.916.8089c-1.626 0-2.853-.5344-3.646-1.5878-.802-1.0646-1.209-2.6781-1.209-4.7954v-12.29412h-5.687v12.92272c0 2.0122.251 3.7189.748 5.0721.497 1.3573 1.18 2.4614 2.029 3.281.849.8187 1.84 1.41 2.946 1.7581 1.1.3463 2.284.5217 3.518.5217 1.778 0 3.25-.3225 4.373-.9586 1.024-.5819 1.883-1.2622 2.555-2.0251l.509 2.7148h4.992v-23.28672h-5.687zm-33.913-10.43745c-1.7923-.99372-3.9206-1.49716-6.3249-1.49716-2.3749 0-4.4953.50344-6.3024 1.49684-1.8092.99597-3.2308 2.40247-4.2254 4.18037-.9931 1.7763-1.4966 3.8817-1.4966 6.2574 0 2.3466.5035 4.4373 1.4966 6.2136.994 1.7773 2.4159 3.1835 4.2254 4.1793 1.8071.9935 3.9276 1.4969 6.3024 1.4969 2.4042 0 4.5325-.5034 6.3249-1.4972 1.7942-.9953 3.2082-2.4014 4.2026-4.179.9934-1.7773 1.4971-3.868 1.4971-6.2136 0-2.3748-.5037-4.4802-1.4971-6.2575-.995-1.7781-2.4087-3.1847-4.2026-4.17995zm-3.0047 16.63905c-.9162.5966-2.0332.8993-3.3199.8993-1.2572 0-2.367-.3026-3.2986-.8995-.9332-.5976-1.665-1.441-2.1757-2.5072-.5128-1.0672-.7732-2.3099-.7732-3.6942 0-1.4128.2601-2.6627.7732-3.7154.5104-1.0518 1.2428-1.8955 2.1769-2.5081.9313-.612 2.0408-.9222 3.2973-.9222 1.2861 0 2.4025.3102 3.319.9215.9191.613 1.6443 1.457 2.1559 2.5091.5125 1.0552.7725 2.3052.7725 3.7152 0 1.3811-.26 2.6242-.7725 3.6941-.5115 1.0664-1.2364 1.9099-2.1549 2.5074zm-81.19475-18.48035h-5.91055v23.90035h5.91055zm18.53525 1.36671c0-5.07148-4.1298-9.19751668-9.2063-9.19751668h-15.2395v5.10407668h14.5149c2.2974 0 4.2004 1.80488 4.2425 4.02316.021 1.11072-.3959 2.15902-1.1738 2.95172-.7782.7929-1.818 1.2299-2.9278 1.2299h-5.65434c-.20074 0-.36413.1631-.36413.3639v4.5363c0 .0772.02383.1509.06866.213l9.59341 13.3092h7.0225l-9.6157-13.3456c4.8425-.2431 8.7396-4.3118 8.7396-9.18814zm18.1745.33907c-1.7026-.90368-3.7242-1.36164-6.0087-1.36164-2.2874 0-4.3325.50376-6.0787 1.4978-1.7491.99501-3.1251 2.40181-4.0897 4.18061-.9636 1.7748-1.452 3.8949-1.452 6.3017 0 2.3457.4959 4.4357 1.4746 6.2123.9808 1.7807 2.3955 3.1797 4.2041 4.158 1.8052.9784 3.9706 1.4743 6.4354 1.4743 1.9554 0 3.7114-.3663 5.2192-1.0894 1.5081-.7249 2.7393-1.712 3.6596-2.9341.8742-1.1615 1.464-2.4752 1.7525-3.9042l.0311-.1525h-5.6559l-.0267.0916c-.3114 1.0659-.9156 1.9081-1.7964 2.5038-.9454.6405-2.1066.9654-3.4519.9654-1.1402 0-2.17-.2443-3.0605-.7261-.8862-.479-1.5791-1.164-2.059-2.0367-.4818-.8757-.756-1.9294-.8146-3.1254v-.187h17.0842l.0191-.1044c.0596-.3278.0979-.6656.1145-1.0053.0141-.331.0223-.6616.0223-.9953-.0305-2.2563-.5348-4.2409-1.4987-5.8993-.9677-1.6603-2.3215-2.9605-4.0238-3.86417zm-2.0724 4.38547c.9717.8178 1.5762 1.9799 1.7979 3.4564h-11.2467c.1285-.958.4466-1.7877.9463-2.4683.5242-.7139 1.1957-1.2748 1.9962-1.6672.8014-.3936 1.6813-.5934 2.6148-.5934 1.5781-.0001 2.8874.4281 3.8915 1.2725z"></path>
                    </svg>
                  </div>
                  <div className="card-company visa"></div>
                  <div className="card-last-four-digits">
                    **** **** **** 4810
                  </div>
                  <div className="card-expiry">09/30</div>
                </div>
                <div className="cc-item amex gold">
                  <div className="card-title">
                    <svg
                      version="1.1"
                      id="Layer_1"
                      xmlns="http://www.w3.org/2000/svg"
                      xmlnsXlink="http://www.w3.org/1999/xlink"
                      x="0px"
                      y="0px"
                      viewBox="-1422.2 401.1 2235.4 142.7"
                      xmlSpace="preserve"
                    >
                      <g>
                        <path
                          fill="none"
                          d="M-1422.2,401.1H813.2v142.7h-2235.4V401.1z"
                        ></path>
                        <path
                          fill="000"
                          d="M766.6,456.2h-34.2c-7.6,0-12.4-4.8-12.4-11.4s5.7-10.5,12.4-10.5h61.8l14.3-31.4h-76.1
                              c-31.4,0-49.5,19-49.5,43.8c0,26.6,17.1,41.9,44.7,41.9h34.2c7.6,0,12.4,4.8,12.4,11.4c0,6.7-4.8,11.4-12.4,11.4h-74.2v31.4h74.2
                              c31.4,0,49.5-18.1,49.5-44.7C811.3,471.4,795.1,456.2,766.6,456.2 M630.6,456.2h-34.2c-7.6,0-12.4-4.8-12.4-11.4
                              s5.7-10.5,12.4-10.5h61.8l14.3-31.4h-76.1c-31.4,0-49.5,19-49.5,43.8c0,26.6,17.1,41.9,44.7,41.9h34.2c7.6,0,12.4,4.8,12.4,11.4
                              c0,6.7-4.8,11.4-12.4,11.4h-74.2v31.4h74.2c31.4,0,49.5-18.1,49.5-44.7C675.3,471.4,659.1,456.2,630.6,456.2 M413.7,541.8h117
                              v-31.4h-79.9v-22.8h78v-31.4h-78v-21.9h79.9V403h-117V541.8z M340.4,461.9h-39v-27.6h39c11.4,0,17.1,6.7,17.1,14.3
                              C356.6,456.2,350.9,461.9,340.4,461.9 M394.7,447.7c0-26.6-19-44.7-49.5-44.7h-79.9v138.9h37.1v-48.5h13.3l41.9,48.5h45.7
                              l-45.7-50.4C380.4,486.7,394.7,469.5,394.7,447.7 M194.9,464.8h-40v-30.4h40c11.4,0,17.1,6.7,17.1,15.2
                              C211.1,458.1,205.4,464.8,194.9,464.8 M198.7,403h-80.9v138.9H155v-45.7h42.8c31.4,0,50.4-20,50.4-46.6
                              C248.2,422,229.2,403,198.7,403 M111.2,403H63.6l-36.1,41.9L-8.7,403h-48.5l60.9,68.5l-61.8,70.4h47.6l37.1-43.8l38.1,43.8h48.5
                              l-62.8-71.3L111.2,403z M-180.8,541.8h117v-31.4h-79.9v-22.8h78v-31.4h-78v-21.9h79.9V403h-117V541.8z M-311.2,487.6l-57.1-84.7
                              h-46.6v138.9h37.1v-88.5l58,88.5h44.7V403h-36.1L-311.2,487.6z M-527.1,482.9l19-46.6l19,46.6H-527.1z M-530.9,403l-60.9,138.9
                              h40.9l11.4-28.5h64.7l12.4,28.5h41.9L-483.3,403H-530.9z M-652.7,473.4v-2.9c0-20.9,11.4-35.2,35.2-35.2h41.9V403h-44.7
                              c-45.7,0-69.4,29.5-69.4,67.5v2.9c0,42.8,26.6,67.5,67.5,67.5h12.4l15.2-31.4h-21.9C-638.4,510.5-652.7,498.1-652.7,473.4
                              M-745.9,403v138.9h37.1V403H-745.9z M-820.1,461.9h-39v-27.6h39c11.4,0,17.1,6.7,17.1,14.3S-808.7,461.9-820.1,461.9
                              M-765.9,447.7c0-26.6-19-44.7-49.5-44.7h-79.9v138.9h37.1v-48.5h13.3l41.9,48.5h46.6l-45.7-50.4
                              C-779.2,486.7-765.9,469.5-765.9,447.7 M-1037,541.8h117v-31.4h-79.9v-22.8h78v-31.4h-78v-21.9h79.9V403h-117V541.8z
                              M-1154.9,490.5l-31.4-87.5h-58v138.9h36.1V442l36.1,99.9h33.3l37.1-99.9v99.9h36.1V403h-58L-1154.9,490.5z M-1356.6,482.9l19-46.6
                              l19,46.6C-1318.5,482.9-1356.6,482.9-1356.6,482.9z M-1361.3,403l-60.9,138.9h40.9l11.4-28.5h64.7l12.4,28.5h41.9l-61.8-138.9
                              H-1361.3z"
                        ></path>
                      </g>
                    </svg>
                  </div>
                  <div className="card-last-four-digits">
                    **** **** **** 4810
                  </div>
                  <div className="card-expiry">09/30</div>
                </div>
              </div>
            </div>
          </div>
          <div className="card card-sm income">
            <div className="income-expense-grid">
              <div className="label">
                <span className="material-symbols-outlined">paid</span>
                <span className="label">Income</span>
              </div>
              <div className="growth">
                <span className="material-symbols-outlined">arrow_warm_up</span>
                <span className="growth-amount positive">5.7%</span>
              </div>
              <span className="amount">€450.00</span>
              <span className="stat">
                <b>+ €42.00</b> than last week
              </span>
            </div>
          </div>
          <div className="card card-sm expense">
            <div className="income-expense-grid">
              <div className="label">
                <span className="material-symbols-outlined">paid</span>
                <span className="label">Expense</span>
              </div>
              <div className="growth">
                <span className="material-symbols-outlined">
                  arrow_cool_down
                </span>
                <span className="growth-amount negative">10.2%</span>
              </div>
              <span className="amount">€335.00</span>
              <span className="stat">
                <b>- €30.20</b> than last week
              </span>
            </div>
          </div>
          <div className="card cashflow">
            <div className="card-header">
              <h3 className="card-title">Cashflow</h3>
              <div className="card-actions">
                <select
                  className="no-checkmark no-border"
                  defaultValue="last-month"
                >
                  <button className="select-button">
                    <div>
                      <selectedcontent></selectedcontent>
                    </div>
                  </button>
                  <div>
                    <option value="this-week">
                      <div className="custom-option">
                        <span className="option-text">This Week</span>
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
                    <option value="last-week">
                      <div className="custom-option">
                        <span className="option-text">Last Week</span>
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
            <div className="card-content">
              <CashFlow />
            </div>
          </div>
          <div className="card budget-breakdown">
            <div className="card-header">
              <h3 className="card-title">Budgets</h3>
              <div className="card-actions"></div>
            </div>
            <div className="card-content">
              <div className="category-area">
                <div className="category-header">
                  <div className="category-label-group">
                    <span className="material-symbols-outlined">
                      restaurant
                    </span>
                    <span className="category-label">Food & Drink</span>
                  </div>
                  <span className="category-amount">€272.45</span>
                </div>
                <progress
                  className="category-progress-bar"
                  value="85"
                  max="100"
                />
              </div>
              <div className="category-area">
                <div className="category-header">
                  <div className="category-label-group">
                    <span className="material-symbols-outlined">
                      shopping_cart
                    </span>
                    <span className="category-label">Groceries</span>
                  </div>
                  <span className="category-amount">€423.45</span>
                </div>
                <progress
                  className="category-progress-bar"
                  value="83"
                  max="100"
                />
              </div>
              <div className="category-area">
                <div className="category-header">
                  <div className="category-label-group">
                    <span className="material-symbols-outlined">
                      shopping_bag
                    </span>
                    <span className="category-label">Shopping</span>
                  </div>
                  <span className="category-amount">€179.99</span>
                </div>
                <progress
                  className="category-progress-bar"
                  value="51"
                  max="100"
                />
              </div>
              <div className="category-area">
                <div className="category-header">
                  <div className="category-label-group">
                    <span className="material-symbols-outlined">
                      subscriptions
                    </span>
                    <span className="category-label">Subscriptions</span>
                  </div>
                  <span className="category-amount">€89.99</span>
                </div>
                <progress
                  className="category-progress-bar"
                  value="100"
                  max="100"
                />
              </div>
              <div className="category-area">
                <div className="category-header">
                  <div className="category-label-group">
                    <span className="material-symbols-outlined">
                      directions_bus
                    </span>
                    <span className="category-label">Transportation</span>
                  </div>
                  <span className="category-amount">€53.45</span>
                </div>
                <progress
                  className="category-progress-bar"
                  value="23"
                  max="100"
                />
              </div>
            </div>
          </div>
          <div className="card vaults">
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
                <div className="amount">€23,250.00</div>
              </div>
              <div className="vault-list">
                <div className="vault-item">
                  <div className="vault-label">
                    <span>Sweet Home</span>
                  </div>
                  <div className="vault-progress">
                    <progress
                      className="vault-progress-bar"
                      value="22000"
                      max="50000"
                    />
                    <div className="vault-progress-info">
                      <div className="amount-target">
                        <span className="amount">€22,000.00</span>
                        <span className="separator">/</span>
                        <span className="target">€40,000.00</span>
                      </div>
                      <span className="percent">55%</span>
                    </div>
                  </div>
                </div>
                <div className="vault-item">
                  <div className="vault-label">
                    <span>Holidays</span>
                  </div>
                  <div className="vault-progress">
                    <progress
                      className="vault-progress-bar"
                      value="1250"
                      max="5000"
                    />
                    <div className="vault-progress-info">
                      <div className="amount-target">
                        <span className="amount">€1,250.00</span>
                        <span className="separator">/</span>
                        <span className="target">€5,000.00</span>
                      </div>
                      <span className="percent">25%</span>
                    </div>
                  </div>
                </div>
                {/* <div className="vault-item">
                  <div className="create-vault">
                    <RoundButtonSVG width="48" height="48" />
                  </div>
                </div> */}
                {/* <div className="vault-item">
                  <div className="create-vault">
                    <RoundButtonSVG width="48" height="48" />
                  </div>
                </div> */}
              </div>
            </div>
          </div>
          <div className="card recent-transactions">
            <div className="card-header">
              <h3 className="card-title">Recent Transactions</h3>
              <div className="card-actions">
                <button className="btn outline sm square">
                  <span className="material-symbols-outlined">instant_mix</span>
                </button>
              </div>
            </div>
            <div className="card-content">
              <div className="grid-header">
                <span>Transaction</span>
                <span>Account</span>
                <span>Date</span>
                <span>Amount</span>
                <span>Type</span>
              </div>
              <div className="grid-content">
                <div className="grid-item">
                  <div className="transaction-label">
                    <span className="transaction-name">Bonobo Pub</span>
                    <span className="transaction-category">Food & Drink</span>
                  </div>
                  <span className="transaction-account">Revolut</span>
                  <span className="transaction-date">10/06/2026 21:09</span>
                  <span className="transaction-amount">€43.99</span>
                  <span className="transaction-type expense">Expense</span>
                </div>
                <div className="grid-item">
                  <div className="transaction-label">
                    <span className="transaction-name">Starbucks</span>
                    <span className="transaction-category">Food & Drink</span>
                  </div>
                  <span className="transaction-account">Revolut</span>
                  <span className="transaction-date">09/06/2026 17:34</span>
                  <span className="transaction-amount">€4.89</span>
                  <span className="transaction-type expense">Expense</span>
                </div>
                <div className="grid-item">
                  <div className="transaction-label">
                    <span className="transaction-name">Amazon</span>
                    <span className="transaction-category">Shopping</span>
                  </div>
                  <span className="transaction-account">Revolut</span>
                  <span className="transaction-date">09/06/2026 09:56</span>
                  <span className="transaction-amount">€83.99</span>
                  <span className="transaction-type expense">Expense</span>
                </div>
                <div className="grid-item">
                  <div className="transaction-label">
                    <span className="transaction-name">
                      Jobseeker's Benefit
                    </span>
                    <span className="transaction-category">Welfare</span>
                  </div>
                  <span className="transaction-account">Revolut</span>
                  <span className="transaction-date">08/06/2026 13:32</span>
                  <span className="transaction-amount">€423.42</span>
                  <span className="transaction-type income">Income</span>
                </div>
                <div className="grid-item">
                  <div className="transaction-label">
                    <span className="transaction-name">Rent</span>
                    <span className="transaction-category">Bills</span>
                  </div>
                  <span className="transaction-account">Revolut</span>
                  <span className="transaction-date">01/06/2026 09:12</span>
                  <span className="transaction-amount">€750.00</span>
                  <span className="transaction-type expense">Expense</span>
                </div>
              </div>
            </div>
          </div>
          <div className="card investments">
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
                      className="investment-ratio-bar"
                      value="10000"
                      max="15000"
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
                      className="investment-ratio-bar"
                      value="3000"
                      max="15000"
                    />
                    <div className="investment-ratio-info">
                      <span className="amount">€3,000.00</span>
                      <span className="percent">20%</span>
                    </div>
                  </div>
                </div>
                <div className="investment-item">
                  <div className="investment-label">
                    <span>Gold</span>
                  </div>
                  <div className="investment-ratio">
                    <progress
                      className="investment-ratio-bar"
                      value="2000"
                      max="15000"
                    />
                    <div className="investment-ratio-info">
                      <span className="amount">€2,000.00</span>
                      <span className="percent">13%</span>
                    </div>
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

export default Dashboard;
