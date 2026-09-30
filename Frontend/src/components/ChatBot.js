import React, { useState } from "react";
import { withRouter } from "react-router-dom";
import { Card, Form, Button } from "react-bootstrap";

/* ── Navigation rules ───────────────────────────────────────────────────
   Checked top to bottom; first matching keyword wins. Keep more specific
   phrases (e.g. "credit profile") above broader ones (e.g. "admin") so
   specific requests don't get swallowed by a generic match. ───────────── */
const NAV_RULES = [
  // Admin
  { keywords: ["credit profile"], path: "/admin/credit-profiles", label: "Credit Profile Management" },
  { keywords: ["banking operation", "banking ops"], path: "/admin/banking-ops", label: "Banking Operations" },
  { keywords: ["admin dashboard", "admin panel"], path: "/admin", label: "Admin Dashboard" },
  { keywords: ["analytics"], path: "/analytics", label: "Analytics" },
  { keywords: ["user management", "manage users"], path: "/users", label: "User Management" },
  { keywords: ["fraud"], path: "/fraud", label: "Fraud Monitoring" },

  // Loans
  { keywords: ["emi calculator", "emi"], path: "/emi-calculator", label: "EMI Calculator" },
  { keywords: ["loan application", "apply loan", "apply for a loan"], path: "/loan-application", label: "Loan Application" },
  { keywords: ["loan"], path: "/loans", label: "Loan Dashboard" },

  // Investments
  { keywords: ["investment calculator"], path: "/investment-calculator", label: "Investment Calculator" },
  { keywords: ["my investment"], path: "/my-investments", label: "My Investments" },
  { keywords: ["investment"], path: "/investments", label: "Investment Products" },

  // Banking
  { keywords: ["deposit"], path: "/deposit", label: "Deposit" },
  { keywords: ["withdraw"], path: "/withdraw", label: "Withdraw" },
  { keywords: ["transfer"], path: "/transfer", label: "Transfer" },
  { keywords: ["transaction"], path: "/transactions", label: "Transactions" },
  { keywords: ["qr"], path: "/qr-payment", label: "QR Payment" },

  // Main
  { keywords: ["dashboard", "home"], path: "/dashboard", label: "Dashboard" },
];

function ChatBot(props) {

  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const processMessage = () => {
    if (message.trim() === "") return;

    const lowerMsg = message.toLowerCase();
    let response = "Sorry, I didn't understand. Try asking about dashboard, loans, investments, transactions, deposit, withdraw, transfer, QR payment, or (for admins) analytics, users, fraud, credit profiles.";
    let matchedPath = null;

    for (const rule of NAV_RULES) {
      if (rule.keywords.some((kw) => lowerMsg.includes(kw))) {
        response = `Opening ${rule.label}...`;
        matchedPath = rule.path;
        break;
      }
    }

    setChat([...chat, { user: message, bot: response }]);
    setMessage("");

    if (matchedPath) {
      // Small delay so the user sees the bot's reply before navigating away
      setTimeout(() => {
        props.history.push(matchedPath);
      }, 400);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") processMessage();
  };

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <div
          onClick={() => setIsOpen(true)}
          style={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
            width: "65px",
            height: "65px",
            borderRadius: "50%",
            background: "linear-gradient(135deg, #4f46e5, #6d28d9)",
            color: "white",
            fontSize: "30px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            cursor: "pointer",
            boxShadow: "0px 6px 20px rgba(79,70,229,0.4)",
            zIndex: "999",
          }}
        >
          🤖
        </div>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div
          style={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
            width: "320px",
            zIndex: "999",
          }}
        >
          <Card className="shadow border-0">
            <Card.Header className="nb-brand-gradient text-white d-flex justify-content-between align-items-center">
              <span>NexaBank Assistant</span>
              <Button size="sm" variant="light" onClick={() => setIsOpen(false)}>
                ×
              </Button>
            </Card.Header>

            <Card.Body style={{ height: "250px", overflowY: "auto" }}>
              {chat.length === 0 && (
                <p className="text-muted small mb-0">
                  Try: "open my loans", "show transactions", "investment calculator", "qr payment"...
                </p>
              )}
              {chat.map((c, index) => (
                <div key={index}>
                  <b>You:</b> {c.user}
                  <br />
                  <b>Bot:</b> {c.bot}
                  <hr />
                </div>
              ))}
            </Card.Body>

            <Card.Footer>
              <Form.Control
                className="mb-2"
                placeholder="Ask anything..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <Button variant="primary" className="w-100" onClick={processMessage}>
                Send
              </Button>
            </Card.Footer>
          </Card>
        </div>
      )}
    </>
  );
}

export default withRouter(ChatBot);