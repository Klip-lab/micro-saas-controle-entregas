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
    {
      id: '1',
      title: 'Pedido #101 - Eletrônicos',
      responsible: 'Carlos Silva',
      dueDate: '2025-12-31',
      status: 'Pendente',
    },
  ]);

  const [title, setTitle] = useState('');
  const [responsible, setResponsible] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [status, setStatus] = useState<'Pendente' | 'Em Trânsito' | 'Entregue'>('Pendente');

  const handleAddDelivery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !responsible.trim() || !dueDate) return;

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
    setDeliveries(
      deliveries.map((d) => (d.id === id ? { ...d, status: newStatus } : d))
    );
  };

  return (
    <main>
      <h1>Micro-SaaS de Controle de Entregas</h1>
      <p>Gerencie entregas, responsáveis, prazos e status com clareza.</p>

      <section style={{ background: '#fff', padding: '20px', borderRadius: '8px', marginBottom: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <h2>Cadastrar Nova Entrega</h2>
        <form onSubmit={handleAddDelivery} style={{ display: 'grid', gap: '12px', gridTemplateColumns: '1fr 1fr' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: 500 }}>Descrição da Entrega</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Caixa de Documentos"
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
              required
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: 500 }}>Responsável pela Entrega</label>
            <input
              type="text"
              value={responsible}
              onChange={(e) => setResponsible(e.target.value)}
              placeholder="Ex: Ana Souza"
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
              required
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: 500 }}>Prazo</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
              required
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: 500 }}>Status inicial</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', background: '#fff' }}
            >
              <option value="Pendente">Pendente</option>
              <option value="Em Trânsito">Em Trânsito</option>
              <option value="Entregue">Entregue</option>
            </select>
          </div>
          <div style={{ gridColumn: 'span 2' }}>
            <button type="submit" style={{ padding: '10px 16px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 600 }}>
              Salvar Entrega
            </button>
          </div>
        </form>
      </section>

      <section style={{ background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <h2>Acompanhamento de Entregas</h2>
        {deliveries.length === 0 ? (
          <p>Nenhuma entrega cadastrada.</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '12px' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e5e7eb', textAlign: 'left' }}>
                <th style={{ padding: '8px' }}>Entrega</th>
                <th style={{ padding: '8px' }}>Responsável</th>
                <th style={{ padding: '8px' }}>Prazo</th>
                <th style={{ padding: '8px' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {deliveries.map((delivery) => (
                <tr key={delivery.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <td style={{ padding: '12px 8px' }}>{delivery.title}</td>
                  <td style={{ padding: '12px 8px' }}>{delivery.responsible}</td>
                  <td style={{ padding: '12px 8px' }}>{delivery.dueDate}</td>
                  <td style={{ padding: '12px 8px' }}>
                    <select
                      value={delivery.status}
                      onChange={(e) => handleStatusChange(delivery.id, e.target.value as any)}
                      style={{ padding: '6px', borderRadius: '4px', border: '1px solid #ccc', background: '#f9fafb' }}
                    >
                      <option value="Pendente">Pendente</option>
                      <option value="Em Trânsito">Em Trânsito</option>
                      <option value="Entregue">Entregue</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </main>
  );
}
