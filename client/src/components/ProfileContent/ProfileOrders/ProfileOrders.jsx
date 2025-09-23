import React from "react";
import { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";

import { useAuth } from '../../../contexts/AuthContext';
import { useCookies } from 'react-cookie';
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import OrderDetailsModal from './OrderDetailsModal';

import moment from 'moment';
import "./ProfileOrders.css";

import Badge from 'react-bootstrap/Badge';

// Status badges com cores
const getStatusBadge = (status) => {
  const statusConfig = {
    pending: { variant: 'warning', text: 'Pendente' },
    completed: { variant: 'success', text: 'Concluído' },
    cancelled: { variant: 'danger', text: 'Cancelado' },
    shipped: { variant: 'info', text: 'Enviado' },
    processing: { variant: 'primary', text: 'Processando' }
  };
  
  const config = statusConfig[status] || { variant: 'secondary', text: status };
  return <Badge bg={config.variant}>{config.text}</Badge>;
};

const notifySuccess = (Mensagem) => {
  toast.success(Mensagem, {
    position: "bottom-right",
    autoClose: 1000,
    hideProgressBar: false,
    closeOnClick: false,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "colored",
  });
}

const notifyError = (message) => {
  toast.error(message, {
    position: "bottom-right",
    autoClose: 1500,       // um pouco mais de tempo para ler o erro
    hideProgressBar: false,
    closeOnClick: true,    // permitir fechar ao clicar
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "colored",
  });
}

const ProfileOrders = () => {
  const [orders, setOrders] = useState([]);
  const { user, syncData } = useAuth();
  const [cookies] = useCookies(['authToken']);

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const navigate = useNavigate();

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedOrder(null);
  };

  const fetchOrdesItems = async (zipCode) => {
    try {
      const response = await fetch(`http://localhost:4500/orders/me`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${cookies.authToken}`,
        }
      });

      if (!response.ok) {
        console.error(`Problemas na requisição: ${response}`);
        return;
      }

      const data = await response.json();
      setOrders( data.orders );

      console.log(data)
    } catch (error) {
      console.error(`Problemas na requisição: ${error}`);
    }
  };

  // Bloqueia essa rota caso o usuário esteja deslogado
  useEffect(() => {
    if (!user) navigate('/login');

    fetchOrdesItems();
  }, [user, navigate]);

  return (
    <main className="profile-main-content">
      <h2 className="profile-orders-title">My Orders</h2>

      <div className="orders-list">
        {orders ? orders.map((order) => (
          <div key={order.id} className="order-card">
            <div className="order-card-header">
              <div className="order-info">
                <span className="label">Order ID: </span>
                <span>{order.externID}</span>
              </div>
              <div className="order-info">
                <span className="label">Date: </span>
                <span>{moment(order.createdAt).format("DD/MM/YYYY HH:mm:ss")}</span>
              </div>
              <span>
                {getStatusBadge(order.status)}
              </span>
            </div>
            <div className="order-card-body">
              <ul className="order-item-list">
                {order.items.map((item, index) => (
                  <li key={index} className="order-item">
                    <img
                      src={item.game.imageUrl}
                      alt={item.game.title}
                      className="order-item-image"
                    />
                    <span className="order-item-name">{item.game.title} (x{item.quantity})</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="order-card-footer">
              <span className="order-total">Total: R$ {order.total}</span>

              <div className="d-flex gap-4">
                <button className="profile-btn profile-btn-secondary" onClick={() => handleViewDetails(order)}>
                  View Details
                </button>
              </div>
            </div>
          </div>
        )) : ""}
      </div>
      <ToastContainer />
      {/* Modal */}
      <OrderDetailsModal 
        show={showModal}
        onHide={handleCloseModal}
        order={selectedOrder}
        style={{ zIndex: 3080 }}
        className="custom-order-modal"
        backdropClassName="custom-order-modal-backdrop"
        dialogClassName="custom-order-modal-dialog"
        centered
        refreshFetch={fetchOrdesItems}
      />
    </main>
  );
};

export default ProfileOrders;
