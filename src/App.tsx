import React, { useState, useEffect } from 'react';

interface Delivery {
  id: string;
  title: string;
  assignee: string;
  deadline: string;
  status: 'Pendente' | 'Em trânsito' | 'Entregue' | 'Cancelado';
}

export default function App() {
  const [deliveries, setDeliveries] = useState<Delivery[]>(() => {
    const saved = localStorage.getItem('@micro-saas/deliveries');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [];
      }
    }
    return [
      { id: '1', title: 'Entrega de Documentos - Centro', assignee: 'Carlos Silva', deadline: '2025-03-10', status: 'Em trânsito' },
      { id: '2', title: 'Peças de Reposição - Zona Sul', assignee: 'Ana Souza', deadline: '2025-03-12', status: 'Pendente' }
    ];
  });

  const [title, setTitle] = useState('');
  const [assignee, setAssignee] = useState('');
  const [deadline, setDeadline] = useState('');
  const [status, setStatus] = useState<Delivery['status']>('Pendente');
  const [filterStatus, setFilterStatus] = useState<string>('TODOS');

  useEffect(() => {
    localStorage.setItem('@micro-saas/deliveries', JSON.stringify(deliveries));
  }, [deliveries]);

  const handleAddDelivery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !assignee.trim() || !deadline) return;

    const newDelivery: Delivery = {
      id: Date.now().toString(),
      title: title.trim(),
      assignee: assignee.trim(),
      deadline,
      status
    };

    setDeliveries([newDelivery, ...deliveries]);
    setTitle('');
    setAssignee('');
    setDeadline('');
    setStatus('Pendente');
  };

  const handleStatusChange = (id: string, newStatus: Delivery['status']) => {
    setDeliveries(deliveries.map(d => d.id === id ? { ...d, status: newStatus } : d));
  };

  const filteredDeliveries = filterStatus === 'TODOS' 
    ? deliveries 
    : deliveries.filter(d => d.status === filterStatus);

  return (
    <main>
      <header style={{ marginBottom: '32px', borderBottom: '1px solid #ddd', paddingBottom: '16px' }}>
        <h1>Micro-SaaS de Controle de Entregas</h1>
        <p>Centralize o acompanhamento de entregas, responsáveis, prazos e status em uma interface simples.</p>
      </header>

      <section style={{ background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '32px' }}>
        <h2>Cadastrar Nova Entrega</h2>
        <form onSubmit={handleAddDelivery} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '16px' }}>
          <div style={{ gridColumn: 'span 2' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: 500 }}>Descrição da Entrega</label>
            <input 
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Ex: Entrega de Equipamento X"
              required
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: 500 }}>Responsável</label>
            <input 
              type="text"
              value={assignee}
              onChange={e => setAssignee(e.target.value)}
              placeholder="Ex: João Motorista"
              required
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: 500 }}>Prazo Limite</label>
            <input 
              type="date"
              value={deadline}
              onChange={e => setDeadline(e.target.value)}
              required
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: 500 }}>Status Inicial</label>
            <select 
              value={status}
              onChange={e => setStatus(e.target.value as Delivery['status'])}
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            >
              <option value="Pendente">Pendente</option>
              <option value="Em trânsito">Em trânsito</option>
              <option value="Entregue">Entregue</option>
              <option value="Cancelado">Cancelado</option>
            </select>
          </div>
          <div style={{ gridColumn: 'span 2', display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
            <button 
              type="submit"
              style={{ background: '#2563eb', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}
            >
              Cadastrar Entrega
            </button>
          </div>
        </form>
      </section>

      <section style={{ background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2>Acompanhamento de Entregas</h2>
          <div>
            <label style={{ marginRight: '8px', fontWeight: 500 }}>Filtrar Status:</label>
            <select 
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
              style={{ padding: '6px', borderRadius: '4px', border: '1px solid #ccc' }}
            >
              <option value="TODOS">Todos</option>
              <option value="Pendente">Pendente</option>
              <option value="Em trânsito">Em trânsito</option>
              <option value="Entregue">Entregue</option>
              <option value="Cancelado">Cancelado</option>
            </select>
          </div>
        </div>

        {filteredDeliveries.length === 0 ? (
          <p style={{ color: '#666', textAlign: 'center', padding: '24px' }}>Nenhuma entrega encontrada.</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #eee', color: '#555' }}>
                  <th style={{ padding: '12px' }}>Entrega</th>
                  <th style={{ padding: '12px' }}>Responsável</th>
                  <th style={{ padding: '12px' }}>Prazo</th>
                  <th style={{ padding: '12px' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredDeliveries.map(d => (
                  <tr key={d.id} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '12px', fontWeight: 500 }}>{d.title}</td>
                    <td style={{ padding: '12px' }}>{d.assignee}</td>
                    <td style={{ padding: '12px' }}>{d.deadline}</td>
                    <td style={{ padding: '12px' }}>
                      <select 
                        value={d.status}
                        onChange={e => handleStatusChange(d.id, e.target.value as Delivery['status'])}
                        style={{ padding: '6px', borderRadius: '4px', border: '1px solid #ccc', background: '#f9f9f9' }}
                      >
                        <option value="Pendente">Pendente</option>
                        <option value="Em trânsito">Em trânsito</option>
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
