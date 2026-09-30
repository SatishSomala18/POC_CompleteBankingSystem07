import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import Loader from "../../components/Loader";
import { getAllUsers, deleteUser, approveKyc, rejectKyc } from "../../api/userApi";

function UserManagement() {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");
  const [msgType, setMsgType] = useState("success");

  useEffect(() => {
    loadUsers();
  }, []);

  const notify = (text, type = "success") => {
    setMessage(text);
    setMsgType(type);
    setTimeout(() => setMessage(""), 3000);
  };

  const loadUsers = async () => {
    try {
      const response = await getAllUsers();

      // Debug: confirm the actual field name the backend sends
      console.log("User object from backend:", response.data);

      setUsers(response.data || []);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  // Works whether backend sends "role" or "roles"
  const getUserRole = (user) => user.role ?? user.roles;

  const removeUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await deleteUser(id);
      notify("User deleted successfully.", "success");
      loadUsers();
    } catch (error) {
      console.log(error);
      notify("Failed to delete user.", "danger");
    }
  };

  const handleApproveKyc = async (id) => {
    try {
      await approveKyc(id);
      notify("KYC approved successfully.", "success");
      loadUsers();
    } catch (error) {
      console.log(error);
      notify("Failed to approve KYC.", "danger");
    }
  };

  const handleRejectKyc = async (id) => {
    try {
      await rejectKyc(id);
      notify("KYC rejected.", "success");
      loadUsers();
    } catch (error) {
      console.log(error);
      notify("Failed to reject KYC.", "danger");
    }
  };

  if (loading) return <Loader />;

  return (
    <div>
      <Navbar />
      <div className="d-flex">
        <Sidebar />
        <div className="container-fluid p-4">

          {message && (
            <div
              className={`alert alert-${msgType} alert-dismissible d-flex align-items-center gap-2 mb-4 shadow-sm rounded-3`}
              role="alert"
            >
              <i className={`bi ${msgType === "success" ? "bi-check-circle-fill" : "bi-x-circle-fill"} fs-6`}></i>
              <span>{message}</span>
              <button type="button" className="btn-close ms-auto" onClick={() => setMessage("")} />
            </div>
          )}

          <div className="card border-0 shadow-sm rounded-3">
            <div className="card-header bg-white border-bottom fw-bold text-dark py-3">
              User Management
              <span className="badge bg-primary ms-2">{users.length}</span>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th className="ps-3 text-muted small text-uppercase fw-semibold" style={{ fontSize: "11px" }}>ID</th>
                      <th className="text-muted small text-uppercase fw-semibold" style={{ fontSize: "11px" }}>Name</th>
                      <th className="text-muted small text-uppercase fw-semibold" style={{ fontSize: "11px" }}>Email</th>
                      <th className="text-muted small text-uppercase fw-semibold" style={{ fontSize: "11px" }}>Role</th>
                      <th className="text-muted small text-uppercase fw-semibold" style={{ fontSize: "11px" }}>KYC</th>
                      <th className="text-muted small text-uppercase fw-semibold" style={{ fontSize: "11px" }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="text-center text-muted py-5">
                          No users found
                        </td>
                      </tr>
                    ) : (
                      users.map((user) => {
                        const role = getUserRole(user);
                        return (
                          <tr key={user.id}>
                            <td className="ps-3 fw-semibold text-dark">#{user.id}</td>
                            <td>{user.name}</td>
                            <td className="text-muted">{user.email}</td>
                            <td>
                              {role ? (
                                <span className={`badge ${role === "ADMIN" ? "bg-danger" : "bg-primary"}`}>
                                  {role}
                                </span>
                              ) : (
                                <span className="text-muted small">—</span>
                              )}
                            </td>
                            <td>
                              <span className={`badge ${user.kycStatus === "VERIFIED" ? "bg-success" :
                                user.kycStatus === "REJECTED" ? "bg-danger" :
                                  "bg-warning text-dark"
                                }`}>
                                {user.kycStatus || "PENDING"}
                              </span>
                            </td>
                            <td>
                              <div className="d-flex gap-2">
                                {user.kycStatus !== "VERIFIED" && (
                                  <button
                                    className="btn btn-success btn-sm fw-semibold rounded-3"
                                    onClick={() => handleApproveKyc(user.id)}
                                  >
                                    Approve KYC
                                  </button>
                                )}
                                {user.kycStatus !== "REJECTED" && (
                                  <button
                                    className="btn btn-outline-danger btn-sm fw-semibold rounded-3"
                                    onClick={() => handleRejectKyc(user.id)}
                                  >
                                    Reject KYC
                                  </button>
                                )}
                                <button
                                  className="btn btn-danger btn-sm fw-semibold rounded-3"
                                  onClick={() => removeUser(user.id)}
                                >
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default UserManagement;