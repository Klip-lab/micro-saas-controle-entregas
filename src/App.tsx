import { useState } from 'react';

interface Delivery {
  id: string;
  title: string;
  responsible: string;
  dueDate: string;
  status: 'Pendente' | 'Em Trânsito' | 'Entregue' | 'Cancelado';
}

export default function App() {
  const [deliveries, setDeliveries] = useState<Delivery[]>([
    { id: '1', title: 'Pedido #101 - Eletrônicos', responsible: 'Carlos Silva', dueDate: '2025-06-10', status: 'Pendente' },
    { id: '2', title: 'Pedido #102 - Documentos', responsible: 'Ana Souza', dueDate: '2025-06-08', status: 'Em Trânsito' }
  ]);

  const [title, setTitle] = useState('');
  const [responsible, setResponsible] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [status, setStatus] = useState<'Pendente' | 'Em Trânsito' | 'Entregue' | 'Cancelado'>('Pendente');

  const handleSubmit = (e: React.FormEvent) => {
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

  const updateStatus = (id: string, newStatus: Delivery['status']) => {
    setDeliveries(deliveries.map(d => d.id === id ? { ...d, status: newStatus } : d));
  };

  return (
    <main>
      <h1>Controle de Entregas</h1>
      <p>Micro-SaaS para gestão de entregas rápidas, responsáveis e prazos.</p>

      <section style={{ background: '#fff', padding: '20px', borderRadius: '8px', marginBottom: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <h2>Cadastrar Nova Entrega</h2>
        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '12px', gridTemplateColumns: '1fr 1fr' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: 500 }}>Título / Descrição</label>
            <input 
              type="text" 
              value={title} 
              onChange={e => setTitle(e.target.value)} 
              placeholder="Ex: Pacote de Peças" 
              required 
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: 500 }}>Responsável</label>
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
            <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: 500 }}>Prazo de Entrega</label>
            <input 
              type="date" 
              value={dueDate} 
              onChange={e => setDueDate(e.target.value)} 
              required 
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: 500 }}>Status Inicial</label>
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
          <div style={{ gridColumn: 'span 2' }}>
            <button type="submit" style={{ padding: '10px 16px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 600 }}>
              Salvar Entrega
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
                <tr style={{ borderBottom: '2px solid #e5e7eb', fontSize: '14px', color: '#4b5563' }}>
                  <th style={{ padding: '8px' }}>Entrega</th>
                  <th style={{ padding: '8px' }}>Responsável</th>
                  <th style={{ padding: '8px' }}>Prazo</th>
                  <th style={{ padding: '8px' }}>Status</th>
                  <th style={{ padding: '8px' }}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {deliveries.map(d => (
                  <tr key={d.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                    <td style={{ padding: '12px 8px', fontWeight: 500 }}>{d.title}</td>
                    <td style={{ padding: '12px 8px' }}>{d.responsible}</td>
                    <td style={{ padding: '12px 8px' }}>{d.dueDate}</td>
                    <td style={{ padding: '12px 8px' }}>
                      <span style={{
                        padding: '4px 8px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: 600,
                        background: d.status === 'Entregue' ? '#dcfce7' : d.status === 'Em Trânsito' ? '#dbeafe' : d.status === 'Cancelado' ? '#fee2e2' : '#fef9c3',
                        color: d.status === 'Entregue' ? '#166534' : d.status === 'Em Trânsito' ? '#1e40af' : d.status === 'Cancelado' ? '#991b1b' : '#854d0e'
                      }}>
                        {d.status}
                      </span>
                    </td>
                    <td style={{ padding: '12px 8px' }}>
                      <select 
                        value={d.status} 
                        onChange={e => updateStatus(d.id, e.target.value as Delivery['status'])}
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
