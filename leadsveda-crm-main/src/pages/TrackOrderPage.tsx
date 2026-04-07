import { useState } from 'react';
import { useOrders } from '@/hooks/useOrders';
import StatusBadge from '@/components/StatusBadge';
import { Search, CheckCircle2, Circle, Clock, MapPin } from 'lucide-react';

const STEPS = ['confirmed', 'dispatched', 'delivered'];

const TrackOrderPage = () => {
  const { data: orders = [] } = useOrders();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<(typeof orders)>([]);
  const [searched, setSearched] = useState(false);

  const handleSearch = () => {
    const q = query.trim().toLowerCase();
    if (!q) return;
    const found = orders.filter(
      (o) => o.orderCode.toLowerCase().includes(q) || o.id.toLowerCase().includes(q) || o.customerPhone.includes(q)
    );
    setResults(found);
    setSearched(true);
  };

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

  return (
    <div className="flex-1 p-6 overflow-y-auto">
      <h1 className="text-2xl font-semibold tracking-tight text-foreground mb-6">Track Order</h1>

      <div className="flex gap-2 mb-6 max-w-md">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            className="input-field w-full pl-9 mono-text"
            placeholder="Enter Order Code or Phone"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            maxLength={50}
          />
        </div>
        <button onClick={handleSearch} className="bg-primary text-primary-foreground font-medium px-4 py-2 rounded-lg hover:opacity-90 active:scale-[0.98] transition-all">
          Search
        </button>
      </div>

      {searched && results.length === 0 && (
        <div className="card-surface p-8 text-center max-w-md">
          <p className="text-sm text-muted-foreground">No order found matching that code or phone.</p>
        </div>
      )}

      {results.map((result) => {
        const address = result.address || {};
        return (
          <div key={result.id} className="card-surface max-w-2xl p-6 mb-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="mono-text text-lg font-semibold text-primary">{result.orderCode}</p>
                <p className="text-sm text-muted-foreground">{result.product}</p>
              </div>
              <StatusBadge status={result.status} />
            </div>

            {/* Customer Details */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="p-3 bg-secondary rounded-lg">
                <p className="label-text mb-1">Customer Name</p>
                <p className="text-sm font-semibold text-foreground">{result.customerName}</p>
              </div>
              <div className="p-3 bg-secondary rounded-lg">
                <p className="label-text mb-1">Phone</p>
                <p className="mono-text text-sm font-semibold text-foreground">{result.customerPhone}</p>
              </div>
            </div>

            {/* Product & Amount */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="p-3 bg-secondary rounded-lg">
                <p className="label-text mb-1">Product</p>
                <p className="text-sm font-semibold text-foreground">{result.product}</p>
              </div>
              <div className="p-3 bg-secondary rounded-lg">
                <p className="label-text mb-1">Amount</p>
                <p className="mono-text text-lg font-semibold text-foreground">₹{result.totalAmount.toLocaleString()}</p>
              </div>
            </div>

            {/* Address */}
            {(address.full_address || address.area || address.city) && (
              <div className="p-3 bg-secondary rounded-lg mb-4">
                <p className="label-text mb-1 flex items-center gap-1"><MapPin className="w-3 h-3" /> Delivery Address</p>
                {address.full_address && (
                  <p className="text-sm text-foreground mb-1">{address.full_address}</p>
                )}
                <p className="text-xs text-muted-foreground">
                  {[address.area, address.district, address.city, address.state].filter(Boolean).join(', ')}
                  {address.pincode && <span className="mono-text ml-1">— {address.pincode}</span>}
                </p>
              </div>
            )}

            {/* Last Updated */}
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
              <Clock className="w-3 h-3" />
              <span>Last updated: {formatDate(result.updatedAt)}</span>
            </div>

            {/* Timeline */}
            <p className="label-text mb-3">Order Timeline</p>
            {result.timeline.length > 0 ? (
              <div className="space-y-0">
                {result.timeline.map((step: any, i: number) => (
                  <div key={i} className="flex items-start gap-3 pb-4 last:pb-0">
                    <div className="flex flex-col items-center">
                      <CheckCircle2 className="w-5 h-5 text-accent" />
                      {i < result.timeline.length - 1 && (
                        <div className="w-0.5 h-6 mt-1 bg-accent" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {step.status.charAt(0).toUpperCase() + step.status.slice(1)}
                      </p>
                      <p className="text-xs text-muted-foreground">{formatDate(step.timestamp)}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-0">
                {STEPS.map((step, i) => {
                  const currentIdx = STEPS.indexOf(result.status);
                  const done = i <= currentIdx;
                  return (
                    <div key={step} className="flex items-start gap-3 pb-4 last:pb-0">
                      <div className="flex flex-col items-center">
                        {done ? (
                          <CheckCircle2 className="w-5 h-5 text-accent" />
                        ) : (
                          <Circle className="w-5 h-5 text-muted-foreground/30" />
                        )}
                        {i < STEPS.length - 1 && (
                          <div className={`w-0.5 h-6 mt-1 ${done ? 'bg-accent' : 'bg-muted'}`} />
                        )}
                      </div>
                      <p className={`text-sm font-medium ${done ? 'text-foreground' : 'text-muted-foreground/50'}`}>
                        {step.charAt(0).toUpperCase() + step.slice(1)}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default TrackOrderPage;
