import React from "react";
import { Navbar as RBNavbar, Container, Dropdown } from "react-bootstrap";
import { logout, getRole } from "../utils/auth";
import NotificationCenter from "./NotificationCenter";
import BrandLogo from "./BrandLogo";

function Navbar() {
  const role = getRole();
  const initials = role === "ADMIN" ? "A" : "U";

  return (
    <RBNavbar
      expand="lg"
      sticky="top"
      className="bg-white shadow-sm"
      style={{ zIndex: 1030, borderBottom: "1px solid #eef0f7", height: "68px" }}
    >
      <Container fluid className="px-4 h-100 align-items-center">

        <RBNavbar.Brand href="/" className="d-flex align-items-center gap-2 fw-bold fs-5 text-dark">
          <BrandLogo size={38} rounded="square" />
          <span>
            Nexa<span style={{ color: "var(--nb-accent)" }}>Bank</span>
          </span>
        </RBNavbar.Brand>

        <div className="d-flex align-items-center gap-2 ms-auto">
          <NotificationCenter />

          <div className="vr mx-2 d-none d-sm-block" style={{ height: "28px" }}></div>

          <Dropdown align="end">
            <Dropdown.Toggle
              as="div"
              role="button"
              className="d-flex align-items-center gap-2"
              style={{ cursor: "pointer" }}
              id="user-menu-toggle"
            >
              <span
                className="d-flex align-items-center justify-content-center rounded-circle fw-bold"
                style={{ width: "34px", height: "34px", fontSize: "13px", background: "#eef0fd", color: "#4f46e5" }}
              >
                {initials}
              </span>
              <span className="d-none d-md-flex flex-column lh-1">
                <span className="fw-semibold text-dark" style={{ fontSize: "13px" }}>{role === "ADMIN" ? "Administrator" : "Customer"}</span>
                <span className="text-muted" style={{ fontSize: "11px" }}>NexaBank Account</span>
              </span>
            </Dropdown.Toggle>

            <Dropdown.Menu className="shadow border-0 mt-2">
              <Dropdown.Item disabled className="small text-muted">
                Signed in as <strong>{role === "ADMIN" ? "Administrator" : "Customer"}</strong>
              </Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item onClick={logout} className="text-danger fw-semibold">
                <i className="bi bi-box-arrow-right me-2"></i>
                Logout
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>

      </Container>
    </RBNavbar>
  );
}

export default Navbar;