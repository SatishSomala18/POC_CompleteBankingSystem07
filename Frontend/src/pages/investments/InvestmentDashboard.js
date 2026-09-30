import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import Loader from "../../components/Loader";

import {
  getAllInvestments,
  addInvestment,
  addUserInvestment,
  getUserInvestments,
} from "../../api/investmentApi";
import { getAccountId, getUserId, getRole } from "../../utils/auth";

function InvestmentDashboard() {

  const role = getRole();

  const [loading, setLoading] = useState(true);
  const [investments, setInvestments] = useState([]);
  const [amounts, setAmounts] = useState({});
  const [message, setMessage] = useState("");
  const [msgType, setMsgType] = useState("info");

  // USER-only state
  const [myInvestments, setMyInvestments] = useState([]);
  const [showMyInvestments, setShowMyInvestments] = useState(false);

  // ADMIN-only: Add Investment form
  const [showAddForm, setShowAddForm] = useState(false);
  const [newInvestment, setNewInvestment] = useState({ type: "", riskLevel: "LOW", minAmount: "" });
  const [addingInvestment, setAddingInvestment] = useState(false);

  useEffect(() => {
    loadInvestments();
    if (role === "USER") loadMyInvestments();
  }, []);

  const notify = (text, type = "info") => {
    setMessage(text);
    setMsgType(type);
    setTimeout(() => setMessage(""), 3000);
  };

  const loadInvestments = async () => {
    try {
      const response = await getAllInvestments();
      setInvestments(response.data || []);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  const loadMyInvestments = async () => {
    try {
      const response = await getUserInvestments(getUserId());
      setMyInvestments(response.data || []);
    } catch (error) {
      console.log(error);
      notify("Unable to load your investments.", "danger");
    }
  };

  const invest = async (product) => {
    try {
      await addUserInvestment({
        accountId: getAccountId(),
        investmentId: product.id,
        amount: parseFloat(amounts[product.id] || 0),
      });
      notify("Investment added successfully.", "success");
      loadMyInvestments();
      setAmounts({ ...amounts, [product.id]: "" });
    } catch (error) {
      notify("Investment failed. Please try again.", "danger");
    }
  };

  // ADMIN: Add new investment type
  const handleAddInvestment = async () => {
    if (!newInvestment.type.trim()) {
      notify("Please enter an investment type.", "danger");
      return;
    }
    setAddingInvestment(true);
    try {
      await addInvestment({
        type: newInvestment.type.trim(),
        riskLevel: newInvestment.riskLevel,
        ...(newInvestment.minAmount ? { minAmount: parseFloat(newInvestment.minAmount) } : {}),
      });
      notify("Investment type added successfully.", "success");
      setNewInvestment({ type: "", riskLevel: "LOW", minAmount: "" });
      setShowAddForm(false);
      loadInvestments();
    } catch (error) {
      notify("Failed to add investment type. Please try again.", "danger");
    }
    setAddingInvestment(false);
  };

  if (loading) return <Loader />;

  const getRiskLevelForType = (investmentType) => {
    const match = investments.find((p) => p.type === investmentType);
    return match ? match.riskLevel : null;
  };

  const totalInvested = myInvestments.reduce(
    (sum, inv) => sum + (parseFloat(inv.amount) || 0),
    0
  );

  const riskBadgeClass = (riskLevel) =>
    riskLevel === "LOW" ? "bg-success" :
      riskLevel === "MEDIUM" ? "bg-warning text-dark" :
        riskLevel === "HIGH" ? "bg-danger" :
          "bg-secondary";

  // ─────────────────────────────────────────────
  // ADMIN VIEW
  // ─────────────────────────────────────────────
  if (role === "ADMIN") {
    return (
      <div className="bg-light min-vh-100">
        <Navbar />
        <div className="d-flex">
          <Sidebar />
          <div className="container-fluid p-4">

            {message && (
              <div className={`alert alert-${msgType} alert-dismissible d-flex align-items-center gap-2 mb-4 shadow-sm rounded-3`} role="alert">
                <i className={`bi ${msgType === "success" ? "bi-check-circle-fill" : "bi-x-circle-fill"} fs-6`}></i>
                <span>{message}</span>
                <button type="button" className="btn-close ms-auto" onClick={() => setMessage("")} />
              </div>
            )}

            {/* Header row */}
            <div className="d-flex align-items-center justify-content-between mb-4">
              <h4 className="fw-bold mb-0">
                <i className="bi bi-graph-up-arrow me-2 text-success"></i>
                Investment Products
              </h4>
              <button
                className="btn btn-success fw-semibold rounded-3 px-4"
                onClick={() => setShowAddForm((prev) => !prev)}
              >
                <i className={`bi ${showAddForm ? "bi-x-lg" : "bi-plus-lg"} me-2`}></i>
                {showAddForm ? "Cancel" : "Add Investment Type"}
              </button>
            </div>

            {/* Add Investment Form */}
            {showAddForm && (
              <div className="card border-0 shadow-sm rounded-3 mb-4">
                <div className="card-header bg-white border-bottom fw-bold text-dark py-3">
                  <i className="bi bi-plus-circle me-2 text-success"></i>
                  New Investment Type
                </div>
                <div className="card-body">
                  <div className="row g-3 align-items-end">
                    <div className="col-md-4">
                      <label className="form-label fw-semibold">Investment Type <span className="text-danger">*</span></label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g. Mutual Fund, SIP, Bonds"
                        value={newInvestment.type}
                        onChange={(e) => setNewInvestment({ ...newInvestment, type: e.target.value })}
                      />
                    </div>
                    <div className="col-md-3">
                      <label className="form-label fw-semibold">Risk Level</label>
                      <select
                        className="form-select"
                        value={newInvestment.riskLevel}
                        onChange={(e) => setNewInvestment({ ...newInvestment, riskLevel: e.target.value })}
                      >
                        <option value="LOW">Low</option>
                        <option value="MEDIUM">Medium</option>
                        <option value="HIGH">High</option>
                      </select>
                    </div>
                    <div className="col-md-3">
                      <label className="form-label fw-semibold">Min. Amount (₹) <span className="text-muted fw-normal">(optional)</span></label>
                      <input
                        type="number"
                        className="form-control"
                        placeholder="e.g. 5000"
                        value={newInvestment.minAmount}
                        onChange={(e) => setNewInvestment({ ...newInvestment, minAmount: e.target.value })}
                      />
                    </div>
                    <div className="col-md-2">
                      <button
                        className="btn btn-success w-100 fw-semibold"
                        onClick={handleAddInvestment}
                        disabled={addingInvestment}
                      >
                        {addingInvestment ? "Adding..." : "Add"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Investment Products Table */}
            <div className="card border-0 shadow-sm rounded-3">
              <div className="card-header bg-white border-bottom fw-bold text-dark py-3">
                <i className="bi bi-list-ul me-2 text-primary"></i>
                Available Investment Types
                <span className="badge bg-primary ms-2">{investments.length}</span>
              </div>
              <div className="card-body p-0">
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="table-light">
                      <tr>
                        <th className="ps-3 text-muted small text-uppercase fw-semibold" style={{ fontSize: "11px" }}>ID</th>
                        <th className="text-muted small text-uppercase fw-semibold" style={{ fontSize: "11px" }}>Type</th>
                        <th className="text-muted small text-uppercase fw-semibold" style={{ fontSize: "11px" }}>Risk Level</th>
                        <th className="text-muted small text-uppercase fw-semibold" style={{ fontSize: "11px" }}>Min. Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {investments.length === 0 ? (
                        <tr>
                          <td colSpan="4" className="text-center text-muted py-5">
                            <i className="bi bi-inbox fs-1 d-block mb-2 text-secondary opacity-50"></i>
                            No investment products available
                          </td>
                        </tr>
                      ) : (
                        investments.map((inv) => (
                          <tr key={inv.id}>
                            <td className="ps-3 fw-semibold text-dark">#{inv.id}</td>
                            <td className="fw-semibold">{inv.type}</td>
                            <td>
                              <span className={`badge ${riskBadgeClass(inv.riskLevel)}`}>
                                {inv.riskLevel}
                              </span>
                            </td>
                            <td className="text-muted">
                              {inv.minAmount ? `₹${parseFloat(inv.minAmount).toLocaleString("en-IN")}` : "—"}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────
  // USER VIEW (unchanged)
  // ─────────────────────────────────────────────
  return (
    <div className="bg-light min-vh-100">
      <Navbar />
      <div className="d-flex">
        <Sidebar />
        <div className="container-fluid p-4">

          {message && (
            <div className={`alert alert-${msgType} alert-dismissible d-flex align-items-center gap-2 mb-4 shadow-sm rounded-3`} role="alert">
              <i className={`bi ${msgType === "success" ? "bi-check-circle-fill" : "bi-x-circle-fill"} fs-6`}></i>
              <span>{message}</span>
              <button type="button" className="btn-close ms-auto" onClick={() => setMessage("")} />
            </div>
          )}

          {/* Summary Cards */}
          <div className="row g-3 mb-4">
            <div className="col-6 col-md-3">
              <div className="card border-0 shadow-sm rounded-3 h-100">
                <div className="card-body d-flex align-items-center gap-3 py-3">

                  <div>
                    <p className="text-uppercase text-muted fw-semibold mb-1" style={{ fontSize: "11px", letterSpacing: "0.5px" }}>
                      My Investments
                    </p>
                    <h3 className="fw-bold mb-0 text-dark">{myInvestments.length}</h3>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="card border-0 shadow-sm rounded-3 h-100">
                <div className="card-body d-flex align-items-center gap-3 py-3">

                  <div>
                    <p className="text-uppercase text-muted fw-semibold mb-1" style={{ fontSize: "11px", letterSpacing: "0.5px" }}>
                      Total Invested
                    </p>
                    <h3 className="fw-bold mb-0 text-dark">₹{totalInvested.toLocaleString("en-IN")}</h3>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-12 col-md-6 d-flex align-items-center justify-content-md-end">
              <button
                className="btn btn-outline-primary fw-semibold rounded-3 px-4 py-2"
                onClick={() => setShowMyInvestments(true)}
              >
                <i className="bi bi-briefcase me-2"></i>
                View My Investments
              </button>
            </div>
          </div>

          {/* Available Investments Table */}
          <div className="card border-0 shadow-sm rounded-3">
            <div className="card-header bg-white border-bottom fw-bold text-dark py-3 rounded-top-3">
              <i className="bi bi-graph-up-arrow me-2 text-success"></i>
              Available Investments
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th className="ps-3 text-muted small text-uppercase fw-semibold" style={{ fontSize: "11px" }}>ID</th>
                      <th className="text-muted small text-uppercase fw-semibold" style={{ fontSize: "11px" }}>Type</th>
                      <th className="text-muted small text-uppercase fw-semibold" style={{ fontSize: "11px" }}>Risk</th>
                      <th className="text-muted small text-uppercase fw-semibold" style={{ fontSize: "11px" }}>Amount</th>
                      <th className="text-muted small text-uppercase fw-semibold" style={{ fontSize: "11px" }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {investments.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="text-center text-muted py-5">
                          <i className="bi bi-inbox fs-1 d-block mb-2 text-secondary opacity-50"></i>
                          No investment products available
                        </td>
                      </tr>
                    ) : (
                      investments.map((inv) => (
                        <tr key={inv.id}>
                          <td className="ps-3 fw-semibold text-dark">#{inv.id}</td>
                          <td>{inv.type}</td>
                          <td>
                            <span className={`badge ${riskBadgeClass(inv.riskLevel)}`}>
                              {inv.riskLevel}
                            </span>
                          </td>
                          <td style={{ maxWidth: "150px" }}>
                            <input
                              type="number"
                              className="form-control form-control-sm"
                              placeholder="₹ Amount"
                              value={amounts[inv.id] || ""}
                              onChange={(e) => setAmounts({ ...amounts, [inv.id]: e.target.value })}
                            />
                          </td>
                          <td>
                            <button
                              className="btn btn-success btn-sm fw-semibold rounded-3"
                              onClick={() => invest(inv)}
                            >
                              <i className="bi bi-check-circle me-1"></i>
                              Invest
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* My Investments Modal */}
          {showMyInvestments && (
            <>
              <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
                <div className="modal-dialog modal-lg modal-dialog-centered">
                  <div className="modal-content rounded-4 border-0 shadow">
                    <div className="modal-header border-bottom">
                      <h5 className="modal-title fw-bold text-dark">
                        <i className="bi bi-briefcase me-2 text-primary"></i>
                        My Investments
                      </h5>
                      <button type="button" className="btn-close" onClick={() => setShowMyInvestments(false)}></button>
                    </div>
                    <div className="modal-body p-0">
                      <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                          <thead className="table-light">
                            <tr>
                              <th className="ps-3 text-muted small text-uppercase fw-semibold" style={{ fontSize: "11px" }}>ID</th>
                              <th className="text-muted small text-uppercase fw-semibold" style={{ fontSize: "11px" }}>Name</th>
                              <th className="text-muted small text-uppercase fw-semibold" style={{ fontSize: "11px" }}>Type</th>
                              <th className="text-muted small text-uppercase fw-semibold" style={{ fontSize: "11px" }}>Risk Level</th>
                              <th className="text-muted small text-uppercase fw-semibold" style={{ fontSize: "11px" }}>Amount</th>
                            </tr>
                          </thead>
                          <tbody>
                            {myInvestments.length === 0 ? (
                              <tr>
                                <td colSpan="5" className="text-center text-muted py-5">
                                  <i className="bi bi-piggy-bank fs-1 d-block mb-2 text-secondary opacity-50"></i>
                                  You haven't made any investments yet
                                </td>
                              </tr>
                            ) : (
                              myInvestments.map((inv) => {
                                const riskLevel = getRiskLevelForType(inv.investmentType);
                                return (
                                  <tr key={inv.id}>
                                    <td className="ps-3 fw-semibold text-dark">#{inv.id}</td>
                                    <td>{inv.name || "—"}</td>
                                    <td>{inv.investmentType || "—"}</td>
                                    <td>
                                      {riskLevel ? (
                                        <span className={`badge ${riskBadgeClass(riskLevel)}`}>{riskLevel}</span>
                                      ) : (
                                        <span className="text-muted">—</span>
                                      )}
                                    </td>
                                    <td className="fw-bold text-dark">
                                      ₹{parseFloat(inv.amount || 0).toLocaleString("en-IN")}
                                    </td>
                                  </tr>
                                );
                              })
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                    <div className="modal-footer border-top">
                      <button className="btn btn-secondary rounded-3" onClick={() => setShowMyInvestments(false)}>
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-backdrop fade show" onClick={() => setShowMyInvestments(false)}></div>
            </>
          )}

        </div>
      </div>
    </div>
  );
}

export default InvestmentDashboard;