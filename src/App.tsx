import { useState } from 'react';

interface Delivery {
  id: string;
  title: string;
  responsible: string;
  deadline: string;
  status: 'Pendente' | 'Em Trânsito' | 'Entregue' | 'Cancelado';
}

export default function App() {
  const [deliveries, setDeliveries] = useState<Delivery[]>([
    {
      id: '1',
      title: 'Entrega de documentos - Cliente A',
      responsible: 'Carlos Silva',
      deadline: '2025-03-10',
      status: 'Pendente',
    },
    {
      id: '2',
      title: 'Kit de produtos - Loja B',
      responsible: 'Ana Souza',
      deadline: '2025-03-08',
      status: 'Em Trânsito',
    },
  ]);

  const [title, setTitle] = useState('');
  const [responsible, setResponsible] = useState('');
  const [deadline, setDeadline] = useState('');
  const [status, setStatus] = useState<'Pendente' | 'Em Trânsito' | 'Entregue' | 'Cancelado'>('Pendente');

  function handleAddDelivery(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !responsible.trim() || !deadline) return;

    const newDelivery: Delivery = {
      id: Date.now().toString(),
      title: title.trim(),
      responsible: responsible.trim(),
      deadline,
      status,
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

  return (
    <main>
      <header style={{ marginBottom: '32px' }}>
        <h1>Micro-SaaS de Controle de Entregas</h1>
        <p>Centralize o acompanhamento de entregas, responsáveis, prazos e status em uma interface simples.</p>
      </header>

      <section style={{ background: '#fff', padding: '24px', borderRadius: '8px', marginBottom: '32px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <h2 style={{ marginTop: 0, fontSize: '1.25rem' }}>Cadastrar Nova Entrega</h2>
        <form onSubmit={handleAddDelivery} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div style={{ gridColumn: 'span 2' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: 500 }}>Descrição da Entrega</label>
            <input 
              type="text" 
              value={title} 
              onChange={e => setTitle(e.target.value)} 
              placeholder="Ex: Documentação fiscal - Loja Centro"
              style={{ width: '100%', padding: '8px 12px', border: '1px solid #ccc', borderRadius: '4px' }}
              required
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: 500 }}>Responsável</label>
            <input 
              type="text" 
              value={responsible} 
              onChange={e => setResponsible(e.target.value)} 
              placeholder="Nome do entregador/responsável"
              style={{ width: '100%', padding: '8px 12px', border: '1px solid #ccc', borderRadius: '4px' }}
              required
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: 500 }}>Prazo</label>
            <input 
              type="date" 
              value={deadline} 
              onChange={e => setDeadline(e.target.value)} 
              style={{ width: '100%', padding: '8px 12px', border: '1px solid #ccc', borderRadius: '4px' }}
              required
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: 500 }}>Status Inicial</label>
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
          <div style={{ gridColumn: 'span 2', display: 'flex', justifyContent: 'flex-end' }}>
            <button 
              type="submit"
              style={{ background: '#2563eb', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '4px', fontWeight: 500, cursor: 'pointer' }}
            >
              Cadastrar Entrega
            </button>
          </div>
        </form>
      </section>

      <section style={{ background: '#fff', padding: '24px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <h2 style={{ marginTop: 0, fontSize: '1.25rem' }}>Visão de Acompanhamento ({deliveries.length})</h2>
        {deliveries.length === 0 ? (
          <p style={{ color: '#666' }}>Nenhuma entrega cadastrada no momento.</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #eee' }}>
                  <th style={{ padding: '12px 8px' }}>Entrega</th>
                  <th style={{ padding: '12px 8px' }}>Responsável</th>
                  <th style={{ padding: '12px 8px' }}>Prazo</th>
                  <th style={{ padding: '12px 8px' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {deliveries.map(d => (
                  <tr key={d.id} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '12px 8px', fontWeight: 500 }}>{d.title}</td>
                    <td style={{ padding: '12px 8px' }}>{d.responsible}</td>
                    <td style={{ padding: '12px 8px' }}>{d.deadline.split('-').reverse().join('/')}</td>
                    <td style={{ padding: '12px 8px' }}>
                      <select 
                        value={d.status} 
                        onChange={e => handleStatusChange(d.id, e.target.value as Delivery['status'])}
                        style={{ padding: '6px 8px', borderRadius: '4px', border: '1px solid #ccc', background: '#f9f9f9' }}
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
