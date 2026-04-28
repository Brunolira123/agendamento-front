import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function LandingPage() {
  const [faqAberto, setFaqAberto] = useState(null);

  const toggleFaq = (index) => {
    setFaqAberto(faqAberto === index ? null : index);
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const depoimentos = [
    {
      nome: "João Silva",
      empresa: "Barbearia Corte Legal",
      texto: "Minha agenda lota todo dia agora! O sistema é simples e meus clientes adoram agendar online.",
      rating: 5,
      imagem: "👨"
    },
    {
      nome: "Maria Santos",
      empresa: "Salão da Maria",
      texto: "Controle de comissões mudou minha vida. Não erro mais pagamento das funcionárias!",
      rating: 5,
      imagem: "👩"
    },
    {
      nome: "Carlos Oliveira",
      empresa: "Lava Rápido Express",
      texto: "Clientes agendam 24h. Minha produtividade aumentou 40% em 2 meses.",
      rating: 5,
      imagem: "🧔"
    }
  ];

  const faqs = [
    {
      pergunta: "Como funciona o período de teste grátis?",
      resposta: "Você tem 7 dias para testar todas as funcionalidades do plano Profissional. Não precisa cadastrar cartão, só criar sua conta e começar a usar."
    },
    {
      pergunta: "Posso cancelar quando quiser?",
      resposta: "Sim! Sem multa, sem fidelidade. Você pode cancelar diretamente pelo painel de controle."
    },
    {
      pergunta: "Meus clientes precisam baixar algum aplicativo?",
      resposta: "Não! Eles agendam direto pelo navegador do celular ou computador. URL personalizada para sua empresa."
    },
    {
      pergunta: "Como funciona o app mobile para clientes?",
      resposta: "No plano Profissional, seus clientes podem baixar o app e agendar com um clique. Dá mais fidelidade."
    },
    {
      pergunta: "Tem suporte?",
      resposta: "Sim! Atendimento por WhatsApp, e-mail e chat. Planos Profissionais tem prioridade."
    },
    {
      pergunta: "Precisa de cartão de crédito para testar?",
      resposta: "Não! Nosso teste grátis não exige cadastro de cartão. Você testa e depois decide."
    }
  ];

  const recursos = [
    { icone: "📅", titulo: "Agenda Online", texto: "Clientes agendam 24/7" },
    { icone: "💰", titulo: "Controle Financeiro", texto: "Faturamento e comissões" },
    { icone: "👥", titulo: "Multi-profissionais", texto: "Gerencie toda equipe" },
    { icone: "🔁", titulo: "Planos Recorrentes", texto: "Receita fixa todo mês" },
    { icone: "📊", titulo: "Relatórios", texto: "Métricas do seu negócio" },
    { icone: "📱", titulo: "App Mobile", texto: "Cliente agenda pelo app" },
    { icone: "🔔", titulo: "Notificações", texto: "WhatsApp e e-mail" },
    { icone: "🛡️", titulo: "Segurança", texto: "Dados protegidos" }
  ];

  return (
    <div>
      {/* NAVBAR */}
      <nav className="navbar navbar-expand-lg bg-white shadow-sm fixed-top">
        <div className="container">
          <div className="navbar-brand fw-bold fs-3">
            <span style={{ color: '#667eea' }}>📅</span> Agenda App
          </div>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto align-items-center gap-2">
              <li className="nav-item">
                <button 
                  className="nav-link btn btn-link" 
                  onClick={() => scrollToSection('funcionalidades')}
                  style={{ textDecoration: 'none' }}
                >
                  Funcionalidades
                </button>
              </li>
              <li className="nav-item">
                <Link to="/planos" className="nav-link">Ver todos os planos</Link>
              </li>
              <li className="nav-item">
                <button 
                  className="nav-link btn btn-link" 
                  onClick={() => scrollToSection('depoimentos')}
                  style={{ textDecoration: 'none' }}
                >
                  Depoimentos
                </button>
              </li>
              <li className="nav-item">
                <button 
                  className="nav-link btn btn-link" 
                  onClick={() => scrollToSection('faq')}
                  style={{ textDecoration: 'none' }}
                >
                  FAQ
                </button>
              </li>
              <li className="nav-item">
                <Link to="/login" className="btn btn-outline-primary me-2">Entrar</Link>
              </li>
              <li className="nav-item">
                <Link to="/cadastro" className="btn btn-primary" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', border: 'none' }}>Começar Grátis</Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="min-vh-100 d-flex align-items-center" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', paddingTop: '70px' }}>
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 text-white">
              <h1 className="display-3 fw-bold mb-4">
                Gerencie sua agenda<br />
                de forma <span className="text-warning">simples e eficiente</span>
              </h1>
              <p className="lead mb-4 opacity-75">
                O sistema completo para barbearias, salões de beleza e lava rápidos.
                Agende clientes, controle comissões e aumente seu faturamento.
              </p>
              <div className="d-flex gap-3 flex-wrap">
                <Link to="/cadastro" className="btn btn-light btn-lg px-4 py-2 fw-bold">
                  Começar Grátis → 7 dias
                </Link>
                <button className="btn btn-outline-light btn-lg px-4 py-2">
                  📹 Ver Demo
                </button>
              </div>
              <div className="mt-4 d-flex gap-4 flex-wrap">
                <small className="opacity-75">✓ 7 dias grátis</small>
                <small className="opacity-75">✓ Sem fidelidade</small>
                <small className="opacity-75">✓ Suporte 24/7</small>
              </div>
            </div>
            <div className="col-lg-6 d-none d-lg-block">
              <div className="card shadow-lg border-0 rounded-4 overflow-hidden">
                <div className="bg-dark text-white p-3 d-flex justify-content-between">
                  <span>📅 Agenda App</span>
                  <span>✂️ Barbearia Corte Legal</span>
                </div>
                <div className="p-3 bg-white">
                  <div className="d-flex justify-content-between border-bottom pb-2">
                    <span className="fw-bold">Hoje - 15/05/2026</span>
                    <span className="text-success">+ Novo Agendamento</span>
                  </div>
                  <div className="mt-2">
                    <div className="d-flex justify-content-between p-2">
                      <span>09:00</span>
                      <span className="fw-bold">João</span>
                      <span>Corte</span>
                      <span>R$ 40</span>
                    </div>
                    <div className="d-flex justify-content-between p-2 bg-light">
                      <span>10:00</span>
                      <span className="fw-bold">Carlos</span>
                      <span>Barba</span>
                      <span>R$ 30</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FUNCIONALIDADES */}
      <section id="funcionalidades" className="py-5 bg-light">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="fw-bold">Tudo que você precisa em um só lugar</h2>
            <p className="text-muted fs-5">Funcionalidades pensadas para seu negócio</p>
          </div>
          <div className="row g-4">
            {recursos.map((recurso, index) => (
              <div className="col-md-3 col-sm-6" key={index}>
                <div className="card h-100 border-0 shadow-sm text-center p-3">
                  <div className="fs-1 mb-2">{recurso.icone}</div>
                  <h6 className="fw-bold">{recurso.titulo}</h6>
                  <small className="text-muted">{recurso.texto}</small>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PLANOS */}
      <section id="planos" className="py-5">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="fw-bold">Planos para todos os tamanhos</h2>
            <p className="text-muted fs-5">Escolha o ideal para seu negócio</p>
          </div>
          <div className="row g-4 justify-content-center">
            {/* Plano Básico */}
            <div className="col-md-5 col-lg-4">
              <div className="card h-100 border-0 shadow-sm text-center p-4">
                <div className="mb-3">
                  <span className="badge bg-secondary">Para começar</span>
                </div>
                <h3 className="fw-bold">Básico</h3>
                <h2 className="display-4 fw-bold text-primary">R$ 49<small className="fs-6 text-muted">/mês</small></h2>
                <hr />
                <ul className="list-unstyled text-start mt-3">
                  <li className="mb-2">✓ 1 profissional</li>
                  <li className="mb-2">✓ 100 agendamentos/mês</li>
                  <li className="mb-2">✓ Agenda online</li>
                  <li className="mb-2">✓ Notificações e-mail</li>
                  <li className="text-muted mb-2">✗ App mobile</li>
                  <li className="text-muted mb-2">✗ Relatórios avançados</li>
                  <li className="text-muted">✗ Suporte prioritário</li>
                </ul>
                <Link to="/cadastro" className="btn btn-outline-primary w-100 mt-3">Começar teste grátis</Link>
              </div>
            </div>

            {/* Plano Profissional */}
            <div className="col-md-5 col-lg-4">
              <div className="card h-100 border-0 shadow-lg text-center p-4" style={{ borderTop: '4px solid #667eea' }}>
                <div className="mb-3">
                  <span className="badge bg-primary">🔥 MAIS ESCOLHIDO</span>
                </div>
                <h3 className="fw-bold">Profissional</h3>
                <h2 className="display-4 fw-bold text-primary">R$ 99<small className="fs-6 text-muted">/mês</small></h2>
                <hr />
                <ul className="list-unstyled text-start mt-3">
                  <li className="mb-2">✓ Profissionais ilimitados</li>
                  <li className="mb-2">✓ Agendamentos ilimitados</li>
                  <li className="mb-2">✓ Agenda online</li>
                  <li className="mb-2">✓ Notificações WhatsApp</li>
                  <li className="mb-2">✓ App mobile para clientes</li>
                  <li className="mb-2">✓ Relatórios avançados</li>
                  <li className="mb-2">✓ Suporte prioritário</li>
                </ul>
                <Link to="/cadastro" className="btn btn-primary w-100 mt-3" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', border: 'none' }}>
                  Começar teste grátis
                </Link>
              </div>
            </div>
          </div>

          {/* Tabela Comparativa */}
          <div className="mt-5 d-none d-md-block">
            <h5 className="text-center mb-3">Comparação completa</h5>
            <table className="table table-bordered text-center">
              <thead className="table-light">
                <tr>
                  <th style={{ width: '40%' }}>Funcionalidade</th>
                  <th style={{ width: '30%' }}>Básico</th>
                  <th style={{ width: '30%' }}>Profissional</th>
                </tr>
              </thead>
              <tbody>
                <tr><td className="text-start">Profissionais</td><td>1</td><td className="fw-bold text-primary">Ilimitado</td></tr>
                <tr><td className="text-start">Agendamentos/mês</td><td>100</td><td className="fw-bold text-primary">Ilimitado</td></tr>
                <tr><td className="text-start">Agenda online</td><td>✅</td><td>✅</td></tr>
                <tr><td className="text-start">Notificações e-mail</td><td>✅</td><td>✅</td></tr>
                <tr><td className="text-start">Notificações WhatsApp</td><td>❌</td><td>✅</td></tr>
                <tr><td className="text-start">App mobile para clientes</td><td>❌</td><td>✅</td></tr>
                <tr><td className="text-start">Relatórios avançados</td><td>❌</td><td>✅</td></tr>
                <tr><td className="text-start">Suporte prioritário</td><td>❌</td><td>✅</td></tr>
                <tr><td className="text-start">Preço</td><td><strong>R$ 49/mês</strong></td><td><strong className="text-primary">R$ 99/mês</strong></td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* DEPOIMENTOS */}
      <section id="depoimentos" className="py-5 bg-light">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="fw-bold">O que nossos clientes dizem</h2>
            <p className="text-muted fs-5">Mais de 500 negócios já confiam na Agenda App</p>
          </div>
          <div className="row g-4">
            {depoimentos.map((dep, index) => (
              <div className="col-md-4" key={index}>
                <div className="card h-100 border-0 shadow-sm p-4">
                  <div className="mb-2">
                    {[...Array(dep.rating)].map((_, i) => <span key={i}>⭐</span>)}
                  </div>
                  <p className="mb-3">"{dep.texto}"</p>
                  <div className="d-flex align-items-center gap-2">
                    <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px', fontSize: '20px' }}>
                      {dep.imagem}
                    </div>
                    <div>
                      <div className="fw-bold">{dep.nome}</div>
                      <small className="text-muted">{dep.empresa}</small>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-5">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="fw-bold">Perguntas Frequentes</h2>
            <p className="text-muted fs-5">Tire suas dúvidas</p>
          </div>
          <div className="row justify-content-center">
            <div className="col-md-8">
              {faqs.map((faq, index) => (
                <div className="card mb-3 border-0 shadow-sm" key={index}>
                  <div 
                    className="card-header bg-white d-flex justify-content-between align-items-center"
                    style={{ cursor: 'pointer' }}
                    onClick={() => toggleFaq(index)}
                  >
                    <h6 className="mb-0 fw-bold">{faq.pergunta}</h6>
                    <span>{faqAberto === index ? '▲' : '▼'}</span>
                  </div>
                  {faqAberto === index && (
                    <div className="card-body text-muted">
                      {faq.resposta}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="py-5" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <div className="container text-center text-white">
          <h2 className="fw-bold mb-3">Pronto para começar?</h2>
          <p className="fs-5 mb-4 opacity-75">Junte-se a milhares de negócios que já usam nossa plataforma</p>
          <div className="d-flex gap-3 justify-content-center flex-wrap">
            <Link to="/cadastro" className="btn btn-light btn-lg px-5 py-3 fw-bold">
              Começar Grátis → 7 dias de teste
            </Link>
            <button className="btn btn-outline-light btn-lg px-5 py-3">
              Falar com consultor
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-4 bg-dark text-white-50">
        <div className="container">
          <div className="row">
            <div className="col-md-4 mb-3">
              <h6 className="text-white mb-3">📅 Agenda App</h6>
              <p className="small">Sistema de agendamento multi-nicho para barbearias, salões e lava rápidos.</p>
            </div>
            <div className="col-md-4 mb-3">
              <h6 className="text-white mb-3">Links Rápidos</h6>
              <div className="d-flex flex-column gap-1">
                <button className="text-white-50 text-decoration-none small btn btn-link p-0 text-start" onClick={() => scrollToSection('funcionalidades')}>Funcionalidades</button>
                <button className="text-white-50 text-decoration-none small btn btn-link p-0 text-start" onClick={() => scrollToSection('planos')}>Planos</button>
                <button className="text-white-50 text-decoration-none small btn btn-link p-0 text-start" onClick={() => scrollToSection('depoimentos')}>Depoimentos</button>
                <button className="text-white-50 text-decoration-none small btn btn-link p-0 text-start" onClick={() => scrollToSection('faq')}>FAQ</button>
              </div>
            </div>
            <div className="col-md-4 mb-3">
              <h6 className="text-white mb-3">Contato</h6>
              <div className="d-flex flex-column gap-1">
                <span className="small">📧 contato@agendaapp.com</span>
                <span className="small">📞 (11) 99999-9999</span>
                <span className="small">💬 Suporte via WhatsApp</span>
              </div>
            </div>
          </div>
          <hr className="opacity-25" />
          <div className="text-center small">
            <p className="mb-0">© 2026 Agenda App - Todos os direitos reservados</p>
            <p className="mb-0 mt-1">CNPJ 00.000.000/0001-00 • Termos de uso • Privacidade</p>
          </div>
        </div>
      </footer>

      {/* WhatsApp Button */}
      <div className="position-fixed bottom-0 end-0 m-4" style={{ zIndex: 1000 }}>
        <a 
          href="https://wa.me/5511999999999?text=Olá! Gostaria de saber mais sobre o Agenda App" 
          target="_blank" 
          rel="noopener noreferrer"
          className="btn btn-success rounded-circle p-3 shadow"
          style={{ width: '60px', height: '60px', fontSize: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          💬
        </a>
      </div>
    </div>
  );
}

export default LandingPage;