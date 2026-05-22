import React from 'react';
import { usePrivacyStore } from '@/store/privacyStore';

interface Props {
  value: number;
  className?: string;
}

export const MoneyValue: React.FC<Props> = ({ value, className = "" }) => {
  const isHidden = usePrivacyStore((state) => state.isHidden);

  const formattedValue = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);

  return (
    <span className={`d-inline-block transition-opacity ${className} ${isHidden ? 'opacity-50' : 'opacity-100'}`}>
      {isHidden ? '••••••' : formattedValue}
    </span>
  );
};
