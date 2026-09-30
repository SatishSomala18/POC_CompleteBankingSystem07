import React, { useState } from "react";
import { Container, Row, Col, Card, Form, Button, Alert, InputGroup, Badge } from "react-bootstrap";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

import { deposit } from "../api/bankingApi";
import { getAccountId } from "../utils/auth";
import { useHistory } from "react-router-dom";

/* ── Dummy static QR code (SVG data URI) ───────────────────────────────
   This is a placeholder QR-style graphic for demo purposes only.
   It does not encode real payment data. ──────────────────────────────── */
const DUMMY_QR_SVG =
  "data:image/svg+xml;base64," +
  btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" width="220" height="220" viewBox="0 0 220 220">
      <rect width="220" height="220" fill="#ffffff"/>
      <rect x="10" y="10" width="60" height="60" fill="#4f46e5"/>
      <rect x="150" y="10" width="60" height="60" fill="#4f46e5"/>
      <rect x="10" y="150" width="60" height="60" fill="#4f46e5"/>
      <rect x="25" y="25" width="30" height="30" fill="#ffffff"/>
      <rect x="165" y="25" width="30" height="30" fill="#ffffff"/>
      <rect x="25" y="165" width="30" height="30" fill="#ffffff"/>
      <rect x="35" y="35" width="10" height="10" fill="#4f46e5"/>
      <rect x="175" y="35" width="10" height="10" fill="#4f46e5"/>
      <rect x="35" y="175" width="10" height="10" fill="#4f46e5"/>
      <rect x="90" y="10" width="10" height="10" fill="#4f46e5"/>
      <rect x="110" y="10" width="10" height="10" fill="#4f46e5"/>
      <rect x="90" y="30" width="10" height="10" fill="#4f46e5"/>
      <rect x="130" y="30" width="10" height="10" fill="#4f46e5"/>
      <rect x="90" y="50" width="10" height="10" fill="#4f46e5"/>
      <rect x="110" y="50" width="10" height="10" fill="#4f46e5"/>
      <rect x="130" y="50" width="10" height="10" fill="#4f46e5"/>
      <rect x="90" y="70" width="10" height="10" fill="#4f46e5"/>
      <rect x="10" y="90" width="10" height="10" fill="#4f46e5"/>
      <rect x="30" y="90" width="10" height="10" fill="#4f46e5"/>
      <rect x="50" y="90" width="10" height="10" fill="#4f46e5"/>
      <rect x="70" y="90" width="10" height="10" fill="#4f46e5"/>
      <rect x="90" y="90" width="10" height="10" fill="#4f46e5"/>
      <rect x="110" y="90" width="10" height="10" fill="#4f46e5"/>
      <rect x="130" y="90" width="10" height="10" fill="#4f46e5"/>
      <rect x="150" y="90" width="10" height="10" fill="#4f46e5"/>
      <rect x="170" y="90" width="10" height="10" fill="#4f46e5"/>
      <rect x="190" y="90" width="10" height="10" fill="#4f46e5"/>
      <rect x="10" y="110" width="10" height="10" fill="#4f46e5"/>
      <rect x="50" y="110" width="10" height="10" fill="#4f46e5"/>
      <rect x="90" y="110" width="10" height="10" fill="#4f46e5"/>
      <rect x="130" y="110" width="10" height="10" fill="#4f46e5"/>
      <rect x="170" y="110" width="10" height="10" fill="#4f46e5"/>
      <rect x="90" y="130" width="10" height="10" fill="#4f46e5"/>
      <rect x="110" y="130" width="10" height="10" fill="#4f46e5"/>
      <rect x="150" y="130" width="10" height="10" fill="#4f46e5"/>
      <rect x="170" y="130" width="10" height="10" fill="#4f46e5"/>
      <rect x="190" y="130" width="10" height="10" fill="#4f46e5"/>
      <rect x="90" y="150" width="10" height="10" fill="#4f46e5"/>
      <rect x="130" y="150" width="10" height="10" fill="#4f46e5"/>
      <rect x="150" y="150" width="10" height="10" fill="#4f46e5"/>
      <rect x="190" y="150" width="10" height="10" fill="#4f46e5"/>
      <rect x="90" y="170" width="10" height="10" fill="#4f46e5"/>
      <rect x="110" y="170" width="10" height="10" fill="#4f46e5"/>
      <rect x="150" y="170" width="10" height="10" fill="#4f46e5"/>
      <rect x="170" y="170" width="10" height="10" fill="#4f46e5"/>
      <rect x="90" y="190" width="10" height="10" fill="#4f46e5"/>
      <rect x="130" y="190" width="10" height="10" fill="#4f46e5"/>
      <rect x="170" y="190" width="10" height="10" fill="#4f46e5"/>
    </svg>
  `);

function QrPayment() {
  const history = useHistory();

  const [amount, setAmount] = useState("");
  const [step, setStep] = useState("scan");   // "scan" | "confirm" | "success"
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  /* ── Step 1: "Scan" the dummy QR → move to confirm step ──────────────── */
  const handleScan = () => {
    if (!amount || parseFloat(amount) <= 0) {
      setMessage("Please enter a valid amount before scanning.");
      return;
    }
    setMessage("");
    setStep("confirm");
  };

  /* ── Step 2: Confirm → call the existing deposit API ──────────────────
     NOTE: this reuses the same /banking deposit endpoint as the Deposit
     page, since this is a dummy QR flow simulating a deposit into the
     user's own account rather than a real merchant payment rail. ──────── */
  const handleConfirm = async () => {
    setLoading(true);
    try {
      await deposit({
        accountId: parseInt(getAccountId(), 10),
        amount: parseFloat(amount)
      });

      setStep("success");
      localStorage.setItem("refreshDashboard", "true");

    } catch (error) {
      console.error("QR payment error:", error);
      setMessage("Payment failed. Please try again.");
      setStep("scan");
    }
    setLoading(false);
  };

  const reset = () => {
    setAmount("");
    setMessage("");
    setStep("scan");
  };

  return (
    <div className="bg-light min-vh-100">
      <Navbar />

      <div className="d-flex">
        <Sidebar />

        <Container fluid className="p-4">

          {message && (
            <Alert variant="danger" className="d-flex align-items-center gap-2 mb-4 shadow-sm rounded-3">
              <span>{message}</span>
            </Alert>
          )}

          <Row className="justify-content-center">
            <Col xs={12} md={7} lg={5}>

              <Card className="border-0 shadow-sm rounded-4 nb-shadow-soft">
                <Card.Header className="bg-white border-bottom fw-bold text-dark py-3 rounded-top-4">
                  QR Payment
                  <Badge bg="secondary" className="bg-opacity-10 text-secondary ms-2 fw-normal" style={{ fontSize: "11px" }}>
                    Demo Mode
                  </Badge>
                </Card.Header>

                <Card.Body className="p-4 text-center">

                  {/* ── STEP 1: Scan ───────────────────────────────────── */}
                  {step === "scan" && (
                    <>
                      <p className="text-muted small mb-3">
                        Scan this QR code with any NexaBank-supported app to deposit funds instantly.
                      </p>

                      <div className="d-inline-block p-3 bg-white border rounded-4 shadow-sm mb-4">
                        <img src={DUMMY_QR_SVG} alt="Dummy QR Code" width="200" height="200" />
                      </div>

                      <div className="mb-4">
                        <Form.Label className="fw-semibold small text-dark text-start d-block">
                          Amount to Deposit
                        </Form.Label>
                        <InputGroup>
                          <InputGroup.Text className="bg-light">₹</InputGroup.Text>
                          <Form.Control
                            type="number"
                            placeholder="0.00"
                            min="0"
                            step="0.01"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                          />
                        </InputGroup>
                      </div>

                      <Button
                        variant="primary"
                        className="w-100 fw-semibold rounded-3 py-2"
                        onClick={handleScan}
                        disabled={!amount}
                      >
                        Simulate Scan &amp; Pay
                      </Button>
                    </>
                  )}

                  {/* ── STEP 2: Confirm ────────────────────────────────── */}
                  {step === "confirm" && (
                    <>
                      <h5 className="fw-bold text-dark mb-1">Confirm Payment</h5>
                      <p className="text-muted small mb-4">
                        Review the details below before confirming this deposit.
                      </p>

                      <div className="bg-light rounded-3 p-3 mb-4 text-start">
                        <div className="d-flex justify-content-between py-1">
                          <span className="text-muted small">Payment Method</span>
                          <span className="fw-semibold small">Dummy QR Code</span>
                        </div>
                        <div className="d-flex justify-content-between py-1">
                          <span className="text-muted small">Account</span>
                          <span className="fw-semibold small">#{getAccountId()}</span>
                        </div>
                        <hr className="my-2" />
                        <div className="d-flex justify-content-between py-1">
                          <span className="text-dark fw-semibold">Amount</span>
                          <span className="fw-bold text-primary fs-5">₹{parseFloat(amount).toLocaleString("en-IN")}</span>
                        </div>
                      </div>

                      <div className="d-flex gap-2">
                        <Button
                          variant="outline-secondary"
                          className="flex-fill rounded-3 fw-semibold"
                          onClick={reset}
                          disabled={loading}
                        >
                          Cancel
                        </Button>
                        <Button
                          variant="success"
                          className="flex-fill rounded-3 fw-semibold"
                          onClick={handleConfirm}
                          disabled={loading}
                        >
                          {loading
                            ? <><span className="spinner-border spinner-border-sm me-2"></span>Processing...</>
                            : "Confirm Payment"
                          }
                        </Button>
                      </div>
                    </>
                  )}

                  {/* ── STEP 3: Success ────────────────────────────────── */}
                  {step === "success" && (
                    <>
                      <h5 className="fw-bold text-dark mb-1">Payment Successful</h5>
                      <p className="text-muted small mb-4">
                        ₹{parseFloat(amount).toLocaleString("en-IN")} has been deposited to your account.
                      </p>

                      <div className="d-flex gap-2">
                        <Button
                          variant="outline-primary"
                          className="flex-fill rounded-3 fw-semibold"
                          onClick={reset}
                        >
                          New Payment
                        </Button>
                        <Button
                          variant="primary"
                          className="flex-fill rounded-3 fw-semibold"
                          onClick={() => history.push("/dashboard")}
                        >
                          Go to Dashboard
                        </Button>
                      </div>
                    </>
                  )}

                </Card.Body>
              </Card>

              <p className="text-center text-muted small mt-3">
                This is a simulated QR payment for demo purposes. No real merchant network is involved.
              </p>

            </Col>
          </Row>

        </Container>
      </div>
    </div>
  );
}

export default QrPayment;