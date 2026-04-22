import React from 'react';

const StatusBadge = ({ status }) => {
  const config = {
    AGENDADO: { class: 'bg-warning text-dark', label: '📝 Agendado' },
    CONFIRMADO: { class: 'bg-primary', label: '✅ Confirmado' },
    CONCLUIDO: { class: 'bg-success', label: '✔️ Concluído' },
    CANCELADO: { class: 'bg-danger', label: '❌ Cancelado' }
  };

  const { class: bgClass, label } = config[status] || { class: 'bg-secondary', label: status };

  return (
    <span className={`badge ${bgClass} px-3 py-2`}>
      {label}
    </span>
  );
};

export default StatusBadge;