interface StatusBadgeProps {
  status: string;
}

const statusMap: Record<string, string> = {
  confirmed: 'status-badge status-confirmed',
  dispatched: 'status-badge status-dispatched',
  delivered: 'status-badge status-delivered',
  rto: 'status-badge status-rto',
  cancelled: 'status-badge status-cancelled',
  new: 'status-badge bg-primary/10 text-primary',
  contacted: 'status-badge bg-amber-100 text-amber-700',
  converted: 'status-badge status-delivered',
};

const StatusBadge = ({ status }: StatusBadgeProps) => (
  <span className={statusMap[status] || 'status-badge bg-muted text-muted-foreground'}>
    {status.charAt(0).toUpperCase() + status.slice(1)}
  </span>
);

export default StatusBadge;
