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
    const saved = localStorage.getItem('deliveries');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [];
      }
    }
    return [
      { id: '1', title: 'Entrega de Documentos', responsible: 'Carlos Silva', deadline: '2025-06-01', status: 'Pendente' },
      { id: '2', title: 'Pacote de Peças', responsible: 'Ana Souza', deadline: '2025-06-02', status: 'Em Trânsito' }
    ];
  });

  const [title, setTitle] = useState('');
  const [responsible, setResponsible] = useState('');
  const [deadline, setDeadline] = useState('');
  const [status, setStatus] = useState<'Pendente' | 'Em Trânsito' | 'Entregue' | 'Cancelado'>('Pendente');

  useEffect(() => {
    localStorage.setItem('deliveries', JSON.stringify(deliveries));
  }, [deliveries]);

  const handleAddDelivery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !responsible.trim() || !deadline) return;

    const newDelivery: Delivery = {
      id: Date.now().toString(),
      title,
      responsible,
      deadline,
      status,
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

  return (
    <main>
      <h1>Micro-SaaS de Controle de Entregas</h1>
      <p>Gerencie o responsável, prazo e status das entregas com simplicidade.</p>

      <section style={{ background: '#fff', padding: '20px', borderRadius: '8px', marginBottom: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <h2>Cadastrar Nova Entrega</h2>
        <form onSubmit={handleAddDelivery} style={{ display: 'grid', gap: '12px', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
          <div>
            <label style={{ display: 'block', fontSize: '14px', marginBottom: '4px' }}>Título da Entrega</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Ex: Pedido #123"
              required
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '14px', marginBottom: '4px' }}>Responsável</label>
            <input
              type="text"
              value={responsible}
              onChange={e => setResponsible(e.target.value)}
              placeholder="Ex: João Motorista"
              required
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '14px', marginBottom: '4px' }}>Prazo</label>
            <input
              type="date"
              value={deadline}
              onChange={e => setDeadline(e.target.value)}
              required
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '14px', marginBottom: '4px' }}>Status Inicial</label>
            <select
              value={status}
              onChange={e => setStatus(e.target.value as any)}
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', background: '#fff' }}
            >
              <option value="Pendente">Pendente</option>
              <option value="Em Trânsito">Em Trânsito</option>
              <option value="Entregue">Entregue</option>
              <option value="Cancelado">Cancelado</option>
            </select>
          </div>
          <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end' }}>
            <button type="submit" style={{ padding: '10px 20px', background: '#0066cc', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
              Cadastrar Entrega
            </button>
          </div>
        </form>
      </section>

      <section style={{ background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <h2>Visão de Acompanhamento</h2>
        {deliveries.length === 0 ? (
          <p>Nenhuma entrega cadastrada.</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #eee' }}>
                  <th style={{ padding: '12px' }}>Título</th>
                  <th style={{ padding: '12px' }}>Responsável</th>
                  <th style={{ padding: '12px' }}>Prazo</th>
                  <th style={{ padding: '12px' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {deliveries.map(d => (
                  <tr key={d.id} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '12px', fontWeight: '500' }}>{d.title}</td>
                    <td style={{ padding: '12px' }}>{d.responsible}</td>
                    <td style={{ padding: '12px' }}>{d.deadline}</td>
                    <td style={{ padding: '12px' }}>
                      <select
                        value={d.status}
                        onChange={e => handleStatusChange(d.id, e.target.value as any)}
                        style={{ padding: '6px', borderRadius: '4px', border: '1px solid #ccc', background: '#f9f9f9' }}
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
