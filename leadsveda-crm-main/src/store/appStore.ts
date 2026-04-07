import { create } from 'zustand';
import { Lead, Order, MOCK_LEADS, MOCK_ORDERS } from '@/data/mockData';

interface AppState {
  leads: Lead[];
  orders: Order[];
  addOrder: (order: Order) => void;
  updateLeadStatus: (leadId: string, status: Lead['status']) => void;
}

export const useAppStore = create<AppState>((set) => ({
  leads: MOCK_LEADS,
  orders: MOCK_ORDERS,

  addOrder: (order) =>
    set((state) => ({ orders: [order, ...state.orders] })),

  updateLeadStatus: (leadId, status) =>
    set((state) => ({
      leads: state.leads.map((l) => (l.id === leadId ? { ...l, status } : l)),
    })),
}));
