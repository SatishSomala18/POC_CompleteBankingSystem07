import React from "react";
import { Navbar, Nav } from "react-bootstrap";
import BrandLogo from "../components/BrandLogo";

function Home(props) {
  return (
    <div className="min-vh-100 bg-light">

      {/* ── Navbar ── */}
      <Navbar expand="lg" variant="dark" className="nb-brand-gradient shadow-sm px-3 px-lg-5">

        {/* Left: Company logo + Bank name */}
        <div className="d-flex align-items-center gap-2">
          <BrandLogo size={42} rounded="square" />
          <Navbar.Brand className="mb-0 fs-5 fw-semibold ms-1">NexaBank</Navbar.Brand>
        </div>

        {/* Center: Nav links */}
        <Nav className="d-none d-lg-flex gap-4 ms-5 me-auto">
          <Nav.Link href="/about" className="text-white opacity-75 fw-medium">About</Nav.Link>
          <Nav.Link href="/contact" className="text-white opacity-75 fw-medium">Contact</Nav.Link>
        </Nav>

        {/* Right: Small bank logo/badge */}
        <div className="d-none d-lg-flex">
          <BrandLogo size={40} rounded="square" />
        </div>

      </Navbar>

      {/* ── Hero Banner ── */}
      <div className="nb-brand-gradient text-white position-relative overflow-hidden" style={{ paddingTop: "72px", paddingBottom: "96px" }}>
        <div
          className="position-absolute"
          style={{ width: 420, height: 420, borderRadius: "50%", background: "radial-gradient(circle, rgba(245,158,11,0.25), transparent 70%)", top: -140, right: -100 }}
        ></div>

        <div className="container position-relative">
          <div className="row align-items-center g-5">

            <div className="col-12 col-lg-6">
              <span className="badge bg-success fs-6 px-3 py-2 rounded-pill mb-3 d-inline-block">
                ✔ RBI Regulated &amp; Insured
              </span>
              <h1 className="display-4 fw-bold mb-3" style={{ lineHeight: 1.15 }}>
                Banking that moves<br />as fast as <span style={{ color: "var(--nb-accent)" }}>you do.</span>
              </h1>
              <p className="lead opacity-75 mb-4" style={{ maxWidth: 480 }}>
                Open an account, transfer funds, invest and manage loans — all from one beautifully simple dashboard.
              </p>
              <div className="d-flex gap-3 flex-wrap">
                <button
                  className="btn btn-light btn-lg fw-semibold px-4 rounded-pill"
                  onClick={() => props.history.push("/login")}
                >
                  Login to your account
                </button>

                <button
                  className="btn btn-lg fw-semibold px-4 rounded-pill"
                  style={{ background: "var(--nb-accent)", color: "#1e1b4b", border: "none" }}
                  onClick={() => props.history.push("/register")}
                >
                  Open an account
                </button>
              </div>
            </div>

            <div className="col-12 col-lg-6 d-none d-lg-flex justify-content-center">
              <div style={{ position: "relative", width: 340 }}>

                {/* Floating bank card mockup */}
                <div
                  style={{
                    borderRadius: 20, padding: "26px 24px", color: "#fff",
                    background: "linear-gradient(135deg, #1e293b 0%, #0b1120 100%)",
                    boxShadow: "0 30px 60px rgba(0,0,0,0.35)",
                    transform: "rotate(-4deg)",
                  }}
                >
                  <div className="d-flex justify-content-between align-items-start mb-4">
                    <i className="bi bi-bank2 fs-3"></i>
                    <span className="fw-semibold" style={{ fontSize: 13, letterSpacing: 1 }}>NEXABANK</span>
                  </div>
                  <div style={{ fontSize: 20, letterSpacing: 3 }} className="mb-3">•••• •••• •••• 4821</div>
                  <div className="d-flex justify-content-between">
                    <div>
                      <div className="opacity-50" style={{ fontSize: 10, textTransform: "uppercase" }}>Card Holder</div>
                      <div style={{ fontSize: 13 }}>A. Sharma</div>
                    </div>
                    <div>
                      <div className="opacity-50" style={{ fontSize: 10, textTransform: "uppercase" }}>Expires</div>
                      <div style={{ fontSize: 13 }}>09/29</div>
                    </div>
                  </div>
                </div>

                {/* Floating stat chip */}
                <div
                  className="d-flex align-items-center gap-2 bg-white text-dark shadow-lg"
                  style={{ position: "absolute", bottom: -26, left: -30, borderRadius: 16, padding: "12px 16px" }}
                >
                  <span className="d-flex align-items-center justify-content-center rounded-circle bg-success bg-opacity-10 text-success" style={{ width: 36, height: 36 }}>
                    <i className="bi bi-graph-up-arrow"></i>
                  </span>
                  <div>
                    <div className="fw-bold" style={{ fontSize: 14 }}>+18.4%</div>
                    <div className="text-muted" style={{ fontSize: 10 }}>Portfolio growth</div>
                  </div>
                </div>

                {/* Floating balance chip */}
                <div
                  className="bg-white text-dark shadow-lg"
                  style={{ position: "absolute", top: -20, right: -30, borderRadius: 16, padding: "10px 16px" }}
                >
                  <div className="text-muted" style={{ fontSize: 10 }}>Available Balance</div>
                  <div className="fw-bold text-dark" style={{ fontSize: 15 }}>₹4,52,300</div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ── Stats Row ── */}
      <div className="bg-white border-bottom py-3">
        <div className="container">
          <div className="row text-center">
            <div className="col-4 border-end">
              <div className="fs-4 fw-bold text-primary">2M+</div>
              <div className="text-muted small">Customers</div>
            </div>
            <div className="col-4 border-end">
              <div className="fs-4 fw-bold text-primary">₹500Cr</div>
              <div className="text-muted small">Assets Managed</div>
            </div>
            <div className="col-4">
              <div className="fs-4 fw-bold text-primary">99.9%</div>
              <div className="text-muted small">Uptime</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main 3-column layout ── */}
      <div className="container py-5">
        <div className="row g-4">

          {/* ── LEFT: Account types ── */}
          <div className="col-12 col-md-3">
            <div className="card shadow-sm border-0 h-100">
              <div className="card-header bg-white fw-semibold text-muted text-uppercase small border-bottom">
                Account Types
              </div>
              <div className="list-group list-group-flush">

                <button
                  className="list-group-item list-group-item-action d-flex align-items-center gap-3 py-3 border-0"
                  onClick={() => props.history.push("/savings")}
                >
                  <div
                    className="rounded-circle bg-success bg-opacity-10 d-flex align-items-center justify-content-center text-success fw-bold"
                    style={{ width: 40, height: 40, fontSize: 16 }}
                  >
                    S
                  </div>
                  <div>
                    <div className="fw-semibold">Savings Account</div>
                    <div className="text-muted small">Up to 6.5% p.a.</div>
                  </div>
                  <span className="ms-auto text-muted">&rsaquo;</span>
                </button>

                <button
                  className="list-group-item list-group-item-action d-flex align-items-center gap-3 py-3 border-0"
                  onClick={() => props.history.push("/investment")}
                >
                  <div
                    className="rounded-circle bg-warning bg-opacity-10 d-flex align-items-center justify-content-center text-warning fw-bold"
                    style={{ width: 40, height: 40, fontSize: 16 }}
                  >
                    I
                  </div>
                  <div>
                    <div className="fw-semibold">Investment Plans</div>
                    <div className="text-muted small">Mutual funds &amp; SIPs</div>
                  </div>
                  <span className="ms-auto text-muted">&rsaquo;</span>
                </button>

                <button
                  className="list-group-item list-group-item-action d-flex align-items-center gap-3 py-3 border-0"
                  onClick={() => props.history.push("/current")}
                >
                  <div
                    className="rounded-circle bg-primary bg-opacity-10 d-flex align-items-center justify-content-center text-primary fw-bold"
                    style={{ width: 40, height: 40, fontSize: 16 }}
                  >
                    C
                  </div>
                  <div>
                    <div className="fw-semibold">Current Account</div>
                    <div className="text-muted small">For businesses</div>
                  </div>
                  <span className="ms-auto text-muted">&rsaquo;</span>
                </button>

                <button
                  className="list-group-item list-group-item-action d-flex align-items-center gap-3 py-3 border-0"
                  onClick={() => props.history.push("/loans")}
                >
                  <div
                    className="rounded-circle bg-danger bg-opacity-10 d-flex align-items-center justify-content-center text-danger fw-bold"
                    style={{ width: 40, height: 40, fontSize: 16 }}
                  >
                    L
                  </div>
                  <div>
                    <div className="fw-semibold">Loans</div>
                    <div className="text-muted small">Home, personal &amp; more</div>
                  </div>
                  <span className="ms-auto text-muted">&rsaquo;</span>
                </button>

              </div>
            </div>
          </div>

          {/* ── CENTER: Features ── */}
          <div className="col-12 col-md-6">
            <div className="card shadow-sm border-0 h-100">
              <div className="card-body p-4">
                <h4 className="fw-bold mb-1">Everything you need in one place</h4>
                <p className="text-muted mb-4">Open an account in minutes. No paperwork, no branch visits.</p>

                <div className="row g-3">
                  <div className="col-6">
                    <div className="bg-success bg-opacity-10 rounded-3 p-3 h-100">
                      <div className="fw-semibold text-success mb-1">Savings Account</div>
                      <div className="text-muted small">High interest rates up to 6.5% per annum</div>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="bg-warning bg-opacity-10 rounded-3 p-3 h-100">
                      <div className="fw-semibold text-warning mb-1">Investment Plans</div>
                      <div className="text-muted small">Mutual funds, SIPs and fixed deposits</div>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="bg-primary bg-opacity-10 rounded-3 p-3 h-100">
                      <div className="fw-semibold text-primary mb-1">Current Account</div>
                      <div className="text-muted small">Zero-balance business accounts</div>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="bg-danger bg-opacity-10 rounded-3 p-3 h-100">
                      <div className="fw-semibold text-danger mb-1">Loans</div>
                      <div className="text-muted small">Home, personal and business loans</div>
                    </div>
                  </div>
                </div>

                <hr className="my-4" />

                <div className="d-flex flex-wrap gap-3">
                  <div className="d-flex align-items-center gap-2 text-muted small">
                    <span className="badge bg-secondary rounded-circle p-1">&nbsp;</span>
                    256-bit encryption
                  </div>
                  <div className="d-flex align-items-center gap-2 text-muted small">
                    <span className="badge bg-secondary rounded-circle p-1">&nbsp;</span>
                    24/7 support
                  </div>
                  <div className="d-flex align-items-center gap-2 text-muted small">
                    <span className="badge bg-secondary rounded-circle p-1">&nbsp;</span>
                    Instant transfers
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── RIGHT: Auth card ── */}
          <div className="col-12 col-md-3">
            <div className="card shadow-sm border-0 mb-3">
              <div className="card-body p-4 text-center">
                <h5 className="fw-bold mb-1">Start Banking Today</h5>
                <p className="text-muted small mb-4">Access your account or open a new one in minutes.</p>
                <button
                  className="btn btn-primary w-100 fw-semibold mb-2 py-2"
                  onClick={() => props.history.push("/login")}
                >
                  Login
                </button>

                <div className="text-muted mb-2" style={{ fontSize: 10 }}>* For Existing Users</div>

                <button
                  className="btn btn-outline-primary w-100 fw-semibold py-2"
                  onClick={() => props.history.push("/register")}
                >
                  Register
                </button>
                <div className="text-muted mt-1" style={{ fontSize: 10 }}>* For New Users</div>
              </div>
            </div>

            <div className="card shadow-sm border-0 nb-brand-gradient text-white">
              <div className="card-body p-4">
                <h6 className="fw-bold mb-3">Why NexaBank?</h6>
                <ul className="list-unstyled mb-0 small">
                  <li className="mb-2 opacity-75">✔ RBI regulated &amp; insured</li>
                  <li className="mb-2 opacity-75">✔ Zero hidden charges</li>
                  <li className="mb-2 opacity-75">✔ Instant account opening</li>
                  <li className="mb-0 opacity-75">✔ 24/7 customer support</li>
                </ul>
              </div>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}

export default Home;