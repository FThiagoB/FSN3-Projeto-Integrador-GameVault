import "./OrderDetailsModal.css";

import React from 'react';
import ReactDOM from 'react-dom';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import Badge from 'react-bootstrap/Badge';

const OrderDetailsModal = ({ show, onHide, order }) => {
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
      <Modal.Header closeButton>
        <Modal.Title>Detalhes do Pedido - {order.externID}</Modal.Title>
      </Modal.Header>
      <Modal.Body>

        {/* Informações Gerais do Pedido */}
        <div className="mb-4">
          <h5 className="mb-3">Informações do Pedido</h5>
          <div className="row">
            <div className="col-md-6">
              <p><strong>Status:</strong> {getStatusBadge(order.status)}</p>
              <p><strong>Data do Pedido:</strong> {formatDate(order.createdAt)}</p>
              <p><strong>Status do Pagamento:</strong> {getStatusBadge(order.paymentStatus)}</p>
            </div>
            <div className="col-md-6">
              <p><strong>Subtotal:</strong> {formatCurrency(order.subtotal)}</p>
              <p><strong>Desconto:</strong> {formatCurrency(order.discount)}</p>
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
          </div>
        </div>
      </Modal.Body>
      
 <Modal.Footer>
        <Button variant="outline-secondary" onClick={onHide}>Fechar</Button>
        <Button variant="primary" onClick={() => window.print()}>Imprimir Detalhes</Button>
      </Modal.Footer>
    </Modal>,
    document.body
  );
};

export default OrderDetailsModal;