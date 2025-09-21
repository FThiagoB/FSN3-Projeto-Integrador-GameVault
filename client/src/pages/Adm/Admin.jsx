import React from "react";
import "./Admin.css";
import { FaPencilAlt, FaTrash, FaTimes, FaSave } from "react-icons/fa";
import { useState } from "react";

const Admin = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({ name: "", email: "", role: "" });

  const users = [
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      role: "Admin",
      status: "Active",
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane@example.com",
      role: "Editor",
      status: "Pending",
    },
  ];

  // Abre o modal e preenche o formulário com os dados do usuário
  const handleEditClick = (user) => {
    setSelectedUser(user);
    setFormData({ name: user.name, email: user.email, role: user.role });
    setIsModalOpen(true);
  };

  // Lógica de exclusão (pode ser aprimorada)
  const handleDeleteClick = (user) => {
    if (
      window.confirm(`Tem certeza que deseja excluir o usuário ${user.name}?`)
    ) {
      console.log(`Usuário ${user.name} excluído!`);
      // Aqui você adicionaria a lógica para remover o usuário da lista
    }
  };

  // Fecha o modal e limpa os estados
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
    setFormData({ name: "", email: "", role: "" });
  };

  // Atualiza o estado do formulário conforme o usuário digita
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Simula o salvamento dos dados
  const handleSaveChanges = () => {
    console.log("Salvando alterações:", formData);
    // Aqui você adicionaria a lógica para atualizar o usuário na lista ou API
    handleCloseModal();
  };

  return (
    <div className="admin-layout">
      {/* Main Content */}
      <div className="admin-main-content">
        {/* Content */}
        <main className="admin-content">
          <div className="admin-grid-cards">
            {/* Seus cards aqui */}
            <div className="admin-card">
              <p className="admin-card-subtitle">Total Users</p>
              <h2 className="admin-card-title admin-text-blue">1,240</h2>
            </div>
            <div className="admin-card">
              <p className="admin-card-subtitle">Revenue</p>
              <h2 className="admin-card-title admin-text-green">$24,500</h2>
            </div>
            <div className="admin-card">
              <p className="admin-card-subtitle">New Orders</p>
              <h2 className="admin-card-title admin-text-purple">320</h2>
            </div>
            <div className="admin-card">
              <p className="admin-card-subtitle">Pending Tickets</p>
              <h2 className="admin-card-title admin-text-pink">12</h2>
            </div>
          </div>

          <div className="admin-table-container">
            <div className="admin-table-header">User List</div>
            <table className="admin-table">
              <thead className="admin-table-head">
                <tr>
                  <th className="admin-table-cell">Name</th>
                  <th className="admin-table-cell">Email</th>
                  <th className="admin-table-cell">Role</th>
                  <th className="admin-table-cell">Status</th>
                  <th
                    className="admin-table-cell"
                    style={{ textAlign: "center" }}
                  >
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="admin-table-row">
                    <td className="admin-table-cell">{user.name}</td>
                    <td className="admin-table-cell">{user.email}</td>
                    <td className="admin-table-cell">{user.role}</td>
                    <td
                      className={`admin-table-cell admin-status admin-status-${
                        user.status === "Active" ? "active" : "pending"
                      }`}
                    >
                      {user.status}
                    </td>
                    <td className="admin-table-cell admin-action-buttons">
                      <button
                        className="admin-action-button edit"
                        onClick={() => handleEditClick(user)}
                      >
                        <FaPencilAlt />
                      </button>
                      <button
                        className="admin-action-button delete"
                        onClick={() => handleDeleteClick(user)}
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="admin-grid-buttons">
            <button className="admin-button admin-button-blue">Add User</button>
            <button className="admin-button admin-button-green">
              Export Data
            </button>
            <button className="admin-button admin-button-purple">
              Generate Report
            </button>
            <button className="admin-button admin-button-pink">
              Delete Records
            </button>
          </div>
          {isModalOpen && selectedUser && (
            <div className="admin-modal-overlay">
              <div className="admin-modal-content">
                <div className="admin-modal-header">
                  <h2 className="admin-modal-title">Edit User</h2>
                  <button
                    className="admin-modal-close-btn"
                    onClick={handleCloseModal}
                  >
                    <FaTimes size={24} />
                  </button>
                </div>
                <div className="admin-modal-body">
                  <div className="admin-form-group">
                    <label htmlFor="name">Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      className="admin-form-input"
                      value={formData.name}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="admin-form-group">
                    <label htmlFor="email">Email</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className="admin-form-input"
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="admin-form-group">
                    <label htmlFor="role">Role</label>
                    <input
                      type="text"
                      id="role"
                      name="role"
                      className="admin-form-input"
                      value={formData.role}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="admin-modal-footer">
                  <button
                    className="admin-button admin-button-pink"
                    onClick={handleCloseModal}
                    style={{ marginRight: "1rem" }}
                  >
                    Cancel
                  </button>
                  <button
                    className="admin-button admin-button-blue"
                    onClick={handleSaveChanges}
                  >
                    <FaSave style={{ marginRight: "0.5rem" }} />
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          )}
          <div className="admin-profile-card">
            <img
              src="https://i.pravatar.cc/100"
              alt="Profile"
              className="admin-profile-image"
            />
            <div className="admin-profile-details">
              <h3 className="admin-profile-name">Sophia Ray</h3>
              <p className="admin-profile-role">Administrator</p>
              <button className="admin-edit-button">Edit Profile</button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Admin;
