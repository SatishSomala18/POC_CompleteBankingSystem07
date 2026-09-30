import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Card, Form, Button, Alert, Spinner } from "react-bootstrap";
import BrandLogo from "../../components/BrandLogo";
import { loginUser } from "../../api/authApi";

function Login(props) {
  const [form, setForm] = useState({ name: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submitLogin = () => {
    setError("");
    setLoading(true);
    loginUser(form)
      .then((res) => {
        if (res.data && res.data.userId) {
          localStorage.setItem("tempUserId", res.data.userId);
          props.history.push("/verify-otp");
        }
        setLoading(false);
      })
      .catch(() => {
        setError("Invalid credentials. Please check your username and password.");
        setLoading(false);
      });
  };

  const handleKeyDown = (e) => { if (e.key === "Enter") submitLogin(); };

  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100" style={{ background: "linear-gradient(135deg, #eef0fd 0%, #f5f6fb 100%)" }}>
      <Card className="shadow-sm border-0 nb-shadow-soft" style={{ maxWidth: "400px", width: "100%" }}>
        <Card.Body className="p-4 p-md-5">

          <div className="text-center mb-4">
            <div className="d-flex justify-content-center mb-3">
              <BrandLogo size={56} rounded="square" />
            </div>
            <h4 className="fw-bold mb-1">NexaBank</h4>
            <p className="text-muted small mb-0">Sign in to access your account</p>
          </div>

          {error && (
            <Alert variant="danger" className="py-2 small">
              {error}
            </Alert>
          )}

          <Form.Group className="mb-3">
            <Form.Label className="small fw-semibold">Username</Form.Label>
            <Form.Control
              name="name"
              type="text"
              placeholder="Enter your username"
              value={form.name}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label className="small fw-semibold">Password</Form.Label>
            <Form.Control
              name="password"
              type="password"
              placeholder="Enter your password"
              value={form.password}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
            />
          </Form.Group>

          <Button
            variant="primary"
            className="w-100 d-flex align-items-center justify-content-center gap-2 rounded-pill"
            onClick={submitLogin}
            disabled={loading}
          >
            {loading ? (
              <>
                <Spinner animation="border" size="sm" />
                Signing in…
              </>
            ) : (
              "Sign In"
            )}
          </Button>

          <p className="text-center small text-muted mt-4 mb-0">
            Don't have an account? <Link to="/register">Create one</Link>
          </p>

        </Card.Body>
      </Card>
    </div>
  );
}

export default Login;