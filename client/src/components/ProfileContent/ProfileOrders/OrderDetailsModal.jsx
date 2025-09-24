import React, { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import Alert from "react-bootstrap/Alert";

import { useAuth } from "../../../contexts/AuthContext";
import { useCookies } from "react-cookie";

import { ToastContainer } from "react-toastify";
import useNotification from "../../../utils/useNotification";
import StatusBadge from "../../../utils/StatusBadge";

import styles from "./orderDetailsModal.module.css";

const OrderDetailsModal = ({
  show,
  onHide,
  order,
  refreshFetch = () => {},
}) => {
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [showDeliveryConfirm, setShowDeliveryConfirm] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [confirmingDelivery, setConfirmingDelivery] = useState(false);

  const { notifySuccess, notifyError } = useNotification();
  const alertRef = useRef(null);
  const modalBodyRef = useRef(null);

  const { user } = useAuth();
  const [cookies] = useCookies(["authToken"]);

  async function changeStatus(status) {
    try {
      const payload = { orderStatus: status };
      const response = await fetch(
        `http://localhost:4500/orders/me/${order.id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${cookies.authToken}`,
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        notifyError(`Problemas na requisição: ${response}`);
        return;
      }

      notifySuccess("Status alterado com sucesso");
      refreshFetch();
      setTimeout(onHide, 1500);
    } catch (error) {
      notifyError(`${error}`);
    }
  }

  useEffect(() => {
    if (
      (showCancelConfirm || showDeliveryConfirm) &&
      alertRef.current &&
      modalBodyRef.current
    ) {
      setTimeout(() => {
        alertRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    }
  }, [showCancelConfirm, showDeliveryConfirm]);

  if (!order) return null;

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const formatCurrency = (value) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);

  const canCancelOrder = () =>
    ["pending", "processing", "partially_cancelled"].includes(order.status);
  const canConfirmDelivery = () =>
    ["shipped", "delivered"].includes(order.status);

  const handleCancelClick = () => setShowCancelConfirm(true);
  const handleDeliveryClick = () => {
    setShowDeliveryConfirm(true);
    setShowCancelConfirm(false);
  };
  const confirmCancel = async () => {
    setCancelling(true);
    await changeStatus("cancelled");
    setShowCancelConfirm(false);
    setCancelling(false);
  };
  const confirmDelivery = async () => {
    setConfirmingDelivery(true);
    await changeStatus("delivered");
    setShowDeliveryConfirm(false);
    setConfirmingDelivery(false);
  };
  const cancelCancel = () => setShowCancelConfirm(false);
  const cancelDelivery = () => setShowDeliveryConfirm(false);

  return ReactDOM.createPortal(
    <Modal
      show={show}
      onHide={onHide}
      size="xl"
      centered
      dialogClassName={styles.customOrderModal}
      style={{ zIndex: 1060 }}
    >
      <Modal.Header
        closeButton
        closeVariant="white"
        className={styles.modalHeader}
      >
        <Modal.Title ref={alertRef} className={styles.modalTitle}>
          📦 Detalhes do Pedido - {order.externID}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body ref={modalBodyRef} className={styles.modalBody}>
        {showCancelConfirm && (
          <Alert variant="warning" className="mb-4">
            <Alert.Heading>
              Tem certeza que deseja cancelar este pedido?
            </Alert.Heading>
            <p>
              Esta ação não pode ser desfeita. O pedido será cancelado e
              qualquer valor pago será reembolsado.
            </p>
            <hr />
            <div className="d-flex justify-content-end gap-2">
              <Button
                variant="outline-secondary"
                onClick={cancelCancel}
                disabled={cancelling}
                className={styles.modalButton + " " + styles.modalButtonCancel}
              >
                Manter Pedido
              </Button>
              <Button
                variant="danger"
                onClick={confirmCancel}
                disabled={cancelling}
                className={styles.modalButton + " " + styles.modalButtonConfirm}
              >
                {cancelling ? "Cancelando..." : "Sim, Cancelar Pedido"}
              </Button>
            </div>
          </Alert>
        )}

        {showDeliveryConfirm && (
          <Alert variant="info" className="mb-4">
            <Alert.Heading>Confirmar recebimento do pedido?</Alert.Heading>
            <p>
              Ao confirmar, você estará indicando que recebeu todos os itens do
              pedido em perfeito estado.
            </p>
            <hr />
            <div className="d-flex justify-content-end gap-2">
              <Button
                variant="outline-secondary"
                onClick={cancelDelivery}
                disabled={confirmingDelivery}
                className={styles.modalButton + " " + styles.modalButtonCancel}
              >
                Aguardar Entrega
              </Button>
              <Button
                variant="success"
                onClick={confirmDelivery}
                disabled={confirmingDelivery}
                className={styles.modalButton + " " + styles.modalButtonConfirm}
              >
                {confirmingDelivery ? "Confirmando..." : "Sim, Recebi o Pedido"}
              </Button>
            </div>
          </Alert>
        )}

        {/* Informações Gerais, Itens, Endereço e Pagamento permanecem iguais, sem alteração de classes externas */}
      </Modal.Body>

      <Modal.Footer className={styles.modalFooter}>
        <div className="d-flex flex-column gap-4 justify-content-around align-items-center w-100">
          {canCancelOrder() && (
            <Button
              variant="outline-danger"
              style={{ minWidth: "200px" }}
              disabled={cancelling}
              onClick={() => !showCancelConfirm && handleCancelClick()}
            >
              Cancelar Pedido
            </Button>
          )}
          {canConfirmDelivery() && (
            <Button
              variant="outline-success"
              style={{ minWidth: "200px" }}
              onClick={() =>
                !showCancelConfirm &&
                !showDeliveryConfirm &&
                handleDeliveryClick()
              }
              disabled={confirmingDelivery}
            >
              Confirmar Entrega
            </Button>
          )}
        </div>
      </Modal.Footer>

      <ToastContainer />
    </Modal>,
    document.body
  );
};

export default OrderDetailsModal;
