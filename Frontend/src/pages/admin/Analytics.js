import React, { useState, useEffect } from "react";

import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import Loader from "../../components/Loader";
import { Container, Row, Col, Card, Table } from "react-bootstrap";

import { getAllUsers } from "../../api/userApi";
import { getAllTransactions } from "../../api/bankingApi";
import { getAllLoans } from "../../api/loanApi";
import { getAllUserInvestments } from "../../api/investmentApi";

function Analytics() {

    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [loans, setLoans] = useState([]);
    const [investments, setInvestments] = useState([]);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const usersRes = await getAllUsers();
            const transactionsRes = await getAllTransactions();
            const loansRes = await getAllLoans();
            const investmentsRes = await getAllUserInvestments();

            setUsers(usersRes.data || []);
            setTransactions(transactionsRes.data || []);
            setLoans(loansRes.data || []);
            setInvestments(investmentsRes.data || []);
        } catch (error) {
            console.log(error);
        }

        setLoading(false);
    };

    if (loading) {
        return <Loader />;
    }

    return (
        <div>
            <Navbar />

            <div className="d-flex">
                <Sidebar />

                <Container fluid className="p-4">

                    <Row className="g-3">
                        <Col md={3}>
                            <Card className="border-0 shadow-sm nb-shadow-soft">
                                <Card.Body>
                                    <h6 className="text-muted">Total Users</h6>
                                    <h2 className="fw-bold text-primary">{users.length}</h2>
                                </Card.Body>
                            </Card>
                        </Col>

                        <Col md={3}>
                            <Card className="border-0 shadow-sm nb-shadow-soft">
                                <Card.Body>
                                    <h6 className="text-muted">Total Transactions</h6>
                                    <h2 className="fw-bold text-primary">{transactions.length}</h2>
                                </Card.Body>
                            </Card>
                        </Col>

                        <Col md={3}>
                            <Card className="border-0 shadow-sm nb-shadow-soft">
                                <Card.Body>
                                    <h6 className="text-muted">Total Loans</h6>
                                    <h2 className="fw-bold text-primary">{loans.length}</h2>
                                </Card.Body>
                            </Card>
                        </Col>

                        <Col md={3}>
                            <Card className="border-0 shadow-sm nb-shadow-soft">
                                <Card.Body>
                                    <h6 className="text-muted">Total Investments</h6>
                                    <h2 className="fw-bold text-primary">{investments.length}</h2>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>

                    <Card className="border-0 shadow-sm nb-shadow-soft mt-4">
                        <Card.Header className="bg-white fw-semibold">
                            System Overview
                        </Card.Header>
                        <Card.Body>
                            <Table bordered hover responsive>
                                <tbody>
                                    <tr>
                                        <td>Approved Loans</td>
                                        <td>{loans.filter((l) => l.status === "APPROVED").length}</td>
                                    </tr>
                                    <tr>
                                        <td>Pending Loans</td>
                                        <td>{loans.filter((l) => l.status === "PENDING").length}</td>
                                    </tr>
                                    <tr>
                                        <td>Rejected Loans</td>
                                        <td>{loans.filter((l) => l.status === "REJECTED").length}</td>
                                    </tr>
                                    <tr>
                                        <td>Total Investors</td>
                                        <td>{investments.length}</td>
                                    </tr>
                                </tbody>
                            </Table>
                        </Card.Body>
                    </Card>

                </Container>
            </div>
        </div>
    );
}

export default Analytics;