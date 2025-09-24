import React, { useEffect, useState } from "react";
import styles from "./profileOrders.module.css";

import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../../contexts/AuthContext";
import { ToastContainer } from "react-toastify";

import OrderDetailsModal from "./OrderDetailsModal";
import moment from "moment";
import StatusBadge from "./../../../../utils/StatusBadge";

const ProfileOrders = () => {
  const [orders, setOrders] = useState([]);
  const { user, syncData } = useAuth();
  const [cookies] = useCookies(["authToken"]);

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

  const fetchOrdesItems = async () => {
    try {
      const response = await fetch(`http://localhost:4500/seller/orders/me`, {
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
      setOrders(data.orders || []);
    } catch (error) {
      console.error(`Problemas na requisição: ${error}`);
    }
  };

  // Bloqueia essa rota caso o usuário esteja deslogado
  useEffect(() => {
    if (!user) navigate("/login");

    fetchOrdesItems();
  }, [user, navigate]);

  return (
    <main className={styles.profileMainContent}>
      <h2 className={styles.profileOrdersTitle}>My Salles</h2>

      <div className={styles.ordersList}>
        {orders && orders.length > 0 ? (
          orders.map((order) => (
            <div key={order.id} className={styles.orderCard}>
              <div className={styles.orderCardHeader}>
                <div className={styles.orderInfo}>
                  <span className={styles.label}>Order ID: </span>
                  <span>{order.externID}</span>
                </div>

                <div className={styles.orderInfo}>
                  <span className={styles.label}>Date: </span>
                  <span>
                    {moment(order.createdAt).format("DD/MM/YYYY HH:mm:ss")}
                  </span>
                </div>

                <span>
                  <StatusBadge status={order.status} />
                </span>
              </div>

              <div className={styles.orderCardBody}>
                <ul className={styles.orderItemList}>
                  {order.items.map((item, index) => (
                    <li key={index} className={styles.orderItem}>
                      <img
                        src={item.game.imageUrl}
                        alt={item.game.title}
                        className={styles.orderItemImage}
                      />
                      <span className={styles.orderItemName}>
                        {item.game.title} (x{item.quantity})
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className={styles.orderCardFooter}>
                <span className={styles.orderTotal}>
                  Total: R$ {Number(order.total).toFixed(2)}
                </span>

                <div className="d-flex gap-4">
                  <button
                    className={`${styles.profileBtn} ${styles.profileBtnSecondary}`}
                    onClick={() => handleViewDetails(order)}
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className={styles.emptyNotice}>
            <p>No orders found.</p>
          </div>
        )}
      </div>

      <ToastContainer />

      {/* Modal */}
      <OrderDetailsModal
        show={showModal}
        onHide={handleCloseModal}
        order={selectedOrder}
        refreshFetch={fetchOrdesItems}
      />
    </main>
  );
};

export default ProfileOrders;
