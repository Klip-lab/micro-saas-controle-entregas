import { useState, useEffect } from "react";

interface Delivery {
  id: string;
  title: string;
  responsible: string;
  deadline: string;
  status: "Pendente" | "Em trânsito" | "Entregue" | "Cancelado";
}

export default function App() {
  const [deliveries, setDeliveries] = useState<Delivery[]>(() => {
    const saved = localStorage.getItem("@micro_saas_deliveries");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [];
      }
    }
    return [
      {
        id: "1",
        title: "Documentos Fiscais - Centro",
        responsible: "Carlos Silva",
        deadline: "2025-03-10",
        status: "Em trânsito"
      },
      {
        id: "2",
        title: "Peças de Reposição - Zona Sul",
        responsible: "Ana Souza",
        deadline: "2025-03-12",
        status: "Pendente"
      }
    ];
  });

  const [title, setTitle] = useState("");
  const [responsible, setResponsible] = useState("");
  const [deadline, setDeadline] = useState("");
  const [status, setStatus] = useState<Delivery["status"]>("Pendente");

  useEffect(() => {
    localStorage.setItem("@micro_saas_deliveries", JSON.stringify(deliveries));
  }, [deliveries]);

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

    setDeliveries([newDelivery, ...deliveries]);
    setTitle("");
    setResponsible("");
    setDeadline("");
    setStatus("Pendente");
  };

  const handleStatusChange = (id: string, newStatus: Delivery["status"]) => {
    setDeliveries(
      deliveries.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
    );
  };

  return (
    <main>
      <header style={{ marginBottom: "32px" }}>
        <h1>Controle de Entregas</h1>
        <p style={{ color: "#666" }}>Micro-SaaS de Controle de Entregas - Operações de Logística Urbana</p>
      </header>

      <section style={{ background: "#fff", padding: "24px", borderRadius: "8px", marginBottom: "32px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
        <h2 style={{ marginTop: 0, fontSize: "1.25rem", marginBottom: "16px" }}>Cadastrar Nova Entrega</h2>
        <form onSubmit={handleAddDelivery} style={{ display: "grid", gap: "16px", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={{ fontSize: "0.875rem", fontWeight: 500 }}>Descrição da Entrega</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Caixa de Medicamentos"
              required
              style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={{ fontSize: "0.875rem", fontWeight: 500 }}>Responsável</label>
            <input
              type="text"
              value={responsible}
              onChange={(e) => setResponsible(e.target.value)}
              placeholder="Ex: João da Silva"
              required
              style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={{ fontSize: "0.875rem", fontWeight: 500 }}>Prazo</label>
            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              required
              style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={{ fontSize: "0.875rem", fontWeight: 500 }}>Status Inicial</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as Delivery["status"])}
              style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ccc", background: "#fff" }}
            >
              <option value="Pendente">Pendente</option>
              <option value="Em trânsito">Em trânsito</option>
              <option value="Entregue">Entregue</option>
              <option value="Cancelado">Cancelado</option>
            </select>
          </div>

          <div style={{ gridColumn: "1 / -1", display: "flex", justifyContent: "flex-end" }}>
            <button
              type="submit"
              style={{ background: "#171717", color: "#fff", border: "none", padding: "10px 20px", borderRadius: "4px", fontWeight: 500, cursor: "pointer" }}
            >
              Cadastrar Entrega
            </button>
          </div>
        </form>
      </section>

      <section style={{ background: "#fff", padding: "24px", borderRadius: "8px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
        <h2 style={{ marginTop: 0, fontSize: "1.25rem", marginBottom: "16px" }}>Acompanhamento de Entregas</h2>
        {deliveries.length === 0 ? (
          <p style={{ color: "#666" }}>Nenhuma entrega cadastrada no momento.</p>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid #eee" }}>
                  <th style={{ padding: "12px 8px" }}>Entrega</th>
                  <th style={{ padding: "12px 8px" }}>Responsável</th>
                  <th style={{ padding: "12px 8px" }}>Prazo</th>
                  <th style={{ padding: "12px 8px" }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {deliveries.map((item) => (
                  <tr key={item.id} style={{ borderBottom: "1px solid #eee" }}>
                    <td style={{ padding: "12px 8px", fontWeight: 500 }}>{item.title}</td>
                    <td style={{ padding: "12px 8px" }}>{item.responsible}</td>
                    <td style={{ padding: "12px 8px" }}>{item.deadline}</td>
                    <td style={{ padding: "12px 8px" }}>
                      <select
                        value={item.status}
                        onChange={(e) => handleStatusChange(item.id, e.target.value as Delivery["status"])}
                        style={{ padding: "6px", borderRadius: "4px", border: "1px solid #ccc", background: "#fff" }}
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
