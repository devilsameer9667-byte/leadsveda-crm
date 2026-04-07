import { useState, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLeads } from '@/hooks/useLeads';
import { useOrders } from '@/hooks/useOrders';
import { Phone, Clock, TrendingUp, Users, Package, Inbox } from 'lucide-react';
import StatusBadge from '@/components/StatusBadge';
import SourceBadge from '@/components/SourceBadge';
import LanguageBadge from '@/components/LanguageBadge';
import LeadPopup from '@/components/LeadPopup';
import { Lead } from '@/data/mockData';

const AgentDashboard = () => {
  const { user } = useAuth();
  const { data: leads = [], isLoading: leadsLoading } = useLeads({
    assignedTo: user?.id,
    legacyAssignedTo: user?.agentId,
    enabled: !!user?.id,
  });
  const { data: orders = [], isLoading: ordersLoading } = useOrders();
  const [activeLead, setActiveLead] = useState<(Lead & { language?: string }) | null>(null);

  const myLeads = useMemo(
    () => leads.filter((lead) => lead.assignedAgent === user?.id || lead.assignedAgent === user?.agentId),
    [leads, user?.agentId, user?.id]
  );

  const myOrders = useMemo(
    () => orders.filter((order) => order.agentId === user?.id || order.agentId === user?.agentId),
    [orders, user?.agentId, user?.id]
  );

  const stats = useMemo(() => ({
    total: myLeads.length,
    newLeads: myLeads.filter((l) => l.status === 'new').length,
    converted: myLeads.filter((l) => l.status === 'converted').length,
    todayOrders: myOrders.length,
  }), [myLeads, myOrders]);

  const formatTime = (iso: string) => {
    const mins = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
    if (mins < 60) return `${mins}m ago`;
    if (mins < 1440) return `${Math.floor(mins / 60)}h ago`;
    return `${Math.floor(mins / 1440)}d ago`;
  };

  if (leadsLoading || ordersLoading) {
    return (
      <div className="flex-1 p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-8 overflow-y-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Welcome back, {user?.name}. You have <span className="font-semibold text-primary">{stats.newLeads} pending</span> leads.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Leads', value: stats.total, icon: Users, color: 'text-primary' },
          { label: 'New Leads', value: stats.newLeads, icon: Inbox, color: 'text-amber-500' },
          { label: 'Converted', value: stats.converted, icon: TrendingUp, color: 'text-accent' },
          { label: 'Orders', value: stats.todayOrders, icon: Package, color: 'text-primary' },
        ].map((s) => (
          <div key={s.label} className="card-surface p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="label-text">{s.label}</p>
              <s.icon className={`w-4 h-4 ${s.color}`} />
            </div>
            <p className="mono-text text-3xl font-bold text-foreground">{s.value}</p>
          </div>
        ))}
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-foreground">Lead Queue</h2>
          <span className="text-xs text-muted-foreground mono-text">{myLeads.length} total</span>
        </div>

        {myLeads.length === 0 ? (
          <div className="card-surface p-12 text-center">
            <Inbox className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-sm font-medium text-muted-foreground">No leads assigned yet</p>
            <p className="text-xs text-muted-foreground/60 mt-1">New leads will appear here when assigned by your manager.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {myLeads.map((lead) => (
              <div
                key={lead.id}
                onClick={() => setActiveLead(lead)}
                className="card-surface-hover p-4 flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                    {lead.name.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-sm font-semibold text-foreground">{lead.name}</span>
                      <StatusBadge status={lead.status} />
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Phone className="w-3 h-3" />
                        <span className="mono-text">{lead.phone}</span>
                      </span>
                      {lead.city && <span>{lead.city}</span>}
                      <SourceBadge source={lead.source} />
                      <LanguageBadge language={lead.language} />
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  <span className="mono-text">{formatTime(lead.createdAt)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {activeLead && <LeadPopup lead={activeLead} onClose={() => setActiveLead(null)} />}
    </div>
  );
};

export default AgentDashboard;
