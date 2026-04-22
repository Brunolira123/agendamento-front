export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('pt-BR');
};

export const formatTime = (date) => {
  return new Date(date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
};

export const formatDateTime = (date) => {
  return `${formatDate(date)} ${formatTime(date)}`;
};

export const formatPhone = (phone) => {
  if (!phone) return '';
  const numbers = phone.replace(/\D/g, '');
  if (numbers.length === 11) {
    return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  }
  if (numbers.length === 10) {
    return numbers.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  }
  return phone;
};

export const formatCPF = (cpf) => {
  if (!cpf) return '';
  const numbers = cpf.replace(/\D/g, '');
  if (numbers.length === 11) {
    return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  }
  return cpf;
};

export const formatCurrency = (value) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};