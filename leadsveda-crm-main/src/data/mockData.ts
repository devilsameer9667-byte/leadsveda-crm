export interface Lead {
  id: string;
  name: string;
  phone: string;
  email: string;
  city: string;
  source: string;
  assignedAgent: string;
  status: 'new' | 'contacted' | 'converted' | 'cancelled';
  createdAt: string;
  notes: string;
  language?: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  combo: string;
  description: string;
}

export interface Order {
  id: string;
  leadId: string;
  customerName: string;
  customerPhone: string;
  products: Product[];
  totalAmount: number;
  address: {
    area: string;
    postOffice: string;
    pincode: string;
    state: string;
    city: string;
    district?: string;
  };
  status: 'confirmed' | 'dispatched' | 'delivered' | 'rto' | 'cancelled';
  agentId: string;
  agentName: string;
  createdAt: string;
  updatedAt: string;
  timeline: { status: string; timestamp: string }[];
}

export interface Agent {
  id: string;
  name: string;
  email: string;
  totalLeads: number;
  converted: number;
  cancelled: number;
  active: boolean;
  monthlyTarget: number;
}

export const PRODUCTS: Product[] = [
  { id: 'FP-1499', name: 'FeroxPlus Capsules', price: 1499, combo: 'Premium', description: 'FeroxPlus Capsules — Premium Pack' },
  { id: 'FP-999', name: 'FeroxPlus Capsules', price: 999, combo: 'Standard', description: 'FeroxPlus Capsules — Standard Pack' },
  { id: 'MFX-1499', name: 'ManForceX', price: 1499, combo: 'Premium', description: 'ManForceX — Premium Pack' },
  { id: 'MFX-999', name: 'ManForceX', price: 999, combo: 'Standard', description: 'ManForceX — Standard Pack' },
  { id: 'FFB-1499', name: 'Ferox Femme+ BCream', price: 1499, combo: 'Premium', description: 'Ferox Femme+ BCream — Premium Pack' },
  { id: 'FFB-999', name: 'Ferox Femme+ BCream', price: 999, combo: 'Standard', description: 'Ferox Femme+ BCream — Standard Pack' },
];

export const LEAD_SOURCES = ['meta', 'google', 'taboola', 'whatsapp', 'trafficstars', 'exoclick'] as const;
export type LeadSource = typeof LEAD_SOURCES[number];

export const SOURCE_COLORS: Record<string, { bg: string; text: string; label: string }> = {
  meta: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Meta' },
  google: { bg: 'bg-sky-100', text: 'text-sky-700', label: 'Google' },
  taboola: { bg: 'bg-emerald-100', text: 'text-emerald-700', label: 'Taboola' },
  whatsapp: { bg: 'bg-green-100', text: 'text-green-700', label: 'WhatsApp' },
  trafficstars: { bg: 'bg-red-100', text: 'text-red-700', label: 'TrafficStars' },
  exoclick: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Exoclick' },
  landing_page: { bg: 'bg-purple-100', text: 'text-purple-700', label: 'Landing Page' },
};

// Mock data kept for reference only — live data comes from Supabase
export const MOCK_LEADS: Lead[] = [];
export const MOCK_ORDERS: Order[] = [];
export const MOCK_AGENTS: Agent[] = [];
