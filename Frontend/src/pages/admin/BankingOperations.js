import React, { useState } from "react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import { getAccountsByUserId, freezeAccount, unfreezeAccount, closeAccount } from "../../api/accountApi";
import { deposit, withdraw, transfer } from "../../api/bankingApi";

function BankingOperations() {
  const [bankingUserId, setBankingUserId] = useState("");
  const [bankingAccounts, setBankingAccounts] = useState([]);
  const [selectedAccountId, setSelectedAccountId] = useState("");
  const [bankingAmount, setBankingAmount] = useState("");
  const [bankingToAccountId, setBankingToAccountId] = useState("");
  const [bankingMessage, setBankingMessage] = useState("");
  const [bankingMsgType, setBankingMsgType] = useState("success");
  const [bankingTab, setBankingTab] = useState("deposit");
  const [fetchingAccounts, setFetchingAccounts] = useState(false);

  const notifyBanking = (text, type = "success") => {
    setBankingMessage(text);
    setBankingMsgType(type);
    setTimeout(() => setBankingMessage(""), 3000);
  };

  const fetchBankingAccounts = async () => {
    if (!bankingUserId.trim()) {
      notifyBanking("Please enter a User ID.", "danger");
      return;
    }
    setFetchingAccounts(true);
    setBankingAccounts([]);
    setSelectedAccountId("");
    try {
      const res = await getAccountsByUserId(bankingUserId);
      const accounts = res.data || [];
      setBankingAccounts(accounts);
      if (accounts.length > 0) setSelectedAccountId(accounts[0].id);
      else notifyBanking("No accounts found for this user.", "warning");
    } catch {
      notifyBanking("User not found. Please check the ID.", "danger");
    }
    setFetchingAccounts(false);
  };

  const handleAdminDeposit = async () => {
    if (!selectedAccountId || !bankingAmount || parseFloat(bankingAmount) <= 0) {
      notifyBanking("Please select an account and enter a valid amount.", "danger");
      return;
    }
    try {
      await deposit({ accountId: parseInt(selectedAccountId), amount: parseFloat(bankingAmount) });
      notifyBanking("Deposit successful.", "success");
      setBankingAmount("");
    } catch {
      notifyBanking("Deposit failed. Please try again.", "danger");
    }
  };

  const handleAdminWithdraw = async () => {
    if (!selectedAccountId || !bankingAmount || parseFloat(bankingAmount) <= 0) {
      notifyBanking("Please select an account and enter a valid amount.", "danger");
      return;
    }
    try {
      await withdraw({ accountId: parseInt(selectedAccountId), amount: parseFloat(bankingAmount) });
      notifyBanking("Withdrawal successful.", "success");
      setBankingAmount("");
    } catch {
      notifyBanking("Withdrawal failed. Please try again.", "danger");
    }
  };

  const handleAdminTransfer = async () => {
    if (!selectedAccountId || !bankingToAccountId || !bankingAmount || parseFloat(bankingAmount) <= 0) {
      notifyBanking("Please fill in all transfer fields.", "danger");
      return;
    }
    try {
      await transfer({
        fromAccountId: parseInt(selectedAccountId),
        toAccountId: parseInt(bankingToAccountId),
        amount: parseFloat(bankingAmount),
      });
      notifyBanking("Transfer successful.", "success");
      setBankingAmount("");
      setBankingToAccountId("");
    } catch {
      notifyBanking("Transfer failed. Please try again.", "danger");
    }
  };

  const selectedAccount = bankingAccounts.find(
    (acc) => String(acc.id) === String(selectedAccountId)
  );

  const handleFreeze = async () => {
    try {
      await freezeAccount(selectedAccountId);
      notifyBanking("Account frozen successfully.", "success");
      fetchBankingAccounts();
    } catch {
      notifyBanking("Failed to freeze account.", "danger");
    }
  };

  const handleUnfreeze = async () => {
    try {
      await unfreezeAccount(selectedAccountId);
      notifyBanking("Account unfrozen successfully.", "success");
      fetchBankingAccounts();
    } catch {
      notifyBanking("Failed to unfreeze account.", "danger");
    }
  };

  const handleClose = async () => {
    if (!window.confirm("Closing an account cannot be undone. Continue?")) return;
    try {
      await closeAccount(selectedAccountId);
      notifyBanking("Account closed successfully.", "success");
      fetchBankingAccounts();
    } catch {
      notifyBanking("Failed to close account.", "danger");
    }
  };

  return (
    <div>
      <Navbar />
      <div className="d-flex">
        <Sidebar />
        <div className="container-fluid p-4">

          <h4 className="mb-4 fw-bold">🏦 Admin Banking Operations</h4>

          <div className="card mb-4">
            <div className="card-header bg-success text-white fw-semibold">
              Perform Banking Actions on User Accounts
            </div>
            <div className="card-body">

              {bankingMessage && (
                <div className={`alert alert-${bankingMsgType} py-2 mb-3`}>
                  {bankingMessage}
                </div>
              )}

              {/* User ID Lookup */}
              <div className="row g-3 mb-4 align-items-end">
                <div className="col-md-4">
                  <label className="form-label fw-semibold">User ID</label>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Enter User ID to load accounts"
                    value={bankingUserId}
                    onChange={(e) => setBankingUserId(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && fetchBankingAccounts()}
                  />
                </div>
                <div className="col-md-2">
                  <button
                    className="btn btn-primary w-100"
                    onClick={fetchBankingAccounts}
                    disabled={fetchingAccounts}
                  >
                    {fetchingAccounts ? "Loading..." : "Load Accounts"}
                  </button>
                </div>
                {bankingAccounts.length > 0 && (
                  <div className="col-md-4">
                    <label className="form-label fw-semibold">Select Account</label>
                    <select
                      className="form-select"
                      value={selectedAccountId}
                      onChange={(e) => setSelectedAccountId(e.target.value)}
                    >
                      {bankingAccounts.map((acc) => (
                        <option key={acc.id} value={acc.id}>
                          #{acc.id} — {acc.accType} — ₹{acc.balance} — {acc.status || "ACTIVE"}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {/* Account Status Controls */}
              {selectedAccount && (
                <div className="d-flex align-items-center gap-2 mb-4">
                  <span className="fw-semibold">Account Status:</span>
                  <span
                    className={`badge ${selectedAccount.status === "FROZEN"
                        ? "bg-warning text-dark"
                        : selectedAccount.status === "CLOSED"
                          ? "bg-secondary"
                          : "bg-success"
                      }`}
                  >
                    {selectedAccount.status || "ACTIVE"}
                  </span>
                  {selectedAccount.status !== "CLOSED" && (
                    <>
                      {selectedAccount.status === "FROZEN" ? (
                        <button className="btn btn-outline-success btn-sm" onClick={handleUnfreeze}>
                          Unfreeze
                        </button>
                      ) : (
                        <button className="btn btn-outline-warning btn-sm" onClick={handleFreeze}>
                          Freeze
                        </button>
                      )}
                      <button className="btn btn-outline-danger btn-sm" onClick={handleClose}>
                        Close Account
                      </button>
                    </>
                  )}
                </div>
              )}

              {/* Tabs */}
              {bankingAccounts.length > 0 && (
                <>
                  <ul className="nav nav-tabs mb-4">
                    <li className="nav-item">
                      <button
                        className={`nav-link ${bankingTab === "deposit" ? "active" : ""}`}
                        onClick={() => { setBankingTab("deposit"); setBankingAmount(""); setBankingToAccountId(""); }}
                      >
                        💰 Deposit
                      </button>
                    </li>
                    <li className="nav-item">
                      <button
                        className={`nav-link ${bankingTab === "withdraw" ? "active" : ""}`}
                        onClick={() => { setBankingTab("withdraw"); setBankingAmount(""); setBankingToAccountId(""); }}
                      >
                        💸 Withdraw
                      </button>
                    </li>
                    <li className="nav-item">
                      <button
                        className={`nav-link ${bankingTab === "transfer" ? "active" : ""}`}
                        onClick={() => { setBankingTab("transfer"); setBankingAmount(""); setBankingToAccountId(""); }}
                      >
                        🔁 Transfer
                      </button>
                    </li>
                  </ul>

                  {bankingTab === "deposit" && (
                    <div className="row g-3 align-items-end">
                      <div className="col-md-4">
                        <label className="form-label fw-semibold">Amount (₹)</label>
                        <input
                          type="number"
                          className="form-control"
                          placeholder="Enter amount"
                          value={bankingAmount}
                          min="0.01"
                          step="0.01"
                          onChange={(e) => setBankingAmount(e.target.value)}
                        />
                      </div>
                      <div className="col-md-2">
                        <button className="btn btn-success w-100" onClick={handleAdminDeposit} disabled={!bankingAmount}>
                          Deposit
                        </button>
                      </div>
                    </div>
                  )}

                  {bankingTab === "withdraw" && (
                    <div className="row g-3 align-items-end">
                      <div className="col-md-4">
                        <label className="form-label fw-semibold">Amount (₹)</label>
                        <input
                          type="number"
                          className="form-control"
                          placeholder="Enter amount"
                          value={bankingAmount}
                          min="0.01"
                          step="0.01"
                          onChange={(e) => setBankingAmount(e.target.value)}
                        />
                      </div>
                      <div className="col-md-2">
                        <button className="btn btn-danger w-100" onClick={handleAdminWithdraw} disabled={!bankingAmount}>
                          Withdraw
                        </button>
                      </div>
                    </div>
                  )}

                  {bankingTab === "transfer" && (
                    <div className="row g-3 align-items-end">
                      <div className="col-md-3">
                        <label className="form-label fw-semibold">To Account ID</label>
                        <input
                          type="number"
                          className="form-control"
                          placeholder="Destination account ID"
                          value={bankingToAccountId}
                          onChange={(e) => setBankingToAccountId(e.target.value)}
                        />
                      </div>
                      <div className="col-md-3">
                        <label className="form-label fw-semibold">Amount (₹)</label>
                        <input
                          type="number"
                          className="form-control"
                          placeholder="Enter amount"
                          value={bankingAmount}
                          min="0.01"
                          step="0.01"
                          onChange={(e) => setBankingAmount(e.target.value)}
                        />
                      </div>
                      <div className="col-md-2">
                        <button
                          className="btn btn-primary w-100"
                          onClick={handleAdminTransfer}
                          disabled={!bankingAmount || !bankingToAccountId}
                        >
                          Transfer
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default BankingOperations;