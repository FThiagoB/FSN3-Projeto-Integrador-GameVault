import styles from "./admin.module.css";
import { FaPencilAlt, FaTrash, FaTimes, FaSave } from "react-icons/fa";
import { useState } from "react";

// Removi os hooks não utilizados para este exemplo, mas você pode adicioná-los de volta
// import { useAuth } from "../../contexts/AuthContext";
// import { useCookies } from "react-cookie";
// import { useNavigate } from "react-router-dom";

const Admin = () => {
  // const { user } = useAuth();
  // const [cookies] = useCookies(["authToken"]);
  // const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({ name: "", email: "", role: "" });

  // Mock de usuário para o exemplo funcionar sem o contexto de autenticação
  const user = { role: "admin" };

  // Bloqueia essa rota caso o usuário esteja deslogado
  // if (!user) navigate("/login");
  // Bloqueia essa rota caso o usuário não é admin
  // else if (user.role !== "admin") navigate("/profile");

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
    // Em uma aplicação real, evite usar window.confirm
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
    <div className={styles.adminLayout}>
      {/* Main Content */}
      <div className={styles.adminMainContent}>
        {/* Content */}
        <main className={styles.adminContent}>
          <div className={styles.adminGridCards}>
            {/* Seus cards aqui */}
            <div className={styles.adminCard}>
              <p className={styles.adminCardSubtitle}>Total Users</p>
              <h2
                className={`${styles.adminCardTitle} ${styles.adminTextBlue}`}
              >
                1,240
              </h2>
            </div>
            <div className={styles.adminCard}>
              <p className={styles.adminCardSubtitle}>Revenue</p>
              <h2
                className={`${styles.adminCardTitle} ${styles.adminTextGreen}`}
              >
                $24,500
              </h2>
            </div>
            <div className={styles.adminCard}>
              <p className={styles.adminCardSubtitle}>New Orders</p>
              <h2
                className={`${styles.adminCardTitle} ${styles.adminTextPurple}`}
              >
                320
              </h2>
            </div>
            <div className={styles.adminCard}>
              <p className={styles.adminCardSubtitle}>Pending Tickets</p>
              <h2
                className={`${styles.adminCardTitle} ${styles.adminTextPink}`}
              >
                12
              </h2>
            </div>
          </div>

          <div className={styles.adminTableContainer}>
            <div className={styles.adminTableHeader}>User List</div>
            <table className={styles.adminTable}>
              <thead className={styles.adminTableHead}>
                <tr>
                  <th className={styles.adminTableCell}>Name</th>
                  <th className={styles.adminTableCell}>Email</th>
                  <th className={styles.adminTableCell}>Role</th>
                  <th className={styles.adminTableCell}>Status</th>
                  <th
                    className={styles.adminTableCell}
                    style={{ textAlign: "center" }}
                  >
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className={styles.adminTableRow}>
                    <td className={styles.adminTableCell}>{user.name}</td>
                    <td className={styles.adminTableCell}>{user.email}</td>
                    <td className={styles.adminTableCell}>{user.role}</td>
                    <td
                      className={`${styles.adminTableCell} ${
                        styles.adminStatus
                      } ${
                        user.status === "Active"
                          ? styles.adminStatusActive
                          : styles.adminStatusPending
                      }`}
                    >
                      {user.status}
                    </td>
                    <td
                      className={`${styles.adminTableCell} ${styles.adminActionButtons}`}
                    >
                      <button
                        className={`${styles.adminActionButton} ${styles.edit}`}
                        onClick={() => handleEditClick(user)}
                      >
                        <FaPencilAlt />
                      </button>
                      <button
                        className={`${styles.adminActionButton} ${styles.delete}`}
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

          <div className={styles.adminGridButtons}>
            <button
              className={`${styles.adminButton} ${styles.adminButtonBlue}`}
            >
              Add User
            </button>
            <button
              className={`${styles.adminButton} ${styles.adminButtonGreen}`}
            >
              Export Data
            </button>
            <button
              className={`${styles.adminButton} ${styles.adminButtonPurple}`}
            >
              Generate Report
            </button>
            <button
              className={`${styles.adminButton} ${styles.adminButtonPink}`}
            >
              Delete Records
            </button>
          </div>
          {isModalOpen && selectedUser && (
            <div className={styles.adminModalOverlay}>
              <div className={styles.adminModalContent}>
                <div className={styles.adminModalHeader}>
                  <h2 className={styles.adminModalTitle}>Edit User</h2>
                  <button
                    className={styles.adminModalCloseBtn}
                    onClick={handleCloseModal}
                  >
                    <FaTimes size={24} />
                  </button>
                </div>
                <div className={styles.adminModalBody}>
                  <div className={styles.adminFormGroup}>
                    <label htmlFor="name">Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      className={styles.adminFormInput}
                      value={formData.name}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className={styles.adminFormGroup}>
                    <label htmlFor="email">Email</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className={styles.adminFormInput}
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className={styles.adminFormGroup}>
                    <label htmlFor="role">Role</label>
                    <input
                      type="text"
                      id="role"
                      name="role"
                      className={styles.adminFormInput}
                      value={formData.role}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className={styles.adminModalFooter}>
                  <button
                    className={`${styles.adminButton} ${styles.adminButtonPink}`}
                    onClick={handleCloseModal}
                    style={{ marginRight: "1rem" }}
                  >
                    Cancel
                  </button>
                  <button
                    className={`${styles.adminButton} ${styles.adminButtonBlue}`}
                    onClick={handleSaveChanges}
                  >
                    <FaSave style={{ marginRight: "0.5rem" }} />
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          )}
          <div className={styles.adminProfileCard}>
            <img
              src="https://i.pravatar.cc/100"
              alt="Profile"
              className={styles.adminProfileImage}
            />
            <div className={styles.adminProfileDetails}>
              <h3 className={styles.adminProfileName}>Sophia Ray</h3>
              <p className={styles.adminProfileRole}>Administrator</p>
              <button className={styles.adminEditButton}>Edit Profile</button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Admin;
