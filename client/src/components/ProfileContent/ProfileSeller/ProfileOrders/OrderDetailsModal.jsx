import React from "react";
import ReactDOM from "react-dom";
import { Dropdown, Spinner } from 'react-bootstrap';
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import Alert from "react-bootstrap/Alert";
import { useState, useRef, useEffect } from "react";
import { useCookies } from "react-cookie";
import { ToastContainer } from "react-toastify";

import useNotification from "../../../../utils/useNotification";
import { useAuth } from "../../../../contexts/AuthContext";
import StatusBadge from "./../../../../utils/StatusBadge";

import styles from "./orderDetailsModal.module.css";

const ItemActionsDropdown = ({ item, onUpdateStatus, updatingItemId }) => {
  const [showDropdown, setShowDropdown] = useState(false);

  const handleStatusChange = async (newStatus) => {
    await onUpdateStatus(item.id, newStatus);
    setShowDropdown(false);
  };

  const canCancel = item.status !== 'cancelled' && item.status !== 'delivered';
  const canProcess = item.status === 'pending';
  const canShip = item.status === 'processing' && item.paymentStatus === "paid";

  return (
    <Dropdown
      show={showDropdown}
      onToggle={setShowDropdown}
      align="end"
    >
      <Dropdown.Toggle
        variant="outline-secondary"
        size="sm"
        disabled={updatingItemId === item.id}
      >
        {updatingItemId === item.id ? (
          <Spinner animation="border" size="sm" />
        ) : (
          'Ações'
        )}
      </Dropdown.Toggle>

      <Dropdown.Menu>
        {canProcess && (
          <Dropdown.Item
            onClick={() => handleStatusChange('processing')}
            className="text-center"
          >
            Preparar item
          </Dropdown.Item>
        )}

        {canShip && (
          <Dropdown.Item
            onClick={() => handleStatusChange('shipped')}
            className="text-warning text-center"
          >
            Enviar item
          </Dropdown.Item>
        )}

        {canCancel && (
          <Dropdown.Item
            onClick={() => handleStatusChange('cancelled')}
            className="text-danger text-center"
          >
            Cancelar Item
          </Dropdown.Item>
        )}

        {(item.status === 'shipped' || item.status === 'delivered' || item.status === 'cancelled') && (
          <Dropdown.Item disabled className="text-center">
            Indisponível
          </Dropdown.Item>
        )}
      </Dropdown.Menu>
    </Dropdown>
  );
};

const OrderDetailsModal = ({
  show,
  onHide,
  parentOrder,
  refreshFetch = () => {},
}) => {
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [showDeliveryConfirm, setShowDeliveryConfirm] = useState(false);

  const [cancelling, setCancelling] = useState(false);
  const [confirmingDelivery, setConfirmingDelivery] = useState(false);
  const [updatingItemId, setUpdatingItemId] = useState(null);
  const [order, setOrder] = useState(parentOrder)

  const alertRef = useRef(null);
  const modalBodyRef = useRef(null);

  const { notifySuccess, notifyError } = useNotification();

  const { user, syncData } = useAuth();
  const [cookies] = useCookies(["authToken"]);

  // Atualiza o estado interno quando parentOrder mudar
  useEffect(() => {
    setOrder(parentOrder);
  }, [parentOrder]);

  const refreshOrder = async (orderID) => {
    try {
      const response = await fetch(`http://localhost:4500/seller/orders/${orderID}`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${cookies.authToken}`,
        }
      });

      const data = await response.json();
      if (!response.ok) {
        notifyError(`${data?.message}`);
        console.error(response?.message);
        return;
      }

      setOrder( data.order )

    } catch (error) {
      notifyError(`${error}`);
    }
  }

  const handleUpdateItemStatus = async (orderItemID, status) => {
    setUpdatingItemId(orderItemID)

    try {
      const response = await fetch(`http://localhost:4500/seller/orders/me/${order.id}/${orderItemID}`, {
        method: "PATCH",
        headers: {
          'Content-Type': 'application/json',
          "Authorization": `Bearer ${cookies.authToken}`,
        },
        body: JSON.stringify({ status }),
      });

      const data = await response.json();
      if (!response.ok) {
        notifyError(`${data?.message}`);
        setUpdatingItemId(null)
        return;
      }

      notifySuccess("Status alterado com sucesso");
      refreshFetch();
      refreshOrder( order.id );
      setUpdatingItemId(null)

    } catch (error) {
      setUpdatingItemId(null)
      notifyError(`${error}`);
      console.error('Erro ao confirmar entrega ', error);
    }
  }

  async function changeStatus(status) {
    try {
      const payload = {
        orderStatus: status,
      };

      const response = await fetch(
        `http://localhost:4500/seller/orders/me/${order.id}`,
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
        console.error("Erro ao confirmar entrega:", response);
        return;
      }

      notifySuccess("Status alterado com sucesso");
      refreshFetch();
      setTimeout(() => {
        onHide();
      }, 1500);
    } catch (error) {
      notifyError(`${error}`);
      console.error("Erro ao confirmar entrega:", error);
    }
  }

  // Scroll para o alerta quando ele for exibido
  useEffect(() => {
    if (
      (showCancelConfirm || showDeliveryConfirm) &&
      alertRef.current &&
      modalBodyRef.current
    ) {
      setTimeout(() => {
        alertRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
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

  const canCancelOrder = () => {
    return order.status === "pending";
  };

  const canConfirmDelivery = () => {
    return order.status === "shipped" || order.status === "delivered";
  };

  const handleCancelClick = () => setShowCancelConfirm(true);
  const handleDeliveryClick = () => {
    setShowDeliveryConfirm(true);
    setShowCancelConfirm(false);
  };

  const confirmCancel = async () => {
    setCancelling(true);
    try {
      await changeStatus("cancelled");
      setShowCancelConfirm(false);
    } catch (error) {
      console.error("Erro ao cancelar pedido:", error);
    } finally {
      setCancelling(false);
    }
  };

  const confirmDelivery = async () => {
    setConfirmingDelivery(true);
    try {
      await changeStatus("delivered");
      setShowDeliveryConfirm(false);
    } catch (error) {
      console.error("Erro ao confirmar entrega:", error);
    } finally {
      setConfirmingDelivery(false);
    }
  };

  const cancelCancel = () => setShowCancelConfirm(false);
  const cancelDelivery = () => setShowDeliveryConfirm(false);

  return ReactDOM.createPortal(
    <Modal
      show={show}
      onHide={onHide}
      size="xl"
      centered
      dialogClassName={styles.customOrderModal} // aplicado ao .modal-dialog
      backdropClassName={styles.modalBackdrop} // classe para o backdrop (global)
      style={{ zIndex: 1060 }}
    >
      <Modal.Header
        className={styles.modalHeader}
        closeButton
        closeVariant="white"
      >
        <Modal.Title ref={alertRef} className={styles.modalTitle}>
          📦 Detalhes do Pedido - {order.externID}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className={styles.modalBody} ref={modalBodyRef}>
        {showCancelConfirm && (
          <div>
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
                  className={`${styles.modalButton} ${styles.modalButtonCancel}`}
                >
                  Manter Pedido
                </Button>
                <Button
                  variant="danger"
                  onClick={confirmCancel}
                  disabled={cancelling}
                  className={`${styles.modalButton} ${styles.modalButtonConfirm}`}
                >
                  {cancelling ? "Cancelando..." : "Sim, Cancelar Pedido"}
                </Button>
              </div>
            </Alert>
          </div>
        )}

        {showDeliveryConfirm && (
          <div>
            <Alert variant="info" className="mb-4">
              <Alert.Heading>Confirmar recebimento do pedido?</Alert.Heading>
              <p>
                Ao confirmar, você estará indicando que recebeu todos os itens
                do pedido em perfeito estado. Esta ação finalizará o processo de
                compra.
              </p>
              <hr />
              <div className="d-flex justify-content-end gap-2">
                <Button
                  variant="outline-secondary"
                  onClick={cancelDelivery}
                  disabled={confirmingDelivery}
                  className={`${styles.modalButton} ${styles.modalButtonCancel}`}
                >
                  Aguardar Entrega
                </Button>
                <Button
                  variant="success"
                  onClick={confirmDelivery}
                  disabled={confirmingDelivery}
                  className={`${styles.modalButton} ${styles.modalButtonConfirm}`}
                >
                  {confirmingDelivery
                    ? "Confirmando..."
                    : "Sim, Recebi o Pedido"}
                </Button>
              </div>
            </Alert>
          </div>
        )}

        <div className="mb-4">
          <h5 className="mb-3">Informações do Pedido</h5>
          <div className="row">
            <div className="col-md-6">
              <p>
                <strong>Status:</strong> <StatusBadge status={order.status} />
              </p>
              <p>
                <strong>Status do Pagamento:</strong>{" "}
                <StatusBadge status={order.paymentStatus} />{" "}
              </p>
            </div>
            <div className="col-md-6">
              <p>
                <strong>Data do Pedido:</strong> {formatDate(order.createdAt)}
              </p>
              <p>
                <strong>Última atualização:</strong>{" "}
                {formatDate(order.updatedAt)}
              </p>
              <p>
                <strong className="h6">
                  Total: {formatCurrency(order.total)}
                </strong>
              </p>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <h5 className="mb-3">Itens do Pedido</h5>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Produto</th>
                <th>Quantidade</th>
                <th>Preço Unitário</th>
                <th>Subtotal</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item) => (
                <tr key={item.id}>
                  <td>
                    <div className="d-flex align-items-center">
                      <img
                        src={item.game.imageUrl}
                        alt={item.game.title}
                        style={{
                          width: "50px",
                          height: "50px",
                          objectFit: "cover",
                        }}
                        className="me-3"
                      />
                      <div>
                        <strong>{item.game.title}</strong>
                        <br />
                        <small className="text-muted">ID: {item.game.id}</small>
                      </div>
                    </div>
                  </td>
                  <td className="align-middle">{item.quantity}</td>
                  <td className="align-middle">
                    {formatCurrency(item.unitPrice)}
                  </td>
                  <td className="align-middle">
                    {formatCurrency(item.unitPrice * item.quantity)}
                  </td>
                  <td className="align-middle">
                    <StatusBadge status={item.status} />
                  </td>
                  <td className="align-middle text-center">
                    <ItemActionsDropdown
                      item={item}
                      onUpdateStatus={handleUpdateItemStatus}
                      updatingItemId={updatingItemId}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>

        <div className="mb-4">
          <h5 className="mb-3">Endereço de Entrega</h5>
          <div className="border rounded p-3">
            <p>
              <strong>Endereço:</strong> {order.address.street},{" "}
              {order.address.number}
            </p>
            <p>
              <strong>Bairro:</strong> {order.address.neighborhood}
            </p>
            <p>
              <strong>Cidade/Estado:</strong> {order.address.city}
            </p>
            <p>
              <strong>CEP:</strong> {order.address.zipCode}
            </p>
            {order.address.label && (
              <p>
                <strong>Label:</strong> {order.address.label}
              </p>
            )}
          </div>
        </div>

        <div className="mb-3">
          <h5 className="mb-3">Método de Pagamento</h5>
          <div className="border rounded p-3">
            <p>
              <strong>Tipo:</strong>{" "}
              {order.paymentMethod?.type === "credit_card"
                ? "Cartão de Crédito"
                : order.paymentMethod?.type === "debit_card"
                ? "Cartão de Débito"
                : order.paymentMethod?.type === "pix"
                ? "PIX"
                : order.paymentMethod?.type || "Não especificado"}
            </p>
            <p>
              <strong>
                {" "}
                {order.paymentMethod?.type === "credit_card" || "debit_card"
                  ? "Número do Cartão: "
                  : order.paymentMethod?.type === "pix"
                  ? "Chave: "
                  : order.paymentMethod?.type || "Descrição: "}
              </strong>
              {order.paymentMethod?.description}
            </p>
          </div>
        </div>
      </Modal.Body>

      <Modal.Footer className={styles.modalFooter}>
        <div className="d-flex flex-column gap-4 justify-content-around align-items-center w-100">
          {canCancelOrder() && (
            <Button
              variant="outline-danger"
              style={{ minWidth: "200px" }}
              disabled={cancelling}
              onClick={() => (!showCancelConfirm ? handleCancelClick() : "")}
              className={`${styles.modalButton} ${styles.modalButtonConfirm}`}
            >
              Cancelar Pedido
            </Button>
          )}

          {canConfirmDelivery() && (
            <Button
              variant="outline-success"
              style={{ minWidth: "200px" }}
              onClick={() =>
                !showCancelConfirm && !showDeliveryConfirm
                  ? handleDeliveryClick()
                  : ""
              }
              disabled={confirmingDelivery}
              className={`${styles.modalButton} ${styles.modalButtonConfirm}`}
            >
              Confirmar Entrega
            </Button>
          )}
        </div>
      </Modal.Footer>

      {/* não incluí ToastContainer aqui — já existe no topo da aplicação */}
    </Modal>,
    document.body
  );
};

export default OrderDetailsModal;
