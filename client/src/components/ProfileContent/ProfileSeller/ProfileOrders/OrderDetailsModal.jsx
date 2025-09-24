import "./OrderDetailsModal.css";

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

import { useAuth } from '../../../../contexts/AuthContext';
import { useCookies } from 'react-cookie';
import { useNavigate } from "react-router-dom";

import { ToastContainer } from "react-toastify";
import useNotification from "../../../../utils/useNotification";
import StatusBadge from "./../../../../utils/StatusBadge"

const OrderDetailsModal = ({ show, onHide, order, refreshFetch = () => {} }) => {
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [showDeliveryConfirm, setShowDeliveryConfirm] = useState(false);

  const [cancelling, setCancelling] = useState(false);
  const [confirmingDelivery, setConfirmingDelivery] = useState(false);

  const alertRef = useRef(null);
  const modalBodyRef = useRef(null);

  const {notifySuccess, notifyError} = useNotification()

  const { user, syncData } = useAuth();
  const [cookies] = useCookies(['authToken']);

  async function changeStatus( status ) {
  try {
    const payload = {
      orderStatus: status
    };

    const response = await fetch(`http://localhost:4500/seller/orders/me/${order.id}`, {
      method: "DELETE",
      headers: {
          'Content-Type': 'application/json',
          "Authorization": `Bearer ${cookies.authToken}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      notifyError(`Problemas na requisição: ${response}`);
      console.error('Erro ao confirmar entrega:', response);
      return;
    }

    notifySuccess("Status alterado com sucesso");
    refreshFetch();
    setTimeout(() => {
      onHide();
    }, 1500);

  } catch (error) {
    notifyError(`${error}`);
    console.error('Erro ao confirmar entrega:', error);
  }
}

  // Scroll para o alerta quando ele for exibido
  useEffect(() => {
    if ((showCancelConfirm || showDeliveryConfirm) && alertRef.current && modalBodyRef.current) {
      setTimeout(() => {
        alertRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }, 100);
    }
  }, [showCancelConfirm, showDeliveryConfirm]);

  if (!order) return null;

  // Função para formatar data
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Função para formatar moeda
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  // Verifica se o pedido pode ser cancelado
  const canCancelOrder = () => {
    return (order.status === 'pending');
  };

  // Verifica se o pedido pode ter entrega confirmada
  const canConfirmDelivery = () => {
    return order.status === 'shipped' || order.status === 'delivered';
  };

  // Inicia o processo de cancelamento
  const handleCancelClick = () => {
    setShowCancelConfirm(true);
  };

  // Inicia o processo de confirmação de entrega
  const handleDeliveryClick = () => {
    setShowDeliveryConfirm(true);
    setShowCancelConfirm(false);
  };

  // Confirma o cancelamento
  const confirmCancel = async () => {
    setCancelling(true);
    try {
      await changeStatus("cancelled")
      setShowCancelConfirm(false);
    } catch (error) {
      console.error('Erro ao cancelar pedido:', error);
    } finally {
      setCancelling(false);
    }
  };

  // Confirma a entrega
  const confirmDelivery = async () => {
    setConfirmingDelivery(true);
    try {
      await changeStatus("delivered");
      setShowDeliveryConfirm(false);
    } catch (error) {
      console.error('Erro ao confirmar entrega:', error);
    } finally {
      setConfirmingDelivery(false);
    }
  };

  // Cancela a confirmação de cancelamento
  const cancelCancel = () => {
    setShowCancelConfirm(false);
  };

  // Cancela a confirmação de entrega
  const cancelDelivery = () => {
    setShowDeliveryConfirm(false);
  };

  // Use Portal para renderizar no body
  return ReactDOM.createPortal(
    <Modal
      show={show}
      onHide={onHide}
      size="xl"
      centered
      dialogClassName="custom-order-modal"
      style={{ zIndex: 1060 }}
    >
      <Modal.Header closeButton closeVariant="white">
        <Modal.Title ref={alertRef}>📦 Detalhes do Pedido - {order.externID}</Modal.Title>
      </Modal.Header>
      <Modal.Body ref={modalBodyRef}>
        {/* Alerta de confirmação de cancelamento */}
        {showCancelConfirm && (
          <div >
            <Alert variant="warning" className="mb-4">
              <Alert.Heading>Tem certeza que deseja cancelar este pedido?</Alert.Heading>
              <p>
                Esta ação não pode ser desfeita. O pedido será cancelado e qualquer valor pago será reembolsado.
              </p>
              <hr />
              <div className="d-flex justify-content-end gap-2">
                <Button
                  variant="outline-secondary"
                  onClick={cancelCancel}
                  disabled={cancelling}
                >
                  Manter Pedido
                </Button>
                <Button
                  variant="danger"
                  onClick={confirmCancel}
                  disabled={cancelling}
                >
                  {cancelling ? 'Cancelando...' : 'Sim, Cancelar Pedido'}
                </Button>
              </div>
            </Alert>
          </div>
        )}

        {/* Alerta de confirmação de entrega */}
        {showDeliveryConfirm && (
          <div>
            <Alert variant="info" className="mb-4">
              <Alert.Heading>Confirmar recebimento do pedido?</Alert.Heading>
              <p>
                Ao confirmar, você estará indicando que recebeu todos os itens do pedido em perfeito estado.
                Esta ação finalizará o processo de compra.
              </p>
              <hr />
              <div className="d-flex justify-content-end gap-2">
                <Button
                  variant="outline-secondary"
                  onClick={cancelDelivery}
                  disabled={confirmingDelivery}
                >
                  Aguardar Entrega
                </Button>
                <Button
                  variant="success"
                  onClick={confirmDelivery}
                  disabled={confirmingDelivery}
                >
                  {confirmingDelivery ? 'Confirmando...' : 'Sim, Recebi o Pedido'}
                </Button>
              </div>
            </Alert>
          </div>
        )}

        {/* Informações Gerais do Pedido */}
        <div className="mb-4">
          <h5 className="mb-3">Informações do Pedido</h5>
          <div className="row">
            <div className="col-md-6">
              <p><strong>Status:</strong> <StatusBadge status={order.status}/></p>
              
              
              <p><strong>Status do Pagamento:</strong> <StatusBadge status={order.paymentStatus}/> </p>
            </div>
            <div className="col-md-6">
              <p><strong>Data do Pedido:</strong> {formatDate(order.createdAt)}</p>
              <p><strong>Última atualização:</strong> {formatDate(order.updatedAt)}</p>
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
              {order.items.map((item) => (
                <tr key={item.id}>
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
            <p><strong>Endereço:</strong> {order.address.street}, {order.address.number}</p>
            <p><strong>Bairro:</strong> {order.address.neighborhood}</p>
            <p><strong>Cidade/Estado:</strong> {order.address.city}</p>
            <p><strong>CEP:</strong> {order.address.zipCode}</p>
            {order.address.label && (
              <p><strong>Label:</strong> {order.address.label}</p>
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

      <Modal.Footer className="d-flex justify-content-center align-items-center">
        <div className="d-flex flex-column gap-4 justify-content-around align-items-center w-100">
          {/* Botão de cancelamento (apenas para pedidos canceláveis) */}
          {canCancelOrder() && (
            <Button variant="outline-danger" style={{ "min-width": "200px" }} disabled={cancelling} onClick={() => { return !showCancelConfirm ? handleCancelClick() : "" }}>Cancelar Pedido</Button>
          )}

          {/* Botão de confirmar entrega (apenas para pedidos enviados) */}
          {canConfirmDelivery() && (
            <Button variant="outline-success" style={{ "min-width": "200px" }} onClick={() => { return (!showCancelConfirm && !showDeliveryConfirm) ? handleDeliveryClick() : "" }} disabled={confirmingDelivery}>Confirmar Entrega</Button>
          )}

        </div>
      </Modal.Footer>
      {/* <ToastContainer/> */}
    </Modal>,
    document.body
  );
};

export default OrderDetailsModal;