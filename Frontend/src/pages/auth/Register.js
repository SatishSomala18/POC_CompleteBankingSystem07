import React, { useState } from "react";
import { useHistory, Link } from "react-router-dom";
import { Card, Form, Button, Alert, Spinner, Row, Col } from "react-bootstrap";
import BrandLogo from "../../components/BrandLogo";
import { registerUser } from "../../api/authApi";

function Register() {
  const history = useHistory();
  const [form, setForm] = useState({ name: "", email: "", password: "", roles: "USER", phone: "" });
  const [message, setMessage] = useState("");
  const [msgType, setMsgType] = useState("danger");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const register = async () => {
    if (!form.name || !form.email || !form.password || !form.phone) {
      setMsgType("danger");
      setMessage("Please fill in all required fields.");
      return;
    }
    setLoading(true);
    try {
      await registerUser(form);
      setMsgType("success");
      setMessage("Account created! Redirecting…");
      setSuccess(true);
      setTimeout(() => history.push("/login"), 1500);
    } catch {
      setMsgType("danger");
      setMessage("Registration failed. Username or email may already exist.");
    }
    setLoading(false);
  };

  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100 py-4" style={{ background: "linear-gradient(135deg, #eef0fd 0%, #f5f6fb 100%)" }}>
      <Card className="shadow-sm border-0 nb-shadow-soft" style={{ maxWidth: "440px", width: "100%" }}>
        <Card.Body className="p-4 p-md-5">

          {success ? (
            <div className="text-center py-4">
              <div className="d-inline-flex align-items-center justify-content-center bg-success bg-opacity-10 border border-success rounded-circle mb-3"
                style={{ width: "72px", height: "72px", fontSize: "34px" }}>
                ✅
              </div>
              <h5 className="fw-bold mb-1">Account Created!</h5>
              <p className="text-muted small mb-0">Redirecting you to sign in…</p>
            </div>
          ) : (
            <>
              <div className="text-center mb-4">
                <div className="d-flex justify-content-center mb-3">
                  <BrandLogo size={56} rounded="square" />
                </div>
                <h4 className="fw-bold mb-1">Create your account</h4>
                <p className="text-muted small mb-0">Get started with NexaBank</p>
              </div>

              {message && (
                <Alert variant={msgType} className="py-2 small">
                  {message}
                </Alert>
              )}

              <Row>
                <Col xs={6} className="mb-3">
                  <Form.Label className="small fw-semibold">Full Name</Form.Label>
                  <Form.Control name="name" type="text" placeholder="John Doe" onChange={handleChange} />
                </Col>
                <Col xs={6} className="mb-3">
                  <Form.Label className="small fw-semibold">Phone</Form.Label>
                  <Form.Control name="phone" type="tel" placeholder="+91 98765 43210" onChange={handleChange} />
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label className="small fw-semibold">Email Address</Form.Label>
                <Form.Control name="email" type="email" placeholder="you@example.com" onChange={handleChange} />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className="small fw-semibold">Password</Form.Label>
                <Form.Control name="password" type="password" placeholder="Create a strong password" onChange={handleChange} />
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label className="small fw-semibold">Account Role</Form.Label>
                <Form.Select name="roles" onChange={handleChange}>
                  <option value="USER">User</option>
                  <option value="ADMIN">Admin</option>
                </Form.Select>
              </Form.Group>

              <Button
                variant="primary"
                className="w-100 d-flex align-items-center justify-content-center gap-2 rounded-pill"
                onClick={register}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Spinner animation="border" size="sm" />
                    Creating account…
                  </>
                ) : (
                  "Create Account"
                )}
              </Button>

              <p className="text-center small text-muted mt-4 mb-0">
                Already have an account? <Link to="/login">Sign in</Link>
              </p>
            </>
          )}

        </Card.Body>
      </Card>
    </div>
  );
}

export default Register;