import React, { useState, useEffect } from "react";

import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import Loader from "../../components/Loader";
import FraudAlertPanel from "../../components/FraudAlertPanel";

import { getAllUsers, getUserById } from "../../api/userApi";
import { getAllLoans, getLoansByUserId } from "../../api/loanApi";
import { getAllTransactions } from "../../api/bankingApi";
import { getAllUserInvestments, getUserInvestments } from "../../api/investmentApi";
import { getAccountsByUserId } from "../../api/accountApi";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

  .adm-root * { box-sizing: border-box; font-family: 'Inter', sans-serif; }

  .adm-page {
    background: #f4f6fb;
    min-height: 100vh;
  }
  .adm-body {
    display: flex;
  }
  .adm-main {
    flex: 1;
    padding: 28px 32px;
    overflow: hidden;
  }

  /* Page header */
  .adm-page-header {
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 28px;
  }
  .adm-page-title {
    font-size: 19px; font-weight: 700; color: #0f172a; letter-spacing: -0.3px;
  }
  .adm-page-subtitle { font-size: 13px; color: #94a3b8; margin-top: 2px; }
  .adm-badge-live {
    display: flex; align-items: center; gap: 6px;
    background: #f0fdf4; border: 1px solid #bbf7d0;
    border-radius: 100px; padding: 5px 12px;
    font-size: 12px; font-weight: 600; color: #16a34a;
  }
  .adm-live-dot {
    width: 7px; height: 7px; border-radius: 50%; background: #22c55e;
    animation: blink 1.5s ease-in-out infinite;
  }
  @keyframes blink { 0%,100% { opacity:1; } 50% { opacity:0.3; } }

  /* KPI cards */
  .adm-kpi-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
    margin-bottom: 28px;
  }
  .adm-kpi-card {
    background: #fff;
    border-radius: 14px;
    padding: 20px 22px;
    border: 1px solid #e8edf5;
    position: relative;
    overflow: hidden;
    transition: transform 0.15s, box-shadow 0.15s;
  }
  .adm-kpi-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0,0,0,0.07);
  }
  .adm-kpi-accent {
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 3px;
    border-radius: 14px 14px 0 0;
  }
  .adm-kpi-icon-wrap {
    width: 42px; height: 42px; border-radius: 12px;
    display: flex; align-items: center; justify-content: center;
    font-size: 20px; margin-bottom: 16px;
  }
  .adm-kpi-value {
    font-size: 24px; font-weight: 700; color: #0f172a;
    letter-spacing: -1px; line-height: 1;
    margin-bottom: 4px;
  }
  .adm-kpi-label { font-size: 13px; color: #64748b; font-weight: 500; }
  .adm-kpi-delta {
    font-size: 11px; font-weight: 600;
    margin-top: 10px; display: flex; align-items: center; gap: 4px;
  }
  .adm-kpi-delta.up   { color: #16a34a; }
  .adm-kpi-delta.warn { color: #d97706; }

  /* Section heading */
  .adm-section-head {
    display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px;
  }
  .adm-section-title {
    font-size: 15px; font-weight: 700; color: #0f172a; display: flex; align-items: center; gap: 8px;
  }
  .adm-section-icon {
    width: 28px; height: 28px; border-radius: 8px;
    display: flex; align-items: center; justify-content: center; font-size: 14px;
  }

  /* Investigation panel */
  .adm-card {
    background: #fff; border-radius: 14px; border: 1px solid #e8edf5;
    margin-bottom: 20px; overflow: hidden;
  }
  .adm-card-header {
    padding: 16px 20px; border-bottom: 1px solid #f1f5f9;
    display: flex; align-items: center; justify-content: space-between;
  }
  .adm-card-body { padding: 20px; }

  .adm-search-row {
    display: flex; gap: 10px; align-items: center;
  }
  .adm-search-input-wrap {
    flex: 1; max-width: 320px;
    display: flex; align-items: center;
    background: #f8fafc; border: 1.5px solid #e2e8f0;
    border-radius: 10px; overflow: hidden;
    transition: border-color 0.15s, box-shadow 0.15s;
  }
  .adm-search-input-wrap:focus-within {
    border-color: #4f46e5;
    box-shadow: 0 0 0 3px rgba(79,70,229,0.1);
    background: #fff;
  }
  .adm-search-icon { padding: 0 11px; color: #94a3b8; font-size: 15px; }
  .adm-search-input {
    flex: 1; border: none; background: transparent;
    padding: 10px 10px 10px 0; font-size: 14px;
    color: #0f172a; font-family: 'Inter', sans-serif; outline: none;
  }
  .adm-search-input::placeholder { color: #cbd5e1; }

  .adm-btn {
    padding: 9px 18px; border-radius: 9px; font-size: 13px; font-weight: 600;
    cursor: pointer; border: none; font-family: 'Inter', sans-serif;
    display: flex; align-items: center; gap: 6px;
    transition: transform 0.12s, box-shadow 0.12s;
  }
  .adm-btn:hover:not(:disabled) { transform: translateY(-1px); }
  .adm-btn:disabled { opacity: 0.6; cursor: not-allowed; }
  .adm-btn-primary { background: #4f46e5; color: #fff; }
  .adm-btn-primary:hover:not(:disabled) { background: #3730a3; box-shadow: 0 4px 14px rgba(79,70,229,0.3); }
  .adm-btn-ghost { background: #f1f5f9; color: #475569; }
  .adm-btn-ghost:hover { background: #e2e8f0; }

  .adm-error-msg {
    display: flex; align-items: center; gap: 8px;
    background: #fef2f2; border: 1px solid #fecaca;
    border-radius: 8px; padding: 10px 14px; font-size: 13px; color: #dc2626;
    margin-top: 14px;
  }

  /* User profile card */
  .adm-user-profile {
    display: flex; align-items: center; gap: 16px;
    padding: 16px 20px; background: #f8fafc;
    border-radius: 12px; border: 1px solid #e8edf5; margin-bottom: 16px;
  }
  .adm-avatar {
    width: 52px; height: 52px; border-radius: 14px;
    background: #e0e7ff; border: 2px solid #c7d2fe;
    display: flex; align-items: center; justify-content: center;
    font-size: 22px; font-weight: 700; color: #3730a3; flex-shrink: 0;
  }
  .adm-user-name { font-size: 15px; font-weight: 700; color: #0f172a; }
  .adm-user-meta { font-size: 12px; color: #94a3b8; margin-top: 2px; }
  .adm-role-badge {
    padding: 3px 10px; border-radius: 100px; font-size: 11px; font-weight: 600;
  }
  .adm-role-user  { background: #e0e7ff; color: #3730a3; }
  .adm-role-admin { background: #fef3c7; color: #d97706; }

  .adm-info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
  .adm-info-item { padding: 10px 14px; background: #f8fafc; border-radius: 10px; border: 1px solid #f1f5f9; }
  .adm-info-label { font-size: 11px; font-weight: 600; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 3px; }
  .adm-info-value { font-size: 14px; font-weight: 500; color: #0f172a; }

  /* Tables */
  .adm-table { width: 100%; border-collapse: collapse; font-size: 13px; }
  .adm-table th {
    text-align: left; padding: 9px 12px;
    font-size: 11px; font-weight: 600; color: #94a3b8;
    text-transform: uppercase; letter-spacing: 0.5px;
    border-bottom: 1px solid #f1f5f9; background: #fafbfc;
  }
  .adm-table td {
    padding: 11px 12px; border-bottom: 1px solid #f8fafc; color: #374151;
  }
  .adm-table tr:last-child td { border-bottom: none; }
  .adm-table tr:hover td { background: #fafbfc; }
  .adm-table .mono { font-family: monospace; font-size: 12px; color: #64748b; }

  .adm-status-badge {
    padding: 3px 9px; border-radius: 100px; font-size: 11px; font-weight: 600; display: inline-flex;
  }
  .adm-status-active    { background: #f0fdf4; color: #16a34a; }
  .adm-status-pending   { background: #fef3c7; color: #d97706; }
  .adm-status-rejected  { background: #fef2f2; color: #dc2626; }
  .adm-status-approved  { background: #e0e7ff; color: #4f46e5; }

  /* Bottom row */
  .adm-bottom-grid {
    display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-top: 20px;
  }

  /* Risk items */
  .adm-risk-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 10px; }
  .adm-risk-item {
    display: flex; align-items: center; justify-content: space-between;
    padding: 12px 14px; background: #fafbfc; border-radius: 10px;
    border: 1px solid #f1f5f9;
  }
  .adm-risk-label { font-size: 13px; color: #374151; font-weight: 500; display: flex; align-items: center; gap: 8px; }
  .adm-risk-icon { font-size: 16px; }
  .adm-risk-pill {
    font-size: 11px; font-weight: 600; padding: 2px 9px;
    border-radius: 100px;
  }
  .adm-risk-high   { background: #fef2f2; color: #dc2626; }
  .adm-risk-medium { background: #fef3c7; color: #d97706; }
  .adm-risk-low    { background: #f0fdf4; color: #16a34a; }

  /* Empty state */
  .adm-empty {
    text-align: center; padding: 32px;
    color: #94a3b8; font-size: 13px;
  }
  .adm-empty-icon { font-size: 32px; margin-bottom: 10px; opacity: 0.4; }

  @media (max-width: 1100px) { .adm-kpi-grid { grid-template-columns: repeat(2, 1fr); } }
  @media (max-width: 768px)  {
    .adm-main { padding: 16px; }
    .adm-kpi-grid { grid-template-columns: 1fr 1fr; }
    .adm-bottom-grid { grid-template-columns: 1fr; }
    .adm-info-grid { grid-template-columns: 1fr; }
  }
`;

function StatusBadge({ status }) {
  const map = {
    ACTIVE: "adm-status-active", PENDING: "adm-status-pending",
    REJECTED: "adm-status-rejected", APPROVED: "adm-status-approved",
  };
  return <span className={`adm-status-badge ${map[status] || "adm-status-pending"}`}>{status}</span>;
}

function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [loans, setLoans] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [investments, setInvestments] = useState([]);

  const [searchUserId, setSearchUserId] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [userAccounts, setUserAccounts] = useState([]);
  const [userLoans, setUserLoans] = useState([]);
  const [userInvestments, setUserInvestments] = useState([]);
  const [searchError, setSearchError] = useState("");
  const [searching, setSearching] = useState(false);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const [u, l, t, i] = await Promise.all([
        getAllUsers(), getAllLoans(), getAllTransactions(), getAllUserInvestments()
      ]);
      setUsers(u.data || []);
      setLoans(l.data || []);
      setTransactions(t.data || []);
      setInvestments(i.data || []);
    } catch (err) { console.log(err); }
    setLoading(false);
  };

  const searchUser = async () => {
    if (!searchUserId.trim()) { setSearchError("Please enter a User ID."); return; }
    setSearchError(""); setSearching(true);
    setSelectedUser(null); setUserAccounts([]); setUserLoans([]); setUserInvestments([]);
    try {
      const [userRes, accountRes, loanRes, investRes] = await Promise.all([
        getUserById(searchUserId), getAccountsByUserId(searchUserId),
        getLoansByUserId(searchUserId), getUserInvestments(searchUserId),
      ]);
      setSelectedUser(userRes.data);
      setUserAccounts(accountRes.data || []);
      setUserLoans(loanRes.data || []);
      setUserInvestments(investRes.data || []);
    } catch { setSearchError("User not found. Please verify the ID and try again."); }
    setSearching(false);
  };

  const clearSearch = () => {
    setSearchUserId(""); setSelectedUser(null);
    setUserAccounts([]); setUserLoans([]); setUserInvestments([]); setSearchError("");
  };

  const getInitials = (name = "") => name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();

  if (loading) return <Loader />;

  return (
    <div className="adm-root">
      <style>{styles}</style>
      <div className="adm-page">
        <Navbar />
        <div className="adm-body">
          <Sidebar />
          <main className="adm-main">

            {/* Page header */}
            <div className="adm-page-header">
              <div>
                <h1 className="adm-page-title">Admin Dashboard</h1>
                <p className="adm-page-subtitle">Overview of platform activity and user management</p>
              </div>
              <div className="adm-badge-live">
                <span className="adm-live-dot"></span>
                Live
              </div>
            </div>

            {/* KPI Cards */}
            <div className="adm-kpi-grid">
              {[
                { label: "Total Users", value: users.length, icon: "👥", accent: "#4f46e5", bg: "#e0e7ff", delta: "+12% this month", dir: "up" },
                { label: "Transactions", value: transactions.length, icon: "💸", accent: "#16a34a", bg: "#f0fdf4", delta: "+8% this week", dir: "up" },
                { label: "Active Loans", value: loans.length, icon: "🏦", accent: "#d97706", bg: "#fef3c7", delta: "3 pending review", dir: "warn" },
                { label: "Investments", value: investments.length, icon: "📈", accent: "#7c3aed", bg: "#f5f3ff", delta: "+5% portfolio growth", dir: "up" },
              ].map((kpi) => (
                <div className="adm-kpi-card" key={kpi.label}>
                  <div className="adm-kpi-accent" style={{ background: kpi.accent }}></div>
                  <div className="adm-kpi-value">{kpi.value}</div>
                  <div className="adm-kpi-label">{kpi.label}</div>
                  <div className={`adm-kpi-delta ${kpi.dir}`}>
                    {kpi.dir === "up" ? "↑" : "⚠"} {kpi.delta}
                  </div>
                </div>
              ))}
            </div>

            {/* Investigation Panel */}
            <div className="adm-card">
              <div className="adm-card-header">
                <div className="adm-section-title">
                  <div className="adm-section-icon" style={{ background: "#e0e7ff" }}>🔍</div>
                  User Investigation Panel
                </div>
              </div>
              <div className="adm-card-body">
                <div className="adm-search-row">
                  <div className="adm-search-input-wrap">
                    <input
                      type="number"
                      className="adm-search-input"
                      placeholder="Enter User ID to investigate…"
                      value={searchUserId}
                      onChange={(e) => setSearchUserId(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && searchUser()}
                    />
                  </div>
                  <button className="adm-btn adm-btn-primary" onClick={searchUser} disabled={searching}>
                    {searching
                      ? <><span className="spinner-border spinner-border-sm" role="status"></span> Searching…</>
                      : "Search"
                    }
                  </button>
                  {selectedUser && (
                    <button className="adm-btn adm-btn-ghost" onClick={clearSearch}>
                      Clear
                    </button>
                  )}
                </div>
                {searchError && (
                  <div className="adm-error-msg">
                    {searchError}
                  </div>
                )}
              </div>
            </div>

            {/* User details */}
            {selectedUser && (
              <div className="adm-card">
                <div className="adm-card-header">
                  <div className="adm-section-title">
                    <div className="adm-section-icon" style={{ background: "#e0e7ff" }}>👤</div>
                    User Profile — ID #{selectedUser.id}
                  </div>
                  <span className={`adm-role-badge ${selectedUser.role === "ADMIN" ? "adm-role-admin" : "adm-role-user"}`}>
                    {selectedUser.role}
                  </span>
                </div>
                <div className="adm-card-body">
                  <div className="adm-user-profile">
                    <div className="adm-avatar">{getInitials(selectedUser.name)}</div>
                    <div>
                      <div className="adm-user-name">{selectedUser.name}</div>
                      <div className="adm-user-meta">{selectedUser.email}</div>
                    </div>
                  </div>
                  <div className="adm-info-grid">
                    <div className="adm-info-item">
                      <div className="adm-info-label">User ID</div>
                      <div className="adm-info-value mono">#{selectedUser.id}</div>
                    </div>
                    <div className="adm-info-item">
                      <div className="adm-info-label">Email</div>
                      <div className="adm-info-value">{selectedUser.email}</div>
                    </div>
                    <div className="adm-info-item">
                      <div className="adm-info-label">Full Name</div>
                      <div className="adm-info-value">{selectedUser.name}</div>
                    </div>
                    <div className="adm-info-item">
                      <div className="adm-info-label">Role</div>
                      <div className="adm-info-value">{selectedUser.role}</div>
                    </div>
                  </div>

                  {/* Sub-tables */}
                  {userAccounts.length > 0 && (
                    <>
                      <p style={{ fontWeight: 600, fontSize: 13, color: "#374151", marginTop: 20, marginBottom: 10 }}>Accounts</p>
                      <table className="adm-table">
                        <thead><tr><th>ID</th><th>Type</th><th>Balance</th></tr></thead>
                        <tbody>
                          {userAccounts.map(acc => (
                            <tr key={acc.id}>
                              <td className="mono">#{acc.id}</td>
                              <td>{acc.accType}</td>
                              <td style={{ fontWeight: 600 }}>₹{acc.balance?.toLocaleString("en-IN")}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </>
                  )}

                  {userLoans.length > 0 && (
                    <>
                      <p style={{ fontWeight: 600, fontSize: 13, color: "#374151", marginTop: 20, marginBottom: 10 }}>Loans</p>
                      <table className="adm-table">
                        <thead><tr><th>Loan ID</th><th>Amount</th><th>Status</th></tr></thead>
                        <tbody>
                          {userLoans.map(loan => (
                            <tr key={loan.loanId}>
                              <td className="mono">#{loan.loanId}</td>
                              <td style={{ fontWeight: 600 }}>₹{loan.amount?.toLocaleString("en-IN")}</td>
                              <td><StatusBadge status={loan.status} /></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </>
                  )}

                  {userInvestments.length > 0 && (
                    <>
                      <p style={{ fontWeight: 600, fontSize: 13, color: "#374151", marginTop: 20, marginBottom: 10 }}>Investments</p>
                      <table className="adm-table">
                        <thead><tr><th>ID</th><th>Amount</th></tr></thead>
                        <tbody>
                          {userInvestments.map(inv => (
                            <tr key={inv.id}>
                              <td className="mono">#{inv.id}</td>
                              <td style={{ fontWeight: 600 }}>₹{inv.amount?.toLocaleString("en-IN")}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Latest Users */}
            <div className="adm-card">
              <div className="adm-card-header">
                <div className="adm-section-title">
                  <div className="adm-section-icon" style={{ background: "#f5f3ff" }}>🧾</div>
                  Latest Users
                </div>
                <span style={{ fontSize: 12, color: "#94a3b8" }}>Showing last 10</span>
              </div>
              <div style={{ overflowX: "auto" }}>
                <table className="adm-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Email</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.slice(0, 10).map(user => (
                      <tr key={user.id}>
                        <td className="mono">#{user.id}</td>
                        <td>
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <div style={{
                              width: 28, height: 28, borderRadius: 8, background: "#e0e7ff",
                              display: "flex", alignItems: "center", justifyContent: "center",
                              fontSize: 11, fontWeight: 700, color: "#3730a3", flexShrink: 0
                            }}>
                              {user.name?.[0]?.toUpperCase()}
                            </div>
                            {user.name}
                          </div>
                        </td>
                        <td style={{ color: "#64748b" }}>{user.email}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Bottom: Fraud Alert + Risk Monitoring */}
            <div className="adm-bottom-grid">
              <div className="adm-card">
                <div className="adm-card-header">
                  <div className="adm-section-title">
                    <div className="adm-section-icon" style={{ background: "#fef2f2" }}>🚨</div>
                    Fraud Alerts
                  </div>
                </div>
                <div className="adm-card-body">
                  <FraudAlertPanel />
                </div>
              </div>

              <div className="adm-card">
                <div className="adm-card-header">
                  <div className="adm-section-title">
                    <div className="adm-section-icon" style={{ background: "#fef3c7" }}>⚠️</div>
                    Risk Monitoring
                  </div>
                </div>
                <div className="adm-card-body">
                  <ul className="adm-risk-list">
                    {[
                      { label: "Repeated OTP Failures", icon: "🔁", level: "high" },
                      { label: "High Value Transfer", icon: "💰", level: "high" },
                      { label: "New Device Login", icon: "📱", level: "medium" },
                      { label: "Unusual Withdrawal Pattern", icon: "🏧", level: "medium" },
                      { label: "Identity Verification Pending", icon: "🪪", level: "low" },
                    ].map(({ label, icon, level }) => (
                      <li className="adm-risk-item" key={label}>
                        <span className="adm-risk-label">
                          <span className="adm-risk-icon">{icon}</span>
                          {label}
                        </span>
                        <span className={`adm-risk-pill adm-risk-${level}`}>
                          {level.charAt(0).toUpperCase() + level.slice(1)}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

          </main>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;