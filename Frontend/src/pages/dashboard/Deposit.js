import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { Container, Card } from "react-bootstrap";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import { deposit } from "../../api/bankingApi";
import { getAccountId } from "../../utils/auth";

const QUICK_AMOUNTS = [500, 1000, 5000, 10000];

function Deposit({ onSuccess, onCancel }) {
  const history = useHistory();
  const standalone = typeof onSuccess !== "function";
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [msgType, setMsgType] = useState("danger");
  const [loading, setLoading] = useState(false);

  const handleSuccess = (msg) => {
    if (standalone) {
      history.push("/dashboard");
    } else {
      onSuccess(msg);
    }
  };

  const handleCancel = () => {
    if (standalone) {
      history.push("/dashboard");
    } else {
      onCancel();
    }
  };

  const handleDeposit = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      setMsgType("danger");
      setMessage("Please enter a valid deposit amount.");
      return;
    }
    setLoading(true);
    try {
      await deposit({
        accountId: parseInt(getAccountId(), 10),
        amount: parseFloat(amount),
      });
      localStorage.setItem("refreshDashboard", "true");
      setAmount("");
      setMessage("");
      handleSuccess("Deposit successful!");
    } catch (error) {
      console.error("Deposit error:", error);
      setMsgType("danger");
      setMessage("Deposit failed. Please try again.");
    }
    setLoading(false);
  };

  const form = (
    <div>
      <div className="text-center mb-4">
        <div className="fw-bold" style={{ fontSize: 17 }}>Add Money</div>
        <div className="text-muted" style={{ fontSize: 12 }}>Deposits reflect instantly in your account</div>
      </div>

      {message && (
        <div className={`usr-alert usr-alert-${msgType}`} style={{ marginBottom: 16 }}>
          {message}
        </div>
      )}

      <div style={{ marginBottom: 12 }}>
        <label style={{ fontSize: 12, fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.5px", display: "block", marginBottom: 6 }}>
          Amount
        </label>
        <div
          className="d-flex align-items-center"
          style={{ border: "1.5px solid #e2e8f0", borderRadius: 12, padding: "6px 14px", background: "#fafbfe" }}
        >
          <span className="fw-bold text-success me-2" style={{ fontSize: 22 }}>₹</span>
          <input
            type="number"
            min="0"
            step="0.01"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleDeposit()}
            style={{
              width: "100%", border: "none", background: "transparent", outline: "none",
              fontSize: 22, fontWeight: 700, color: "#0f172a", fontFamily: "Inter, sans-serif",
            }}
          />
        </div>
      </div>

      <div className="d-flex gap-2 flex-wrap" style={{ marginBottom: 20 }}>
        {QUICK_AMOUNTS.map((amt) => (
          <button
            key={amt}
            onClick={() => setAmount(String(amt))}
            style={{
              padding: "6px 14px", borderRadius: 100, fontSize: 12.5, fontWeight: 600,
              border: String(amt) === amount ? "1.5px solid #059669" : "1.5px solid #e2e8f0",
              background: String(amt) === amount ? "#d1fae5" : "#fff",
              color: String(amt) === amount ? "#047857" : "#64748b",
              cursor: "pointer", fontFamily: "Inter, sans-serif",
            }}
          >
            ₹{amt.toLocaleString("en-IN")}
          </button>
        ))}
      </div>

      <div style={{ display: "flex", gap: 10 }}>
        <button
          onClick={handleDeposit}
          disabled={!amount || loading}
          style={{
            flex: 1, padding: "12px", borderRadius: 12, border: "none",
            background: loading ? "#a7f3d0" : "linear-gradient(135deg,#059669,#047857)",
            color: "#fff", fontSize: 14.5, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer",
            fontFamily: "Inter, sans-serif", boxShadow: loading ? "none" : "0 6px 16px rgba(5,150,105,0.3)",
          }}
        >
          {loading ? "Processing…" : "Confirm Deposit"}
        </button>
        <button
          onClick={handleCancel}
          style={{
            padding: "12px 18px", borderRadius: 12, border: "1.5px solid #e2e8f0",
            background: "transparent", color: "#64748b", fontSize: 14,
            fontWeight: 600, cursor: "pointer", fontFamily: "Inter, sans-serif",
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  );

  if (!standalone) {
    return form;
  }

  return (
    <div>
      <Navbar />
      <div className="d-flex">
        <Sidebar />
        <Container fluid className="p-4 p-md-5 d-flex justify-content-center">
          <Card className="border-0 shadow-sm nb-shadow-soft" style={{ maxWidth: 480, width: "100%", height: "fit-content" }}>
            <Card.Body className="p-4 p-md-5">
              {form}
            </Card.Body>
          </Card>
        </Container>
      </div>
    </div>
  );
}

export default Deposit;