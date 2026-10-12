import { useCallback, useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import type { Session } from "@supabase/supabase-js";
import { deliveryStatusLabels, supabase, supabaseConfigured, type Delivery } from "./lib/supabase";
import "./styles.css";

type Membership = { organization_id: string; role: "owner" | "member"; organizations: { id: string; name: string } | null };
const errorMessage = (error: unknown) => error instanceof Error ? error.message : "Ocorreu um erro inesperado.";

export default function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [authMessage, setAuthMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [organizationId, setOrganizationId] = useState("");
  const [workspaceName, setWorkspaceName] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [teamMessage, setTeamMessage] = useState("");
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [title, setTitle] = useState("");
  const [recipient, setRecipient] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [filter, setFilter] = useState<"all" | Delivery["status"]>("all");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!supabase) { setAuthReady(true); return; }
    void supabase.auth.getSession().then(({ data, error: sessionError }) => {
      if (sessionError) setError(sessionError.message);
      setSession(data.session);
      setAuthReady(true);
    });
    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setAuthReady(true);
    });
    return () => data.subscription.unsubscribe();
  }, []);

  const loadMemberships = useCallback(async () => {
    if (!supabase || !session?.user.id) return;
    const { data, error: queryError } = await supabase
      .from("organization_members")
      .select("organization_id, role, organizations(id, name)")
      .eq("user_id", session.user.id);
    if (queryError) throw queryError;
    const rows = (data ?? []) as unknown as Membership[];
    setMemberships(rows);
    setOrganizationId((current) => rows.some((row) => row.organization_id === current) ? current : rows[0]?.organization_id ?? "");
  }, [session?.user.id]);

  const loadDeliveries = useCallback(async () => {
    if (!supabase || !session?.user.id || !organizationId) { setDeliveries([]); return; }
    const { data, error: queryError } = await supabase
      .from("deliveries")
      .select("id, organization_id, created_by, title, recipient, status, due_date, created_at")
      .eq("organization_id", organizationId)
      .order("created_at", { ascending: false });
    if (queryError) throw queryError;
    setDeliveries((data ?? []) as Delivery[]);
  }, [organizationId, session?.user.id]);

  useEffect(() => {
    if (!session || !supabase) { setMemberships([]); setOrganizationId(""); setDeliveries([]); return; }
    void (async () => {
      try {
        const { error: invitationError } = await supabase.rpc("accept_organization_invitations");
        if (invitationError) setError(invitationError.message);
      } catch (cause) {
        setError(errorMessage(cause));
      }
      try { await loadMemberships(); } catch (cause) { setError(errorMessage(cause)); }
    })();
  }, [session?.user.id, loadMemberships]);

  useEffect(() => {
    if (!session || !organizationId) { setDeliveries([]); return; }
    void loadDeliveries().catch((cause) => setError(errorMessage(cause)));
  }, [session, organizationId, loadDeliveries]);

  const visibleDeliveries = useMemo(
    () => deliveries.filter((delivery) => delivery.organization_id === organizationId && (filter === "all" || delivery.status === filter)),
    [deliveries, filter, organizationId],
  );
  const selectedMembership = memberships.find((membership) => membership.organization_id === organizationId);

  async function sendOtp(event: FormEvent) {
    event.preventDefault(); if (!supabase) return;
    setBusy(true); setError(""); setAuthMessage("");
    try {
      const { error: requestError } = await supabase.auth.signInWithOtp({ email: email.trim(), options: { shouldCreateUser: true } });
      if (requestError) throw requestError;
      setAuthMessage("Enviamos um código para seu e-mail. Informe o código recebido para entrar.");
    } catch (cause) { setError(errorMessage(cause)); } finally { setBusy(false); }
  }

  async function verifyOtp(event: FormEvent) {
    event.preventDefault(); if (!supabase) return;
    setBusy(true); setError("");
    try {
      const { error: verifyError } = await supabase.auth.verifyOtp({ email: email.trim(), token: otp.trim(), type: "email" });
      if (verifyError) throw verifyError;
      setOtp(""); setAuthMessage("Autenticação concluída.");
    } catch (cause) { setError(errorMessage(cause)); } finally { setBusy(false); }
  }

  async function createWorkspace(event: FormEvent) {
    event.preventDefault(); if (!supabase || !session) return;
    setBusy(true); setError("");
    try {
      const { data, error: rpcError } = await supabase.rpc("create_workspace", { workspace_name: workspaceName.trim() });
      if (rpcError) throw rpcError;
      const createdId = String(data ?? "");
      if (!createdId) throw new Error("O servidor não retornou a organização criada.");
      setWorkspaceName(""); await loadMemberships(); setOrganizationId(createdId);
    } catch (cause) { setError(errorMessage(cause)); } finally { setBusy(false); }
  }

  async function inviteMember(event: FormEvent) {
    event.preventDefault();
    if (!supabase || !organizationId || selectedMembership?.role !== "owner") return;
    setBusy(true); setError(""); setTeamMessage("");
    try {
      const { error: inviteError } = await supabase.rpc("invite_organization_member", {
        target_organization_id: organizationId,
        invite_email: inviteEmail.trim(),
      });
      if (inviteError) throw inviteError;
      setInviteEmail("");
      setTeamMessage("Convite registrado. A pessoa deve entrar com esse mesmo e-mail para aceitar o convite.");
    } catch (cause) { setError(errorMessage(cause)); } finally { setBusy(false); }
  }

  async function createDelivery(event: FormEvent) {
    event.preventDefault(); if (!supabase || !session || !organizationId) return;
    setBusy(true); setError("");
    try {
      const { error: insertError } = await supabase.from("deliveries").insert({
        organization_id: organizationId,
        created_by: session.user.id,
        title: title.trim(),
        recipient: recipient.trim(),
        due_date: dueDate || null,
        status: "pending",
      });
      if (insertError) throw insertError;
      setTitle(""); setRecipient(""); setDueDate(""); await loadDeliveries();
    } catch (cause) { setError(errorMessage(cause)); } finally { setBusy(false); }
  }

  async function updateStatus(delivery: Delivery, status: Delivery["status"]) {
    if (!supabase || !session || delivery.organization_id !== organizationId) return;
    setBusy(true); setError("");
    try {
      const { error: updateError } = await supabase.from("deliveries").update({ status }).eq("id", delivery.id).eq("organization_id", organizationId);
      if (updateError) throw updateError;
      await loadDeliveries();
    } catch (cause) { setError(errorMessage(cause)); } finally { setBusy(false); }
  }

  if (!supabaseConfigured) return <main className="shell"><section className="panel"><p className="eyebrow">CONFIGURAÇÃO NECESSÁRIA</p><h1>Controle de Entregas</h1><p>Configure <code>VITE_SUPABASE_URL</code> e <code>VITE_SUPABASE_ANON_KEY</code> no ambiente de execução. Sem essas variáveis, o app não inicia uma sessão nem acessa dados.</p></section></main>;
  if (!authReady) return <main className="shell"><section className="panel">Verificando sessão…</section></main>;
  if (!session) return <main className="shell auth-shell"><section className="panel auth-panel"><p className="eyebrow">OPERAÇÃO LOGÍSTICA</p><h1>Controle de Entregas</h1><p className="muted">Entre com seu e-mail e o código de uso único.</p><form onSubmit={sendOtp} className="stack"><label>E-mail<input type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} /></label><button disabled={busy}>{busy ? "Enviando…" : "Enviar código"}</button></form><form onSubmit={verifyOtp} className="stack verify-form"><label>Código recebido<input inputMode="numeric" autoComplete="one-time-code" minLength={6} required value={otp} onChange={(event) => setOtp(event.target.value)} /></label><button className="secondary" disabled={busy || !email.trim()}>Confirmar código</button></form>{authMessage && <p role="status" className="success">{authMessage}</p>}{error && <p role="alert" className="error">{error}</p>}</section></main>;

  return <main className="shell"><header className="topbar"><div><p className="eyebrow">ESPAÇO DE TRABALHO</p><h1>Controle de Entregas</h1></div><div className="account"><span>{session.user.email}</span><button className="secondary compact" onClick={() => void supabase?.auth.signOut()}>Sair</button></div></header>
    {error && <p role="alert" className="error banner">{error}</p>}
    {memberships.length > 0 && <section className="workspace-select"><label>Organização<select value={organizationId} onChange={(event) => setOrganizationId(event.target.value)}>{memberships.map((membership) => <option key={membership.organization_id} value={membership.organization_id}>{membership.organizations?.name ?? "Organização"}</option>)}</select></label><span className="muted">Os dados são limitados à organização selecionada e também protegidos no banco.</span></section>}
    {memberships.length === 0 && <section className="panel"><h2>Crie seu espaço de trabalho</h2><p className="muted">A organização e sua associação são criadas pelo servidor autenticado.</p><form onSubmit={createWorkspace} className="inline-form"><label>Nome da organização<input required maxLength={100} value={workspaceName} onChange={(event) => setWorkspaceName(event.target.value)} /></label><button disabled={busy}>{busy ? "Criando…" : "Criar organização"}</button></form></section>}
    {organizationId && selectedMembership?.role === "owner" && <section className="panel"><h2>Equipe</h2><p className="muted">Convide alguém para esta organização pelo e-mail. A associação só é concluída quando essa pessoa entrar com o mesmo endereço.</p><form onSubmit={inviteMember} className="inline-form"><label>E-mail do membro<input type="email" autoComplete="email" required maxLength={320} value={inviteEmail} onChange={(event) => setInviteEmail(event.target.value)} /></label><button disabled={busy}>{busy ? "Enviando…" : "Registrar convite"}</button></form>{teamMessage && <p role="status" className="success">{teamMessage}</p>}</section>}
    {organizationId && <><section className="stats"><article className="stat"><span>Total</span><strong>{visibleDeliveries.length}</strong></article><article className="stat"><span>Pendentes</span><strong>{visibleDeliveries.filter((item) => item.status === "pending").length}</strong></article><article className="stat"><span>Em trânsito</span><strong>{visibleDeliveries.filter((item) => item.status === "in_transit").length}</strong></article><article className="stat"><span>Entregues</span><strong>{visibleDeliveries.filter((item) => item.status === "delivered").length}</strong></article></section>
    <section className="panel"><h2>Nova entrega</h2><form onSubmit={createDelivery} className="delivery-form"><label>Entrega<input required maxLength={160} value={title} onChange={(event) => setTitle(event.target.value)} /></label><label>Destinatário<input required maxLength={160} value={recipient} onChange={(event) => setRecipient(event.target.value)} /></label><label>Prazo<input type="date" value={dueDate} onChange={(event) => setDueDate(event.target.value)} /></label><button disabled={busy}>{busy ? "Salvando…" : "Adicionar entrega"}</button></form></section>
    <section className="panel"><div className="section-heading"><div><h2>Entregas</h2><p className="muted">Atualizações são autorizadas no banco pela associação à organização.</p></div><label>Filtrar<select value={filter} onChange={(event) => setFilter(event.target.value as typeof filter)}><option value="all">Todas</option>{Object.entries(deliveryStatusLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label></div>
    {visibleDeliveries.length === 0 ? <p className="empty">Nenhuma entrega neste filtro.</p> : <div className="delivery-list">{visibleDeliveries.map((delivery) => <article className="delivery" key={delivery.id}><div className="delivery-main"><h3>{delivery.title}</h3><p>{delivery.recipient}</p><small>{delivery.due_date ? `Prazo: ${new Date(delivery.due_date + "T12:00:00").toLocaleDateString("pt-BR")}` : "Sem prazo definido"}</small></div><label>Status<select aria-label={`Status de ${delivery.title}`} disabled={busy} value={delivery.status} onChange={(event) => void updateStatus(delivery, event.target.value as Delivery["status"])}>{Object.entries(deliveryStatusLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label></article>)}</div>}</section></>}
    <footer>Autenticação por código · Acesso por organização · RLS no banco</footer>
  </main>;
}
