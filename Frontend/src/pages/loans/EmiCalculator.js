import React, { useState } from "react";

import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import { Container, Card, Form, Button, Row, Col } from "react-bootstrap";

import { calculateEMI, totalRepayment, totalInterest } from "../../utils/calculators";

function EmiCalculator() {

    const [principal, setPrincipal] = useState("");
    const [rate, setRate] = useState("");
    const [months, setMonths] = useState("");
    const [emi, setEmi] = useState("");
    const [repayment, setRepayment] = useState("");
    const [interest, setInterest] = useState("");

    const calculate = () => {
        const emiValue = calculateEMI(
            parseFloat(principal),
            parseFloat(rate),
            parseInt(months)
        );

        const total = totalRepayment(emiValue, months);
        const totalInt = totalInterest(principal, total);

        setEmi(emiValue);
        setRepayment(total);
        setInterest(totalInt);
    };

    const reset = () => {
        setPrincipal("");
        setRate("");
        setMonths("");
        setEmi("");
        setRepayment("");
        setInterest("");
    };

    return (
        <div>
            <Navbar />

            <div className="d-flex">
                <Sidebar />

                <Container fluid className="p-4 p-md-5 d-flex justify-content-center">
                    <div style={{ maxWidth: 480, width: "100%" }}>

                        <div className="text-center mb-4">
                            <h4 className="fw-bold mb-1">EMI Calculator</h4>
                            <p className="text-muted mb-0" style={{ fontSize: 13 }}>
                                Estimate your monthly loan repayment in seconds
                            </p>
                        </div>

                        <Card className="border-0 shadow-sm nb-shadow-soft">
                            <Card.Body className="p-4">

                                <Form.Group className="mb-3">
                                    <Form.Label className="small fw-semibold text-muted">Loan Amount (₹)</Form.Label>
                                    <Form.Control
                                        type="number"
                                        placeholder="e.g. 500000"
                                        value={principal}
                                        onChange={(e) => setPrincipal(e.target.value)}
                                    />
                                </Form.Group>

                                <Row>
                                    <Col xs={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label className="small fw-semibold text-muted">Interest Rate (%)</Form.Label>
                                            <Form.Control
                                                type="number"
                                                placeholder="e.g. 9.5"
                                                value={rate}
                                                onChange={(e) => setRate(e.target.value)}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col xs={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label className="small fw-semibold text-muted">Tenure (Months)</Form.Label>
                                            <Form.Control
                                                type="number"
                                                placeholder="e.g. 36"
                                                value={months}
                                                onChange={(e) => setMonths(e.target.value)}
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <div className="d-flex gap-2 mt-2">
                                    <Button
                                        variant="primary"
                                        className="rounded-pill flex-fill"
                                        onClick={calculate}
                                        disabled={!principal || !rate || !months}
                                    >
                                        Calculate EMI
                                    </Button>
                                    {emi !== "" && (
                                        <Button variant="outline-secondary" className="rounded-pill" onClick={reset}>
                                            Reset
                                        </Button>
                                    )}
                                </div>

                                {emi !== "" && (
                                    <div className="mt-4 pt-3 border-top">
                                        <div className="d-flex justify-content-between align-items-center py-2">
                                            <span className="text-muted small">Monthly EMI</span>
                                            <span className="fw-bold fs-5 text-primary">₹{emi}</span>
                                        </div>
                                        <div className="d-flex justify-content-between align-items-center py-2 border-top">
                                            <span className="text-muted small">Total Repayment</span>
                                            <span className="fw-semibold">₹{repayment}</span>
                                        </div>
                                        <div className="d-flex justify-content-between align-items-center py-2 border-top">
                                            <span className="text-muted small">Total Interest</span>
                                            <span className="fw-semibold">₹{interest}</span>
                                        </div>
                                    </div>
                                )}

                            </Card.Body>
                        </Card>
                    </div>
                </Container>
            </div>
        </div>
    );
}

export default EmiCalculator;