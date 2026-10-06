import { useState, useEffect, FormEvent } from "react";

interface Delivery {
  id: string;
  title: string;
  responsible: string;
  dueDate: string;
  status: "Pendente" | "Em trânsito" | "Entregue" | "Cancelado";
}

export default function App() {
  const [deliveries, setDeliveries] = useState<Delivery[]>(() => {
    const saved = localStorage.getItem("@micro_saas_deliveries");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [];
      }
    }
    return [
      {
        id: "1",
        title: "Documentos Fiscais - Cliente A",
        responsible: "Carlos Silva",
        dueDate: "2025-12-31",
        status: "Pendente"
      },
      {
        id: "2",
        title: "Peças de Reposição - Loja Centro",
        responsible: "Mariana Souza",
        dueDate: "2025-12-28",
        status: "Em trânsito"
      }
    ];
  });

  const [title, setTitle] = useState("");
  const [responsible, setResponsible] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [status, setStatus] = useState<Delivery["status"]>("Pendente");

  useEffect(() => {
    localStorage.setItem("@micro_saas_deliveries", JSON.stringify(deliveries));
  }, [deliveries]);

  function handleCreateDelivery(e: FormEvent) {
    e.preventDefault();
    if (!title.trim() || !responsible.trim() || !dueDate) return;

    const newDelivery: Delivery = {
      id: Date.now().toString(),
      title: title.trim(),
      responsible: responsible.trim(),
      dueDate,
      status
    };

    setDeliveries([newDelivery, ...deliveries]);
    setTitle("");
    setResponsible("");
    setDueDate("");
    setStatus("Pendente");
  }

  function handleStatusChange(id: string, newStatus: Delivery["status"]) {
    setDeliveries(
      deliveries.map((item) =>
        item.id === id ? { ...item, status: newStatus } : item
      )
    );
  }

  return (
    <main>
      <header style={{ marginBottom: "32px" }}>
        <h1>Controle de Entregas</h1>
        <p style={{ color: "#666" }}>
          Gerencie entregas, responsáveis, prazos e status com simplicidade.
        </p>
      </header>

      <section
        style={{
          background: "#fff",
          padding: "24px",
          borderRadius: "8px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          marginBottom: "32px"
        }}
      >
        <h2 style={{ fontSize: "1.25rem", marginBottom: "16px" }}>
          Cadastrar Nova Entrega
        </h2>
        <form
          onSubmit={handleCreateDelivery}
          style={{ display: "grid", gap: "16px", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={{ fontSize: "0.875rem", fontWeight: 600 }}>Descrição / Título</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Entrega de Produtos"
              required
              style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={{ fontSize: "0.875rem", fontWeight: 600 }}>Responsável</label>
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
            <label style={{ fontSize: "0.875rem", fontWeight: 600 }}>Prazo</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              required
              style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={{ fontSize: "0.875rem", fontWeight: 600 }}>Status Inicial</label>
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
              style={{
                background: "#2563eb",
                color: "#fff",
                padding: "10px 20px",
                borderRadius: "4px",
                border: "none",
                cursor: "pointer",
                fontWeight: 600
              }}
            >
              Salvar Entrega
            </button>
          </div>
        </form>
      </section>

      <section
        style={{
          background: "#fff",
          padding: "24px",
          borderRadius: "8px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
        }}
      >
        <h2 style={{ fontSize: "1.25rem", marginBottom: "16px" }}>
          Acompanhamento de Entregas ({deliveries.length})
        </h2>
        {deliveries.length === 0 ? (
          <p style={{ color: "#666" }}>Nenhuma entrega cadastrada até o momento.</p>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid #eee" }}>
                  <th style={{ padding: "12px" }}>Descrição</th>
                  <th style={{ padding: "12px" }}>Responsável</th>
                  <th style={{ padding: "12px" }}>Prazo</th>
                  <th style={{ padding: "12px" }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {deliveries.map((item) => (
                  <tr key={item.id} style={{ borderBottom: "1px solid #eee" }}>
                    <td style={{ padding: "12px", fontWeight: 500 }}>{item.title}</td>
                    <td style={{ padding: "12px" }}>{item.responsible}</td>
                    <td style={{ padding: "12px" }}>{item.dueDate}</td>
                    <td style={{ padding: "12px" }}>
                      <select
                        value={item.status}
                        onChange={(e) =>
                          handleStatusChange(item.id, e.target.value as Delivery["status"])
                        }
                        style={{
                          padding: "6px 10px",
                          borderRadius: "4px",
                          border: "1px solid #ccc",
                          background: "#f8fafc",
                          fontWeight: 500
                        }}
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
