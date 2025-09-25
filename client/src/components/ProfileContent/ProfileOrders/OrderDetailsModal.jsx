import React from 'react';
import ReactDOM from 'react-dom';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import Badge from 'react-bootstrap/Badge';
import Alert from 'react-bootstrap/Alert';
import { useState } from "react";
import { useRef } from "react";
import { useEffect } from "react";

import { useAuth } from '../../../contexts/AuthContext';
import { useCookies } from 'react-cookie';
import { useNavigate } from "react-router-dom";

import { ToastContainer } from "react-toastify";
import useNotification from "../../../utils/useNotification";

import StatusBadge from "./../../../utils/StatusBadge"
import styles from "./orderDetailsModal.module.css";

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
  const [order, setOrder] = useState({});

  const { notifySuccess, notifyError } = useNotification();
  const alertRef = useRef(null);
  const modalBodyRef = useRef(null);

  const { user } = useAuth();
  const [cookies] = useCookies(["authToken"]);

  console.log({order})

  const setDelivery = async (orderID) => {
    try {
      const response = await fetch(`http://localhost:4500/user/confirm-payment/${orderID}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${cookies.authToken}`,
          "Content-Type": "application/json"
        },
      });

      if (!response.ok) {
        const data = await response.json()
        console.error(`Problemas na requisição: ${data?.message}`);
        return;
      }

      notifySuccess("Status alterado com sucesso");
      refreshFetch();
      setTimeout(onHide, 1500);
    } catch (error) {

      console.error(`Problemas na requisição: ${error}`);
    }
  };


  const canConfirmDelivery = () => {
    if (!order?.items || order.items.length === 0) return false;
    
    return order.items.every(item => 
      (item.paymentStatus === 'paid') && (item.status === "shipped" || item.status === 'cancelled')
    );
  };

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

  useEffect( () => {
    setOrder(parentOrder)
  }, [parentOrder])

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

        {/* Informações Gerais do Pedido */}
        <div className="mb-4">
          <h5 className="mb-3">Informações do Pedido</h5>
          <div className="row">
            <div className="col-md-6">
              <p><strong>Status:</strong> <StatusBadge status={order.status}/></p>
              <p><strong>Data do Pedido:</strong> {formatDate(order.createdAt)}</p>
              <p><strong>Última atualização:</strong> {formatDate(order.updatedAt)}</p>
              <p><strong>Status do Pagamento:</strong> <StatusBadge status={order.paymentStatus}/></p>
            </div>
            <div className="col-md-6">
              <p><strong>Subtotal:</strong> {formatCurrency(order.subtotal)}</p>
              <p><strong>Desconto:</strong> {formatCurrency(order.discount * order.subtotal)}</p>
              <p><strong>Taxas:</strong> {formatCurrency(order.tax)}</p>
              <p><strong>Frete:</strong> {formatCurrency(order.shippingCost)}</p>
              <p><strong className="h6">Total: {formatCurrency(order.total)}</strong></p>
            </div>
          </div>
        </div>

        {/* Itens do Pedido */}
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
              </tr>
            </thead>
            <tbody>
              {order?.items?.map((item) => (
                <tr key={item.game.id}>
                  <td>
                    <div className="d-flex align-items-center">
                      <img
                        src={item.game.imageUrl}
                        alt={item.game.title}
                        style={{ width: '50px', height: '50px', objectFit: 'cover' }}
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
                  <td className="align-middle">{formatCurrency(item.unitPrice)}</td>
                  <td className="align-middle">
                    {formatCurrency(item.unitPrice * item.quantity)}
                  </td>
                  <td className="align-middle"><StatusBadge status={item.status}/></td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>

        {/* Endereço de Entrega */}
        <div className="mb-4">
          <h5 className="mb-3">Endereço de Entrega</h5>
          <div className="border rounded p-3">
            <p><strong>Endereço:</strong> {order?.address?.street}, {order?.address?.number}</p>
            <p><strong>Bairro:</strong> {order?.address?.neighborhood}</p>
            <p><strong>Cidade/Estado:</strong> {order?.address?.city}</p>
            <p><strong>CEP:</strong> {order?.address?.zipCode}</p>
            {order?.address?.label && (
              <p><strong>Label:</strong> {order?.address?.label}</p>
            )}
          </div>
        </div>

        {/* Método de Pagamento */}
        <div className="mb-3">
          <h5 className="mb-3">Método de Pagamento</h5>
          <div className="border rounded p-3">
            <p>
              <strong>Tipo:</strong> {order.paymentMethod?.type === 'credit_card'
                ? 'Cartão de Crédito'
                : order.paymentMethod?.type === 'debit_card'
                  ? 'Cartão de Débito'
                  : order.paymentMethod?.type === 'pix'
                    ? 'PIX'
                    : order.paymentMethod?.type || 'Não especificado'}
            </p>
            <p>
              <strong> {order.paymentMethod?.type === 'credit_card' || 'debit_card'
                ? 'Número do Cartão: '
                : order.paymentMethod?.type === 'pix'
                  ? 'Chave: '
                  : order.paymentMethod?.type || 'Descrição: '}
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
                setDelivery(order.id)
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
