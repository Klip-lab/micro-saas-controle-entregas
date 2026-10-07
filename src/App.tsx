import React, { useState } from 'react';

interface Delivery {
  id: string;
  title: string;
  responsible: string;
  dueDate: string;
  status: 'Pendente' | 'Em Trânsito' | 'Entregue' | 'Cancelado';
}

export default function App() {
  const [deliveries, setDeliveries] = useState<Delivery[]>([
    { id: '1', title: 'Pedido #101', responsible: 'Carlos Silva', dueDate: '2025-06-01', status: 'Pendente' },
    { id: '2', title: 'Pedido #102', responsible: 'Ana Souza', dueDate: '2025-06-02', status: 'Em Trânsito' }
  ]);

  const [title, setTitle] = useState('');
  const [responsible, setResponsible] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [status, setStatus] = useState<'Pendente' | 'Em Trânsito' | 'Entregue' | 'Cancelado'>('Pendente');

  const handleAddDelivery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !responsible.trim() || !dueDate) return;

    const newDelivery: Delivery = {
      id: Date.now().toString(),
      title,
      responsible,
      dueDate,
      status
    };

    setDeliveries([newDelivery, ...deliveries]);
    setTitle('');
    setResponsible('');
    setDueDate('');
    setStatus('Pendente');
  };

  const handleStatusChange = (id: string, newStatus: Delivery['status']) => {
    setDeliveries(deliveries.map(d => d.id === id ? { ...d, status: newStatus } : d));
  };

  return (
    <main>
      <h1>Controle de Entregas</h1>
      <p>Micro-SaaS de Controle de Entregas - Acompanhamento centralizado.</p>

      <section style={{ background: '#fff', padding: '20px', borderRadius: '8px', marginBottom: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <h2>Cadastrar Nova Entrega</h2>
        <form onSubmit={handleAddDelivery} style={{ display: 'grid', gap: '12px', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: 600 }}>Descrição / Pedido</label>
            <input 
              type="text" 
              value={title} 
              onChange={e => setTitle(e.target.value)} 
              placeholder="Ex: Entrega de Equipamento" 
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
              required
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: 600 }}>Responsável</label>
            <input 
              type="text" 
              value={responsible} 
              onChange={e => setResponsible(e.target.value)} 
              placeholder="Nome do entregador/responsável" 
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
              required
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: 600 }}>Prazo</label>
            <input 
              type="date" 
              value={dueDate} 
              onChange={e => setDueDate(e.target.value)} 
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
              required
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: 600 }}>Status Inicial</label>
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
          <div style={{ gridColumn: '1 / -1' }}>
            <button type="submit" style={{ background: '#2563eb', color: '#fff', border: 'none', padding: '10px 16px', borderRadius: '4px', cursor: 'pointer', fontWeight: 600 }}>
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
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', marginTop: '12px' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #e5e7eb', color: '#4b5563' }}>
                  <th style={{ padding: '10px' }}>Entrega</th>
                  <th style={{ padding: '10px' }}>Responsável</th>
                  <th style={{ padding: '10px' }}>Prazo</th>
                  <th style={{ padding: '10px' }}>Status</th>
                  <th style={{ padding: '10px' }}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {deliveries.map(d => (
                  <tr key={d.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                    <td style={{ padding: '10px', fontWeight: 500 }}>{d.title}</td>
                    <td style={{ padding: '10px' }}>{d.responsible}</td>
                    <td style={{ padding: '10px' }}>{d.dueDate}</td>
                    <td style={{ padding: '10px' }}>
                      <span style={{
                        padding: '4px 8px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: 600,
                        background: d.status === 'Entregue' ? '#d1fae5' : d.status === 'Em Trânsito' ? '#dbeafe' : d.status === 'Cancelado' ? '#fee2e2' : '#fef3c7',
                        color: d.status === 'Entregue' ? '#065f46' : d.status === 'Em Trânsito' ? '#1e40af' : d.status === 'Cancelado' ? '#991b1b' : '#92400e'
                      }}>
                        {d.status}
                      </span>
                    </td>
                    <td style={{ padding: '10px' }}>
                      <select 
                        value={d.status} 
                        onChange={e => handleStatusChange(d.id, e.target.value as Delivery['status'])}
                        style={{ padding: '4px 8px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '12px' }}
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
