import { useMemo, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useOrders, useUpdateOrderStatus } from '@/hooks/useOrders';
import StatusBadge from '@/components/StatusBadge';
import { Search, X, Clock, MapPin, Package } from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

const STATUSES = ['confirmed', 'dispatched', 'delivered', 'rto', 'cancelled'];

const OrdersPage = () => {
  const { user } = useAuth();
  const { data: orders = [], isLoading } = useOrders();
  const updateStatus = useUpdateOrderStatus();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  const filtered = useMemo(() => {
    let list = user?.role === 'agent'
      ? orders.filter((o) => o.agentId === user.id || o.agentId === user.agentId)
      : orders;
    if (statusFilter !== 'all') list = list.filter((o) => o.status === statusFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((o) =>
        o.orderCode.toLowerCase().includes(q) ||
        o.id.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        o.customerPhone.includes(q) ||
        o.product.toLowerCase().includes(q)
      );
    }
    return list;
  }, [orders, user, search, statusFilter]);

  const statuses = ['all', ...STATUSES];
  const formatDate = (iso: string) => new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  const formatDateTime = (iso: string) => new Date(iso).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await updateStatus.mutateAsync({ orderId, status: newStatus, updatedBy: user?.id || '' });
      toast.success(`Order status updated to ${newStatus}`);
    } catch (err: any) {
      toast.error(`Failed to update status: ${err?.message || 'Unknown error'}`);
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 p-6 flex items-center justify-center">
        <p className="text-sm text-muted-foreground">Loading orders...</p>
      </div>
    );
  }

  return (
    <div className="flex-1 p-6 overflow-y-auto">
      <h1 className="text-2xl font-semibold tracking-tight text-foreground mb-6">Orders</h1>

      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            className="input-field w-full pl-9"
            placeholder="Search order code, customer, phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            maxLength={100}
          />
        </div>
        <div className="flex gap-1">
          {statuses.map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                statusFilter === s
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-muted-foreground hover:text-foreground'
              }`}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="card-surface overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="label-text text-left p-3">Order Code</th>
              <th className="label-text text-left p-3">Customer</th>
              <th className="label-text text-left p-3">Phone</th>
              <th className="label-text text-left p-3">Product</th>
              <th className="label-text text-left p-3">Amount</th>
              <th className="label-text text-left p-3">Status</th>
              <th className="label-text text-left p-3">Date</th>
              <th className="label-text text-left p-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((order) => (
              <tr
                key={order.id}
                className="border-b border-border/50 hover:bg-muted/30 transition-colors cursor-pointer"
                onClick={() => setSelectedOrder(order)}
              >
                <td className="p-3 mono-text text-sm font-medium text-primary">{order.orderCode}</td>
                <td className="p-3 text-sm font-medium text-foreground">{order.customerName}</td>
                <td className="p-3 mono-text text-sm text-muted-foreground">{order.customerPhone}</td>
                <td className="p-3 text-sm text-foreground">{order.product}</td>
                <td className="p-3 mono-text text-sm text-foreground">₹{order.totalAmount.toLocaleString()}</td>
                <td className="p-3"><StatusBadge status={order.status} /></td>
                <td className="p-3 text-sm text-muted-foreground">{formatDate(order.createdAt)}</td>
                <td className="p-3" onClick={(e) => e.stopPropagation()}>
                  <select
                    className="input-field text-xs py-1"
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
            {!filtered.length && (
              <tr><td colSpan={8} className="p-8 text-center text-sm text-muted-foreground">No orders found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Order Detail Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/20 backdrop-blur-sm p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedOrder(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.98, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: 8 }}
              className="bg-card rounded-xl w-full max-w-lg max-h-[80vh] overflow-y-auto p-6"
              style={{ boxShadow: 'var(--shadow-overlay)' }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="mono-text text-lg font-semibold text-primary">{selectedOrder.orderCode}</p>
                  <p className="text-xs text-muted-foreground">ID: {selectedOrder.id}</p>
                </div>
                <button onClick={() => setSelectedOrder(null)} className="text-muted-foreground hover:text-foreground">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Customer */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-secondary rounded-lg">
                    <p className="label-text mb-1">Customer</p>
                    <p className="text-sm font-semibold text-foreground">{selectedOrder.customerName}</p>
                  </div>
                  <div className="p-3 bg-secondary rounded-lg">
                    <p className="label-text mb-1">Phone</p>
                    <p className="mono-text text-sm font-semibold text-foreground">{selectedOrder.customerPhone}</p>
                  </div>
                </div>

                {/* Products */}
                <div className="p-3 bg-secondary rounded-lg">
                  <p className="label-text mb-2 flex items-center gap-1"><Package className="w-3 h-3" /> Products</p>
                  {selectedOrder.products.length > 0 ? (
                    <div className="space-y-1">
                      {selectedOrder.products.map((p: any, i: number) => (
                        <div key={i} className="flex justify-between text-sm">
                          <span className="text-foreground">{p.name} ({p.combo})</span>
                          <span className="mono-text text-foreground">₹{p.price?.toLocaleString()}</span>
                        </div>
                      ))}
                      <div className="border-t border-border pt-1 flex justify-between text-sm font-bold">
                        <span>Total</span>
                        <span className="mono-text text-primary">₹{selectedOrder.totalAmount.toLocaleString()}</span>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">{selectedOrder.product} — ₹{selectedOrder.totalAmount.toLocaleString()}</p>
                  )}
                </div>

                {/* Address */}
                {selectedOrder.address && (selectedOrder.address.full_address || selectedOrder.address.area) && (
                  <div className="p-3 bg-secondary rounded-lg">
                    <p className="label-text mb-1 flex items-center gap-1"><MapPin className="w-3 h-3" /> Address</p>
                    {selectedOrder.address.full_address && (
                      <p className="text-sm text-foreground mb-1">{selectedOrder.address.full_address}</p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      {[selectedOrder.address.area, selectedOrder.address.district, selectedOrder.address.city, selectedOrder.address.state].filter(Boolean).join(', ')}
                      {selectedOrder.address.pincode && <span className="mono-text ml-1">— {selectedOrder.address.pincode}</span>}
                    </p>
                  </div>
                )}

                {/* Timeline */}
                {selectedOrder.timeline.length > 0 && (
                  <div>
                    <p className="label-text mb-2 flex items-center gap-1"><Clock className="w-3 h-3" /> Timeline</p>
                    <div className="space-y-2">
                      {selectedOrder.timeline.map((step: any, i: number) => (
                        <div key={i} className="flex items-center gap-2 text-sm">
                          <div className="w-2 h-2 rounded-full bg-accent" />
                          <span className="font-medium text-foreground">{step.status?.charAt(0).toUpperCase() + step.status?.slice(1)}</span>
                          <span className="text-xs text-muted-foreground">{formatDateTime(step.timestamp)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Last Updated */}
                <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2 border-t border-border">
                  <Clock className="w-3 h-3" />
                  <span>Last updated: {formatDateTime(selectedOrder.updatedAt)}</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default OrdersPage;
