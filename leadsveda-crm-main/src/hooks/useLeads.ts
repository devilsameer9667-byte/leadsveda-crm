import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Lead } from '@/data/mockData';
import { useEffect } from 'react';

interface DbLead {
  id: string;
  name: string;
  phone: string;
  email: string;
  city: string;
  source: string;
  assigned_to?: string | null;
  assigned_agent?: string | null;
  status: string;
  created_at: string;
  notes?: string | null;
  language?: string | null;
}

interface UseLeadsOptions {
  assignedTo?: string;
  legacyAssignedTo?: string;
  enabled?: boolean;
}

const normalizeLeadStatus = (status?: string): Lead['status'] => {
  const normalized = (status || '').trim().toLowerCase();
  if (normalized === 'contacted' || normalized === 'converted' || normalized === 'cancelled') {
    return normalized;
  }
  return 'new';
};

const mapLead = (d: DbLead): Lead & { language?: string } => ({
  id: d.id,
  name: d.name,
  phone: d.phone,
  email: d.email,
  city: d.city,
  source: (d.source || '').trim().toLowerCase(),
  assignedAgent: d.assigned_to || d.assigned_agent || '',
  status: normalizeLeadStatus(d.status),
  createdAt: d.created_at,
  notes: d.notes || '',
  language: d.language || 'tamil',
});

const fetchLeads = async ({ assignedTo, legacyAssignedTo }: UseLeadsOptions) => {
  const buildQuery = (column?: 'assigned_to' | 'assigned_agent', value?: string) => {
    let query = supabase.from('leads').select('*').order('created_at', { ascending: false });
    if (column && value) {
      query = query.eq(column, value);
    }
    return query;
  };

  if (!assignedTo) {
    const { data, error } = await buildQuery();
    if (error) throw error;
    return (data as DbLead[]).map(mapLead);
  }

  const attempts: Array<{ column: 'assigned_to' | 'assigned_agent'; value: string }> = [
    { column: 'assigned_to', value: assignedTo },
    { column: 'assigned_agent', value: assignedTo },
  ];

  if (legacyAssignedTo && legacyAssignedTo !== assignedTo) {
    attempts.push({ column: 'assigned_agent', value: legacyAssignedTo });
  }

  let lastError: Error | null = null;

  for (let index = 0; index < attempts.length; index += 1) {
    const attempt = attempts[index];
    const { data, error } = await buildQuery(attempt.column, attempt.value);

    if (error) {
      lastError = error;
      if (error.message.toLowerCase().includes(attempt.column)) continue;
      throw error;
    }

    if ((data || []).length > 0 || index === attempts.length - 1) {
      return (data as DbLead[]).map(mapLead);
    }
  }

  if (lastError) throw lastError;
  return [];
};

export const useLeads = (options: UseLeadsOptions = {}) => {
  const qc = useQueryClient();

  useEffect(() => {
    const channel = supabase
      .channel('leads-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'leads' }, () => {
        qc.invalidateQueries({ queryKey: ['leads'] });
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [qc]);

  return useQuery({
    queryKey: ['leads', options.assignedTo ?? 'all'],
    enabled: options.enabled ?? true,
    queryFn: () => fetchLeads(options),
  });
};

export const useUpdateLeadStatus = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: Lead['status'] }) => {
      const { error } = await supabase.from('leads').update({ status }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['leads'] }),
  });
};

export const useAssignLead = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ leadId, agentProfileId }: { leadId: string; agentProfileId: string }) => {
      const primaryUpdate = await supabase
        .from('leads')
        .update({ assigned_to: agentProfileId })
        .eq('id', leadId);

      if (!primaryUpdate.error) return;
      if (!primaryUpdate.error.message.toLowerCase().includes('assigned_to')) throw primaryUpdate.error;

      const fallbackUpdate = await supabase
        .from('leads')
        .update({ assigned_agent: agentProfileId })
        .eq('id', leadId);

      if (fallbackUpdate.error) throw fallbackUpdate.error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['leads'] }),
  });
};
