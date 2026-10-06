import { useState } from "react";

interface Delivery {
  id: string;
  title: string;
  responsible: string;
  dueDate: string;
  status: "Pendente" | "Em trânsito" | "Entregue";
}

export default function App() {
  const [deliveries, setDeliveries] = useState<Delivery[]>([
    { id: "1", title: "Pedido #101", responsible: "Carlos Silva", dueDate: "2023-12-31", status: "Pendente" }
  ]);

  const [title, setTitle] = useState("");
  const [responsible, setResponsible] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [status, setStatus] = useState<"Pendente" | "Em trânsito" | "Entregue">("Pendente");

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
    setDeliveries([...deliveries, newDelivery]);
    setTitle("");
    setResponsible("");
    setDueDate("");
    setStatus("Pendente");
  };

  const handleStatusChange = (id: string, newStatus: "Pendente" | "Em trânsito" | "Entregue") => {
    setDeliveries(deliveries.map(d => d.id === id ? { ...d, status: newStatus } : d));
  };

  return (
    <main>
      <h1>Controle de Entregas</h1>
      <p>Gerenciamento e acompanhamento de entregas, responsáveis e prazos.</p>

      <section style={{ background: "#fff", padding: "20px", borderRadius: "8px", marginBottom: "24px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
        <h2>Cadastrar Nova Entrega</h2>
        <form onSubmit={handleAddDelivery} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <div>
            <label style={{ display: "block", fontSize: "14px", fontWeight: 600, marginBottom: "4px" }}>Descrição da Entrega:</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Pacote de Documentos"
              style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
              required
            />
          </div>
          <div>
            <label style={{ display: "block", fontSize: "14px", fontWeight: 600, marginBottom: "4px" }}>Responsável pela Entrega:</label>
            <input
              type="text"
              value={responsible}
              onChange={(e) => setResponsible(e.target.value)}
              placeholder="Ex: Ana Souza"
              style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
              required
            />
          </div>
          <div>
            <label style={{ display: "block", fontSize: "14px", fontWeight: 600, marginBottom: "4px" }}>Prazo:</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
              required
            />
          </div>
          <div>
            <label style={{ display: "block", fontSize: "14px", fontWeight: 600, marginBottom: "4px" }}>Status Inicial:</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
              style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
            >
              <option value="Pendente">Pendente</option>
              <option value="Em trânsito">Em trânsito</option>
              <option value="Entregue">Entregue</option>
            </select>
          </div>
          <button type="submit" style={{ padding: "10px 16px", background: "#0284c7", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" }}>
            Cadastrar Entrega
          </button>
        </form>
      </section>

      <section style={{ background: "#fff", padding: "20px", borderRadius: "8px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
        <h2>Acompanhamento de Entregas</h2>
        {deliveries.length === 0 ? (
          <p>Nenhuma entrega cadastrada.</p>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "12px" }}>
            <thead>
              <tr style={{ background: "#f1f5f9", textAlign: "left" }}>
                <th style={{ padding: "10px", borderBottom: "1px solid #cbd5e1" }}>Entrega</th>
                <th style={{ padding: "10px", borderBottom: "1px solid #cbd5e1" }}>Responsável</th>
                <th style={{ padding: "10px", borderBottom: "1px solid #cbd5e1" }}>Prazo</th>
                <th style={{ padding: "10px", borderBottom: "1px solid #cbd5e1" }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {deliveries.map((d) => (
                <tr key={d.id}>
                  <td style={{ padding: "10px", borderBottom: "1px solid #e2e8f0" }}>{d.title}</td>
                  <td style={{ padding: "10px", borderBottom: "1px solid #e2e8f0" }}>{d.responsible}</td>
                  <td style={{ padding: "10px", borderBottom: "1px solid #e2e8f0" }}>{d.dueDate}</td>
                  <td style={{ padding: "10px", borderBottom: "1px solid #e2e8f0" }}>
                    <select
                      value={d.status}
                      onChange={(e) => handleStatusChange(d.id, e.target.value as any)}
                      style={{ padding: "4px 8px", borderRadius: "4px", border: "1px solid #cbd5e1" }}
                    >
                      <option value="Pendente">Pendente</option>
                      <option value="Em trânsito">Em trânsito</option>
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
