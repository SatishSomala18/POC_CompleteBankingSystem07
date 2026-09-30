import React, { useState } from "react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import { addCreditProfile, updateCreditProfile, getCreditProfileByUserId, deleteCreditProfile } from "../../api/creditProfileApi";

function CreditProfileManagement() {
  const [creditForm, setCreditForm] = useState({ userId: "", creditScore: "", monthlyIncome: "" });
  const [creditProfiles, setCreditProfiles] = useState([]);
  const [creditMessage, setCreditMessage] = useState("");
  const [creditMsgType, setCreditMsgType] = useState("success");
  const [editingCreditId, setEditingCreditId] = useState(null);
  const [loadingCredit, setLoadingCredit] = useState(false);

  const notifyCredit = (text, type = "success") => {
    setCreditMessage(text);
    setCreditMsgType(type);
    setTimeout(() => setCreditMessage(""), 3000);
  };

  const fetchCreditProfiles = async (userId) => {
    if (!userId) return;
    setLoadingCredit(true);
    try {
      const res = await getCreditProfileByUserId(userId);
      setCreditProfiles(res.data || []);
    } catch {
      setCreditProfiles([]);
    }
    setLoadingCredit(false);
  };

  const handleCreditFormChange = (e) => {
    setCreditForm({ ...creditForm, [e.target.name]: e.target.value });
  };

  const handleCreditSubmit = async () => {
    if (!creditForm.userId || !creditForm.creditScore || !creditForm.monthlyIncome) {
      notifyCredit("Please fill in all fields.", "danger");
      return;
    }
    try {
      if (editingCreditId) {
        await updateCreditProfile(editingCreditId, {
          userId: parseInt(creditForm.userId),
          creditScore: parseInt(creditForm.creditScore),
          monthlyIncome: parseFloat(creditForm.monthlyIncome),
        });
        notifyCredit("Credit profile updated successfully.", "success");
      } else {
        await addCreditProfile({
          userId: parseInt(creditForm.userId),
          creditScore: parseInt(creditForm.creditScore),
          monthlyIncome: parseFloat(creditForm.monthlyIncome),
        });
        notifyCredit("Credit profile created successfully.", "success");
      }
      setCreditForm({ userId: "", creditScore: "", monthlyIncome: "" });
      setEditingCreditId(null);
      fetchCreditProfiles(creditForm.userId);
    } catch {
      notifyCredit("Operation failed. Please try again.", "danger");
    }
  };

  const handleCreditEdit = (profile) => {
    setEditingCreditId(profile.id);
    setCreditForm({
      userId: profile.userId,
      creditScore: profile.creditScore,
      monthlyIncome: profile.monthlyIncome,
    });
  };

  const handleCreditDelete = async (id, userId) => {
    if (!window.confirm("Are you sure you want to delete this credit profile?")) return;
    try {
      await deleteCreditProfile(id);
      notifyCredit("Credit profile deleted successfully.", "success");
      fetchCreditProfiles(userId);
    } catch {
      notifyCredit("Delete failed. Please try again.", "danger");
    }
  };

  const handleCreditCancel = () => {
    setEditingCreditId(null);
    setCreditForm({ userId: "", creditScore: "", monthlyIncome: "" });
  };

  return (
    <div>
      <Navbar />
      <div className="d-flex">
        <Sidebar />
        <div className="container-fluid p-4">

          <h4 className="mb-4 fw-bold">💳 Credit Profile Management</h4>

          <div className="card mb-4">
            <div className="card-header bg-info text-white fw-semibold">
              Manage Credit Profiles
            </div>
            <div className="card-body">

              {creditMessage && (
                <div className={`alert alert-${creditMsgType} py-2 mb-3`}>
                  {creditMessage}
                </div>
              )}

              <div className="row g-3 mb-4">
                <div className="col-md-3">
                  <label className="form-label fw-semibold">User ID</label>
                  <input
                    type="number"
                    className="form-control"
                    name="userId"
                    placeholder="Enter User ID"
                    value={creditForm.userId}
                    onChange={handleCreditFormChange}
                  />
                </div>
                <div className="col-md-3">
                  <label className="form-label fw-semibold">Credit Score</label>
                  <input
                    type="number"
                    className="form-control"
                    name="creditScore"
                    placeholder="e.g. 750"
                    value={creditForm.creditScore}
                    onChange={handleCreditFormChange}
                  />
                </div>
                <div className="col-md-3">
                  <label className="form-label fw-semibold">Monthly Income (₹)</label>
                  <input
                    type="number"
                    className="form-control"
                    name="monthlyIncome"
                    placeholder="e.g. 50000"
                    value={creditForm.monthlyIncome}
                    onChange={handleCreditFormChange}
                  />
                </div>
                <div className="col-md-3 d-flex align-items-end gap-2">
                  <button
                    className={`btn ${editingCreditId ? "btn-warning" : "btn-success"} fw-semibold`}
                    onClick={handleCreditSubmit}
                  >
                    {editingCreditId ? "Update Profile" : "Create Profile"}
                  </button>
                  {editingCreditId && (
                    <button className="btn btn-secondary" onClick={handleCreditCancel}>
                      Cancel
                    </button>
                  )}
                  <button
                    className="btn btn-outline-primary"
                    onClick={() => fetchCreditProfiles(creditForm.userId)}
                  >
                    View
                  </button>
                </div>
              </div>

              {loadingCredit ? (
                <p className="text-muted">Loading profiles...</p>
              ) : creditProfiles.length > 0 ? (
                <table className="table table-bordered mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>ID</th>
                      <th>User ID</th>
                      <th>Credit Score</th>
                      <th>Monthly Income</th>
                      <th>Risk Category</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {creditProfiles.map((profile) => (
                      <tr key={profile.id}>
                        <td>{profile.id}</td>
                        <td>{profile.userId}</td>
                        <td>
                          <span className={`badge ${profile.creditScore >= 750 ? "bg-success" :
                              profile.creditScore >= 600 ? "bg-warning text-dark" :
                                "bg-danger"
                            }`}>
                            {profile.creditScore}
                          </span>
                        </td>
                        <td>₹{parseFloat(profile.monthlyIncome).toLocaleString("en-IN")}</td>
                        <td>
                          <span className={`badge ${profile.riskCategory === "LOW" ? "bg-success" :
                              profile.riskCategory === "MEDIUM" ? "bg-warning text-dark" :
                                "bg-danger"
                            }`}>
                            {profile.riskCategory || "—"}
                          </span>
                        </td>
                        <td className="d-flex gap-2">
                          <button
                            className="btn btn-warning btn-sm"
                            onClick={() => handleCreditEdit(profile)}
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleCreditDelete(profile.id, profile.userId)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-muted mb-0">No credit profiles found. Enter a User ID and click View.</p>
              )}

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default CreditProfileManagement;