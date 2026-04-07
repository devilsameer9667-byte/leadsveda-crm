import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useEffect } from 'react';
import { Product } from '@/data/mockData';

export interface DbOrder {
  id: string;
  order_code?: string;
  lead_id: string;
  customer_name: string;
  customer_phone: string;
  products: any;
  total_amount: number;
  address: any;
  status: string;
  agent_id: string;
  agent_name: string;
  created_at: string;
  updated_at: string;
  timeline: any;
}

const normalizeOrderStatus = (status: string): string => {
  const s = (status || '').trim().toLowerCase();
  if (['confirmed', 'dispatched', 'delivered', 'rto', 'cancelled'].includes(s)) return s;
  return 'confirmed';
};

export const mapDbOrder = (d: DbOrder) => ({
  id: d.id,
  orderCode: d.order_code || d.id,
  leadId: d.lead_id,
  customerName: d.customer_name || '',
  customerPhone: d.customer_phone || '',
  products: Array.isArray(d.products) ? d.products : [],
  product: Array.isArray(d.products)
    ? d.products.map((p: any) => p.name).join(', ')
    : (typeof d.products === 'string' ? d.products : ''),
  totalAmount: Number(d.total_amount) || 0,
  address: d.address || {},
  status: normalizeOrderStatus(d.status),
  agentId: d.agent_id,
  agentName: d.agent_name || '',
  createdAt: d.created_at,
  updatedAt: d.updated_at || d.created_at,
  timeline: Array.isArray(d.timeline) ? d.timeline : [],
});

export const useOrders = () => {
  const qc = useQueryClient();

  useEffect(() => {
    const channel = supabase
      .channel('orders-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => {
        qc.invalidateQueries({ queryKey: ['orders'] });
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [qc]);

  return useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return (data as DbOrder[]).map(mapDbOrder);
    },
  });
};

export interface CreateOrderInput {
  lead_id: string;
  customer_name: string;
  customer_phone: string;
  products: Product[];
  total_amount: number;
  address: {
    full_address?: string;
    area: string;
    pincode: string;
    state: string;
    city: string;
    district?: string;
  };
  status: string;
  agent_id: string;
  agent_name: string;
}

export const useCreateOrder = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: CreateOrderInput) => {
      // Generate order_code (NOT the id — let Supabase auto-generate UUID id)
      const orderCode = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;
      const now = new Date().toISOString();

      const insertPayload: Record<string, any> = {
        order_code: orderCode,
        lead_id: input.lead_id,
        customer_name: input.customer_name,
        customer_phone: input.customer_phone,
        products: input.products,
        total_amount: input.total_amount,
        address: input.address,
        status: input.status || 'confirmed',
        agent_id: input.agent_id,
        agent_name: input.agent_name,
        timeline: [{ status: 'confirmed', timestamp: now }],
        updated_at: now,
      };

      console.log('Creating order with payload:', JSON.stringify(insertPayload));

      const { data, error } = await supabase
        .from('orders')
        .insert(insertPayload)
        .select()
        .single();

      if (error) {
        console.error('Supabase order insert error:', JSON.stringify(error));
        throw error;
      }
      console.log('Order created successfully:', data);
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['orders'] });
      qc.invalidateQueries({ queryKey: ['leads'] });
    },
  });
};

export const useUpdateOrderStatus = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ orderId, status, updatedBy }: { orderId: string; status: string; updatedBy: string }) => {
      const { data: current, error: fetchErr } = await supabase
        .from('orders')
        .select('timeline')
        .eq('id', orderId)
        .single();
      if (fetchErr) throw fetchErr;

      const timeline = Array.isArray(current?.timeline) ? [...current.timeline] : [];
      timeline.push({ status, timestamp: new Date().toISOString(), updated_by: updatedBy });

      const { error } = await supabase
        .from('orders')
        .update({ status, updated_at: new Date().toISOString(), timeline })
        .eq('id', orderId);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['orders'] });
    },
  });
};
