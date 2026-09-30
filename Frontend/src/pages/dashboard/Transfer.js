import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { Container, Card } from "react-bootstrap";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import { transfer } from "../../api/bankingApi";
import { getAccountId } from "../../utils/auth";

const QUICK_AMOUNTS = [500, 1000, 5000, 10000];

function Transfer({ onSuccess, onCancel }) {
  const history = useHistory();
  const standalone = typeof onSuccess !== "function";

  const [toAccountId, setToAccountId] = useState("");
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
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

  const handleTransfer = async () => {
    if (!toAccountId) {
      setMessage("Please enter a destination account ID.");
      return;
    }
    if (!amount || parseFloat(amount) <= 0) {
      setMessage("Please enter a valid transfer amount.");
      return;
    }
    setLoading(true);
    try {
      await transfer({
        fromAccountId: parseInt(getAccountId(), 10),
        toAccountId: parseInt(toAccountId, 10),
        amount: parseFloat(amount),
      });
      localStorage.setItem("refreshDashboard", "true");
      setAmount("");
      setToAccountId("");
      setMessage("");
      handleSuccess("Transfer successful!");
    } catch (error) {
      console.error("Transfer error:", error);
      setMessage("Transfer failed. Please try again.");
    }
    setLoading(false);
  };

  const inputStyle = {
    width: "100%", padding: "10px 14px", borderRadius: 12,
    border: "1.5px solid #e2e8f0", fontSize: 14, color: "#0f172a",
    fontFamily: "Inter, sans-serif", outline: "none",
    transition: "border-color 0.15s", background: "#fafbfe",
  };

  const form = (
    <div>
      <div className="text-center mb-4">
        <div className="fw-bold" style={{ fontSize: 17 }}>Transfer Money</div>
        <div className="text-muted" style={{ fontSize: 12 }}>Send funds to another NexaBank account</div>
      </div>

      {message && (
        <div className="usr-alert usr-alert-danger" style={{ marginBottom: 16 }}>
          {message}
        </div>
      )}
      <div style={{ marginBottom: 16 }}>
        <label style={{ fontSize: 12, fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.5px", display: "block", marginBottom: 6 }}>
          Destination Account ID
        </label>
        <input
          type="text"
          placeholder="e.g. 12345"
          value={toAccountId}
          onChange={(e) => setToAccountId(e.target.value)}
          style={inputStyle}
          onFocus={(e) => e.target.style.borderColor = "#4f46e5"}
          onBlur={(e) => e.target.style.borderColor = "#e2e8f0"}
        />
      </div>
      <div style={{ marginBottom: 12 }}>
        <label style={{ fontSize: 12, fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.5px", display: "block", marginBottom: 6 }}>
          Amount
        </label>
        <div
          className="d-flex align-items-center"
          style={{ border: "1.5px solid #e2e8f0", borderRadius: 12, padding: "6px 14px", background: "#fafbfe" }}
        >
          <span className="fw-bold me-2" style={{ fontSize: 22, color: "#4f46e5" }}>₹</span>
          <input
            type="number"
            min="0.01"
            step="0.01"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleTransfer()}
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
              border: String(amt) === amount ? "1.5px solid #4f46e5" : "1.5px solid #e2e8f0",
              background: String(amt) === amount ? "#e0e7ff" : "#fff",
              color: String(amt) === amount ? "#3730a3" : "#64748b",
              cursor: "pointer", fontFamily: "Inter, sans-serif",
            }}
          >
            ₹{amt.toLocaleString("en-IN")}
          </button>
        ))}
      </div>

      <div style={{ display: "flex", gap: 10 }}>
        <button
          onClick={handleTransfer}
          disabled={!toAccountId || !amount || loading}
          style={{
            flex: 1, padding: "12px", borderRadius: 12, border: "none",
            background: loading ? "#c7d2fe" : "linear-gradient(135deg,#4f46e5,#6d28d9)",
            color: "#fff", fontSize: 14.5, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer",
            fontFamily: "Inter, sans-serif", boxShadow: loading ? "none" : "0 6px 16px rgba(79,70,229,0.3)",
          }}
        >
          {loading ? "Processing…" : "Confirm Transfer"}
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

export default Transfer;