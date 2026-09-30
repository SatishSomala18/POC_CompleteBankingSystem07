import React, { useEffect } from "react";

import {
    BrowserRouter,
    Switch,
    Route,
    Redirect
} from "react-router-dom";

import PrivateRoute from "./components/PrivateRoute";
import ChatBot from "./components/ChatBot";

// Auth
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import VerifyOtp from "./pages/auth/VerifyOtp";

// Dashboards
import CustomerDashboard from "./pages/dashboard/CustomerDashboard";
import AdminDashboard from "./pages/dashboard/AdminDashboard";

// Transactions
import Deposit from "./pages/dashboard/Deposit";
import Withdraw from "./pages/dashboard/Withdraw";
import Transfer from "./pages/dashboard/Transfer";
import TransactionHistory from "./pages/transactions/TransactionHistory";

// QR Payment
import QrPayment from "./components/QRPayment";

// Investments
import InvestmentDashboard from "./pages/investments/InvestmentDashboard";
import MyInvestments from "./pages/investments/MyInvestments";
import InvestmentCalculator from "./pages/investments/InvestmentCalculator";

// Loans
import LoanDashboard from "./pages/loans/LoanDashboard";
import LoanApplication from "./pages/loans/LoanApplication";
import EmiCalculator from "./pages/loans/EmiCalculator";

// Admin
import Analytics from "./pages/admin/Analytics";
import UserManagement from "./pages/admin/UserManagement";
import FraudMonitoring from "./pages/admin/FraudMonitoring";
import CreditProfileManagement from "./pages/admin/CreditProfileManagement";
import BankingOperations from "./pages/admin/BankingOperations";
import Home from "./pages/Home";

import { isAuthenticated, startIdleTimer } from "./utils/auth";

function App() {

    useEffect(() => {
        if (isAuthenticated()) {
            startIdleTimer();
        }
    }, []);

    return (

        <BrowserRouter>

            <Switch>

                {/* Public Routes */}

                <Route
                    exact
                    path="/"
                    component={Home}
                />

                <Route
                    exact
                    path="/login"
                    component={Login}
                />

                <Route
                    exact
                    path="/register"
                    component={Register}
                />

                <Route
                    exact
                    path="/verify-otp"
                    component={VerifyOtp}
                />

                {/* User Routes */}

                <PrivateRoute
                    exact
                    path="/dashboard"
                    role="USER"
                    component={CustomerDashboard}
                />

                <PrivateRoute
                    exact
                    path="/deposit"
                    role={["USER", "ADMIN"]}
                    component={Deposit}
                />

                <PrivateRoute
                    exact
                    path="/withdraw"
                    role={["USER", "ADMIN"]}
                    component={Withdraw}
                />

                <PrivateRoute
                    exact
                    path="/transfer"
                    role={["USER", "ADMIN"]}
                    component={Transfer}
                />

                <PrivateRoute
                    exact
                    path="/transactions"
                    role={["USER", "ADMIN"]}
                    component={TransactionHistory}
                />

                <PrivateRoute
                    exact
                    path="/qr-payment"
                    role={["USER", "ADMIN"]}
                    component={QrPayment}
                />

                {/* Investments — USER sees full dashboard, ADMIN sees products-only page */}
                <PrivateRoute
                    exact
                    path="/investments"
                    role={["USER", "ADMIN"]}
                    component={InvestmentDashboard}
                />

                {/* My Investments — USER only */}
                <PrivateRoute
                    exact
                    path="/my-investments"
                    role="USER"
                    component={MyInvestments}
                />

                <PrivateRoute
                    exact
                    path="/investment-calculator"
                    role={["USER", "ADMIN"]}
                    component={InvestmentCalculator}
                />

                <PrivateRoute
                    exact
                    path="/loans"
                    role={["USER", "ADMIN"]}
                    component={LoanDashboard}
                />

                <PrivateRoute
                    exact
                    path="/loan-application"
                    role={["USER", "ADMIN"]}
                    component={LoanApplication}
                />

                <PrivateRoute
                    exact
                    path="/emi-calculator"
                    role={["USER", "ADMIN"]}
                    component={EmiCalculator}
                />

                {/* Admin Routes */}

                <PrivateRoute
                    exact
                    path="/admin"
                    role="ADMIN"
                    component={AdminDashboard}
                />

                <PrivateRoute
                    exact
                    path="/analytics"
                    role="ADMIN"
                    component={Analytics}
                />

                <PrivateRoute
                    exact
                    path="/users"
                    role="ADMIN"
                    component={UserManagement}
                />

                <PrivateRoute
                    exact
                    path="/fraud"
                    role="ADMIN"
                    component={FraudMonitoring}
                />

                <PrivateRoute
                    exact
                    path="/admin/credit-profiles"
                    role="ADMIN"
                    component={CreditProfileManagement}
                />

                <PrivateRoute
                    exact
                    path="/admin/banking-ops"
                    role="ADMIN"
                    component={BankingOperations}
                />

                {/* Fallback */}

                <Redirect to="/" />

            </Switch>

            <ChatBot />

        </BrowserRouter>

    );

}

export default App;