import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

export interface AgentProfile {
  id: string;
  agentId: string;
  name: string;
  email: string;
  monthlyTarget: number;
  active: boolean;
}

const AGENT_PROFILE_FIELDS = 'id, agent_id, name, email, monthly_target';

const mapAgent = (d: any): AgentProfile => ({
  id: d.id,
  agentId: d.agent_id || d.id,
  name: d.name,
  email: d.email || '',
  monthlyTarget: Number(d.monthly_target) || 0,
  active: true,
});

export const useAgents = () =>
  useQuery({
    queryKey: ['agents'],
    queryFn: async () => {
      const loadProfiles = async (profileIds?: string[]) => {
        let query = supabase
          .from('profiles')
          .select(AGENT_PROFILE_FIELDS)
          .order('name', { ascending: true });

        if (profileIds?.length) {
          query = query.in('id', profileIds);
        }

        return query;
      };

      const { data: roleData, error: roleError } = await supabase
        .from('user_roles')
        .select('user_id')
        .eq('role', 'agent');

      if (!roleError && roleData?.length) {
        const agentProfileIds = [...new Set((roleData || []).map((role: any) => role.user_id).filter(Boolean))];

        if (agentProfileIds.length > 0) {
          const { data, error } = await loadProfiles(agentProfileIds);

          if (!error) {
            return (data || []).map(mapAgent);
          }

          console.error('Failed to load filtered agents from profiles:', error.message);
        }
      }

      if (roleError) {
        console.error('Failed to fetch agent roles:', roleError.message);
      }

      const { data, error } = await loadProfiles();

      if (error) throw error;
      return (data || []).map(mapAgent);
    },
  });
