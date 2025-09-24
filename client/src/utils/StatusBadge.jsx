import { Badge, OverlayTrigger, Tooltip } from 'react-bootstrap';

const StatusBadge = ({ status, showTooltip = false }) => {
  const statusConfig = {
    // Status do pedido
    empty: { 
      variant: 'secondary', 
      text: 'Vazio',
      tooltip: 'Pedido sem itens' 
    },
    pending: { 
      variant: 'warning', 
      text: 'Pendente',
      tooltip: 'Aguardando processamento' 
    },
    processing: { 
      variant: 'primary', 
      text: 'Processando',
      tooltip: 'Em preparação' 
    },
    shipping: { 
      variant: 'info', 
      text: 'Em Transporte',
      tooltip: 'Itens a caminho' 
    },
    shipped: { 
      variant: 'info', 
      text: 'Enviado',
      tooltip: 'Todos os itens enviados' 
    },
    delivered: { 
      variant: 'success', 
      text: 'Entregue',
      tooltip: 'Pedido entregue' 
    },
    completed: { 
      variant: 'success', 
      text: 'Concluído',
      tooltip: 'Pedido finalizado (entregue/cancelado)' 
    },
    cancelled: { 
      variant: 'danger', 
      text: 'Cancelado',
      tooltip: 'Pedido cancelado' 
    },
    partially_cancelled: { 
      variant: 'warning', 
      text: 'Parcialmente Cancelado',
      tooltip: 'Alguns itens foram cancelados' 
    },

    // Status de pagamento
    paid: { 
      variant: 'success', 
      text: 'Pago',
      tooltip: 'Pagamento confirmado' 
    },
    refunded: { 
      variant: 'info', 
      text: 'Reembolsado',
      tooltip: 'Valor reembolsado' 
    },
    partially_refunded: { 
      variant: 'info', 
      text: 'Parcialmente Reembolsado',
      tooltip: 'Reembolso parcial realizado' 
    },

    // Status de itens
    deleted: { 
      variant: 'danger', 
      text: 'Deletado',
      tooltip: 'Deletado' 
    },

    in_stock: { 
      variant: 'info', 
      text: 'em estoque',
      tooltip: 'Existem produtos em estoque' 
    },

    out_of_stock: { 
      variant: 'danger', 
      text: 'Sem estoque',
      tooltip: 'Sem estoque desse produto' 
    },
  };

  const config = statusConfig[status] || { 
    variant: 'secondary', 
    text: status.charAt(0).toUpperCase() + status.slice(1),
    tooltip: status
  };

  const badge = <Badge bg={config.variant}>{config.text}</Badge>;

  if (showTooltip) {
    return (
      <OverlayTrigger overlay={<Tooltip>{config.tooltip}</Tooltip>}>
        {badge}
      </OverlayTrigger>
    );
  }

  return badge;
};

export default StatusBadge;