import React, { useState } from "react";

import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import { Container, Card, Form, Button, Row, Col } from "react-bootstrap";

import { calculateInvestment, calculateProfit } from "../../utils/calculators";

function InvestmentCalculator() {

    const [principal, setPrincipal] = useState("");
    const [rate, setRate] = useState("");
    const [years, setYears] = useState("");
    const [futureValue, setFutureValue] = useState("");
    const [profit, setProfit] = useState("");

    const calculate = () => {
        const maturity = calculateInvestment(
            parseFloat(principal),
            parseFloat(rate),
            parseInt(years)
        );

        const gain = calculateProfit(parseFloat(principal), parseFloat(maturity));

        setFutureValue(maturity);
        setProfit(gain);
    };

    const reset = () => {
        setPrincipal("");
        setRate("");
        setYears("");
        setFutureValue("");
        setProfit("");
    };

    return (
        <div>
            <Navbar />

            <div className="d-flex">
                <Sidebar />

                <Container fluid className="p-4 p-md-5 d-flex justify-content-center">
                    <div style={{ maxWidth: 480, width: "100%" }}>

                        <div className="text-center mb-4">
                            <h4 className="fw-bold mb-1">Investment Calculator</h4>
                            <p className="text-muted mb-0" style={{ fontSize: 13 }}>
                                See how your investment could grow over time
                            </p>
                        </div>

                        <Card className="border-0 shadow-sm nb-shadow-soft">
                            <Card.Body className="p-4">

                                <Form.Group className="mb-3">
                                    <Form.Label className="small fw-semibold text-muted">Investment Amount (₹)</Form.Label>
                                    <Form.Control
                                        type="number"
                                        placeholder="e.g. 100000"
                                        value={principal}
                                        onChange={(e) => setPrincipal(e.target.value)}
                                    />
                                </Form.Group>

                                <Row>
                                    <Col xs={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label className="small fw-semibold text-muted">Expected Return (%)</Form.Label>
                                            <Form.Control
                                                type="number"
                                                placeholder="e.g. 12"
                                                value={rate}
                                                onChange={(e) => setRate(e.target.value)}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col xs={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label className="small fw-semibold text-muted">Years</Form.Label>
                                            <Form.Control
                                                type="number"
                                                placeholder="e.g. 5"
                                                value={years}
                                                onChange={(e) => setYears(e.target.value)}
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <div className="d-flex gap-2 mt-2">
                                    <Button
                                        variant="primary"
                                        className="rounded-pill flex-fill"
                                        onClick={calculate}
                                        disabled={!principal || !rate || !years}
                                    >
                                        Calculate
                                    </Button>
                                    {futureValue !== "" && (
                                        <Button variant="outline-secondary" className="rounded-pill" onClick={reset}>
                                            Reset
                                        </Button>
                                    )}
                                </div>

                                {futureValue !== "" && (
                                    <div className="mt-4 pt-3 border-top">
                                        <div className="d-flex justify-content-between align-items-center py-2">
                                            <span className="text-muted small">Future Value</span>
                                            <span className="fw-bold fs-5 text-primary">₹{futureValue}</span>
                                        </div>
                                        <div className="d-flex justify-content-between align-items-center py-2 border-top">
                                            <span className="text-muted small">Total Profit</span>
                                            <span className="fw-semibold text-success">₹{profit}</span>
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

export default InvestmentCalculator;