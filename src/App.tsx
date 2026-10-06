import React, { useState, useEffect } from 'react';

interface Delivery {
  id: string;
  title: string;
  responsible: string;
  deadline: string;
  status: 'Pendente' | 'Em Trânsito' | 'Entregue' | 'Cancelado';
}

export default function App() {
  const [deliveries, setDeliveries] = useState<Delivery[]>(() => {
    const saved = localStorage.getItem('@MicroSaaS:deliveries');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [];
      }
    }
    return [
      { id: '1', title: 'Pedido #101 - Eletrônicos', responsible: 'Carlos Silva', deadline: '2025-06-01', status: 'Em Trânsito' },
      { id: '2', title: 'Pedido #102 - Documentos', responsible: 'Ana Souza', deadline: '2025-06-02', status: 'Pendente' }
    ];
  });

  const [title, setTitle] = useState('');
  const [responsible, setResponsible] = useState('');
  const [deadline, setDeadline] = useState('');
  const [status, setStatus] = useState<'Pendente' | 'Em Trânsito' | 'Entregue' | 'Cancelado'>('Pendente');
  const [filterStatus, setFilterStatus] = useState<string>('TODOS');
  const [filterResponsible, setFilterResponsible] = useState<string>('');

  useEffect(() => {
    localStorage.setItem('@MicroSaaS:deliveries', JSON.stringify(deliveries));
  }, [deliveries]);

  function handleAddDelivery(e: React.FormEvent) {
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
  }

  function handleStatusChange(id: string, newStatus: Delivery['status']) {
    setDeliveries(deliveries.map(d => d.id === id ? { ...d, status: newStatus } : d));
  }

  function handleDelete(id: string) {
    setDeliveries(deliveries.filter(d => d.id !== id));
  }

  const filteredDeliveries = deliveries.filter(d => {
    const matchesStatus = filterStatus === 'TODOS' || d.status === filterStatus;
    const matchesResp = !filterResponsible || d.responsible.toLowerCase().includes(filterResponsible.toLowerCase());
    return matchesStatus && matchesResp;
  });

  return (
    <main>
      <header style={{ marginBottom: '32px' }}>
        <h1>Controle de Entregas</h1>
        <p style={{ color: '#555' }}>Gerencie entregas, defina responsáveis, prazos e acompanhe o status em tempo real.</p>
      </header>

      <section style={{ background: '#fff', padding: '24px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '32px' }}>
        <h2 style={{ fontSize: '1.2rem', marginBottom: '16px' }}>Cadastrar Nova Entrega</h2>
        <form onSubmit={handleAddDelivery} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>Descrição da Entrega</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Ex: Caixa de Peças #45"
              required
              style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>Responsável</label>
            <input
              type="text"
              value={responsible}
              onChange={e => setResponsible(e.target.value)}
              placeholder="Ex: João da Silva"
              required
              style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>Prazo Limite</label>
            <input
              type="date"
              value={deadline}
              onChange={e => setDeadline(e.target.value)}
              required
              style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>Status Inicial</label>
            <select
              value={status}
              onChange={e => setStatus(e.target.value as Delivery['status'])}
              style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px', background: '#fff' }}
            >
              <option value="Pendente">Pendente</option>
              <option value="Em Trânsito">Em Trânsito</option>
              <option value="Entregue">Entregue</option>
              <option value="Cancelado">Cancelado</option>
            </select>
          </div>
          <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end' }}>
            <button
              type="submit"
              style={{ background: '#2563eb', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '4px', fontWeight: 600, cursor: 'pointer' }}
            >
              Cadastrar Entrega
            </button>
          </div>
        </form>
      </section>

      <section style={{ background: '#fff', padding: '24px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
          <h2 style={{ fontSize: '1.2rem', margin: 0 }}>Acompanhamento de Entregas</h2>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <input
              type="text"
              placeholder="Filtrar responsável..."
              value={filterResponsible}
              onChange={e => setFilterResponsible(e.target.value)}
              style={{ padding: '6px 12px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '0.9rem' }}
            />
            <select
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
              style={{ padding: '6px 12px', border: '1px solid #ccc', borderRadius: '4px', background: '#fff', fontSize: '0.9rem' }}
            >
              <option value="TODOS">Todos os Status</option>
              <option value="Pendente">Pendente</option>
              <option value="Em Trânsito">Em Trânsito</option>
              <option value="Entregue">Entregue</option>
              <option value="Cancelado">Cancelado</option>
            </select>
          </div>
        </div>

        {filteredDeliveries.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#777', padding: '24px 0' }}>Nenhuma entrega encontrada.</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.95rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #eee', color: '#555' }}>
                  <th style={{ padding: '10px' }}>Entrega</th>
                  <th style={{ padding: '10px' }}>Responsável</th>
                  <th style={{ padding: '10px' }}>Prazo</th>
                  <th style={{ padding: '10px' }}>Status</th>
                  <th style={{ padding: '10px', textAlign: 'right' }}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredDeliveries.map(delivery => (
                  <tr key={delivery.id} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '12px 10px', fontWeight: 500 }}>{delivery.title}</td>
                    <td style={{ padding: '12px 10px' }}>{delivery.responsible}</td>
                    <td style={{ padding: '12px 10px' }}>{delivery.deadline.split('-').reverse().join('/')}</td>
                    <td style={{ padding: '12px 10px' }}>
                      <select
                        value={delivery.status}
                        onChange={e => handleStatusChange(delivery.id, e.target.value as Delivery['status'])}
                        style={{
                          padding: '4px 8px',
                          borderRadius: '4px',
                          border: '1px solid #ccc',
                          background: delivery.status === 'Entregue' ? '#dcfce7' : delivery.status === 'Em Trânsito' ? '#dbeafe' : delivery.status === 'Cancelado' ? '#fee2e2' : '#fef9c3',
                          color: delivery.status === 'Entregue' ? '#166534' : delivery.status === 'Em Trânsito' ? '#1e40af' : delivery.status === 'Cancelado' ? '#991b1b' : '#854d0e',
                          fontWeight: 600
                        }}
                      >
                        <option value="Pendente">Pendente</option>
                        <option value="Em Trânsito">Em Trânsito</option>
                        <option value="Entregue">Entregue</option>
                        <option value="Cancelado">Cancelado</option>
                      </select>
                    </td>
                    <td style={{ padding: '12px 10px', textAlign: 'right' }}>
                      <button
                        onClick={() => handleDelete(delivery.id)}
                        style={{ background: 'transparent', border: 'none', color: '#dc2626', cursor: 'pointer', fontWeight: 500 }}
                      >
                        Excluir
                      </button>
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
