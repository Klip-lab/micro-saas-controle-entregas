import { useState } from 'react';

interface Delivery {
  id: string;
  title: string;
  responsible: string;
  dueDate: string;
  status: 'Pendente' | 'Em trânsito' | 'Entregue' | 'Cancelado';
}

export default function App() {
  const [deliveries, setDeliveries] = useState<Delivery[]>([
    {
      id: '1',
      title: 'Pedido #101 - Eletrônicos',
      responsible: 'Carlos Silva',
      dueDate: '2025-06-01',
      status: 'Pendente'
    },
    {
      id: '2',
      title: 'Pedido #102 - Documentos',
      responsible: 'Ana Souza',
      dueDate: '2025-05-28',
      status: 'Em trânsito'
    }
  ]);

  const [title, setTitle] = useState('');
  const [responsible, setResponsible] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [status, setStatus] = useState<'Pendente' | 'Em trânsito' | 'Entregue' | 'Cancelado'>('Pendente');

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
      <header style={{ marginBottom: '24px' }}>
        <h1>Micro-SaaS de Controle de Entregas</h1>
        <p>Gerencie entregas, responsáveis, prazos e status em uma interface simples.</p>
      </header>

      <section style={{ background: '#fff', padding: '20px', borderRadius: '8px', marginBottom: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <h2 style={{ marginTop: 0, fontSize: '1.25rem' }}>Cadastrar Nova Entrega</h2>
        <form onSubmit={handleAddDelivery} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: '12px', alignItems: 'end' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '4px' }}>Descrição da Entrega</label>
            <input 
              type="text" 
              value={title} 
              onChange={e => setTitle(e.target.value)} 
              placeholder="Ex: Caixa de peças" 
              required
              style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '4px' }}>Responsável</label>
            <input 
              type="text" 
              value={responsible} 
              onChange={e => setResponsible(e.target.value)} 
              placeholder="Nome do entregador" 
              required
              style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '4px' }}>Prazo</label>
            <input 
              type="date" 
              value={dueDate} 
              onChange={e => setDueDate(e.target.value)} 
              required
              style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
            />
          </div>
          <button type="submit" style={{ padding: '9px 16px', background: '#0284c7', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: '500' }}>
            Cadastrar
          </button>
        </form>
      </section>

      <section style={{ background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <h2 style={{ marginTop: 0, fontSize: '1.25rem' }}>Acompanhamento de Entregas</h2>
        {deliveries.length === 0 ? (
          <p style={{ color: '#666' }}>Nenhuma entrega cadastrada no momento.</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #eee', color: '#555', fontSize: '0.875rem' }}>
                  <th style={{ padding: '10px' }}>Entrega</th>
                  <th style={{ padding: '10px' }}>Responsável</th>
                  <th style={{ padding: '10px' }}>Prazo</th>
                  <th style={{ padding: '10px' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {deliveries.map(d => (
                  <tr key={d.id} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '10px', fontWeight: '500' }}>{d.title}</td>
                    <td style={{ padding: '10px' }}>{d.responsible}</td>
                    <td style={{ padding: '10px' }}>{d.dueDate}</td>
                    <td style={{ padding: '10px' }}>
                      <select 
                        value={d.status} 
                        onChange={e => handleStatusChange(d.id, e.target.value as Delivery['status'])}
                        style={{ padding: '6px', borderRadius: '4px', border: '1px solid #ccc', background: '#fff' }}
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
