import React, { useState } from 'react';

interface Delivery {
  id: string;
  title: string;
  responsible: string;
  deadline: string;
  status: 'Pendente' | 'Em Trânsito' | 'Entregue';
}

export default function App() {
  const [deliveries, setDeliveries] = useState<Delivery[]>([
    { id: '1', title: 'Pedido #101', responsible: 'Carlos Silva', deadline: '2025-03-10', status: 'Pendente' }
  ]);

  const [title, setTitle] = useState('');
  const [responsible, setResponsible] = useState('');
  const [deadline, setDeadline] = useState('');
  const [status, setStatus] = useState<'Pendente' | 'Em Trânsito' | 'Entregue'>('Pendente');

  const handleAddDelivery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !responsible.trim() || !deadline) return;

    const newDelivery: Delivery = {
      id: Date.now().toString(),
      title,
      responsible,
      deadline,
      status
    };

    setDeliveries([...deliveries, newDelivery]);
    setTitle('');
    setResponsible('');
    setDeadline('');
    setStatus('Pendente');
  };

  const handleStatusChange = (id: string, newStatus: 'Pendente' | 'Em Trânsito' | 'Entregue') => {
    setDeliveries(deliveries.map(d => d.id === id ? { ...d, status: newStatus } : d));
  };

  return (
    <main>
      <h1>Controle de Entregas</h1>
      <p>Gerenciamento de entregas, responsáveis e prazos.</p>

      <section style={{ background: '#fff', padding: '20px', borderRadius: '8px', marginBottom: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <h2>Cadastrar Nova Entrega</h2>
        <form onSubmit={handleAddDelivery} style={{ display: 'grid', gap: '12px', gridTemplateColumns: '1fr 1fr 1fr auto', alignItems: 'end' }}>
          <div>
            <label style={{ display: 'block', fontSize: '14px', marginBottom: '4px' }}>Descrição / Pedido</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Ex: Pacote A"
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
              placeholder="Nome do responsável"
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
          <button type="submit" style={{ padding: '9px 16px', background: '#0070f3', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            Cadastrar
          </button>
        </form>
      </section>

      <section style={{ background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <h2>Acompanhamento de Entregas</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '12px' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #eaeaea', textAlign: 'left' }}>
              <th style={{ padding: '8px' }}>Entrega</th>
              <th style={{ padding: '8px' }}>Responsável</th>
              <th style={{ padding: '8px' }}>Prazo</th>
              <th style={{ padding: '8px' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {deliveries.length === 0 ? (
              <tr>
                <td colSpan={4} style={{ padding: '16px', textAlign: 'center', color: '#666' }}>Nenhuma entrega cadastrada.</td>
              </tr>
            ) : (
              deliveries.map(d => (
                <tr key={d.id} style={{ borderBottom: '1px solid #eaeaea' }}>
                  <td style={{ padding: '12px 8px' }}>{d.title}</td>
                  <td style={{ padding: '12px 8px' }}>{d.responsible}</td>
                  <td style={{ padding: '12px 8px' }}>{d.deadline}</td>
                  <td style={{ padding: '12px 8px' }}>
                    <select
                      value={d.status}
                      onChange={e => handleStatusChange(d.id, e.target.value as any)}
                      style={{ padding: '4px 8px', borderRadius: '4px', border: '1px solid #ccc' }}
                    >
                      <option value="Pendente">Pendente</option>
                      <option value="Em Trânsito">Em Trânsito</option>
                      <option value="Entregue">Entregue</option>
                    </select>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </section>
    </main>
  );
}
