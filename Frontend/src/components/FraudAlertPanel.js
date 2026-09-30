import React, { useEffect, useState } from "react";
import { getFlaggedTransactions } from "../api/bankingApi";
import { getRole } from "../utils/auth";

/* Uses the risk-score/flagged fields the backend already computes per
   transaction (see TransactionServiceImp.calculateRisk) - no mock data. */
function FraudAlertPanel() {

    const [alerts, setAlerts] = useState([]);

    useEffect(() => {

        if (getRole() !== "ADMIN") return;

        getFlaggedTransactions()
            .then(response => {

                const flagged = response.data || [];

                setAlerts(flagged.map(tx => ({
                    id: tx.tid,
                    message: `${tx.type} of \u20B9${tx.amount} flagged (risk score: ${tx.riskScore})`
                })));
            })
            .catch(() => setAlerts([]));

    }, []);

    return (

        <div className="card mb-3">

            <div className="card-header bg-warning">

                Fraud Alerts

            </div>

            <div className="card-body">

                {
                    alerts.length === 0 ? (
                        <p className="text-muted small mb-0">No flagged transactions right now.</p>
                    ) : (
                        <ul className="list-group">

                            {
                                alerts.map(alert => (

                                    <li
                                        key={alert.id}
                                        className="list-group-item"
                                    >

                                        ⚠ {alert.message}

                                    </li>

                                ))
                            }

                        </ul>
                    )
                }

            </div>

        </div>

    );
}

export default FraudAlertPanel;