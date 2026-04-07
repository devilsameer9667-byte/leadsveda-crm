import { useMemo, useState } from 'react';
import { useOrders } from '@/hooks/useOrders';
import { useLeads, useAssignLead } from '@/hooks/useLeads';
import { useAgents } from '@/hooks/useAgents';
import { LEAD_SOURCES, SOURCE_COLORS } from '@/data/mockData';
import SourceBadge from '@/components/SourceBadge';
import LanguageBadge from '@/components/LanguageBadge';
import { TrendingUp, Users, Package, Target, IndianRupee, Award, Inbox, UserPlus, Phone, Clock, BarChart3, Filter } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';

const ManagerDashboard = () => {
  const { data: orders = [], isLoading: ordersLoading } = useOrders();
  const { data: leads = [], isLoading: leadsLoading } = useLeads();
  const { data: agents = [], isLoading: agentsLoading } = useAgents();
  const assignLead = useAssignLead();
  const [assigningLeadId, setAssigningLeadId] = useState<string | null>(null);
  const [sourceFilter, setSourceFilter] = useState<string>('all');

  const filteredLeads = useMemo(
    () => sourceFilter === 'all' ? leads : leads.filter((l) => l.source.toLowerCase() === sourceFilter),
    [leads, sourceFilter]
  );

  const unassignedLeads = useMemo(
    () => filteredLeads.filter((l) => !l.assignedAgent),
    [filteredLeads]
  );

  const assignedLeads = useMemo(
    () => filteredLeads.filter((l) => l.assignedAgent),
    [filteredLeads]
  );

  const floorStats = useMemo(() => {
    const totalLeads = leads.length;
    const unassigned = leads.filter((l) => !l.assignedAgent).length;
    const assigned = totalLeads - unassigned;
    const totalConverted = leads.filter((l) => l.status === 'converted').length;
    const conversionRate = totalLeads > 0 ? ((totalConverted / totalLeads) * 100).toFixed(1) : '0';
    const totalRevenue = orders.filter((o) => o.status === 'delivered').reduce((sum, o) => sum + o.totalAmount, 0);
    return { totalLeads, unassigned, assigned, conversionRate, activeAgents: agents.filter((a) => a.active).length, totalOrders: orders.length, totalRevenue };
  }, [leads, agents, orders]);

  // Source analytics
  const sourceStats = useMemo(() => {
    return LEAD_SOURCES.map((src) => {
      const srcLeads = leads.filter((l) => l.source.toLowerCase() === src);
      const srcOrders = orders.filter((o) => {
        const lead = leads.find((l) => l.id === o.leadId);
        return lead && lead.source.toLowerCase() === src;
      });
      const delivered = srcOrders.filter((o) => o.status === 'delivered');
      const conversion = srcLeads.length > 0 ? ((srcOrders.length / srcLeads.length) * 100).toFixed(1) : '0';
      const revenue = delivered.reduce((s, o) => s + o.totalAmount, 0);
      return { source: src, leads: srcLeads.length, orders: srcOrders.length, conversion, revenue };
    });
  }, [leads, orders]);

  const orderStats = useMemo(() => {
    const confirmed = orders.filter((o) => o.status === 'confirmed').length;
    const dispatched = orders.filter((o) => o.status === 'dispatched').length;
    const delivered = orders.filter((o) => o.status === 'delivered').length;
    const rto = orders.filter((o) => o.status === 'rto').length;
    const cancelled = orders.filter((o) => o.status === 'cancelled').length;
    return { confirmed, dispatched, delivered, rto, cancelled, total: orders.length };
  }, [orders]);

  const agentTargets = useMemo(() => {
    return agents.map((agent) => {
      const deliveredOrders = orders.filter(
        (o) => (o.agentId === agent.id || o.agentId === agent.agentId) && o.status === 'delivered'
      );
      const deliveredAmount = deliveredOrders.reduce((sum, o) => sum + o.totalAmount, 0);
      const progress = agent.monthlyTarget > 0 ? Math.min(100, (deliveredAmount / agent.monthlyTarget) * 100) : 0;
      const agentLeads = leads.filter((l) => l.assignedAgent === agent.id || l.assignedAgent === agent.agentId);
      const converted = agentLeads.filter((l) => l.status === 'converted').length;
      const cancelled = agentLeads.filter((l) => l.status === 'cancelled').length;
      return { ...agent, deliveredCount: deliveredOrders.length, deliveredAmount, remaining: Math.max(0, agent.monthlyTarget - deliveredAmount), progress, totalLeads: agentLeads.length, converted, cancelled };
    }).sort((a, b) => b.deliveredAmount - a.deliveredAmount);
  }, [orders, agents, leads]);

  const topAgent = agentTargets.length > 0 ? agentTargets[0] : null;
  const fmt = (n: number) => `₹${n.toLocaleString('en-IN')}`;

  const formatTime = (iso: string) => {
    const mins = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
    if (mins < 60) return `${mins}m ago`;
    if (mins < 1440) return `${Math.floor(mins / 60)}h ago`;
    return `${Math.floor(mins / 1440)}d ago`;
  };

  const handleAssign = async (leadId: string, agentProfileId: string) => {
    try {
      await assignLead.mutateAsync({ leadId, agentProfileId });
      setAssigningLeadId(null);
      const agentName = agents.find((a) => a.id === agentProfileId)?.name || agentProfileId;
      toast.success(`Lead assigned to ${agentName}`);
    } catch (err) {
      console.error('Assignment failed:', err);
      toast.error('Failed to assign lead. Please try again.');
    }
  };

  if (ordersLoading || leadsLoading || agentsLoading) {
    return (
      <div className="flex-1 p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">Loading floor data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-8 overflow-y-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Floor Overview</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Real-time performance across <span className="font-semibold text-foreground">{floorStats.activeAgents}</span> active agents.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Leads', value: floorStats.totalLeads, icon: Users, color: 'text-primary' },
          { label: 'Unassigned', value: floorStats.unassigned, icon: UserPlus, color: 'text-amber-500' },
          { label: 'Total Orders', value: floorStats.totalOrders, icon: Package, color: 'text-primary' },
          { label: 'Conversion Rate', value: `${floorStats.conversionRate}%`, icon: TrendingUp, color: 'text-accent' },
        ].map((s) => (
          <div key={s.label} className="card-surface p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="label-text">{s.label}</p>
              <s.icon className={`w-4 h-4 ${s.color}`} />
            </div>
            <p className="mono-text text-2xl font-bold text-foreground">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Revenue + Top Agent */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
        <div className="card-surface p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="label-text">Total Revenue</p>
            <IndianRupee className="w-4 h-4 text-accent" />
          </div>
          <p className="mono-text text-2xl font-bold text-foreground">{fmt(floorStats.totalRevenue)}</p>
        </div>
        {topAgent && topAgent.deliveredAmount > 0 && (
          <div className="card-surface p-5 flex items-center gap-4 bg-primary/5 border border-primary/10">
            <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center">
              <Award className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-medium text-primary uppercase tracking-wider">Top Agent</p>
              <p className="text-base font-bold text-foreground mt-0.5">{topAgent.name}</p>
            </div>
            <div className="text-right">
              <p className="mono-text text-lg font-bold text-primary">{fmt(topAgent.deliveredAmount)}</p>
              <p className="text-xs text-muted-foreground">{topAgent.deliveredCount} delivered</p>
            </div>
          </div>
        )}
      </div>

      {/* Source Analytics */}
      <div className="card-surface p-5 mb-8">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="w-4 h-4 text-muted-foreground" />
          <h2 className="text-sm font-semibold text-foreground">Source Analytics</h2>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {sourceStats.map((s) => (
            <div key={s.source} className="bg-secondary rounded-lg p-4">
              <div className="mb-2">
                <SourceBadge source={s.source} size="md" />
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <p className="text-muted-foreground">Leads</p>
                  <p className="mono-text font-bold text-foreground">{s.leads}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Orders</p>
                  <p className="mono-text font-bold text-foreground">{s.orders}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Conv %</p>
                  <p className="mono-text font-bold text-primary">{s.conversion}%</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Revenue</p>
                  <p className="mono-text font-bold text-accent">{fmt(s.revenue)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Source Filter */}
      <div className="flex items-center gap-2 mb-4">
        <Filter className="w-4 h-4 text-muted-foreground" />
        <span className="text-xs font-medium text-muted-foreground">Filter:</span>
        <div className="flex gap-1">
          <button
            onClick={() => setSourceFilter('all')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
              sourceFilter === 'all' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground hover:text-foreground'
            }`}
          >
            All
          </button>
          {LEAD_SOURCES.map((src) => {
            const config = SOURCE_COLORS[src];
            return (
              <button
                key={src}
                onClick={() => setSourceFilter(src)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  sourceFilter === src ? `${config.bg} ${config.text}` : 'bg-secondary text-muted-foreground hover:text-foreground'
                }`}
              >
                {config.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Unassigned Leads */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <UserPlus className="w-4 h-4 text-amber-500" />
          <h2 className="text-sm font-semibold text-foreground">
            Unassigned Leads
            {unassignedLeads.length > 0 && (
              <span className="ml-2 px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 text-xs font-bold mono-text">
                {unassignedLeads.length}
              </span>
            )}
          </h2>
        </div>

        {unassignedLeads.length === 0 ? (
          <div className="card-surface p-10 text-center">
            <Inbox className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
            <p className="text-sm font-medium text-muted-foreground">All leads are assigned</p>
            <p className="text-xs text-muted-foreground/60 mt-1">New leads from external sources will appear here.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {unassignedLeads.map((lead) => (
              <div key={lead.id} className="card-surface p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-sm font-bold text-amber-700">
                    {lead.name.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-sm font-semibold text-foreground">{lead.name}</span>
                      <SourceBadge source={lead.source} />
                      <LanguageBadge language={lead.language} />
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Phone className="w-3 h-3" />
                        <span className="mono-text">{lead.phone}</span>
                      </span>
                      {lead.city && <span>{lead.city}</span>}
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatTime(lead.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="relative">
                  {assigningLeadId === lead.id ? (
                    <div className="flex items-center gap-2">
                      <select
                        className="input-field text-sm py-1.5 pr-8"
                        defaultValue=""
                        onChange={(e) => { if (e.target.value) handleAssign(lead.id, e.target.value); }}
                        autoFocus
                      >
                        <option value="" disabled>Select agent...</option>
                        {agents.filter((a) => a.active).map((a) => (
                          <option key={a.id} value={a.id}>{a.name}</option>
                        ))}
                      </select>
                      <button onClick={() => setAssigningLeadId(null)} className="text-xs text-muted-foreground hover:text-foreground px-2 py-1">Cancel</button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setAssigningLeadId(lead.id)}
                      className="flex items-center gap-1.5 bg-primary text-primary-foreground text-xs font-medium px-3 py-2 rounded-lg hover:opacity-90 active:scale-[0.98] transition-all"
                    >
                      <UserPlus className="w-3.5 h-3.5" />
                      Assign
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Assigned Leads */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Users className="w-4 h-4 text-primary" />
          <h2 className="text-sm font-semibold text-foreground">
            Assigned Leads
            <span className="ml-2 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-bold mono-text">
              {assignedLeads.length}
            </span>
          </h2>
        </div>

        {assignedLeads.length === 0 ? (
          <div className="card-surface p-10 text-center">
            <Inbox className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
            <p className="text-sm font-medium text-muted-foreground">No assigned leads</p>
          </div>
        ) : (
          <div className="card-surface overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="label-text text-left p-3">Name</th>
                  <th className="label-text text-left p-3">Phone</th>
                  <th className="label-text text-left p-3">Source</th>
                  <th className="label-text text-left p-3">Status</th>
                  <th className="label-text text-left p-3">Agent</th>
                  <th className="label-text text-left p-3">Time</th>
                </tr>
              </thead>
              <tbody>
                {assignedLeads.slice(0, 20).map((lead) => {
                  const agent = agents.find((a) => a.id === lead.assignedAgent || a.agentId === lead.assignedAgent);
                  return (
                    <tr key={lead.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                      <td className="p-3">
                        <span className="text-sm font-semibold text-foreground">{lead.name}</span>
                      </td>
                      <td className="p-3 mono-text text-sm text-muted-foreground">{lead.phone}</td>
                      <td className="p-3"><SourceBadge source={lead.source} /></td>
                      <td className="p-3">
                        <span className={`status-badge ${lead.status === 'new' ? 'bg-primary/10 text-primary' : lead.status === 'contacted' ? 'bg-amber-100 text-amber-700' : lead.status === 'converted' ? 'status-delivered' : 'status-cancelled'}`}>
                          {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
                        </span>
                      </td>
                      <td className="p-3 text-sm text-muted-foreground">{agent?.name || lead.assignedAgent}</td>
                      <td className="p-3 text-xs text-muted-foreground">{formatTime(lead.createdAt)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order Pipeline */}
      <div className="card-surface p-5 mb-8">
        <h2 className="text-sm font-semibold text-foreground mb-4">Order Pipeline</h2>
        {orderStats.total === 0 ? (
          <div className="text-center py-6">
            <Inbox className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">No orders yet</p>
          </div>
        ) : (
          <div className="flex gap-3">
            {[
              { label: 'Confirmed', count: orderStats.confirmed, cls: 'status-confirmed' },
              { label: 'Dispatched', count: orderStats.dispatched, cls: 'status-dispatched' },
              { label: 'Delivered', count: orderStats.delivered, cls: 'status-delivered' },
              { label: 'RTO', count: orderStats.rto, cls: 'status-rto' },
              { label: 'Cancelled', count: orderStats.cancelled, cls: 'status-cancelled' },
            ].map((s) => (
              <div key={s.label} className="flex-1 bg-secondary rounded-lg p-4 text-center">
                <p className="mono-text text-2xl font-bold text-foreground">{s.count}</p>
                <span className={`status-badge mt-1.5 ${s.cls}`}>{s.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Monthly Agent Targets */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Target className="w-4 h-4 text-muted-foreground" />
          <h2 className="text-sm font-semibold text-foreground">Monthly Agent Targets</h2>
        </div>
        {agentTargets.length === 0 ? (
          <div className="card-surface p-12 text-center">
            <Users className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">No agents found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {agentTargets.map((agent) => (
              <div key={agent.id} className="card-surface p-5">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm font-semibold text-foreground">{agent.name}</p>
                      <p className="text-xs text-muted-foreground mono-text mt-0.5">{agent.agentId}</p>
                  </div>
                  <span className={`status-badge ${agent.active ? 'status-delivered' : 'bg-muted text-muted-foreground'}`}>
                    {agent.active ? 'Active' : 'Offline'}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-x-4 gap-y-3 mb-4 text-sm">
                  <div>
                    <p className="label-text">Target</p>
                    <p className="mono-text font-bold text-foreground mt-0.5">{fmt(agent.monthlyTarget)}</p>
                  </div>
                  <div>
                    <p className="label-text">Delivered</p>
                    <p className="mono-text font-bold text-foreground mt-0.5">{agent.deliveredCount}</p>
                  </div>
                  <div>
                    <p className="label-text">Amount</p>
                    <p className="mono-text font-bold text-accent mt-0.5">{fmt(agent.deliveredAmount)}</p>
                  </div>
                  <div>
                    <p className="label-text">Remaining</p>
                    <p className="mono-text font-bold text-destructive mt-0.5">{fmt(agent.remaining)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Progress value={agent.progress} className="h-2.5 flex-1" />
                  <span className="mono-text text-xs font-bold text-foreground w-12 text-right">{agent.progress.toFixed(1)}%</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Agent Performance Table */}
      <div>
        <h2 className="text-sm font-semibold text-foreground mb-4">Agent Performance</h2>
        <div className="card-surface overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="label-text text-left p-4">Agent</th>
                <th className="label-text text-left p-4">Status</th>
                <th className="label-text text-right p-4">Leads</th>
                <th className="label-text text-right p-4">Converted</th>
                <th className="label-text text-right p-4">Cancelled</th>
                <th className="label-text text-right p-4">Conv %</th>
              </tr>
            </thead>
            <tbody>
              {agentTargets.map((agent) => {
                const rate = agent.totalLeads > 0 ? ((agent.converted / agent.totalLeads) * 100).toFixed(1) : '0';
                return (
                  <tr key={agent.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                    <td className="p-4">
                      <span className="text-sm font-semibold text-foreground">{agent.name}</span>
                      <span className="text-xs text-muted-foreground ml-2 mono-text">{agent.agentId}</span>
                    </td>
                    <td className="p-4">
                      <span className={`status-badge ${agent.active ? 'status-delivered' : 'bg-muted text-muted-foreground'}`}>
                        {agent.active ? 'Active' : 'Offline'}
                      </span>
                    </td>
                    <td className="p-4 mono-text text-sm text-foreground text-right">{agent.totalLeads}</td>
                    <td className="p-4 mono-text text-sm text-foreground text-right">{agent.converted}</td>
                    <td className="p-4 mono-text text-sm text-foreground text-right">{agent.cancelled}</td>
                    <td className="p-4 mono-text text-sm font-bold text-primary text-right">{rate}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;
