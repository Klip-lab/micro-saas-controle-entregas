import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim();
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim();

export const supabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = supabaseConfigured
  ? createClient(supabaseUrl!, supabaseAnonKey!, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null;

export type Delivery = {
  id: string;
  organization_id: string;
  created_by: string;
  title: string;
  recipient: string;
  status: "pending" | "in_transit" | "delivered" | "delayed";
  due_date: string | null;
  created_at: string;
};

export const deliveryStatusLabels: Record<Delivery["status"], string> = {
  pending: "Pendente",
  in_transit: "Em trânsito",
  delivered: "Entregue",
  delayed: "Atrasada",
};
