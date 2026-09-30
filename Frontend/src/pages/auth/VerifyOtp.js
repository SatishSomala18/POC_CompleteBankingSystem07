import React, { useState, useRef } from "react";
import { Card, Alert, Button, Badge } from "react-bootstrap";
import { verifyOtp } from "../../api/authApi";

function VerifyOtp(props) {
  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const [message, setMessage] = useState("");
  const [msgType, setMsgType] = useState("danger");
  const [loading, setLoading] = useState(false);
  const [verified, setVerified] = useState(false);
  const inputsRef = useRef([]);

  const otp = digits.join("");

  const handleDigit = (index, value) => {
    const char = value.replace(/\D/g, "").slice(-1);
    const next = [...digits];
    next[index] = char;
    setDigits(next);
    if (char && index < 5) inputsRef.current[index + 1]?.focus();
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace") {
      if (digits[index]) {
        const next = [...digits]; next[index] = ""; setDigits(next);
      } else if (index > 0) {
        inputsRef.current[index - 1]?.focus();
      }
    }
    if (e.key === "Enter" && otp.length === 6) verify();
  };

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted.length === 6) {
      setDigits(pasted.split(""));
      inputsRef.current[5]?.focus();
    }
    e.preventDefault();
  };

  const verify = async () => {
    setLoading(true);
    try {
      const response = await verifyOtp({ userId: localStorage.getItem("tempUserId"), otp });
      const data = response.data;
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);
      localStorage.setItem("userId", data.userId);
      if (data.refreshToken) {
        localStorage.setItem("refreshToken", data.refreshToken);
      }
      setMsgType("success");
      setMessage("Identity verified successfully!");
      setVerified(true);
      setTimeout(() => {
        props.history.push(data.role === "ADMIN" ? "/admin" : "/dashboard");
      }, 900);
    } catch {
      setMsgType("danger");
      setMessage("Incorrect OTP. Please check and try again.");
      setDigits(["", "", "", "", "", ""]);
      inputsRef.current[0]?.focus();
    }
    setLoading(false);
  };

  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100 py-4" style={{ background: "linear-gradient(135deg, #eef0fd 0%, #f5f6fb 100%)" }}>
      <Card className="shadow-sm border-0 nb-shadow-soft" style={{ maxWidth: "440px", width: "100%" }}>
        <Card.Body className="p-4 p-md-5">

          {verified ? (
            <div className="text-center py-4">
              <div className="d-inline-flex align-items-center justify-content-center bg-success bg-opacity-10 border border-success rounded-circle mb-3"
                style={{ width: "72px", height: "72px", fontSize: "34px" }}>
                ✅
              </div>
              <h5 className="fw-bold mb-1">Identity Verified</h5>
              <p className="text-muted small mb-0">Taking you to your dashboard…</p>
            </div>
          ) : (
            <>
              {/* Step progress */}
              <div className="d-flex align-items-center justify-content-between mb-4 small">
                <div className="d-flex align-items-center gap-2 text-success fw-semibold">
                  <Badge pill bg="success">✓</Badge>
                  Sign in
                </div>
                <div className="flex-grow-1 border-top border-success mx-2"></div>
                <div className="d-flex align-items-center gap-2 text-primary fw-semibold">
                  <Badge pill bg="primary">2</Badge>
                  Verify OTP
                </div>
                <div className="flex-grow-1 border-top mx-2"></div>
                <div className="d-flex align-items-center gap-2 text-muted">
                  <Badge pill bg="secondary" className="bg-opacity-50">3</Badge>
                  Dashboard
                </div>
              </div>

              <div className="text-center mb-4">
                <div className="d-inline-flex align-items-center justify-content-center bg-primary bg-opacity-10 border border-primary rounded-circle mb-3"
                  style={{ width: "64px", height: "64px", fontSize: "28px" }}>
                  🔑
                </div>
                <h4 className="fw-bold mb-1">Enter verification code</h4>
                <p className="text-muted small mb-0">
                  We sent a <strong>6-digit OTP</strong> to your registered email and phone number. It expires in 10 minutes.
                </p>
              </div>

              {message && (
                <Alert variant={msgType} className="py-2 small">
                  {message}
                </Alert>
              )}

              {/* 6-box OTP input */}
              <div className="d-flex justify-content-center gap-2 mb-4" onPaste={handlePaste}>
                {digits.map((d, i) => (
                  <input
                    key={i}
                    ref={(el) => (inputsRef.current[i] = el)}
                    className={`form-control text-center fw-bold fs-4 ${d ? "border-primary text-primary bg-primary bg-opacity-10" : ""}`}
                    style={{ width: "48px", height: "58px", padding: 0 }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={d}
                    onChange={(e) => handleDigit(i, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(i, e)}
                    autoFocus={i === 0}
                  />
                ))}
              </div>

              <Button
                variant="primary"
                className="w-100 d-flex align-items-center justify-content-center gap-2 rounded-pill"
                onClick={verify}
                disabled={loading || otp.length < 6}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm" role="status"></span>
                    Verifying…
                  </>
                ) : (
                  "Verify & Continue"
                )}
              </Button>

              <p className="text-center small text-muted mt-3 mb-0">
                Didn't get a code? Check your spam folder or contact support.
              </p>
            </>
          )}

        </Card.Body>
      </Card>
    </div>
  );
}

export default VerifyOtp;