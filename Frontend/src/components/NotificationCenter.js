import React, { useState } from "react";
import { Dropdown } from "react-bootstrap";

function NotificationCenter() {

    const [notifications] = useState([
        { id: 1, message: "Investment return updated" },
        { id: 2, message: "Loan application received" },
        { id: 3, message: "New fraud alert generated" }
    ]);

    return (
        <Dropdown align="end">
            <Dropdown.Toggle
                variant="light"
                className="rounded-circle d-flex align-items-center justify-content-center position-relative border-0"
                style={{ width: "40px", height: "40px", background: "#f4f5fb" }}
                id="notification-center-toggle"
            >
                <i className="bi bi-bell text-dark" style={{ fontSize: "16px" }}></i>
                <span
                    className="position-absolute translate-middle p-1 bg-danger border border-light rounded-circle"
                    style={{ top: "10px", left: "28px" }}
                >
                    <span className="visually-hidden">unread notifications</span>
                </span>
            </Dropdown.Toggle>

            <Dropdown.Menu className="shadow border-0">
                <Dropdown.Header>Notifications</Dropdown.Header>
                {notifications.map(item => (
                    <Dropdown.Item key={item.id}>
                        <i className="bi bi-dot text-primary"></i>
                        {item.message}
                    </Dropdown.Item>
                ))}
            </Dropdown.Menu>
        </Dropdown>
    );
}

export default NotificationCenter;