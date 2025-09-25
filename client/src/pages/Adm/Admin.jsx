import styles from "./admin.module.css";
import { FaPencilAlt, FaTrash, FaTimes, FaSave, FaThumbsUp, FaThumbsDown, FaCog, FaEye, FaCreditCard } from "react-icons/fa";
import { useEffect, useState } from "react";

import { useAuth } from "../../contexts/AuthContext";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";

import AdminOrderModal from "./AdminOrderModal";
import StatusBadge from "../../utils/StatusBadge";

const Admin = () => {
  const { user } = useAuth();
  const [cookies] = useCookies(["authToken"]);
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({ name: "", email: "", role: "" });

  const [dashboardData, setDashboardData] = useState({});
  const [showEditModal, setShowEditModal] = useState(false);
  const [orders, setOrders] = useState([]);

  // Estados para controlar o modal
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);

  // Funções auxiliares para formatar status
  const getStatusLabel = (status) => {
    const statusLabels = {
      pending: 'Pendente',
      processing: 'Processando',
      shipped: 'Enviado',
      delivered: 'Entregue',
      cancelled: 'Cancelado'
    };
    return statusLabels[status] || status;
  };

  const getPaymentStatusLabel = (paymentStatus) => {
    const paymentLabels = {
      pending: 'Pendente',
      processing: 'Processando',
      paid: 'Pago',
      failed: 'Falhou',
      refunded: 'Reembolsado',
      cancelled: 'Cancelado'
    };
    return paymentLabels[paymentStatus] || paymentStatus;
  };

  // Funções de manipulação
  const handleManageOrder = (order) => {
    setSelectedOrder(order);
    setShowOrderModal(true);
  };

  const handleViewOrder = (order) => {
    // Aqui você pode implementar uma visualização apenas leitura
    // ou redirecionar para uma página de detalhes
    console.log('Visualizar pedido:', order);
    // Alternativa: abrir o mesmo modal em modo leitura
    setSelectedOrder(order);
    setShowOrderModal(true);
  };


  const handleCloseOrderModal = () => {
    setShowOrderModal(false);
    setSelectedOrder(null);
  };

  const cargos = { seller: "Vendedor", user: "Cliente", admin: "Administrador" }

  const handleCloseEditModal = () => {
    setShowEditModal(false);
  };

  const handleUpdateOrder = (updatedOrder) => {
    if (orders) {
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order.id === updatedOrder.id ? updatedOrder : order
        )
      );
    }
    console.log("Mudou: ", orders)
  };

  const fetchDashboardData = async () => {
    try {
      const response = await fetch(`http://localhost:4500/admin/dashboard`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${cookies.authToken}`,
        },
      });

      if (!response.ok) {
        console.error(`Problemas na requisição: ${response}`);
        return;
      }

      const data = await response.json();
      setDashboardData(data);
      console.log({ data })
    } catch (error) {
      console.error(`Problemas na requisição: ${error}`);
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await fetch(`http://localhost:4500/admin/orders`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${cookies.authToken}`,
        },
      });

      if (!response.ok) {
        console.error(`Problemas na requisição: ${response}`);
        return;
      }

      const data = await response.json();
      // Garanta que data.orders seja um array
      setOrders(Array.isArray(data) ? data : []);
      console.log({ data })
    } catch (error) {
      console.error(`Problemas na requisição: ${error}`);
    }
  };

  const confirmPagamento = async (orderID) => {
    try {
      console.log(`/admin/confirm-payment/${orderID}`) // Agora usa orderID
      const response = await fetch(`http://localhost:4500/admin/confirm-payment/${orderID}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${cookies.authToken}`,
          "Content-Type": "application/json" // Adicione este header
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Erro na requisição: ${response.status} - ${errorText}`);
        return;
      }

      fetchDashboardData();
      fetchOrders();
    } catch (error) {
      console.error(`Problemas na requisição: ${error}`);
      fetchDashboardData();
      fetchOrders();
    }
  }

  const deleteUser = async (userID) => {
    try {
      const response = await fetch(`http://localhost:4500/admin/user/${userID}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${cookies.authToken}`,
        },
      });

      if (!response.ok) {
        console.error(`Problemas na requisição: ${response}`);
        return;
      }

      fetchDashboardData();
      fetchOrders();
    } catch (error) {
      console.error(`Problemas na requisição: ${error}`);
      fetchDashboardData();
      fetchOrders();
    }
  };

  const setUserSeller = async (sellerID, state) => {
    try {
      console.log(`http://localhost:4500/admin/user/${sellerID}/seller`)
      const response = await fetch(`http://localhost:4500/admin/user/${sellerID}/seller`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${cookies.authToken}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ state }),
      });

      if (!response.ok) {
        const data = await response.json()
        console.error(`Problemas na requisição: ${data?.message}`);
        return;
      }

      fetchDashboardData();
    } catch (error) {

      console.error(`Problemas na requisição: ${error}`);
    }
  };

  useEffect(() => {
    if (!user) navigate("/login");
    else if (user.role !== "admin") navigate("/profile");

    fetchDashboardData()
    fetchOrders()
  }, [user, navigate])

  // Abre o modal e preenche o formulário com os dados do usuário
  const handleEditClick = (user) => {
    setSelectedUser(user);
    setFormData({ name: user.name, email: user.email, role: user.role });
    setIsModalOpen(true);
  };
  console.log({ orders })
  // Lógica de exclusão (pode ser aprimorada)
  const handleDeleteClick = (user) => {
    // Em uma aplicação real, evite usar window.confirm
    if (
      window.confirm(`Tem certeza que deseja excluir o usuário ${user.name}?`)
    ) {
      deleteUser(user.id)
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
              <p className={styles.adminCardSubtitle}>Vendas concluidas</p>
              <h2
                className={`${styles.adminCardTitle} ${styles.adminTextGreen}`}
              >
                R$ {(dashboardData?.summary?.revenue?.delivered) | 0}
              </h2>
            </div>
            <div className={styles.adminCard}>
              <p className={styles.adminCardSubtitle}>Nossos vendedores</p>
              <h2
                className={`${styles.adminCardTitle} ${styles.adminTextBlue}`}
              >
                {dashboardData?.summary?.totalUsers?.seller | 0}
              </h2>
            </div>
            <div className={styles.adminCard}>
              <p className={styles.adminCardSubtitle}>Total de pedidos</p>
              <h2
                className={`${styles.adminCardTitle} ${styles.adminTextPurple}`}
              >
                {dashboardData?.summary?.totalOrders?.total | 0}
              </h2>
            </div>
            <div className={styles.adminCard}>
              <p className={styles.adminCardSubtitle}>total de Jogos disponíveis</p>
              <h2
                className={`${styles.adminCardTitle} ${styles.adminTextPurple}`}
              >
                {dashboardData?.summary?.totalGames | 0}
              </h2>
            </div>
          </div>

          {(dashboardData?.recentActivity?.pendingSellers?.length ?? false) ? (
            <div className={styles.adminTableContainer}>
              <div className={styles.adminTableHeader}>Candidatos a Vendedor</div>
              <table className={styles.adminTable}>
                <thead className={styles.adminTableHead}>
                  <tr>
                    <th className={styles.adminTableCell}>Name</th>
                    <th className={styles.adminTableCell}>Email</th>
                    <th
                      className={styles.adminTableCell}
                      style={{ textAlign: "center" }}
                    >
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {(dashboardData?.recentActivity?.pendingSellers ?? []).map((user) => (
                    <tr key={user.id} className={styles.adminTableRow}>
                      <td className={styles.adminTableCell}>{user.name}</td>
                      <td className={styles.adminTableCell}>{user.email}</td>
                      <td
                        className={`${styles.adminTableCell} ${styles.adminActionButtons}`}
                      >
                        <button
                          className={`${styles.adminActionButton} ${styles.edit}`}
                          onClick={() => { setUserSeller(user.id, true) }}
                        >
                          <FaThumbsUp />
                        </button>
                        <button
                          className={`${styles.adminActionButton} ${styles.delete}`}
                          onClick={() => setUserSeller(user.id, false)}
                        >
                          <FaThumbsDown />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (<></>)}

          {(orders && orders.length)?(
            <div className={styles.adminTableContainer}>
              <div className={styles.adminTableHeader}>Pedidos Recentes</div>
              <table className={styles.adminTable}>
                <thead className={styles.adminTableHead}>
                  <tr>
                    <th className={styles.adminTableCell}>ID do Pedido</th>
                    <th className={styles.adminTableCell}>Cliente</th>
                    <th className={styles.adminTableCell}>Data</th>
                    <th className={styles.adminTableCell}>Status</th>
                    <th className={styles.adminTableCell}>Pagamento</th>
                    <th className={styles.adminTableCell}>Total</th>
                    <th className={styles.adminTableCell} style={{ textAlign: "center" }}>
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {console.log("Dentro: ", Object.keys(orders).length)}
                  {console.log("Dentro: ", orders)}

                  {(orders ?? []).map((order) => (
                    <tr key={order.id} className={styles.adminTableRow}>
                      <td className={styles.adminTableCell}>
                        <strong>{order.externID}</strong>
                      </td>
                      <td className={styles.adminTableCell}>
                        <div>
                          <strong>{order.user.name}</strong>
                          <br />
                          <small className="text-muted">{order.user.email}</small>
                        </div>
                      </td>
                      <td className={styles.adminTableCell}>
                        {new Date(order.createdAt).toLocaleDateString('pt-BR')}
                        <br />
                        <small className="text-muted">
                          {new Date(order.createdAt).toLocaleTimeString('pt-BR', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </small>
                      </td>
                      <td className={styles.adminTableCell}>
                        <span className={`${styles.statusBadge} ${styles[order.status]}`}>
                          <StatusBadge status={order.status}/>
                        </span>
                      </td>
                      <td className={styles.adminTableCell}>
                        <span className={`${styles.statusBadge} ${styles[order.paymentStatus]}`}>
                          <StatusBadge status={order.paymentStatus}/>
                        </span>
                      </td>
                      <td className={styles.adminTableCell}>
                        <strong>
                          {new Intl.NumberFormat('pt-BR', {
                            style: 'currency',
                            currency: 'BRL'
                          }).format(order.total)}
                        </strong>
                      </td>
                      <td className={`${styles.adminTableCell} ${styles.adminActionButtons}`}>
                        {/* <button
                          className={`${styles.adminActionButton} ${styles.manage}`}
                          onClick={() => handleManageOrder(order)}
                          title="Gerenciar Pedido"
                        >
                          <FaCog />
                        </button>
                        <button
                          className={`${styles.adminActionButton} ${styles.view}`}
                          onClick={() => handleViewOrder(order)}
                          title="Ver Detalhes"
                        >
                          <FaEye />
                          FaCreditCard
                        </button> */}
                        {["cancelled", "delivered", "completed"].includes(order.status)?(

                            <div>Pedido finalizado</div>
                        ):(
                          <button
                            className={`${styles.adminActionButton} ${styles.manage}`}
                            onClick={() => confirmPagamento(order.id)}
                            title="Confirmar pagamento"
                          >
                            <FaCreditCard />
                          </button>
                          )}
                      </td>
                    </tr>
                  ))}

                </tbody>
              </table>
            </div>
          ):(<></>)}


          <div className={styles.adminTableContainer}>
            <div className={styles.adminTableHeader}>Cadastros recentes</div>
            <table className={styles.adminTable}>
              <thead className={styles.adminTableHead}>
                <tr>
                  <th className={styles.adminTableCell}>Name</th>
                  <th className={styles.adminTableCell}>Email</th>
                  <th className={styles.adminTableCell}>Role</th>
                  <th
                    className={styles.adminTableCell}
                    style={{ textAlign: "center" }}
                  >
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {(dashboardData?.recentActivity?.users ?? []).map((iterativeUser) => (
                  <>
                    {iterativeUser.id === user?.id ? (<></>) : (
                      <tr key={iterativeUser.id} className={styles.adminTableRow}>
                        <td className={styles.adminTableCell}>{iterativeUser.name}</td>
                        <td className={styles.adminTableCell}>{iterativeUser.email}</td>
                        <td className={styles.adminTableCell}>{cargos[iterativeUser.role]}</td>
                        <td
                          className={`${styles.adminTableCell} ${styles.adminActionButtons}`}
                        >
                          <button
                            className={`${styles.adminActionButton} ${styles.delete}`}
                            onClick={() => handleDeleteClick(iterativeUser)}
                          >
                            <FaTrash />
                          </button>
                        </td>
                      </tr>
                    )}
                  </>
                ))}
              </tbody>
            </table>
          </div>

          <div className={styles.adminGridButtons}>
            <button
              className={`${styles.adminButton} ${styles.adminButtonPink}`}
              onClick={() => setShowEditModal(true)}
            >
              Gerenciar pedidos
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
              src={user?.imageUrl}
              alt="Profile"
              className={styles.adminProfileImage}
            />
            <div className={styles.adminProfileDetails}>
              <h3 className={styles.adminProfileName}>{user?.name}</h3>
              <p className={styles.adminProfileRole}>{cargos[(user?.role) ?? "admin"]}</p>
              <button className={styles.adminEditButton} onClick={() => navigate("/profile")}>Editar perfil</button>
            </div>
          </div>
        </main>

        {selectedOrder && (
          <AdminOrderModal
            show={showOrderModal}
            onHide={handleCloseModal}
            order={selectedOrder}
            onUpdateOrder={handleUpdateOrder}
          />
        )}
      </div>
    </div>
  );
};

export default Admin;
