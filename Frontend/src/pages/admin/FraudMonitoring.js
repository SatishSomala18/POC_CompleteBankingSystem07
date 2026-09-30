import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import Loader from "../../components/Loader";
import { getAllTransactions } from "../../api/bankingApi";

/* ── Severity thresholds (documented, not arbitrary) ──────────────────────
   HIGH   : single transaction >= ₹1,00,000
   MEDIUM : single transaction >= ₹50,000 (below HIGH threshold)
   MEDIUM : 3+ same-type transactions (deposit/withdraw/transfer) by the
            same account on the same calendar day
   These are basic velocity + amount heuristics derived from real
   transaction data returned by getAllTransactions(). There is no
   dedicated fraud-detection backend, so this page does not show
   device fingerprinting, geolocation, or OTP-failure alerts — those
   would require data this app does not currently capture. ─────────────── */
const HIGH_AMOUNT_THRESHOLD = 100000;
const MEDIUM_AMOUNT_THRESHOLD = 50000;
const VELOCITY_THRESHOLD = 3; // same-type txns per account per day

function severityBadge(severity) {
  const cls =
    severity === "HIGH" ? "bg-danger" :
      severity === "MEDIUM" ? "bg-warning text-dark" :
        "bg-success";
  return <span className={`badge ${cls}`}>{severity}</span>;
}

function FraudMonitoring() {
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    try {
      const response = await getAllTransactions();
      const txList = response.data || [];
      setTransactions(txList);
      setAlerts(deriveAlerts(txList));
    } catch (error) {
      console.log(error);
      setMessage("Unable to load transaction data for fraud analysis.");
    }
    setLoading(false);
  };

  /* ── Derive real alerts from real transaction data ──────────────────── */
  const deriveAlerts = (txList) => {
    const derivedAlerts = [];
    let alertId = 1;

    // 1. Amount-based flags — check each transaction individually
    txList.forEach((tx) => {
      const amount = parseFloat(tx.amount) || 0;
      const acctId = tx.fromAccount ? tx.fromAccount.id : (tx.toAccount ? tx.toAccount.id : "Unknown");

      if (amount >= HIGH_AMOUNT_THRESHOLD) {
        derivedAlerts.push({
          id: alertId++,
          severity: "HIGH",
          message: `${tx.type || "Transaction"} of ₹${amount.toLocaleString("en-IN")} by Account #${acctId} exceeds high-value threshold`,
          txId: tx.tid,
        });
      } else if (amount >= MEDIUM_AMOUNT_THRESHOLD) {
        derivedAlerts.push({
          id: alertId++,
          severity: "MEDIUM",
          message: `${tx.type || "Transaction"} of ₹${amount.toLocaleString("en-IN")} by Account #${acctId} is above normal range`,
          txId: tx.tid,
        });
      }
    });

    // 2. Velocity-based flags — group by accountId + type + calendar day
    const groups = {};
    txList.forEach((tx) => {
      const acctId = tx.fromAccount ? tx.fromAccount.id : (tx.toAccount ? tx.toAccount.id : null);
      if (!acctId || !tx.timestamp) return;

      const day = new Date(tx.timestamp).toDateString();
      const key = `${acctId}__${tx.type}__${day}`;

      if (!groups[key]) groups[key] = { acctId, type: tx.type, day, count: 0 };
      groups[key].count += 1;
    });

    Object.values(groups).forEach((group) => {
      if (group.count >= VELOCITY_THRESHOLD) {
        derivedAlerts.push({
          id: alertId++,
          severity: "MEDIUM",
          message: `Account #${group.acctId} made ${group.count} ${group.type?.toLowerCase()} transactions on ${group.day}`,
          txId: null,
        });
      }
    });

    return derivedAlerts;
  };

  if (loading) return <Loader />;

  const highCount = alerts.filter((a) => a.severity === "HIGH").length;
  const mediumCount = alerts.filter((a) => a.severity === "MEDIUM").length;

  return (
    <div className="bg-light min-vh-100">
      <Navbar />
      <div className="d-flex">
        <Sidebar />
        <div className="container-fluid p-4">

          {message && (
            <div className="alert alert-danger d-flex align-items-center gap-2 mb-4 shadow-sm rounded-3" role="alert">
              <span>{message}</span>
            </div>
          )}

          {/* ── Summary KPIs ──────────────────────────────────────────── */}
          <div className="row g-3 mb-4">
            <div className="col-6 col-md-3">
              <div className="card border-0 shadow-sm rounded-3 h-100">
                <div className="card-body d-flex align-items-center gap-3 py-3">

                  <div>
                    <p className="text-uppercase text-muted fw-semibold mb-1" style={{ fontSize: "11px" }}>High Severity</p>
                    <h3 className="fw-bold mb-0 text-dark">{highCount}</h3>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="card border-0 shadow-sm rounded-3 h-100">
                <div className="card-body d-flex align-items-center gap-3 py-3">

                  <div>
                    <p className="text-uppercase text-muted fw-semibold mb-1" style={{ fontSize: "11px" }}>Medium Severity</p>
                    <h3 className="fw-bold mb-0 text-dark">{mediumCount}</h3>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="card border-0 shadow-sm rounded-3 h-100">
                <div className="card-body d-flex align-items-center gap-3 py-3">

                  <div>
                    <p className="text-uppercase text-muted fw-semibold mb-1" style={{ fontSize: "11px" }}>Transactions Scanned</p>
                    <h3 className="fw-bold mb-0 text-dark">{transactions.length}</h3>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="card border-0 shadow-sm rounded-3 h-100">
                <div className="card-body d-flex align-items-center gap-3 py-3">

                  <div>
                    <p className="text-uppercase text-muted fw-semibold mb-1" style={{ fontSize: "11px" }}>Total Alerts</p>
                    <h3 className="fw-bold mb-0 text-dark">{alerts.length}</h3>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Alerts table ─────────────────────────────────────────── */}
          <div className="card border-0 shadow-sm rounded-3 mb-4">
            <div className="card-header bg-white border-bottom fw-bold text-dark py-3">
              Fraud Monitoring Center
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th className="ps-3 text-muted small text-uppercase fw-semibold" style={{ fontSize: "11px" }}>ID</th>
                      <th className="text-muted small text-uppercase fw-semibold" style={{ fontSize: "11px" }}>Severity</th>
                      <th className="text-muted small text-uppercase fw-semibold" style={{ fontSize: "11px" }}>Alert</th>
                    </tr>
                  </thead>
                  <tbody>
                    {alerts.length === 0 ? (
                      <tr>
                        <td colSpan="3" className="text-center text-muted py-5">
                          No suspicious activity detected
                        </td>
                      </tr>
                    ) : (
                      alerts.map((alert) => (
                        <tr key={alert.id}>
                          <td className="ps-3 fw-semibold text-dark">#{alert.id}</td>
                          <td>{severityBadge(alert.severity)}</td>
                          <td className="small">{alert.message}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* ── Methodology note (honest about limitations) ────────────── */}
          <div className="card border-0 shadow-sm rounded-3 mb-4">
            <div className="card-header bg-white border-bottom fw-bold text-dark py-3">
              How These Alerts Are Generated
            </div>
            <div className="card-body">
              <p className="small text-muted mb-2">
                These alerts are calculated live from transaction records using two basic rules:
              </p>
              <ul className="small text-muted mb-0">
                <li>
                  <strong className="text-dark">High-value transactions:</strong> any single deposit, withdrawal, or transfer of ₹1,00,000 or more.
                </li>
                <li>
                  <strong className="text-dark">Above-average transactions:</strong> any single transaction of ₹50,000–₹99,999.
                </li>
                <li>
                  <strong className="text-dark">High-frequency activity:</strong> an account making 3 or more same-type transactions on the same calendar day.
                </li>
              </ul>
              <p className="small text-muted mt-2 mb-0">
                This app does not currently track OTP failures, device fingerprints, or login geolocation, so alerts related to those signals are not shown until that data is captured by the backend.
              </p>
            </div>
          </div>

          {/* ── Fraud prevention suggestions ────────────────────────────── */}
          <div className="card border-0 shadow-sm rounded-3">
            <div className="card-header bg-white border-bottom fw-bold text-dark py-3">
              Fraud Prevention Suggestions
            </div>
            <div className="card-body">
              <div className="row g-2">
                {[
                  { text: "Enable device fingerprinting" },
                  { text: "Enable transaction velocity checks" },
                  { text: "Add geolocation anomaly detection" },
                  { text: "Introduce beneficiary cooling period" },
                  { text: "Enable account freeze mechanism" },
                  { text: "Implement risk scoring" },
                ].map((s) => (
                  <div className="col-md-6" key={s.text}>
                    <div className="d-flex align-items-center gap-2 p-2">
                      <span className="small text-dark">{s.text}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default FraudMonitoring;