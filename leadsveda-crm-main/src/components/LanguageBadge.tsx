import { Globe } from 'lucide-react';

interface LanguageBadgeProps {
  language?: string;
}

const LanguageBadge = ({ language }: LanguageBadgeProps) => {
  if (!language) return null;
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 text-primary px-2 py-0.5 text-[10px] font-semibold">
      <Globe className="w-2.5 h-2.5" />
      {language.charAt(0).toUpperCase() + language.slice(1)}
    </span>
  );
};

export default LanguageBadge;
