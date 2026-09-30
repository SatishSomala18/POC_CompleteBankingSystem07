import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Nav } from "react-bootstrap";
import { getRole } from "../utils/auth";

function NavItem({ to, label, badge, badgeVariant = "amber" }) {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Nav.Link
      as={Link}
      to={to}
      className="d-flex align-items-center gap-2 text-decoration-none"
      style={{
        fontSize: "13.5px",
        padding: "9px 12px",
        margin: "2px 10px",
        borderRadius: "10px",
        color: isActive ? "#fff" : "rgba(255,255,255,0.6)",
        background: isActive ? "rgba(255,255,255,0.1)" : "transparent",
        borderLeft: isActive ? "3px solid #f59e0b" : "3px solid transparent",
        transition: "all 0.15s ease",
        fontWeight: isActive ? 600 : 400,
      }}
      onMouseEnter={(e) => {
        if (!isActive) {
          e.currentTarget.style.background = "rgba(255,255,255,0.06)";
          e.currentTarget.style.color = "rgba(255,255,255,0.9)";
        }
      }}
      onMouseLeave={(e) => {
        if (!isActive) {
          e.currentTarget.style.background = "transparent";
          e.currentTarget.style.color = "rgba(255,255,255,0.6)";
        }
      }}
    >
      <span style={{ flex: 1 }}>{label}</span>
      {badge != null && (
        <span
          style={{
            fontSize: "10px",
            fontWeight: 500,
            borderRadius: "20px",
            padding: "1px 7px",
            background:
              badgeVariant === "red"
                ? "rgba(225,29,72,0.18)"
                : "rgba(245,158,11,0.2)",
            color: badgeVariant === "red" ? "#fda4af" : "#fbbf24",
            border: `0.5px solid ${badgeVariant === "red"
              ? "rgba(225,29,72,0.25)"
              : "rgba(245,158,11,0.3)"
              }`,
          }}
        >
          {badge}
        </span>
      )}
    </Nav.Link>
  );
}

function SectionLabel({ label }) {
  return (
    <div
      style={{
        padding: "16px 20px 4px",
        fontSize: "9.5px",
        letterSpacing: "1.5px",
        textTransform: "uppercase",
        color: "rgba(255,255,255,0.28)",
        fontWeight: 500,
      }}
    >
      {label}
    </div>
  );
}

function Divider() {
  return (
    <div
      style={{
        height: "0.5px",
        background: "rgba(255,255,255,0.08)",
        margin: "10px 16px",
      }}
    />
  );
}

function ActionItem({ label, onClick }) {
  return (
    <Nav.Link
      as="button"
      onClick={onClick}
      className="d-flex align-items-center gap-2"
      style={{
        fontSize: "13.5px",
        padding: "9px 12px",
        margin: "2px 10px",
        borderRadius: "10px",
        color: "rgba(255,255,255,0.6)",
        background: "transparent",
        border: "none",
        borderLeft: "3px solid transparent",
        width: "calc(100% - 20px)",
        textAlign: "left",
        cursor: "pointer",
        fontFamily: "inherit",
        transition: "all 0.15s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "rgba(255,255,255,0.06)";
        e.currentTarget.style.color = "rgba(255,255,255,0.9)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "transparent";
        e.currentTarget.style.color = "rgba(255,255,255,0.6)";
      }}
    >
      <span>{label}</span>
    </Nav.Link>
  );
}

function ProfileCard({ role }) {
  return (
    <div
      className="d-flex align-items-center gap-2 mx-3 mb-3 p-2"
      style={{ background: "rgba(255,255,255,0.06)", borderRadius: "14px", border: "1px solid rgba(255,255,255,0.08)" }}
    >
      <span
        className="d-flex align-items-center justify-content-center rounded-circle fw-bold flex-shrink-0"
        style={{ width: "34px", height: "34px", background: "rgba(255,255,255,0.14)", color: "#fff", fontSize: "13px" }}
      >
        {role === "ADMIN" ? "A" : "U"}
      </span>
      <div className="lh-1">
        <div className="text-white fw-semibold" style={{ fontSize: "13px" }}>
          {role === "ADMIN" ? "Administrator" : "Customer"}
        </div>
        <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.45)" }}>NexaBank Account</div>
      </div>
    </div>
  );
}

function Sidebar({ onBankingAction }) {
  const role = getRole();

  return (
    <Nav
      className="flex-column"
      style={{
        minHeight: "calc(100vh - 68px)",
        width: "250px",
        background: "linear-gradient(175deg, #0b1120 0%, #312e81 50%, #6d28d9 100%)",
        position: "sticky",
        top: "68px",
        overflowY: "auto",
        display: "flex",
        flexDirection: "column",
        padding: "16px 0 12px",
        flexShrink: 0,
      }}
    >
      <ProfileCard role={role} />

      {role === "USER" && (
        <>
          <SectionLabel label="Main" />
          <NavItem to="/dashboard" icon="bi-speedometer2" label="Dashboard" />
          <NavItem to="/transactions" icon="bi-clock-history" label="Transactions" />
          <NavItem to="/investments" icon="bi-graph-up-arrow" label="Investments" />
          <NavItem to="/loans" icon="bi-credit-card-2-front" label="Loans" />
          <NavItem to="/qr-payment" icon="bi-qr-code-scan" label="QR Payment" />

          <Divider />
          <SectionLabel label="Banking Services" />
          {onBankingAction ? (
            <>
              <ActionItem icon="bi-arrow-down-circle" label="Deposit" onClick={() => onBankingAction("deposit")} />
              <ActionItem icon="bi-arrow-up-circle" label="Withdraw" onClick={() => onBankingAction("withdraw")} />
              <ActionItem icon="bi-arrow-left-right" label="Transfer" onClick={() => onBankingAction("transfer")} />
              <NavItem to="/transactions" icon="bi-list-ul" label="Transactions" />
            </>
          ) : (
            <>
              <NavItem to="/deposit" icon="bi-arrow-down-circle" label="Deposit" />
              <NavItem to="/withdraw" icon="bi-arrow-up-circle" label="Withdraw" />
              <NavItem to="/transfer" icon="bi-arrow-left-right" label="Transfer" />
              <NavItem to="/transactions" icon="bi-list-ul" label="Transactions" />
            </>
          )}

          <Divider />
          <SectionLabel label="Financial Services" />
          <NavItem to="/loan-application" icon="bi-file-earmark-text" label="Apply for Loan" />
          <NavItem to="/loans" icon="bi-layout-text-sidebar" label="Loan Dashboard" />
          <NavItem to="/investments" icon="bi-graph-up" label="Investments" />
          <NavItem to="/investment-calculator" icon="bi-calculator" label="Calculator" />
        </>
      )}

      {role === "ADMIN" && (
        <>
          <SectionLabel label="Overview" />
          <NavItem to="/admin" icon="bi-speedometer2" label="Admin Dashboard" />
          <NavItem to="/analytics" icon="bi-bar-chart-line" label="Analytics" />
          <NavItem to="/users" icon="bi-people-fill" label="User Management" />
          <NavItem to="/fraud" icon="bi-shield-exclamation" label="Fraud Monitoring" />

          <Divider />
          <SectionLabel label="Admin Access" />
          <NavItem to="/admin/credit-profiles" icon="bi-person-vcard" label="Credit Profile Management" />
          <NavItem to="/admin/banking-ops" icon="bi-bank" label="Banking Operations" />

          <Divider />
          <SectionLabel label="Loans" />
          <NavItem to="/loans" icon="bi-credit-card-2-front" label="Loan Dashboard" />
          <NavItem to="/emi-calculator" icon="bi-calculator" label="EMI Calculator" />

          <Divider />
          <SectionLabel label="Investments" />
          <NavItem to="/investments" icon="bi-graph-up-arrow" label="Investment Products" />
          <NavItem to="/investment-calculator" icon="bi-calculator" label="Investment Calculator" />
        </>
      )}
    </Nav>
  );
}

export default Sidebar;