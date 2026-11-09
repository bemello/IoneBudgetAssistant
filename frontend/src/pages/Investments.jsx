import PageHeader from "../components/PageHeader";
import PortfolioValue from "../components/charts/PortfolioValue";
import ProfitLoss from "../components/charts/ProfitLoss";
import AssetsAllocation from "../components/charts/AssetsAllocation";
import api from "../utils/api";

const getCryptoData = async () => {
  await api
    .get("/api/investment/investments/get-crypto-prices", {
      params: {
        coins: "bitcoin,ethereum,cardano",
      },
    })
    .then((res) => res.data)
    .then((data) => console.log(data.data))
    .catch((err) => console.error("Oops!", err));
};

function Investments({ user }) {
  return (
    <>
      <PageHeader title="Investments" showVisibilityButton={true}>
        <div className="cta-container">
          <button className="btn outline" onClick={() => getCryptoData()}>
            <span className="material-symbols-outlined">currency_bitcoin</span>
          </button>
        </div>
      </PageHeader>
      <div className="page-container min-height no-border investments">
        <div className="portfolio-value card  frosted-glass">
          <div className="card-header">
            <h3 className="card-title">Portfolio Value</h3>
            <div className="page-header-actions">
              <div className="cta-container">
                <select
                  className="no-checkmark no-border"
                  defaultValue="last-12-months"
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
                    <option value="last-12-months">
                      <div className="custom-option">
                        <span className="option-text">Last 12 Months</span>
                      </div>
                    </option>
                    <option value="last-5-years">
                      <div className="custom-option">
                        <span className="option-text">Last 5 Years</span>
                      </div>
                    </option>
                    <option value="last-5-years">
                      <div className="custom-option">
                        <span className="option-text">Last 10 Years</span>
                      </div>
                    </option>
                  </div>
                </select>
              </div>
            </div>
          </div>
          <div className="card-content chart">
            <PortfolioValue />
          </div>
        </div>
        <div className="profits card frosted-glass">
          <div className="card-header">
            <h3 className="card-title">Profit & Loss</h3>
            <div className="page-header-actions">
              <div className="cta-container">
                <select
                  className="no-checkmark no-border"
                  defaultValue="last-12-months"
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
                    <option value="last-12-months">
                      <div className="custom-option">
                        <span className="option-text">Last 12 Months</span>
                      </div>
                    </option>
                    <option value="last-5-years">
                      <div className="custom-option">
                        <span className="option-text">Last 5 Years</span>
                      </div>
                    </option>
                    <option value="last-5-years">
                      <div className="custom-option">
                        <span className="option-text">Last 10 Years</span>
                      </div>
                    </option>
                  </div>
                </select>
              </div>
            </div>
          </div>
          <div className="card-content chart">
            <ProfitLoss />
          </div>
        </div>
        <div className="allocation frosted-glass">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Assets Allocation</h3>
              <div className="pag§e-header-actions">
                <div className="cta-container">
                  <select
                    className="no-checkmark no-border"
                    defaultValue="today"
                  >
                    <button className="select-button">
                      <div>
                        <selectedcontent></selectedcontent>
                      </div>
                    </button>
                    <div>
                      <option value="today">
                        <div className="custom-option">
                          <span className="option-text">Today</span>
                        </div>
                      </option>
                      <option value="seven-days-ago">
                        <div className="custom-option">
                          <span className="option-text">7 days ago</span>
                        </div>
                      </option>
                      <option value="thirty-days-ago">
                        <div className="custom-option">
                          <span className="option-text">30 days ago</span>
                        </div>
                      </option>
                      <option value="three-months-ago">
                        <div className="custom-option">
                          <span className="option-text">3 months ago</span>
                        </div>
                      </option>
                      <option value="one-year-ago">
                        <div className="custom-option">
                          <span className="option-text">1 year ago</span>
                        </div>
                      </option>
                    </div>
                  </select>
                </div>
              </div>
            </div>
            <div className="card-content chart">
              <div className="chart">
                <AssetsAllocation />
                <div className="label">
                  <span className="title">Total Invested</span>
                  <span className="value">€3,500.00</span>
                </div>
              </div>
              <div className="legend">
                <div className="item">
                  <div className="color"></div>
                  <div className="label">Stocks</div>
                  <div className="allocation">
                    <span className="percentage">71.43%</span>
                    <span className="value">€2,500.00</span>
                  </div>
                </div>
                <div className="item">
                  <div className="color"></div>
                  <div className="label">Crypto</div>
                  <div className="allocation">
                    <span className="percentage">28.57%</span>
                    <span className="value">€1,000.00</span>
                  </div>
                </div>
                <div className="item">
                  <div className="color"></div>
                  <div className="label">Real Estate</div>
                  <div className="allocation">
                    <span className="percentage">0%</span>
                    <span className="value">-</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="watchlist frosted-glass">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Watchlist</h3>
              <div className="page-header-actions"></div>
            </div>
            <div className="card-content scrollable">
              <div className="watchlist-item">
                <div className="asset">
                  <div className="icon">
                    <img
                      src="https://cdn.brandfetch.io/ticker/V/fallback/transparent/?c=1id6vIG18idYd9T7iyh"
                      alt="Logo (Powered by Brandfetch.com)"
                    />
                  </div>
                  <span className="symbol">V</span>
                  <span className="company">Visa Inc.</span>
                </div>
                <div className="price-variation">
                  <span className="price">$332.23</span>
                  <div className="variation positive">
                    <span className="material-symbols-outlined">
                      arrow_warm_up
                    </span>
                    <span className="value">1.14%</span>
                  </div>
                </div>
              </div>
              <div className="watchlist-item">
                <div className="asset">
                  <div className="icon">
                    <img
                      src="https://cdn.brandfetch.io/ticker/META/fallback/transparent?c=1id6vIG18idYd9T7iyh"
                      alt="Logo (Powered by Brandfetch.com)"
                    />
                  </div>
                  <span className="symbol">META</span>
                  <span className="company">Meta Platforms Inc.</span>
                </div>
                <div className="price-variation">
                  <span className="price">$563.85</span>
                  <div className="variation negative">
                    <span className="material-symbols-outlined">
                      arrow_cool_down
                    </span>
                    <span className="value">2.32%</span>
                  </div>
                </div>
              </div>
              <div className="watchlist-item">
                <div className="asset">
                  <div className="icon">
                    <img
                      src="https://cdn.brandfetch.io/ticker/JPM/fallback/transparent?c=1id6vIG18idYd9T7iyh"
                      alt="Logo (Powered by Brandfetch.com)"
                    />
                  </div>
                  <span className="symbol">JPM</span>
                  <span className="company">JPMorgan Chase & Co.</span>
                </div>
                <div className="price-variation">
                  <span className="price">$331.48</span>
                  <div className="variation positive">
                    <span className="material-symbols-outlined">
                      arrow_warm_up
                    </span>
                    <span className="value">1.92%</span>
                  </div>
                </div>
              </div>
              <div className="watchlist-item">
                <div className="asset">
                  <div className="icon">
                    <img
                      src="https://cdn.brandfetch.io/ticker/CVX/fallback/transparent?c=1id6vIG18idYd9T7iyh"
                      alt="Logo (Powered by Brandfetch.com)"
                    />
                  </div>
                  <span className="symbol">CVX</span>
                  <span className="company">Chevron Corporation</span>
                </div>
                <div className="price-variation">
                  <span className="price">$175.06</span>
                  <div className="variation positive">
                    <span className="material-symbols-outlined">
                      arrow_warm_up
                    </span>
                    <span className="value">0.82%</span>
                  </div>
                </div>
              </div>
              <div className="watchlist-item">
                <div className="asset">
                  <div className="icon">
                    <img
                      src="https://cdn.brandfetch.io/crypto/HYPE/fallback/transparent?c=1id6vIG18idYd9T7iyh"
                      alt="Logo (Powered by Brandfetch.com)"
                    />
                  </div>
                  <span className="symbol">HYPE</span>
                  <span className="company">Hyperliquid</span>
                </div>
                <div className="price-variation">
                  <span className="price">$62.73</span>
                  <div className="variation positive">
                    <span className="material-symbols-outlined">
                      arrow_warm_up
                    </span>
                    <span className="value">1.06%</span>
                  </div>
                </div>
              </div>
              <div className="watchlist-item">
                <div className="asset">
                  <div className="icon">
                    <img
                      src="https://cdn.brandfetch.io/isin/US84615Q1031/fallback/transparent?c=1id6vIG18idYd9T7iyh"
                      alt="Logo (Powered by Brandfetch.com)"
                    />
                  </div>
                  <span className="symbol">SPCX</span>
                  <span className="company">
                    Space Exploration Technologies Corp
                  </span>
                </div>
                <div className="price-variation">
                  <span className="price">$4.19</span>
                  <div className="variation negative">
                    <span className="material-symbols-outlined">
                      arrow_cool_down
                    </span>
                    <span className="value">5.39%</span>
                  </div>
                </div>
              </div>
              <div className="watchlist-item">
                <div className="asset">
                  <div className="icon">
                    <img
                      src="https://cdn.brandfetch.io/crypto/HYPE/fallback/transparent?c=1id6vIG18idYd9T7iyh"
                      alt="Logo (Powered by Brandfetch.com)"
                    />
                  </div>
                  <span className="symbol">HYPE</span>
                  <span className="company">Hyperliquid</span>
                </div>
                <div className="price-variation">
                  <span className="price">$62.73</span>
                  <div className="variation positive">
                    <span className="material-symbols-outlined">
                      arrow_warm_up
                    </span>
                    <span className="value">1.06%</span>
                  </div>
                </div>
              </div>
              <div className="watchlist-item">
                <div className="asset">
                  <div className="icon">
                    <img
                      src="https://cdn.brandfetch.io/crypto/INJ/fallback/transparent?c=1id6vIG18idYd9T7iyh"
                      alt="Logo (Powered by Brandfetch.com)"
                    />
                  </div>
                  <span className="symbol">INJ</span>
                  <span className="company">Injective</span>
                </div>
                <div className="price-variation">
                  <span className="price">$4.19</span>
                  <div className="variation negative">
                    <span className="material-symbols-outlined">
                      arrow_cool_down
                    </span>
                    <span className="value">5.39%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="my-portfolio">
          <div className="card frosted-glass">
            <div className="card-header">
              <h3 className="card-title">My Portfolio</h3>
              <div className="page-header-actions">
                <div className="cta-container">
                  <select
                    className="no-checkmark no-border"
                    defaultValue="today"
                  >
                    <button className="select-button">
                      <div>
                        <selectedcontent></selectedcontent>
                      </div>
                    </button>
                    <div>
                      <option value="today">
                        <div className="custom-option">
                          <span className="option-text">Today</span>
                        </div>
                      </option>
                      <option value="seven-days-ago">
                        <div className="custom-option">
                          <span className="option-text">7 days ago</span>
                        </div>
                      </option>
                      <option value="thirty-days-ago">
                        <div className="custom-option">
                          <span className="option-text">30 days ago</span>
                        </div>
                      </option>
                      <option value="three-months-ago">
                        <div className="custom-option">
                          <span className="option-text">3 months ago</span>
                        </div>
                      </option>
                      <option value="one-year-ago">
                        <div className="custom-option">
                          <span className="option-text">1 year ago</span>
                        </div>
                      </option>
                    </div>
                  </select>
                </div>
              </div>
            </div>
            <div className="card-content scrollable">
              <div className="grid-header">
                <div className="content">
                  <span>Asset</span>
                  <span>Average Cost</span>
                  <span>Quantity</span>
                  <span>Current Value</span>
                </div>
              </div>
              <div className="grid-content">
                <div className="grid-item">
                  <div className="asset">
                    <div className="icon">
                      <img
                        src="https://cdn.brandfetch.io/ticker/AAPL/fallback/transparent?c=1id6vIG18idYd9T7iyh"
                        alt="Logo (Powered by Brandfetch.com)"
                      />
                    </div>
                    <span className="symbol">AAPL</span>
                    <span className="company">Apple Inc.</span>
                  </div>
                  <span className="cost">€120.00</span>
                  <span className="quantity">10</span>
                  <span className="value">€1,200.00</span>
                </div>
                <div className="grid-item">
                  <div className="asset">
                    <div className="icon">
                      <img
                        src="https://cdn.brandfetch.io/ticker/AMZN/fallback/transparent?c=1id6vIG18idYd9T7iyh"
                        alt="Logo (Powered by Brandfetch.com)"
                      />
                    </div>
                    <span className="symbol">AMZN</span>
                    <span className="company">Amazon.com Inc.</span>
                  </div>
                  <span className="cost">€120.00</span>
                  <span className="quantity">10</span>
                  <span className="value">€1,200.00</span>
                </div>
                <div className="grid-item">
                  <div className="asset">
                    <div className="icon">
                      <img
                        src="https://cdn.brandfetch.io/ticker/NVDA/fallback/transparent?c=1id6vIG18idYd9T7iyh"
                        alt="Logo (Powered by Brandfetch.com)"
                      />
                    </div>
                    <span className="symbol">NVDA</span>
                    <span className="company">NVIDIA Corporation</span>
                  </div>
                  <span className="cost">€120.00</span>
                  <span className="quantity">10</span>
                  <span className="value">€1,200.00</span>
                </div>
                <div className="grid-item">
                  <div className="asset">
                    <div className="icon">
                      <img
                        src="https://cdn.brandfetch.io/crypto/BTC/fallback/transparent?c=1id6vIG18idYd9T7iyh"
                        alt="Logo (Powered by Brandfetch.com)"
                      />
                    </div>
                    <span className="symbol">BTC</span>
                    <span className="company">Bitcoin</span>
                  </div>
                  <span className="cost">€120.00</span>
                  <span className="quantity">10</span>
                  <span className="value">€1,200.00</span>
                </div>
                <div className="grid-item">
                  <div className="asset">
                    <div className="icon">
                      <img
                        src="https://cdn.brandfetch.io/crypto/ETH/fallback/transparent?c=1id6vIG18idYd9T7iyh"
                        alt="Logo (Powered by Brandfetch.com)"
                      />
                    </div>
                    <span className="symbol">ETH</span>
                    <span className="company">Ethereum</span>
                  </div>
                  <span className="cost">€120.00</span>
                  <span className="quantity">10</span>
                  <span className="value">€1,200.00</span>
                </div>
                <div className="grid-item">
                  <div className="asset">
                    <div className="icon">
                      <img
                        src="https://cdn.brandfetch.io/crypto/SOL/fallback/transparent?c=1id6vIG18idYd9T7iyh"
                        alt="Logo (Powered by Brandfetch.com)"
                      />
                    </div>
                    <span className="symbol">SOL</span>
                    <span className="company">Solana</span>
                  </div>
                  <span className="cost">€120.00</span>
                  <span className="quantity">10</span>
                  <span className="value">€1,200.00</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Investments;
