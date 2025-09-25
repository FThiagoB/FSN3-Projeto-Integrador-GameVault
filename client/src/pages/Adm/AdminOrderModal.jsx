import React, { useState, useEffect } from 'react';
import { Modal, Button, Alert, Table, Form, Badge } from 'react-bootstrap';
import ReactDOM from 'react-dom';
import styles from './AdminOrderModal.module.css';

const AdminOrderModal = ({ show, onHide, order, onUpdateOrder }) => {
  const [currentOrder, setCurrentOrder] = useState(order);
  const [updating, setUpdating] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [selectedItemStatus, setSelectedItemStatus] = useState({});
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState({});

  // Estados que bloqueiam cancelamento
  const BLOCKED_STATUSES = ['shipped', 'delivered', 'cancelled'];
  const BLOCKED_PAYMENT_STATUSES = ['paid', 'refunded'];

  useEffect(() => {
    if (order) {
      setCurrentOrder(order);
      // Inicializar estados dos itens
      const itemStatuses = {};
      const paymentStatuses = {};
      order.items.forEach(item => {
        itemStatuses[item.id] = item.status;
        paymentStatuses[item.id] = item.paymentStatus;
      });
      setSelectedItemStatus(itemStatuses);
      setSelectedPaymentStatus(paymentStatuses);
    }
  }, [order]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const StatusBadge = ({ status }) => {
    const getVariant = () => {
      switch (status) {
        case 'pending': return 'warning';
        case 'processing': return 'info';
        case 'shipped': return 'primary';
        case 'delivered': return 'success';
        case 'cancelled': return 'danger';
        case 'paid': return 'success';
        case 'refunded': return 'secondary';
        case 'failed': return 'danger';
        default: return 'secondary';
      }
    };

    const getLabel = () => {
      const labels = {
        pending: 'Pendente',
        processing: 'Processando',
        shipped: 'Enviado',
        delivered: 'Entregue',
        cancelled: 'Cancelado',
        paid: 'Pago',
        refunded: 'Reembolsado',
        failed: 'Falhou'
      };
      return labels[status] || status;
    };

    return <Badge bg={getVariant()}>{getLabel()}</Badge>;
  };

  const canCancelOrder = () => {
    if (!currentOrder) return false;
    return !BLOCKED_STATUSES.includes(currentOrder.status) && 
           !BLOCKED_PAYMENT_STATUSES.includes(currentOrder.paymentStatus);
  };

  const handleOrderStatusChange = async (newStatus) => {
    if (!currentOrder) return;

    setUpdating(true);
    try {
      const response = await fetch(`/admin/orders/${currentOrder.id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        const updatedOrder = await response.json();
        setCurrentOrder(updatedOrder);
        onUpdateOrder(updatedOrder);
      } else {
        throw new Error('Erro ao atualizar status');
      }
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao atualizar status do pedido');
    } finally {
      setUpdating(false);
    }
  };

  const handleItemStatusChange = async (itemId, newStatus) => {
    setUpdating(true);
    try {
      const response = await fetch(`/admin/orders/${currentOrder.id}/items/${itemId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        const updatedItem = await response.json();
        // Atualizar o item na lista
        const updatedItems = currentOrder.items.map(item =>
          item.id === itemId ? updatedItem : item
        );
        const updatedOrder = { ...currentOrder, items: updatedItems };
        setCurrentOrder(updatedOrder);
        onUpdateOrder(updatedOrder);
      } else {
        throw new Error('Erro ao atualizar status do item');
      }
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao atualizar status do item');
    } finally {
      setUpdating(false);
    }
  };

  const handlePaymentStatusChange = async (itemId, newPaymentStatus) => {
    setUpdating(true);
    try {
      const response = await fetch(`/admin/orders/${currentOrder.id}/items/${itemId}/payment-status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ paymentStatus: newPaymentStatus }),
      });

      if (response.ok) {
        const updatedItem = await response.json();
        const updatedItems = currentOrder.items.map(item =>
          item.id === itemId ? updatedItem : item
        );
        const updatedOrder = { ...currentOrder, items: updatedItems };
        setCurrentOrder(updatedOrder);
        onUpdateOrder(updatedOrder);
      } else {
        throw new Error('Erro ao atualizar status de pagamento');
      }
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao atualizar status de pagamento');
    } finally {
      setUpdating(false);
    }
  };

  const handleAdminCancel = async () => {
    if (!cancelReason.trim()) {
      alert('Por favor, informe o motivo do cancelamento administrativo');
      return;
    }

    setUpdating(true);
    try {
      const response = await fetch(`/admin/orders/${currentOrder.id}/cancel`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reason: cancelReason }),
      });

      if (response.ok) {
        const result = await response.json();
        setCurrentOrder(result.order);
        onUpdateOrder(result.order);
        setShowCancelConfirm(false);
        setCancelReason('');
        alert(`Pedido cancelado. ${result.refundRequired ? 'Reembolso necessário.' : ''}`);
      } else {
        throw new Error('Erro ao cancelar pedido');
      }
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao cancelar pedido');
    } finally {
      setUpdating(false);
    }
  };

  if (!currentOrder) return null;

  return ReactDOM.createPortal(
    <Modal
      show={show}
      onHide={onHide}
      size="xl"
      centered
      dialogClassName={styles.customOrderModal}
      backdropClassName={styles.modalBackdrop}
      style={{ zIndex: 1060 }}
    >
      <Modal.Header className={styles.modalHeader} closeButton closeVariant="white">
        <Modal.Title className={styles.modalTitle}>
          🛠️ Gerenciamento Administrativo - {currentOrder.externID}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className={styles.modalBody} style={{ maxHeight: '70vh', overflowY: 'auto' }}>
        {/* Confirmação de Cancelamento Administrativo */}
        {showCancelConfirm && (
          <Alert variant="warning" className="mb-4">
            <Alert.Heading>Cancelamento Administrativo</Alert.Heading>
            <p>
              Você está prestes a cancelar este pedido como administrador. 
              Esta ação irá sobrepor quaisquer restrições normais de cancelamento.
            </p>
            
            <Form.Group className="mb-3">
              <Form.Label>
                <strong>Motivo do cancelamento administrativo:</strong>
              </Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Descreva o motivo do cancelamento administrativo..."
              />
            </Form.Group>
            
            <hr />
            <div className="d-flex justify-content-end gap-2">
              <Button
                variant="outline-secondary"
                onClick={() => setShowCancelConfirm(false)}
                disabled={updating}
              >
                Voltar
              </Button>
              <Button
                variant="danger"
                onClick={handleAdminCancel}
                disabled={updating || !cancelReason.trim()}
              >
                {updating ? 'Cancelando...' : 'Confirmar Cancelamento Administrativo'}
              </Button>
            </div>
          </Alert>
        )}

        {/* Controles Administrativos */}
        <div className="mb-4">
          <h5 className="mb-3">🎛️ Controles Administrativos</h5>
          <div className="row">
            <div className="col-md-6">
              <Form.Group className="mb-3">
                <Form.Label><strong>Status do Pedido:</strong></Form.Label>
                <Form.Select
                  value={currentOrder.status}
                  onChange={(e) => handleOrderStatusChange(e.target.value)}
                  disabled={updating}
                >
                  <option value="pending">Pendente</option>
                  <option value="processing">Processando</option>
                  <option value="shipped">Enviado</option>
                  <option value="delivered">Entregue</option>
                  <option value="cancelled">Cancelado</option>
                </Form.Select>
              </Form.Group>
            </div>
            <div className="col-md-6">
              <div className="d-flex flex-column h-100 justify-content-end">
                <Button
                  variant="outline-danger"
                  onClick={() => setShowCancelConfirm(true)}
                  disabled={updating || currentOrder.status === 'cancelled'}
                  className="mb-2"
                >
                  🔒 Cancelamento Administrativo
                </Button>
                <small className="text-muted">
                  Permite cancelar mesmo em status bloqueados
                </small>
              </div>
            </div>
          </div>
        </div>

        {/* Informações do Pedido */}
        <div className="mb-4">
          <h5 className="mb-3">📦 Informações do Pedido</h5>
          <div className="row">
            <div className="col-md-6">
              <p><strong>Status Atual:</strong> <StatusBadge status={currentOrder.status} /></p>
              <p><strong>Status do Pagamento:</strong> <StatusBadge status={currentOrder.paymentStatus} /></p>
              <p><strong>Cliente:</strong> {currentOrder.user.name} ({currentOrder.user.email})</p>
            </div>
            <div className="col-md-6">
              <p><strong>Data do Pedido:</strong> {formatDate(currentOrder.createdAt)}</p>
              <p><strong>Última atualização:</strong> {formatDate(currentOrder.updatedAt)}</p>
              <p><strong className="h6">Total: {formatCurrency(currentOrder.total)}</strong></p>
            </div>
          </div>
        </div>

        {/* Itens do Pedido com Controles Individuais */}
        <div className="mb-4">
          <h5 className="mb-3">🎮 Itens do Pedido</h5>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Produto</th>
                <th>Quantidade</th>
                <th>Preço Unitário</th>
                <th>Subtotal</th>
                <th>Status do Item</th>
                <th>Status do Pagamento</th>
              </tr>
            </thead>
            <tbody>
              {currentOrder.items.map((item) => (
                <tr key={item.id}>
                  <td>
                    <div className="d-flex align-items-center">
                      <img
                        src={item.game.imageUrl}
                        alt={item.game.title}
                        style={{ width: "50px", height: "50px", objectFit: "cover" }}
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
                  <td className="align-middle">{formatCurrency(item.unitPrice * item.quantity)}</td>
                  
                  {/* Status do Item */}
                  <td className="align-middle">
                    <Form.Select
                      value={selectedItemStatus[item.id] || item.status}
                      onChange={(e) => {
                        setSelectedItemStatus(prev => ({
                          ...prev,
                          [item.id]: e.target.value
                        }));
                        handleItemStatusChange(item.id, e.target.value);
                      }}
                      disabled={updating}
                      size="sm"
                    >
                      <option value="pending">Pendente</option>
                      <option value="confirmed">Confirmado</option>
                      <option value="preparing">Preparando</option>
                      <option value="shipped">Enviado</option>
                      <option value="delivered">Entregue</option>
                      <option value="cancelled">Cancelado</option>
                    </Form.Select>
                  </td>
                  
                  {/* Status do Pagamento */}
                  <td className="align-middle">
                    <Form.Select
                      value={selectedPaymentStatus[item.id] || item.paymentStatus}
                      onChange={(e) => {
                        setSelectedPaymentStatus(prev => ({
                          ...prev,
                          [item.id]: e.target.value
                        }));
                        handlePaymentStatusChange(item.id, e.target.value);
                      }}
                      disabled={updating}
                      size="sm"
                    >
                      <option value="pending">Pendente</option>
                      <option value="processing">Processando</option>
                      <option value="paid">Pago</option>
                      <option value="failed">Falhou</option>
                      <option value="refunded">Reembolsado</option>
                      <option value="cancelled">Cancelado</option>
                    </Form.Select>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>

        {/* Endereço de Entrega */}
        <div className="mb-4">
          <h5 className="mb-3">🏠 Endereço de Entrega</h5>
          <div className="border rounded p-3">
            <p><strong>Endereço:</strong> {currentOrder.address.street}, {currentOrder.address.number}</p>
            <p><strong>Complemento:</strong> {currentOrder.address.complemento || 'N/A'}</p>
            <p><strong>Bairro:</strong> {currentOrder.address.neighborhood}</p>
            <p><strong>Cidade/Estado:</strong> {currentOrder.address.city}/{currentOrder.address.state}</p>
            <p><strong>CEP:</strong> {currentOrder.address.zipCode}</p>
          </div>
        </div>

        {/* Método de Pagamento */}
        <div className="mb-3">
          <h5 className="mb-3">💳 Método de Pagamento</h5>
          <div className="border rounded p-3">
            <p>
              <strong>Tipo:</strong> {
                currentOrder.paymentMethod?.type === 'credit_card' ? 'Cartão de Crédito' :
                currentOrder.paymentMethod?.type === 'debit_card' ? 'Cartão de Débito' :
                currentOrder.paymentMethod?.type === 'pix' ? 'PIX' :
                currentOrder.paymentMethod?.type || 'Não especificado'
              }
            </p>
            <p><strong>Descrição:</strong> {currentOrder.paymentMethod?.description}</p>
          </div>
        </div>
      </Modal.Body>

      <Modal.Footer className={styles.modalFooter}>
        <div className="d-flex justify-content-between w-100">
          <div>
            <Badge bg="info" className="me-2">
              Pedido: {currentOrder.status}
            </Badge>
            <Badge bg={currentOrder.paymentStatus === 'paid' ? 'success' : 'warning'}>
              Pagamento: {currentOrder.paymentStatus}
            </Badge>
          </div>
          <Button variant="secondary" onClick={onHide} disabled={updating}>
            Fechar
          </Button>
        </div>
      </Modal.Footer>
    </Modal>,
    document.body
  );
};

export default AdminOrderModal;