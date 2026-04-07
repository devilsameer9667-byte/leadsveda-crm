import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Phone, Mail, MapPin, Clock, ShoppingCart, Search } from 'lucide-react';
import { Lead, Product, PRODUCTS } from '@/data/mockData';
import { searchLocations, lookupByPincode, PincodeEntry } from '@/data/indiaPincodes';
import { useAuth } from '@/contexts/AuthContext';
import { useCreateOrder, CreateOrderInput } from '@/hooks/useOrders';
import { useUpdateLeadStatus } from '@/hooks/useLeads';
import StatusBadge from './StatusBadge';
import SourceBadge from './SourceBadge';
import LanguageBadge from './LanguageBadge';
import { toast } from 'sonner';

interface LeadPopupProps {
  lead: Lead & { language?: string };
  onClose: () => void;
}

const modalTransition = {
  initial: { opacity: 0, scale: 0.98, y: 8 },
  animate: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.98, y: 8 },
  transition: { duration: 0.2, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] },
};

const LeadPopup = ({ lead, onClose }: LeadPopupProps) => {
  const { user } = useAuth();
  const createOrder = useCreateOrder();
  const updateLeadStatus = useUpdateLeadStatus();

  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const [addressQuery, setAddressQuery] = useState('');
  const [fullAddress, setFullAddress] = useState('');
  const [area, setArea] = useState('');
  const [pincode, setPincode] = useState('');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [district, setDistrict] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [orderCode, setOrderCode] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [pincodeNotFound, setPincodeNotFound] = useState(false);

  const elapsed = useMemo(() => {
    const mins = Math.floor((Date.now() - new Date(lead.createdAt).getTime()) / 60000);
    if (mins < 60) return `${mins}m`;
    return `${Math.floor(mins / 60)}h ${mins % 60}m`;
  }, [lead.createdAt]);

  const suggestions = useMemo(() => {
    if (!addressQuery || addressQuery.length < 2) return [];
    return searchLocations(addressQuery, 8);
  }, [addressQuery]);

  const handleSelectLocation = (entry: PincodeEntry) => {
    setArea(entry.area);
    setPincode(entry.pincode);
    setState(entry.state);
    setCity(entry.city);
    setDistrict(entry.district);
    setAddressQuery(entry.area);
    setShowSuggestions(false);
    setPincodeNotFound(false);
  };

  const handlePincodeChange = (value: string) => {
    setPincode(value);
    setPincodeNotFound(false);
    if (value.length === 6) {
      const results = lookupByPincode(value);
      if (results.length > 0) {
        const first = results[0];
        setArea(first.area);
        setState(first.state);
        setCity(first.city);
        setDistrict(first.district);
        setAddressQuery(first.area);
      } else {
        setPincodeNotFound(true);
      }
    }
  };

  const toggleProduct = (product: Product) => {
    setSelectedProducts((prev) =>
      prev.find((p) => p.id === product.id)
        ? prev.filter((p) => p.id !== product.id)
        : [...prev, product]
    );
  };

  const total = selectedProducts.reduce((s, p) => s + p.price, 0);

  const handleConfirmOrder = async () => {
    if (!selectedProducts.length || !fullAddress.trim() || submitting) return;

    // Validate phone
    if (!lead.phone || lead.phone.length < 10) {
      toast.error('Invalid phone number on this lead');
      return;
    }

    setSubmitting(true);

    const orderInput: CreateOrderInput = {
      lead_id: lead.id,
      customer_name: lead.name,
      customer_phone: lead.phone,
      products: selectedProducts,
      total_amount: total,
      address: {
        full_address: fullAddress,
        area,
        pincode,
        state,
        city,
        district,
      },
      status: 'confirmed',
      agent_id: user?.id || '',
      agent_name: user?.name || '',
    };

    try {
      const created = await createOrder.mutateAsync(orderInput);
      await updateLeadStatus.mutateAsync({ id: lead.id, status: 'converted' });
      setOrderCode(created?.order_code || created?.id || 'Created');
      setShowSuccess(true);
      toast.success('Order confirmed successfully!');
    } catch (err: any) {
      console.error('Order creation failed:', err);
      toast.error(`Failed to create order: ${err?.message || 'Unknown error'}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/20 backdrop-blur-sm p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          {...modalTransition}
          className="bg-card rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          style={{ boxShadow: 'var(--shadow-overlay)' }}
          onClick={(e) => e.stopPropagation()}
        >
          {showSuccess ? (
            <div className="p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                <ShoppingCart className="w-8 h-8 text-accent" />
              </div>
              <h2 className="text-xl font-semibold text-foreground mb-2">Order Confirmed</h2>
              <p className="mono-text text-lg font-medium text-primary mb-1">{orderCode}</p>
              <p className="text-sm text-muted-foreground mb-2">
                {lead.name} • {lead.phone}
              </p>
              <p className="text-sm text-muted-foreground mb-6">
                ₹{total.toLocaleString()} • {selectedProducts.length} item(s)
              </p>
              <button onClick={onClose} className="bg-primary text-primary-foreground font-medium px-6 py-2.5 rounded-lg hover:opacity-90 active:scale-[0.98] transition-all">
                Close
              </button>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="p-6 pb-4 flex items-start justify-between border-b border-border">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h2 className="text-2xl font-semibold tracking-tight text-foreground">{lead.name}</h2>
                    <StatusBadge status={lead.status} />
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5" /><span className="mono-text">{lead.phone}</span></span>
                    {lead.email && <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5" />{lead.email}</span>}
                    {lead.city && <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{lead.city}</span>}
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <Clock className="w-3 h-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">{elapsed} elapsed</span>
                    <SourceBadge source={lead.source} />
                    <LanguageBadge language={lead.language} />
                  </div>
                  {lead.notes && (
                    <p className="text-xs text-muted-foreground mt-1.5 italic">"{lead.notes}"</p>
                  )}
                </div>
                <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Product Selection */}
              <div className="p-6 pb-4">
                <h3 className="label-text mb-3">Select Products</h3>
                <div className="grid grid-cols-2 gap-2">
                  {PRODUCTS.map((product) => {
                    const selected = selectedProducts.find((p) => p.id === product.id);
                    return (
                      <motion.button
                        key={product.id}
                        onClick={() => toggleProduct(product)}
                        whileTap={{ scale: 0.98 }}
                        className={`p-3 rounded-lg text-left transition-all ${
                          selected
                            ? 'bg-primary/5 ring-2 ring-primary shadow-elevated'
                            : 'bg-secondary hover:bg-muted'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium text-foreground">{product.name}</span>
                          <span className="mono-text text-xs font-medium text-muted-foreground">
                            {product.combo}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">{product.description}</p>
                        <p className="mono-text text-sm font-semibold text-primary mt-1">₹{product.price.toLocaleString()}</p>
                      </motion.button>
                    );
                  })}
                </div>
                {selectedProducts.length > 0 && (
                  <div className="mt-3 flex items-center justify-between px-1">
                    <span className="text-sm text-muted-foreground">{selectedProducts.length} item(s)</span>
                    <span className="mono-text text-lg font-semibold text-foreground">₹{total.toLocaleString()}</span>
                  </div>
                )}
              </div>

              {/* Address Form */}
              <div className="px-6 pb-4">
                <h3 className="label-text mb-3">Delivery Address</h3>
                <div className="grid grid-cols-2 gap-3">
                  {/* Full Address - Required */}
                  <div className="col-span-2">
                    <label className="label-text block mb-1">Full Address <span className="text-red-500">*</span></label>
                    <textarea
                      className="input-field w-full min-h-[60px] resize-y"
                      value={fullAddress}
                      onChange={(e) => setFullAddress(e.target.value)}
                      placeholder="Enter complete delivery address..."
                      maxLength={500}
                      rows={2}
                    />
                  </div>

                  {/* Search for autofill (optional) */}
                  <div className="relative col-span-2">
                    <label className="label-text block mb-1">Search Area / Pincode (optional autofill)</label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input
                        className="input-field w-full pl-9"
                        value={addressQuery}
                        onChange={(e) => { setAddressQuery(e.target.value); setShowSuggestions(true); }}
                        onFocus={() => setShowSuggestions(true)}
                        placeholder="Type pincode, area to autofill fields below..."
                        maxLength={100}
                      />
                    </div>
                    {showSuggestions && suggestions.length > 0 && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-card rounded-lg z-10 max-h-48 overflow-y-auto border border-border" style={{ boxShadow: 'var(--shadow-overlay)' }}>
                        {suggestions.map((s, i) => (
                          <button
                            key={`${s.pincode}-${s.area}-${i}`}
                            onClick={() => handleSelectLocation(s)}
                            className="w-full text-left px-3 py-2.5 text-sm hover:bg-muted transition-colors first:rounded-t-lg last:rounded-b-lg border-b border-border/30 last:border-0"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-foreground font-medium">{s.area}</span>
                              <span className="mono-text text-xs text-muted-foreground">{s.pincode}</span>
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {s.postOffice} • {s.city}, {s.district}, {s.state}
                            </span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="label-text block mb-1">Pincode</label>
                    <input
                      className="input-field w-full mono-text"
                      value={pincode}
                      onChange={(e) => handlePincodeChange(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      placeholder="6-digit pincode"
                      maxLength={6}
                    />
                    {pincodeNotFound && (
                      <p className="text-xs text-amber-600 mt-1">Pincode not found, please enter manually</p>
                    )}
                  </div>
                  <div>
                    <label className="label-text block mb-1">Area</label>
                    <input className="input-field w-full" value={area} onChange={(e) => setArea(e.target.value)} placeholder="Area / Locality" maxLength={100} />
                  </div>
                  <div>
                    <label className="label-text block mb-1">District</label>
                    <input className="input-field w-full" value={district} onChange={(e) => setDistrict(e.target.value)} placeholder="District" maxLength={100} />
                  </div>
                  <div>
                    <label className="label-text block mb-1">City</label>
                    <input className="input-field w-full" value={city} onChange={(e) => setCity(e.target.value)} placeholder="City" maxLength={100} />
                  </div>
                  <div>
                    <label className="label-text block mb-1">State</label>
                    <input className="input-field w-full" value={state} onChange={(e) => setState(e.target.value)} placeholder="State" maxLength={100} />
                  </div>
                </div>
              </div>

              {/* Confirm */}
              <div className="p-6 pt-2 flex justify-end">
                <button
                  onClick={handleConfirmOrder}
                  disabled={!selectedProducts.length || !fullAddress.trim() || submitting}
                  className="bg-primary text-primary-foreground font-medium px-6 py-2.5 rounded-lg hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-40 disabled:pointer-events-none"
                >
                  {submitting ? 'Creating...' : `Confirm Order — ₹${total.toLocaleString()}`}
                </button>
              </div>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default LeadPopup;
