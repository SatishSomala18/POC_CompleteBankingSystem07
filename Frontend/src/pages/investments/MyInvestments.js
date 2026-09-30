import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import Loader from "../../components/Loader";
import { Container, Card, Table, Button } from "react-bootstrap";
import { getUserInvestments, deleteUserInvestmentById } from "../../api/investmentApi";
import { getUserId } from "../../utils/auth";

function MyInvestments() {
  const [loading, setLoading] = useState(true);
  const [investments, setInvestments] = useState([]);
  const [closingId, setClosingId] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const response = await getUserInvestments(getUserId());
      setInvestments(response.data || []);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  const handleCloseInvestment = async (investmentId) => {
    const confirmed = window.confirm(
      "Are you sure you want to close this investment? This action cannot be undone."
    );
    if (!confirmed) return;

    setClosingId(investmentId);
    try {
      await deleteUserInvestmentById(investmentId);
      setInvestments((prev) => prev.filter((inv) => inv.id !== investmentId));
    } catch (error) {
      console.log(error);
      alert("Failed to close investment. Please try again.");
    }
    setClosingId(null);
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
            <Card.Header className="bg-white fw-bold">My Investments</Card.Header>
            <Card.Body>
              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Investment</th>
                    <th>Amount</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {investments.map((inv) => (
                    <tr key={inv.id}>
                      <td>{inv.id}</td>
                      <td>{inv.investmentId}</td>
                      <td>₹{inv.amount}</td>
                      <td>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleCloseInvestment(inv.id)}
                          disabled={closingId === inv.id}
                        >
                          {closingId === inv.id ? "Closing..." : "Close"}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Container>
      </div>
    </div>
  );
}

export default MyInvestments;