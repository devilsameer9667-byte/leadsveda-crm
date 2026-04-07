import { SOURCE_COLORS } from '@/data/mockData';

interface SourceBadgeProps {
  source: string;
  size?: 'sm' | 'md';
}

const SourceBadge = ({ source, size = 'sm' }: SourceBadgeProps) => {
  const key = source.toLowerCase();
  const config = SOURCE_COLORS[key] || { bg: 'bg-muted', text: 'text-muted-foreground', label: source };

  return (
    <span
      className={`inline-flex items-center rounded-full font-semibold ${config.bg} ${config.text} ${
        size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-0.5 text-xs'
      }`}
    >
      {config.label}
    </span>
  );
};

export default SourceBadge;
