import { useState } from 'react';

interface Delivery {
  id: string;
  title: string;
  responsible: string;
  deadline: string;
  status: 'Pendente' | 'Em Trânsito' | 'Entregue';
}

export default function App() {
  const [deliveries, setDeliveries] = useState<Delivery[]>([
    { id: '1', title: 'Pedido #101', responsible: 'Carlos Silva', deadline: '2025-03-15', status: 'Pendente' },
    { id: '2', title: 'Pedido #102', responsible: 'Ana Souza', deadline: '2025-03-16', status: 'Em Trânsito' }
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
      <header style={{ marginBottom: '24px' }}>
        <h1>Micro-SaaS de Controle de Entregas</h1>
        <p>Centralize o acompanhamento de entregas, responsáveis, prazos e status.</p>
      </header>

      <section style={{ background: '#fff', padding: '20px', borderRadius: '8px', marginBottom: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <h2>Cadastrar Nova Entrega</h2>
        <form onSubmit={handleAddDelivery} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: '12px', alignItems: 'end', marginTop: '12px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '14px', marginBottom: '4px' }}>Título / Descrição</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Ex: Entrega de Documentos"
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
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '14px', marginBottom: '4px' }}>Prazo</label>
            <input
              type="date"
              value={deadline}
              onChange={e => setDeadline(e.target.value)}
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            />
          </div>
          <div>
            <button type="submit" style={{ padding: '9px 16px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
              Cadastrar
            </button>
          </div>
        </form>
      </section>

      <section style={{ background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <h2>Acompanhamento de Entregas</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '12px' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #e5e7eb', textAlign: 'left' }}>
              <th style={{ padding: '8px' }}>Entrega</th>
              <th style={{ padding: '8px' }}>Responsável</th>
              <th style={{ padding: '8px' }}>Prazo</th>
              <th style={{ padding: '8px' }}>Status</th>
              <th style={{ padding: '8px' }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {deliveries.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ padding: '16px', textAlign: 'center', color: '#6b7280' }}>Nenhuma entrega cadastrada.</td>
              </tr>
            ) : (
              deliveries.map(d => (
                <tr key={d.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <td style={{ padding: '8px' }}>{d.title}</td>
                  <td style={{ padding: '8px' }}>{d.responsible}</td>
                  <td style={{ padding: '8px' }}>{d.deadline}</td>
                  <td style={{ padding: '8px' }}>
                    <span style={{
                      padding: '2px 8px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      background: d.status === 'Entregue' ? '#d1fae5' : d.status === 'Em Trânsito' ? '#dbeafe' : '#fef3c7',
                      color: d.status === 'Entregue' ? '#065f46' : d.status === 'Em Trânsito' ? '#1e40af' : '#92400e'
                    }}>
                      {d.status}
                    </span>
                  </td>
                  <td style={{ padding: '8px' }}>
                    <select
                      value={d.status}
                      onChange={e => handleStatusChange(d.id, e.target.value as any)}
                      style={{ padding: '4px', borderRadius: '4px', border: '1px solid #ccc' }}
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
