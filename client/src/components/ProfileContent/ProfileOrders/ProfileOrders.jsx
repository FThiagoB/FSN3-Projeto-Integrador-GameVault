import React, { useState, useEffect } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";

import OrderDetailsModal from "./OrderDetailsModal";
import StatusBadge from "../../../utils/StatusBadge";
import { ToastContainer } from "react-toastify";
import useNotification from "../../../utils/useNotification";

import moment from "moment";
import styles from "./profileOrders.module.css";

const ProfileOrders = () => {
  const [orders, setOrders] = useState([]);
  const { user } = useAuth();
  const [cookies] = useCookies(["authToken"]);

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const { notifySuccess, notifyError } = useNotification();
  const navigate = useNavigate();

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedOrder(null);
  };

  const fetchOrdersItems = async () => {
    try {
      const response = await fetch(`http://localhost:4500/orders/me`, {
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

  useEffect(() => {
    if (!user) navigate("/login");
    fetchOrdersItems();
  }, [user, navigate]);

  return (
    <main className={styles.profileMainContent}>
      <h2 className={styles.profileOrdersTitle}>My Orders</h2>

      <div className={styles.ordersList}>
        {orders.map((order) => (
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
                <StatusBadge status={order.status} showTooltip={true} />
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
                  className={styles.profileBtnSecondary}
                  onClick={() => handleViewDetails(order)}
                >
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <ToastContainer />

      <OrderDetailsModal
        show={showModal}
        onHide={handleCloseModal}
        order={selectedOrder}
        refreshFetch={fetchOrdersItems}
      />
    </main>
  );
};

export default ProfileOrders;
