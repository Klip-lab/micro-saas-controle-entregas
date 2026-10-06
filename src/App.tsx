import { useState, useEffect } from 'react';

interface Delivery {
  id: string;
  title: string;
  responsible: string;
  deadline: string;
  status: 'Pendente' | 'Em Trânsito' | 'Entregue' | 'Cancelado';
}

const INITIAL_DELIVERIES: Delivery[] = [
  {
    id: '1',
    title: 'Documentação Fiscal - Cliente A',
    responsible: 'Carlos Silva',
    deadline: '2025-06-10',
    status: 'Em Trânsito'
  },
  {
    id: '2',
    title: 'Peças de Reposição - Loja B',
    responsible: 'Mariana Souza',
    deadline: '2025-06-12',
    status: 'Pendente'
  }
];

export default function App() {
  const [deliveries, setDeliveries] = useState<Delivery[]>(() => {
    const saved = localStorage.getItem('micro_saas_deliveries');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_DELIVERIES;
      }
    }
    return INITIAL_DELIVERIES;
  });

  const [title, setTitle] = useState('');
  const [responsible, setResponsible] = useState('');
  const [deadline, setDeadline] = useState('');
  const [status, setStatus] = useState<'Pendente' | 'Em Trânsito' | 'Entregue' | 'Cancelado'>('Pendente');
  const [filterStatus, setFilterStatus] = useState<string>('Todos');
  const [filterResponsible, setFilterResponsible] = useState<string>('Todos');

  useEffect(() => {
    localStorage.setItem('micro_saas_deliveries', JSON.stringify(deliveries));
  }, [deliveries]);

  const handleAddDelivery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !responsible.trim() || !deadline) return;

    const newDelivery: Delivery = {
      id: Date.now().toString(),
      title: title.trim(),
      responsible: responsible.trim(),
      deadline,
      status
    };

    setDeliveries([newDelivery, ...deliveries]);
    setTitle('');
    setResponsible('');
    setDeadline('');
    setStatus('Pendente');
  };

  const handleStatusChange = (id: string, newStatus: Delivery['status']) => {
    setDeliveries(deliveries.map(d => d.id === id ? { ...d, status: newStatus } : d));
  };

  const responsiblesList = Array.from(new Set(deliveries.map(d => d.responsible)));

  const filteredDeliveries = deliveries.filter(d => {
    const matchesStatus = filterStatus === 'Todos' || d.status === filterStatus;
    const matchesResp = filterResponsible === 'Todos' || d.responsible === filterResponsible;
    return matchesStatus && matchesResp;
  });

  return (
    <main>
      <header style={{ marginBottom: '32px', borderBottom: '1px solid #ddd', paddingBottom: '16px' }}>
        <h1>Micro-SaaS de Controle de Entregas</h1>
        <p>Gerencie entregas, responsáveis, prazos e status em uma interface simples.</p>
      </header>

      <section style={{ background: '#fff', padding: '24px', borderRadius: '8px', marginBottom: '32px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <h2 style={{ marginTop: 0, fontSize: '1.25rem' }}>Cadastrar Nova Entrega</h2>
        <form onSubmit={handleAddDelivery} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', alignItems: 'flex-end' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.875rem', fontWeight: 500 }}>Descrição / Pedido</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Ex: Entrega de pacotes #102"
              required
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.875rem', fontWeight: 500 }}>Responsável</label>
            <input
              type="text"
              value={responsible}
              onChange={e => setResponsible(e.target.value)}
              placeholder="Nome do entregador/responsável"
              required
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.875rem', fontWeight: 500 }}>Prazo Limite</label>
            <input
              type="date"
              value={deadline}
              onChange={e => setDeadline(e.target.value)}
              required
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.875rem', fontWeight: 500 }}>Status Inicial</label>
            <select
              value={status}
              onChange={e => setStatus(e.target.value as Delivery['status'])}
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', background: '#fff' }}
            >
              <option value="Pendente">Pendente</option>
              <option value="Em Trânsito">Em Trânsito</option>
              <option value="Entregue">Entregue</option>
              <option value="Cancelado">Cancelado</option>
            </select>
          </div>
          <div>
            <button type="submit" style={{ width: '100%', padding: '9px 16px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '4px', fontWeight: 600, cursor: 'pointer' }}>
              Cadastrar Entrega
            </button>
          </div>
        </form>
      </section>

      <section style={{ background: '#fff', padding: '24px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
          <h2 style={{ margin: 0, fontSize: '1.25rem' }}>Acompanhamento de Entregas</h2>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <div>
              <label style={{ fontSize: '0.8125rem', marginRight: '6px', fontWeight: 500 }}>Filtrar Status:</label>
              <select
                value={filterStatus}
                onChange={e => setFilterStatus(e.target.value)}
                style={{ padding: '6px', borderRadius: '4px', border: '1px solid #ccc', background: '#fff' }}
              >
                <option value="Todos">Todos</option>
                <option value="Pendente">Pendente</option>
                <option value="Em Trânsito">Em Trânsito</option>
                <option value="Entregue">Entregue</option>
                <option value="Cancelado">Cancelado</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: '0.8125rem', marginRight: '6px', fontWeight: 500 }}>Filtrar Responsável:</label>
              <select
                value={filterResponsible}
                onChange={e => setFilterResponsible(e.target.value)}
                style={{ padding: '6px', borderRadius: '4px', border: '1px solid #ccc', background: '#fff' }}
              >
                <option value="Todos">Todos</option>
                {responsiblesList.map(resp => (
                  <option key={resp} value={resp}>{resp}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {filteredDeliveries.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#666', padding: '24px 0' }}>Nenhuma entrega encontrada com os filtros selecionados.</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #e5e7eb', color: '#4b5563' }}>
                  <th style={{ padding: '12px' }}>Entrega</th>
                  <th style={{ padding: '12px' }}>Responsável</th>
                  <th style={{ padding: '12px' }}>Prazo</th>
                  <th style={{ padding: '12px' }}>Status</th>
                  <th style={{ padding: '12px', textAlign: 'right' }}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredDeliveries.map(delivery => (
                  <tr key={delivery.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                    <td style={{ padding: '12px', fontWeight: 500 }}>{delivery.title}</td>
                    <td style={{ padding: '12px' }}>{delivery.responsible}</td>
                    <td style={{ padding: '12px' }}>{delivery.deadline.split('-').reverse().join('/')}</td>
                    <td style={{ padding: '12px' }}>
                      <span style={{
                        padding: '4px 8px',
                        borderRadius: '12px',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        background: 
                          delivery.status === 'Entregue' ? '#dcfce7' :
                          delivery.status === 'Em Trânsito' ? '#dbeafe' :
                          delivery.status === 'Cancelado' ? '#fee2e2' : '#fef3c7',
                        color:
                          delivery.status === 'Entregue' ? '#166534' :
                          delivery.status === 'Em Trânsito' ? '#1e40af' :
                          delivery.status === 'Cancelado' ? '#991b1b' : '#92400e'
                      }}>
                        {delivery.status}
                      </span>
                    </td>
                    <td style={{ padding: '12px', textAlign: 'right' }}>
                      <select
                        value={delivery.status}
                        onChange={e => handleStatusChange(delivery.id, e.target.value as Delivery['status'])}
                        style={{ padding: '4px 8px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '0.8125rem', background: '#fff' }}
                      >
                        <option value="Pendente">Pendente</option>
                        <option value="Em Trânsito">Em Trânsito</option>
                        <option value="Entregue">Entregue</option>
                        <option value="Cancelado">Cancelado</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}
