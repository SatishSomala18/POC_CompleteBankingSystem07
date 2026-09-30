import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import Loader from "../../components/Loader";
import FraudAlertPanel from "../../components/FraudAlertPanel";

import {
  getLoansByUserId,
  getAllLoans,
  approveLoan,
  rejectLoan,
  markEmiPaid,
} from "../../api/loanApi";
import { getUserId, getRole } from "../../utils/auth";

function LoanDashboard() {
  const role = getRole();

  const [loading, setLoading] = useState(true);
  const [loans, setLoans] = useState([]);
  const [filterStatus, setFilterStatus] = useState("ALL");

  useEffect(() => {
    loadLoans();
  }, []);

  const loadLoans = async () => {
    try {
      const response =
        role === "ADMIN"
          ? await getAllLoans()
          : await getLoansByUserId(getUserId());
      setLoans(response.data || []);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  const approve = async (id) => {
    try {
      await approveLoan(id);
      loadLoans();
    } catch (error) {
      console.log(error);
    }
  };

  const reject = async (id) => {
    try {
      await rejectLoan(id);
      loadLoans();
    } catch (error) {
      console.log(error);
    }
  };

  const payEmi = async (id) => {
    try {
      await markEmiPaid(id);
      loadLoans();
    } catch (error) {
      console.log(error);
    }
  };

  const statusBadge = (status) => {
    if (status === "APPROVED")
      return <span className="badge bg-success">Approved</span>;
    if (status === "PENDING")
      return <span className="badge bg-warning text-dark">Pending</span>;
    if (status === "REJECTED")
      return <span className="badge bg-danger">Rejected</span>;
    return <span className="badge bg-secondary">{status}</span>;
  };

  const filteredLoans =
    filterStatus === "ALL"
      ? loans
      : loans.filter((loan) => loan.status === filterStatus);

  if (loading) return <Loader />;

  // ─────────────────────────────────────────────
  // ADMIN VIEW
  // ─────────────────────────────────────────────
  if (role === "ADMIN") {
    return (
      <div>
        <Navbar />
        <div className="d-flex">
          <Sidebar />
          <div className="container-fluid p-4">

            {/* KPI Summary */}
            <div className="row g-3 mb-4">
              <div className="col-6 col-md-3">
                <div className="card border-0 shadow-sm rounded-3 h-100">
                  <div className="card-body d-flex align-items-center gap-3 py-3">

                    <div>
                      <p className="text-uppercase text-muted fw-semibold mb-1" style={{ fontSize: "11px" }}>
                        Total Loans
                      </p>
                      <h3 className="fw-bold mb-0">{loans.length}</h3>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-6 col-md-3">
                <div className="card border-0 shadow-sm rounded-3 h-100">
                  <div className="card-body d-flex align-items-center gap-3 py-3">

                    <div>
                      <p className="text-uppercase text-muted fw-semibold mb-1" style={{ fontSize: "11px" }}>
                        Pending
                      </p>
                      <h3 className="fw-bold mb-0">
                        {loans.filter((l) => l.status === "PENDING").length}
                      </h3>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-6 col-md-3">
                <div className="card border-0 shadow-sm rounded-3 h-100">
                  <div className="card-body d-flex align-items-center gap-3 py-3">

                    <div>
                      <p className="text-uppercase text-muted fw-semibold mb-1" style={{ fontSize: "11px" }}>
                        Approved
                      </p>
                      <h3 className="fw-bold mb-0">
                        {loans.filter((l) => l.status === "APPROVED").length}
                      </h3>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-6 col-md-3">
                <div className="card border-0 shadow-sm rounded-3 h-100">
                  <div className="card-body d-flex align-items-center gap-3 py-3">

                    <div>
                      <p className="text-uppercase text-muted fw-semibold mb-1" style={{ fontSize: "11px" }}>
                        Rejected
                      </p>
                      <h3 className="fw-bold mb-0">
                        {loans.filter((l) => l.status === "REJECTED").length}
                      </h3>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="card border-0 shadow-sm rounded-3">
              <div className="card-header bg-white border-bottom py-3 d-flex align-items-center justify-content-between flex-wrap gap-2">
                <span className="fw-bold text-dark">
                  <i className="bi bi-credit-card-2-front me-2 text-primary"></i>
                  All Loan Applications
                </span>
                <div className="d-flex gap-2">
                  {["ALL", "PENDING", "APPROVED", "REJECTED"].map((status) => (
                    <button
                      key={status}
                      className={`btn btn-sm fw-semibold rounded-3 ${filterStatus === status
                        ? status === "PENDING" ? "btn-warning"
                          : status === "APPROVED" ? "btn-success"
                            : status === "REJECTED" ? "btn-danger"
                              : "btn-primary"
                        : "btn-outline-secondary"
                        }`}
                      onClick={() => setFilterStatus(status)}
                    >
                      {status === "ALL" ? "All" : status.charAt(0) + status.slice(1).toLowerCase()}
                      <span className="ms-1 badge bg-white bg-opacity-25 text-dark">
                        {status === "ALL"
                          ? loans.length
                          : loans.filter((l) => l.status === status).length}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="card-body p-0">
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="table-light">
                      <tr>
                        <th className="ps-3 text-muted small text-uppercase fw-semibold" style={{ fontSize: "11px" }}>Loan ID</th>
                        <th className="text-muted small text-uppercase fw-semibold" style={{ fontSize: "11px" }}>User ID</th>
                        <th className="text-muted small text-uppercase fw-semibold" style={{ fontSize: "11px" }}>Amount</th>
                        <th className="text-muted small text-uppercase fw-semibold" style={{ fontSize: "11px" }}>Tenure</th>
                        <th className="text-muted small text-uppercase fw-semibold" style={{ fontSize: "11px" }}>Credit Score</th>
                        <th className="text-muted small text-uppercase fw-semibold" style={{ fontSize: "11px" }}>Status</th>
                        <th className="text-muted small text-uppercase fw-semibold" style={{ fontSize: "11px" }}>Delinquent</th>
                        <th className="text-muted small text-uppercase fw-semibold" style={{ fontSize: "11px" }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredLoans.length === 0 ? (
                        <tr>
                          <td colSpan="8" className="text-center text-muted py-5">
                            <i className="bi bi-inbox fs-1 d-block mb-2 text-secondary opacity-50"></i>
                            No loans found for this filter
                          </td>
                        </tr>
                      ) : (
                        filteredLoans.map((loan) => (
                          <tr key={loan.loanId}>
                            <td className="ps-3 fw-semibold text-dark">#{loan.loanId}</td>
                            <td className="text-muted">{loan.userId ?? "—"}</td>
                            <td className="fw-semibold">₹{loan.amount}</td>
                            <td>{loan.tenureMonths} Months</td>
                            <td>
                              {loan.creditScore != null ? (
                                <span className={`badge ${loan.creditScore >= 750 ? "bg-success" :
                                  loan.creditScore >= 600 ? "bg-warning text-dark" :
                                    "bg-danger"
                                  }`}>
                                  {loan.creditScore}
                                </span>
                              ) : (
                                <span className="text-muted">—</span>
                              )}
                            </td>
                            <td>{statusBadge(loan.status)}</td>
                            <td>
                              {loan.status === "APPROVED" ? (
                                loan.delinquent ? (
                                  <span className="badge bg-danger">{loan.overdueDays}d overdue</span>
                                ) : (
                                  <span className="badge bg-success">On track</span>
                                )
                              ) : (
                                <span className="text-muted small">—</span>
                              )}
                            </td>
                            <td>
                              {loan.status === "PENDING" ? (
                                <div className="d-flex gap-2">
                                  <button
                                    className="btn btn-success btn-sm fw-semibold rounded-3"
                                    onClick={() => approve(loan.loanId)}
                                  >
                                    <i className="bi bi-check-lg me-1"></i>
                                    Approve
                                  </button>
                                  <button
                                    className="btn btn-danger btn-sm fw-semibold rounded-3"
                                    onClick={() => reject(loan.loanId)}
                                  >
                                    <i className="bi bi-x-lg me-1"></i>
                                    Reject
                                  </button>
                                </div>
                              ) : (
                                <span className="text-muted small fst-italic">No action needed</span>
                              )}
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
    <div>
      <Navbar />
      <div className="d-flex">
        <Sidebar />
        <div className="container-fluid p-4">
          <div className="row">
            <div className="col-md-8">
              <div className="card">
                <div className="card-header">Loan Applications</div>
                <div className="card-body">
                  <table className="table table-bordered">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Amount</th>
                        <th>Tenure</th>
                        <th>Status</th>
                        <th>EMI</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loans.map((loan) => (
                        <tr key={loan.loanId}>
                          <td>{loan.loanId}</td>
                          <td>₹{loan.amount}</td>
                          <td>{loan.tenureMonths} Months</td>
                          <td>
                            {statusBadge(loan.status)}
                            {loan.status === "APPROVED" && loan.delinquent && (
                              <span className="badge bg-danger ms-2">{loan.overdueDays}d overdue</span>
                            )}
                          </td>
                          <td>
                            {loan.status === "APPROVED" && (
                              <button
                                className="btn btn-outline-success btn-sm"
                                onClick={() => payEmi(loan.loanId)}
                              >
                                Mark EMI Paid
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <FraudAlertPanel />
              <div className="card mt-3">
                <div className="card-header">Loan Insights</div>
                <div className="card-body">
                  <ul>
                    <li>Improve credit score for lower interest rates</li>
                    <li>Maintain transaction consistency</li>
                    <li>Avoid excessive withdrawals</li>
                    <li>Keep investments active</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoanDashboard;