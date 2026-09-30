import React, { useState, useEffect } from "react";

import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import Loader from "../../components/Loader";
import ErrorMessage from "../../components/ErrorMessage";
import { Container, Card, Table, Button } from "react-bootstrap";

import { getAccountTransactions } from "../../api/bankingApi";
import { getAccountId } from "../../utils/auth";
import { exportTransactions } from "../../utils/exportCsv";

function TransactionHistory() {

    const [loading, setLoading] = useState(true);
    const [transactions, setTransactions] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        loadTransactions();
    }, []);

    const loadTransactions = async () => {
        try {
            setLoading(true);

            const response = await getAccountTransactions(getAccountId());

            setTransactions(response.data || []);
            setError("");

        } catch (error) {
            console.log(error);
            setError("Unable to load transactions.");
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

                    <Card className="border-0 shadow-sm nb-shadow-soft">

                        <Card.Header className="bg-white d-flex justify-content-between align-items-center">
                            <h5 className="mb-0 fw-bold">Transaction History</h5>

                            <Button
                                variant="success"
                                className="rounded-pill"
                                onClick={() => exportTransactions(transactions)}
                            >
                                <i className="bi bi-download me-1"></i>
                                Export CSV
                            </Button>
                        </Card.Header>

                        <Card.Body>

                            <ErrorMessage message={error} />

                            <div className="mb-3">
                                <strong>Total Transactions :</strong>
                                {" "}
                                {transactions.length}
                            </div>

                            <Table bordered striped hover responsive>
                                <thead className="table-light">
                                    <tr>
                                        <th>Transaction ID</th>
                                        <th>From Account</th>
                                        <th>To Account</th>
                                        <th>Amount</th>
                                        <th>Type</th>
                                        <th>Date</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {transactions.length === 0 ? (

                                        <tr>
                                            <td colSpan="6" className="text-center">
                                                No Transactions Found
                                            </td>
                                        </tr>

                                    ) : (

                                        transactions.map((tx) => (
                                            <tr key={tx.tid}>

                                                <td>{tx.tid}</td>

                                                <td>
                                                    {tx.fromAccount
                                                        ? tx.fromAccount.id
                                                        : "-"}
                                                </td>

                                                <td>
                                                    {tx.toAccount
                                                        ? tx.toAccount.id
                                                        : "-"}
                                                </td>

                                                <td>₹{tx.amount}</td>

                                                <td>{tx.type}</td>

                                                <td>
                                                    {tx.timestamp
                                                        ? new Date(tx.timestamp).toLocaleString()
                                                        : "-"}
                                                </td>

                                            </tr>
                                        ))

                                    )}
                                </tbody>
                            </Table>

                        </Card.Body>
                    </Card>
                </Container>
            </div>
        </div>
    );
}

export default TransactionHistory;