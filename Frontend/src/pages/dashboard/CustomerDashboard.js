import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import Loader from "../../components/Loader";
import FraudAlertPanel from "../../components/FraudAlertPanel";

import { getAccountsByUserId, createAccount } from "../../api/accountApi";
import { getAccountTransactions } from "../../api/bankingApi";
import { getLoansByUserId } from "../../api/loanApi";
import { getUserInvestments } from "../../api/investmentApi";
import { getUserId } from "../../utils/auth";
import { getUserById } from "../../api/userApi";
import Deposit from "./Deposit";
import Withdraw from "./Withdraw";
import Transfer from "./Transfer";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

  .usr-root * { box-sizing: border-box; font-family: 'Inter', sans-serif; }

  .usr-page {
    background: #f4f6fb;
    min-height: 100vh;
  }
  .usr-body {
    display: flex;
  }
  .usr-main {
    flex: 1;
    padding: 28px 32px;
    overflow: hidden;
  }

  /* Page header */
  .usr-page-header {
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 28px;
  }
  .usr-page-title {
    font-size: 19px; font-weight: 700; color: #0f172a; letter-spacing: -0.3px;
  }
  .usr-page-subtitle { font-size: 13px; color: #94a3b8; margin-top: 2px; }
  .usr-badge-live {
    display: flex; align-items: center; gap: 6px;
    background: #f0fdf4; border: 1px solid #bbf7d0;
    border-radius: 100px; padding: 5px 12px;
    font-size: 12px; font-weight: 600; color: #16a34a;
  }
  .usr-live-dot {
    width: 7px; height: 7px; border-radius: 50%; background: #22c55e;
    animation: usrBlink 1.5s ease-in-out infinite;
  }
  @keyframes usrBlink { 0%,100% { opacity:1; } 50% { opacity:0.3; } }

  /* KPI cards */
  .usr-kpi-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
    margin-bottom: 28px;
  }
  .usr-kpi-card {
    background: #fff;
    border-radius: 14px;
    padding: 20px 22px;
    border: 1px solid #e8edf5;
    position: relative;
    overflow: hidden;
    transition: transform 0.15s, box-shadow 0.15s;
  }
  .usr-kpi-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0,0,0,0.07);
  }
  .usr-kpi-accent {
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 3px;
    border-radius: 14px 14px 0 0;
  }
  .usr-kpi-icon-wrap {
    width: 42px; height: 42px; border-radius: 12px;
    display: flex; align-items: center; justify-content: center;
    font-size: 20px; margin-bottom: 16px;
  }
  .usr-kpi-value {
    font-size: 24px; font-weight: 700; color: #0f172a;
    letter-spacing: -1px; line-height: 1;
    margin-bottom: 4px;
  }
  .usr-kpi-label { font-size: 13px; color: #64748b; font-weight: 500; }
  .usr-kpi-delta {
    font-size: 11px; font-weight: 600;
    margin-top: 10px; display: flex; align-items: center; gap: 4px;
  }
  .usr-kpi-delta.up   { color: #16a34a; }
  .usr-kpi-delta.info { color: #4f46e5; }
  .usr-kpi-delta.warn { color: #d97706; }

  /* Cards */
  .usr-card {
    background: #fff; border-radius: 14px; border: 1px solid #e8edf5;
    margin-bottom: 20px; overflow: hidden;
  }
  .usr-card-header {
    padding: 16px 20px; border-bottom: 1px solid #f1f5f9;
    display: flex; align-items: center; justify-content: space-between;
  }
  .usr-card-body { padding: 20px; }

  /* Section title */
  .usr-section-title {
    font-size: 15px; font-weight: 700; color: #0f172a;
    display: flex; align-items: center; gap: 8px;
  }
  .usr-section-icon {
    width: 28px; height: 28px; border-radius: 8px;
    display: flex; align-items: center; justify-content: center; font-size: 14px;
  }

  /* Alert banner */
  .usr-alert {
    display: flex; align-items: center; gap: 10px;
    padding: 12px 16px; border-radius: 10px;
    font-size: 13px; font-weight: 500; margin-bottom: 20px;
    border: 1px solid transparent;
  }
  .usr-alert-success { background: #f0fdf4; border-color: #bbf7d0; color: #16a34a; }
  .usr-alert-danger  { background: #fef2f2; border-color: #fecaca; color: #dc2626; }
  .usr-alert-info    { background: #e0e7ff; border-color: #c7d2fe; color: #4f46e5; }
  .usr-alert-close {
    margin-left: auto; background: none; border: none; cursor: pointer;
    font-size: 16px; color: inherit; opacity: 0.6; line-height: 1;
    padding: 0 2px;
  }
  .usr-alert-close:hover { opacity: 1; }

  /* Account cards */
  .usr-account-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 20px; }
  .usr-account-card {
    border-radius: 14px; padding: 22px; color: #fff; position: relative; overflow: hidden;
    border: 3px solid transparent;
    transition: transform 0.15s, box-shadow 0.15s;
  }
  .usr-account-card:hover { transform: translateY(-2px); box-shadow: 0 10px 28px rgba(0,0,0,0.15); }
  .usr-account-card.active { border-color: #fbbf24; }
  .usr-account-card-blue   { background: linear-gradient(135deg, #4f46e5 0%, #3730a3 100%); }
  .usr-account-card-green  { background: linear-gradient(135deg, #16a34a 0%, #15803d 100%); }
  .usr-account-card-dark   { background: linear-gradient(135deg, #334155 0%, #1e293b 100%); }
  .usr-account-type {
    font-size: 11px; font-weight: 600; letter-spacing: 1.2px;
    text-transform: uppercase; opacity: 0.75; margin-bottom: 6px;
  }
  .usr-account-balance {
    font-size: 22px; font-weight: 700; letter-spacing: -0.3px; margin-bottom: 12px;
  }
  .usr-account-meta { font-size: 12px; opacity: 0.75; }
  .usr-account-btn {
    margin-top: 14px; padding: 7px 14px; border-radius: 8px;
    background: rgba(255,255,255,0.2); border: 1px solid rgba(255,255,255,0.3);
    color: #fff; font-size: 12px; font-weight: 600; cursor: pointer;
    font-family: 'Inter', sans-serif;
    transition: background 0.15s;
  }
  .usr-account-btn:hover { background: rgba(255,255,255,0.3); }
  .usr-active-badge {
    display: inline-flex; align-items: center; gap: 6px;
    background: #e0e7ff; border: 1px solid #c7d2fe;
    border-radius: 100px; padding: 5px 14px;
    font-size: 12px; font-weight: 600; color: #4f46e5;
    margin-bottom: 16px;
  }
  .usr-active-dot { width: 7px; height: 7px; border-radius: 50%; background: #4f46e5; }

  /* Buttons */
  .usr-btn {
    padding: 9px 18px; border-radius: 9px; font-size: 13px; font-weight: 600;
    cursor: pointer; border: none; font-family: 'Inter', sans-serif;
    display: inline-flex; align-items: center; gap: 6px;
    transition: transform 0.12s, box-shadow 0.12s;
  }
  .usr-btn:hover { transform: translateY(-1px); }
  .usr-btn-primary { background: #4f46e5; color: #fff; }
  .usr-btn-primary:hover { background: #3730a3; box-shadow: 0 4px 14px rgba(79,70,229,0.3); }
  .usr-btn-ghost { background: #f1f5f9; color: #475569; }
  .usr-btn-ghost:hover { background: #e2e8f0; }
  .usr-btn-outline {
    background: transparent; border: 1.5px solid #e2e8f0; color: #475569;
  }
  .usr-btn-outline:hover { border-color: #4f46e5; color: #4f46e5; background: #e0e7ff; }

  /* Tables */
  .usr-table { width: 100%; border-collapse: collapse; font-size: 13px; }
  .usr-table th {
    text-align: left; padding: 9px 12px;
    font-size: 11px; font-weight: 600; color: #94a3b8;
    text-transform: uppercase; letter-spacing: 0.5px;
    border-bottom: 1px solid #f1f5f9; background: #fafbfc;
  }
  .usr-table td {
    padding: 11px 12px; border-bottom: 1px solid #f8fafc; color: #374151;
  }
  .usr-table tr:last-child td { border-bottom: none; }
  .usr-table tr:hover td { background: #fafbfc; }
  .usr-table .mono { font-family: monospace; font-size: 12px; color: #64748b; }

  /* Transaction type badges */
  .usr-tx-badge {
    padding: 3px 9px; border-radius: 100px; font-size: 11px; font-weight: 600; display: inline-flex;
  }
  .usr-tx-deposit  { background: #f0fdf4; color: #16a34a; }
  .usr-tx-withdraw { background: #fef2f2; color: #dc2626; }
  .usr-tx-transfer { background: #e0e7ff; color: #4f46e5; }

  /* Status badges */
  .usr-status-badge {
    padding: 3px 9px; border-radius: 100px; font-size: 11px; font-weight: 600; display: inline-flex;
  }
  .usr-status-active    { background: #f0fdf4; color: #16a34a; }
  .usr-status-pending   { background: #fef3c7; color: #d97706; }
  .usr-status-rejected  { background: #fef2f2; color: #dc2626; }
  .usr-status-approved  { background: #e0e7ff; color: #4f46e5; }

  /* Bottom grid */
  .usr-bottom-grid {
    display: grid; grid-template-columns: 2fr 1fr; gap: 20px; margin-top: 0;
  }

  /* Empty state */
  .usr-empty {
    text-align: center; padding: 36px 20px; color: #94a3b8; font-size: 13px;
  }
  .usr-empty-icon { font-size: 36px; margin-bottom: 10px; opacity: 0.4; }

  /* No accounts state */
  .usr-no-accounts {
    text-align: center; padding: 40px 24px;
  }
  .usr-no-accounts-icon { font-size: 48px; margin-bottom: 14px; }
  .usr-no-accounts h3 { font-size: 18px; font-weight: 700; color: #0f172a; margin-bottom: 6px; }
  .usr-no-accounts p  { font-size: 14px; color: #94a3b8; margin-bottom: 20px; }
  .usr-no-accounts-btns { display: flex; gap: 10px; justify-content: center; }

  /* Create account strip */
  .usr-create-strip { display: flex; gap: 10px; margin-bottom: 20px; }

  /* Action Drawer */
  .usr-drawer-overlay {
    position: fixed; inset: 0; background: rgba(15,23,42,0.35);
    z-index: 200; backdrop-filter: blur(2px);
    animation: usrFadeIn 0.2s ease;
  }
  @keyframes usrFadeIn { from { opacity: 0; } to { opacity: 1; } }

  .usr-drawer {
    position: fixed; top: 0; right: 0; bottom: 0;
    width: 380px; background: #fff;
    box-shadow: -8px 0 40px rgba(0,0,0,0.12);
    z-index: 201; display: flex; flex-direction: column;
    animation: usrSlideIn 0.25s cubic-bezier(0.4,0,0.2,1);
  }
  @keyframes usrSlideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }

  .usr-drawer-header {
    padding: 20px 24px; border-bottom: 1px solid #f1f5f9;
    display: flex; align-items: center; justify-content: space-between;
    flex-shrink: 0;
  }
  .usr-drawer-title {
    display: flex; align-items: center; gap: 10px;
    font-size: 16px; font-weight: 700; color: #0f172a;
  }
  .usr-drawer-icon {
    width: 34px; height: 34px; border-radius: 10px;
    display: flex; align-items: center; justify-content: center; font-size: 16px;
  }
  .usr-drawer-close {
    width: 30px; height: 30px; border-radius: 8px;
    border: none; background: #f1f5f9; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    font-size: 16px; color: #64748b; transition: background 0.15s;
  }
  .usr-drawer-close:hover { background: #e2e8f0; color: #0f172a; }

  .usr-drawer-meta {
    padding: 14px 24px; background: #f8fafc;
    border-bottom: 1px solid #f1f5f9;
    font-size: 12px; color: #64748b;
    display: flex; align-items: center; gap: 6px;
  }
  .usr-drawer-body {
    padding: 24px; flex: 1; overflow-y: auto;
  }

  @media (max-width: 480px) {
    .usr-drawer { width: 100%; }
  }

  @media (max-width: 1100px) {
    .usr-kpi-grid { grid-template-columns: repeat(2, 1fr); }
  }
  @media (max-width: 768px) {
    .usr-main { padding: 16px; }
    .usr-kpi-grid { grid-template-columns: 1fr 1fr; }
    .usr-account-grid { grid-template-columns: 1fr; }
    .usr-bottom-grid { grid-template-columns: 1fr; }
  }
`;

function TxTypeBadge({ type }) {
  if (!type) return <span style={{ color: "#94a3b8" }}>—</span>;
  const t = type.toUpperCase();
  const cls =
    t === "DEPOSIT" ? "usr-tx-badge usr-tx-deposit" :
      t === "WITHDRAW" ? "usr-tx-badge usr-tx-withdraw" :
        "usr-tx-badge usr-tx-transfer";
  return <span className={cls}>{type}</span>;
}

function StatusBadge({ status }) {
  const map = {
    ACTIVE: "usr-status-active",
    PENDING: "usr-status-pending",
    REJECTED: "usr-status-rejected",
    APPROVED: "usr-status-approved",
  };
  return (
    <span className={`usr-status-badge ${map[status] || "usr-status-pending"}`}>
      {status}
    </span>
  );
}

function CustomerDashboard(props) {
  const [loading, setLoading] = useState(true);
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loans, setLoans] = useState([]);
  const [investments, setInvestments] = useState([]);
  const [message, setMessage] = useState("");
  const [msgType, setMsgType] = useState("info");
  const [user, setUser] = useState(null);
  const [activePanel, setActivePanel] = useState(null); // "deposit" | "withdraw" | "transfer" | null

  useEffect(() => {
    loadDashboard();
    const refresh = localStorage.getItem("refreshDashboard");
    if (refresh) {
      loadDashboard();
      localStorage.removeItem("refreshDashboard");
    }
  }, []);

  const notify = (text, type = "info") => {
    setMessage(text);
    setMsgType(type);
  };

  const openPanel = (panel) => setActivePanel(panel);
  const closePanel = () => setActivePanel(null);

  const handlePanelSuccess = (msg) => {
    closePanel();
    notify(msg, "success");
    loadDashboard();
  };

  const loadDashboard = async () => {
    try {
      const userId = getUserId();
      if (!userId) {
        setLoading(false);
        notify("User ID not found. Please login again.", "danger");
        return;
      }

      const userResponse = await getUserById(userId);
      setUser(userResponse.data);

      /* A brand-new user has no accounts/loans/investments yet — the backend
         returns a 404 for each of those in that case, which is a normal empty
         state here, not a dashboard failure. Each fetch is isolated so one
         empty section can't block the rest of the dashboard from loading. */
      let accountList = [];
      try {
        const accountResponse = await getAccountsByUserId(userId);
        accountList = accountResponse.data || [];
      } catch (accountError) {
        accountList = [];
      }
      setAccounts(accountList);

      if (accountList.length > 0) {
        const activeAccountId = localStorage.getItem("accountId");
        const accountIdToLoad = activeAccountId || accountList[0].id;
        localStorage.setItem("accountId", accountIdToLoad);
        try {
          const txResponse = await getAccountTransactions(accountIdToLoad);
          setTransactions(txResponse.data || []);
        } catch (txError) {
          setTransactions([]);
        }
      } else {
        setTransactions([]);
      }

      try {
        const loanResponse = await getLoansByUserId(userId);
        setLoans(loanResponse.data || []);
      } catch (loanError) {
        setLoans([]);
      }

      try {
        const investmentResponse = await getUserInvestments(userId);
        setInvestments(investmentResponse.data || []);
      } catch (investmentError) {
        setInvestments([]);
      }
    } catch (error) {
      console.log(error);
      notify("Unable to load dashboard.", "danger");
    }
    setLoading(false);
  };

  const createNewAccount = async (type) => {
    try {
      await createAccount({ userId: getUserId(), accType: type });
      notify(`${type} account created successfully.`, "success");
      loadDashboard();
    } catch (error) {
      console.log(error);
      notify("Unable to create account.", "danger");
    }
  };

  const selectAccount = async (account) => {
    try {
      localStorage.setItem("accountId", account.id);
      const txResponse = await getAccountTransactions(account.id);
      setTransactions(txResponse.data || []);
      notify(`Now viewing ${account.accType} account · #${account.id}`, "info");
    } catch (error) {
      console.log(error);
      notify("Unable to switch account.", "danger");
    }
  };

  if (loading) return <Loader />;

  const hasSavings = accounts.some((a) => a.accType === "SAVINGS");
  const hasCurrent = accounts.some((a) => a.accType === "CURRENT");

  const accountCardClass = ["usr-account-card-blue", "usr-account-card-green", "usr-account-card-dark"];

  const activeAccountId = localStorage.getItem("accountId");

  const creditScore = user?.creditScore || 0;
  const creditScoreDelta =
    creditScore >= 750 ? { label: "Excellent score", dir: "up" } :
      creditScore >= 600 ? { label: "Fair score", dir: "info" } :
        { label: "Needs improvement", dir: "warn" };

  const kpis = [
    {
      label: "Total Accounts", value: accounts.length,
      icon: "🏦", accent: "#4f46e5", bg: "#e0e7ff",
      delta: accounts.length > 0 ? `${accounts.length} account${accounts.length > 1 ? "s" : ""} linked` : "No accounts yet",
      dir: "info",
    },
    {
      label: "Investments", value: investments.length,
      icon: "📈", accent: "#16a34a", bg: "#f0fdf4",
      delta: investments.length > 0 ? "+5% portfolio growth" : "No investments yet",
      dir: "up",
    },
    {
      label: "Active Loans", value: loans.length,
      icon: "💳", accent: "#d97706", bg: "#fef3c7",
      delta: loans.length > 0 ? `${loans.length} loan${loans.length > 1 ? "s" : ""} active` : "No active loans",
      dir: "warn",
    },
    {
      label: "Credit Score", value: creditScore,
      icon: "🛡️", accent: "#7c3aed", bg: "#f5f3ff",
      delta: creditScoreDelta.label,
      dir: creditScoreDelta.dir,
    },
  ];

  return (
    <div className="usr-root">
      <style>{styles}</style>
      <div className="usr-page">
        <Navbar />
        <div className="usr-body">
          <Sidebar onBankingAction={openPanel} />
          <main className="usr-main">

            {/* Page Header */}
            <div className="usr-page-header">
              <div>
                <h1 className="usr-page-title">
                  My Dashboard{user?.name ? `, ${user.name.split(" ")[0]}` : ""}
                </h1>
                <p className="usr-page-subtitle">Your accounts, transactions, and financial overview</p>
              </div>
              <div className="usr-badge-live">
                <span className="usr-live-dot"></span>
                Live
              </div>
            </div>

            {/* Alert Banner */}
            {message && (
              <div className={`usr-alert usr-alert-${msgType}`}>
                <span>
                  {msgType === "success" && "✓ "}
                  {msgType === "danger" && "⚠ "}
                  {msgType === "info" && "ℹ "}
                  {message}
                </span>
                <button className="usr-alert-close" onClick={() => setMessage("")}>×</button>
              </div>
            )}

            {/* KPI Cards */}
            <div className="usr-kpi-grid">
              {kpis.map((kpi) => (
                <div className="usr-kpi-card" key={kpi.label}>
                  <div className="usr-kpi-accent" style={{ background: kpi.accent }}></div>
                  <div className="usr-kpi-icon-wrap" style={{ background: kpi.bg }}>{kpi.icon}</div>
                  <div className="usr-kpi-value">{kpi.value}</div>
                  <div className="usr-kpi-label">{kpi.label}</div>
                  <div className={`usr-kpi-delta ${kpi.dir}`}>
                    {kpi.dir === "up" ? "↑" : kpi.dir === "warn" ? "⚠" : "→"} {kpi.delta}
                  </div>
                </div>
              ))}
            </div>

            {/* No Accounts State */}
            {accounts.length === 0 && (
              <div className="usr-card">
                <div className="usr-card-body usr-no-accounts">
                  <div className="usr-no-accounts-icon">🏦</div>
                  <h3>No Accounts Found</h3>
                  <p>Create your first bank account to start banking.</p>
                  <div className="usr-no-accounts-btns">
                    <button className="usr-btn usr-btn-primary" disabled={hasSavings} onClick={() => createNewAccount("SAVINGS")}>
                      Open Savings Account
                    </button>
                    <button className="usr-btn usr-btn-ghost" disabled={hasCurrent} onClick={() => createNewAccount("CURRENT")}>
                      Open Current Account
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Account Cards */}
            {accounts.length > 0 && (
              <>
                {activeAccountId && (
                  <div className="usr-active-badge">
                    <span className="usr-active-dot"></span>
                    Active Account: <strong>#{activeAccountId}</strong>
                  </div>
                )}

                <div className="usr-account-grid">
                  {accounts.map((account, idx) => (
                    <div
                      key={account.id}
                      className={`usr-account-card ${accountCardClass[idx % accountCardClass.length]} ${String(account.id) === activeAccountId ? "active" : ""
                        }`}
                    >
                      <div className="usr-account-type">{account.accType} Account</div>
                      <div className="usr-account-balance">
                        ₹{account.balance?.toLocaleString("en-IN")}
                      </div>
                      <div className="usr-account-meta">
                        👤 {account.accHolder} &nbsp;·&nbsp; #{account.id}
                      </div>
                      <button className="usr-account-btn" onClick={() => selectAccount(account)}>
                        Use This Account
                      </button>
                    </div>
                  ))}
                </div>

                {(!hasSavings || !hasCurrent) && (
                  <div className="usr-create-strip">
                    {!hasSavings && (
                      <button className="usr-btn usr-btn-outline" onClick={() => createNewAccount("SAVINGS")}>
                        + Open Savings Account
                      </button>
                    )}
                    {!hasCurrent && (
                      <button className="usr-btn usr-btn-outline" onClick={() => createNewAccount("CURRENT")}>
                        + Open Current Account
                      </button>
                    )}
                  </div>
                )}
              </>
            )}

            {/* Bottom Grid: Transactions + Fraud Alerts */}
            <div className="usr-bottom-grid">

              {/* Recent Transactions */}
              <div className="usr-card" style={{ marginBottom: 0 }}>
                <div className="usr-card-header">
                  <div className="usr-section-title">
                    <div className="usr-section-icon" style={{ background: "#e0e7ff" }}>🧾</div>
                    Recent Transactions
                  </div>
                  <span style={{ fontSize: 12, color: "#94a3b8" }}>Last 5 entries</span>
                </div>
                <div style={{ overflowX: "auto" }}>
                  <table className="usr-table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>From</th>
                        <th>To</th>
                        <th>Amount</th>
                        <th>Type</th>
                        <th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions.length === 0 ? (
                        <tr>
                          <td colSpan="6">
                            <div className="usr-empty">
                              <div className="usr-empty-icon">📭</div>
                              No transactions yet
                            </div>
                          </td>
                        </tr>
                      ) : (
                        transactions.slice(0, 5).map((tx) => (
                          <tr key={tx.tid}>
                            <td className="mono">#{tx.tid}</td>
                            <td className="mono">{tx.fromAccount ? `#${tx.fromAccount.id}` : "—"}</td>
                            <td className="mono">{tx.toAccount ? `#${tx.toAccount.id}` : "—"}</td>
                            <td style={{ fontWeight: 600 }}>₹{tx.amount?.toLocaleString("en-IN")}</td>
                            <td><TxTypeBadge type={tx.type} /></td>
                            <td style={{ color: "#64748b" }}>
                              {tx.timestamp ? new Date(tx.timestamp).toLocaleString() : "—"}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
                <div style={{ padding: "12px 20px", borderTop: "1px solid #f1f5f9", textAlign: "right" }}>
                  <button
                    className="usr-btn usr-btn-outline"
                    style={{ fontSize: 12 }}
                    onClick={() => props.history.push("/transactions")}
                  >
                    View All Transactions →
                  </button>
                </div>
              </div>

              {/* Security Alerts */}
              <div className="usr-card" style={{ marginBottom: 0 }}>
                <div className="usr-card-header">
                  <div className="usr-section-title">
                    <div className="usr-section-icon" style={{ background: "#fef2f2" }}>🚨</div>
                    Security Alerts
                  </div>
                </div>
                <div className="usr-card-body">
                  <FraudAlertPanel />
                </div>
              </div>

            </div>

          </main>
        </div>
      </div>

      {/* Action Drawer */}
      {activePanel && (
        <>
          <div className="usr-drawer-overlay" onClick={closePanel} />
          <div className="usr-drawer">
            <div className="usr-drawer-header">
              <div className="usr-drawer-title">
                <div className="usr-drawer-icon" style={{
                  background:
                    activePanel === "deposit" ? "#f0fdf4" :
                      activePanel === "withdraw" ? "#fef2f2" : "#e0e7ff"
                }}>
                  {activePanel === "deposit" ? "⬇️" : activePanel === "withdraw" ? "⬆️" : "↔️"}
                </div>
                {activePanel === "deposit" ? "Deposit Funds" :
                  activePanel === "withdraw" ? "Withdraw Funds" : "Transfer Funds"}
              </div>
              <button className="usr-drawer-close" onClick={closePanel}>✕</button>
            </div>
            <div className="usr-drawer-meta">
              <span>🏦</span>
              Active Account: <strong>#{localStorage.getItem("accountId")}</strong>
            </div>
            <div className="usr-drawer-body">
              {activePanel === "deposit" && <Deposit onSuccess={handlePanelSuccess} onCancel={closePanel} />}
              {activePanel === "withdraw" && <Withdraw onSuccess={handlePanelSuccess} onCancel={closePanel} />}
              {activePanel === "transfer" && <Transfer onSuccess={handlePanelSuccess} onCancel={closePanel} />}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default CustomerDashboard;