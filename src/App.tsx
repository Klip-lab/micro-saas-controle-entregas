import { useState } from 'react';

interface Delivery {
  id: string;
  title: string;
  responsible: string;
  dueDate: string;
  status: 'Pendente' | 'Em Trânsito' | 'Entregue';
}

export default function App() {
  const [deliveries, setDeliveries] = useState<Delivery[]>([
    { id: '1', title: 'Pedido #101', responsible: 'Carlos Silva', dueDate: '2025-12-31', status: 'Pendente' }
  ]);

  const [title, setTitle] = useState('');
  const [responsible, setResponsible] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [status, setStatus] = useState<'Pendente' | 'Em Trânsito' | 'Entregue'>('Pendente');

  const handleAddDelivery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !responsible || !dueDate) return;
    const newDelivery: Delivery = {
      id: Date.now().toString(),
      title,
      responsible,
      dueDate,
      status,
    };
    setDeliveries([...deliveries, newDelivery]);
    setTitle('');
    setResponsible('');
    setDueDate('');
    setStatus('Pendente');
  };

  const handleStatusChange = (id: string, newStatus: 'Pendente' | 'Em Trânsito' | 'Entregue') => {
    setDeliveries(deliveries.map(d => d.id === id ? { ...d, status: newStatus } : d));
  };

  return (
    <main>
      <h1>Controle de Entregas</h1>
      <p>Gerencie entregas, responsáveis, prazos e status.</p>

      <form onSubmit={handleAddDelivery} style={{ background: '#fff', padding: '16px', borderRadius: '8px', marginBottom: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <h2>Nova Entrega</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr auto', gap: '8px', marginTop: '12px' }}>
          <input
            type="text"
            placeholder="Descrição / Título"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
            style={{ padding: '8px' }}
          />
          <input
            type="text"
            placeholder="Responsável"
            value={responsible}
            onChange={e => setResponsible(e.target.value)}
            required
            style={{ padding: '8px' }}
          />
          <input
            type="date"
            value={dueDate}
            onChange={e => setDueDate(e.target.value)}
            required
            style={{ padding: '8px' }}
          />
          <select
            value={status}
            onChange={e => setStatus(e.target.value as any)}
            style={{ padding: '8px' }}
          >
            <option value="Pendente">Pendente</option>
            <option value="Em Trânsito">Em Trânsito</option>
            <option value="Entregue">Entregue</option>
          </select>
          <button type="submit" style={{ padding: '8px 16px', background: '#000', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            Cadastrar
          </button>
        </div>
      </form>

      <section style={{ background: '#fff', padding: '16px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <h2>Acompanhamento de Entregas</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '12px' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #eee', textAlign: 'left' }}>
              <th style={{ padding: '8px' }}>Entrega</th>
              <th style={{ padding: '8px' }}>Responsável</th>
              <th style={{ padding: '8px' }}>Prazo</th>
              <th style={{ padding: '8px' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {deliveries.map(d => (
              <tr key={d.id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '8px' }}>{d.title}</td>
                <td style={{ padding: '8px' }}>{d.responsible}</td>
                <td style={{ padding: '8px' }}>{d.dueDate}</td>
                <td style={{ padding: '8px' }}>
                  <select
                    value={d.status}
                    onChange={e => handleStatusChange(d.id, e.target.value as any)}
                    style={{ padding: '4px' }}
                  >
                    <option value="Pendente">Pendente</option>
                    <option value="Em Trânsito">Em Trânsito</option>
                    <option value="Entregue">Entregue</option>
                  </select>
                </td>
              </tr>
            ))}
            {deliveries.length === 0 && (
              <tr>
                <td colSpan={4} style={{ padding: '16px', textAlign: 'center', color: '#666' }}>
                  Nenhuma entrega cadastrada.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </main>
  );
}
