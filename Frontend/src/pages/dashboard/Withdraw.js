import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { Container, Card } from "react-bootstrap";

import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import { withdraw } from "../../api/bankingApi";
import { getAccountId } from "../../utils/auth";

const QUICK_AMOUNTS = [500, 1000, 2000, 5000];

function Withdraw({ onSuccess, onCancel }) {
  const history = useHistory();

  // If onSuccess is not provided, this page is being used independently
  const standalone = typeof onSuccess !== "function";

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
    } else if (typeof onCancel === "function") {
      onCancel();
    }
  };

  const handleWithdraw = async () => {
    const withdrawalAmount = parseFloat(amount);
    const accountId = parseInt(getAccountId(), 10);

    if (!amount || isNaN(withdrawalAmount) || withdrawalAmount <= 0) {
      setMessage("Please enter a valid withdrawal amount.");
      return;
    }

    if (isNaN(accountId)) {
      setMessage("Unable to find your account. Please login again.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      await withdraw({
        accountId: accountId,
        amount: withdrawalAmount,
      });

      localStorage.setItem("refreshDashboard", "true");

      setAmount("");
      setMessage("");

      handleSuccess("Withdrawal successful!");
    } catch (error) {
      console.error("Withdrawal error:", error);

      setMessage(
        error?.response?.data?.message ||
        "Withdrawal failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const form = (
    <div>
      <div className="d-flex flex-column align-items-center text-center mb-4">
        {/* Heading */}
        <div className="text-center mb-4">
          <div
            className="fw-bold"
            style={{ fontSize: 17 }}
          >
            Withdraw Money
          </div>

          <div
            className="text-muted"
            style={{ fontSize: 12 }}
          >
            Funds are deducted from your active account
          </div>
        </div>

        {/* Error Message */}
        {message && (
          <div
            className="usr-alert usr-alert-danger"
            style={{
              marginBottom: 16,
              width: "100%",
            }}
          >
            {message}
          </div>
        )}

        {/* Amount Input */}
        <div
          style={{
            marginBottom: 12,
            width: "100%",
          }}
        >
          <label
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: "#64748b",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              display: "block",
              marginBottom: 6,
            }}
          >
            Amount
          </label>

          <div
            className="d-flex align-items-center"
            style={{
              border: "1.5px solid #e2e8f0",
              borderRadius: 12,
              padding: "6px 14px",
              background: "#fafbfe",
            }}
          >
            <span
              className="fw-bold me-2"
              style={{
                fontSize: 22,
                color: "#e11d48",
              }}
            >
              ₹
            </span>

            <input
              type="number"
              min="0.01"
              step="0.01"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !loading) {
                  handleWithdraw();
                }
              }}
              style={{
                width: "100%",
                border: "none",
                background: "transparent",
                outline: "none",
                fontSize: 22,
                fontWeight: 700,
                color: "#0f172a",
                fontFamily: "Inter, sans-serif",
              }}
            />
          </div>
        </div>

        {/* Quick Amount Buttons */}
        <div
          className="d-flex gap-2 flex-wrap"
          style={{
            marginBottom: 20,
            width: "100%",
          }}
        >
          {QUICK_AMOUNTS.map((amt) => (
            <button
              key={amt}
              type="button"
              onClick={() => setAmount(String(amt))}
              disabled={loading}
              style={{
                padding: "6px 14px",
                borderRadius: 100,
                fontSize: 12.5,
                fontWeight: 600,

                border:
                  String(amt) === amount
                    ? "1.5px solid #e11d48"
                    : "1.5px solid #e2e8f0",

                background:
                  String(amt) === amount
                    ? "#ffe4e6"
                    : "#fff",

                color:
                  String(amt) === amount
                    ? "#9f1239"
                    : "#64748b",

                cursor: loading ? "not-allowed" : "pointer",
                fontFamily: "Inter, sans-serif",
              }}
            >
              ₹{amt.toLocaleString("en-IN")}
            </button>
          ))}
        </div>

        {/* Action Buttons */}
        <div
          style={{
            display: "flex",
            gap: 10,
            width: "100%",
          }}
        >
          <button
            type="button"
            onClick={handleWithdraw}
            disabled={!amount || loading}
            style={{
              flex: 1,
              padding: "12px",
              borderRadius: 12,
              border: "none",
              background: loading
                ? "#fda4af"
                : "linear-gradient(135deg,#e11d48,#9f1239)",
              color: "#fff",
              fontSize: 14.5,
              fontWeight: 700,
              cursor: loading ? "not-allowed" : "pointer",
              fontFamily: "Inter, sans-serif",
              boxShadow: loading
                ? "none"
                : "0 6px 16px rgba(225,29,72,0.3)",
            }}
          >
            {loading ? "Processing..." : "Confirm Withdrawal"}
          </button>

          <button
            type="button"
            onClick={handleCancel}
            disabled={loading}
            style={{
              padding: "12px 18px",
              borderRadius: 12,
              border: "1.5px solid #e2e8f0",
              background: "transparent",
              color: "#64748b",
              fontSize: 14,
              fontWeight: 600,
              cursor: loading ? "not-allowed" : "pointer",
              fontFamily: "Inter, sans-serif",
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );

  // Used inside another component/modal
  if (!standalone) {
    return form;
  }

  // Used as standalone Withdraw page
  return (
    <div>
      <Navbar />

      <div className="d-flex">
        <Sidebar />

        <Container
          fluid
          className="p-4 p-md-5 d-flex justify-content-center"
        >
          <Card
            className="border-0 shadow-sm nb-shadow-soft"
            style={{
              maxWidth: 480,
              width: "100%",
              height: "fit-content",
            }}
          >
            <Card.Body className="p-4 p-md-5">
              {form}
            </Card.Body>
          </Card>
        </Container>
      </div>
    </div>
  );
}

export default Withdraw;