import React, { useState } from "react";

import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import { Container, Card, Form, Button, Alert } from "react-bootstrap";

import { applyLoan } from "../../api/loanApi";
import { getAccountId } from "../../utils/auth";

function LoanApplication() {

    const [amount, setAmount] = useState("");
    const [tenureMonths, setTenureMonths] = useState("");
    const [message, setMessage] = useState("");

    const submitLoan = async () => {
        try {
            await applyLoan({
                amount: parseFloat(amount),
                tenureMonths: parseInt(tenureMonths),
                accountId: getAccountId()
            });

            setMessage("Loan Application Submitted Successfully");

            setAmount("");
            setTenureMonths("");
        } catch (error) {
            setMessage("Loan Application Failed");
        }
    };

    return (
        <div>
            <Navbar />

            <div className="d-flex">
                <Sidebar />

                <Container className="p-4">
                    <Card className="border-0 shadow-sm nb-shadow-soft">
                        <Card.Header className="bg-white fw-bold">
                            Apply Loan
                        </Card.Header>

                        <Card.Body>
                            {message && (
                                <Alert variant="info">{message}</Alert>
                            )}

                            <Form.Group className="mb-3">
                                <Form.Label>Loan Amount</Form.Label>
                                <Form.Control
                                    type="number"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Tenure (Months)</Form.Label>
                                <Form.Control
                                    type="number"
                                    value={tenureMonths}
                                    onChange={(e) => setTenureMonths(e.target.value)}
                                />
                            </Form.Group>

                            <Button variant="primary" className="rounded-pill" onClick={submitLoan}>
                                Apply Loan
                            </Button>
                        </Card.Body>
                    </Card>
                </Container>
            </div>
        </div>
    );
}

export default LoanApplication;