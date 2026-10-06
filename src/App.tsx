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
      { id: '1', title: 'Entrega de Documentos - Centro', responsible: 'Carlos Silva', deadline: '2025-03-10', status: 'Pendente' },
      { id: '2', title: 'Peças de Reposição - Loja 2', responsible: 'Ana Souza', deadline: '2025-03-08', status: 'Em Trânsito' }
    ];
  });

  const [title, setTitle] = useState('');
  const [responsible, setResponsible] = useState('');
  const [deadline, setDeadline] = useState('');
  const [status, setStatus] = useState<Delivery['status']>('Pendente');

  useEffect(() => {
    localStorage.setItem('@MicroSaaS:deliveries', JSON.stringify(deliveries));
  }, [deliveries]);

  function handleAddDelivery(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !responsible.trim() || !deadline) return;

    const newDelivery: Delivery = {
      id: Date.now().toString(),
      title,
      responsible,
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

  return (
    <main>
      <header style={{ marginBottom: '24px' }}>
        <h1>Micro-SaaS de Controle de Entregas</h1>
        <p style={{ color: '#555' }}>Centralize o acompanhamento de entregas, responsáveis, prazos e status.</p>
      </header>

      <section style={{ background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '16px' }}>Cadastrar Nova Entrega</h2>
        <form onSubmit={handleAddDelivery} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div style={{ gridColumn: 'span 2' }}>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '6px' }}>Descrição da Entrega / Pedido</label>
            <input 
              type="text" 
              value={title} 
              onChange={e => setTitle(e.target.value)} 
              placeholder="Ex: Remessa de Equipamentos" 
              required 
              style={{ width: '100%', padding: '8px 12px', border: '1px solid #ccc', borderRadius: '4px' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '6px' }}>Responsável pela Entrega</label>
            <input 
              type="text" 
              value={responsible} 
              onChange={e => setResponsible(e.target.value)} 
              placeholder="Ex: João Motorista" 
              required 
              style={{ width: '100%', padding: '8px 12px', border: '1px solid #ccc', borderRadius: '4px' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '6px' }}>Prazo da Entrega</label>
            <input 
              type="date" 
              value={deadline} 
              onChange={e => setDeadline(e.target.value)} 
              required 
              style={{ width: '100%', padding: '8px 12px', border: '1px solid #ccc', borderRadius: '4px' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '6px' }}>Status Inicial</label>
            <select 
              value={status} 
              onChange={e => setStatus(e.target.value as Delivery['status'])}
              style={{ width: '100%', padding: '8px 12px', border: '1px solid #ccc', borderRadius: '4px', background: '#fff' }}
            >
              <option value="Pendente">Pendente</option>
              <option value="Em Trânsito">Em Trânsito</option>
              <option value="Entregue">Entregue</option>
              <option value="Cancelado">Cancelado</option>
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-end' }}>
            <button 
              type="submit" 
              style={{ width: '100%', background: '#2563eb', color: '#fff', border: 'none', padding: '10px 16px', borderRadius: '4px', fontWeight: 600, cursor: 'pointer' }}
            >
              Cadastrar Entrega
            </button>
          </div>
        </form>
      </section>

      <section style={{ background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '16px' }}>Acompanhamento de Entregas</h2>
        {deliveries.length === 0 ? (
          <p style={{ color: '#777' }}>Nenhuma entrega cadastrada no momento.</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
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
                {deliveries.map(d => (
                  <tr key={d.id} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '12px 10px', fontWeight: 500 }}>{d.title}</td>
                    <td style={{ padding: '12px 10px' }}>{d.responsible}</td>
                    <td style={{ padding: '12px 10px' }}>{d.deadline}</td>
                    <td style={{ padding: '12px 10px' }}>
                      <select 
                        value={d.status} 
                        onChange={e => handleStatusChange(d.id, e.target.value as Delivery['status'])}
                        style={{ padding: '4px 8px', borderRadius: '4px', border: '1px solid #ccc', background: '#fff', fontSize: '0.85rem' }}
                      >
                        <option value="Pendente">Pendente</option>
                        <option value="Em Trânsito">Em Trânsito</option>
                        <option value="Entregue">Entregue</option>
                        <option value="Cancelado">Cancelado</option>
                      </select>
                    </td>
                    <td style={{ padding: '12px 10px', textAlign: 'right' }}>
                      <button 
                        onClick={() => handleDelete(d.id)}
                        style={{ background: '#fee2e2', color: '#991b1b', border: 'none', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}
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
