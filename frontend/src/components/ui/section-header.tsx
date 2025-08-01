import React from 'react';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  className?: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ 
  title, 
  subtitle, 
  className = "" 
}) => {
  return (
    <div className={className}>
      <h2 className="text-xl font-semibold">{title}</h2>
      {subtitle && (
        <p className="text-sm text-muted-foreground mb-6">{subtitle}</p>
      )}
    </div>
  );
};

export default SectionHeader;