'use client';

import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import type { ReactNode } from 'react';

export interface ReviewSubmitButtonProps {
  onClick: () => void;
  loading?: boolean;
  disabled?: boolean;
  children: ReactNode;
  fullWidth?: boolean;
}

export function ReviewSubmitButton({ onClick, loading, disabled, children, fullWidth }: ReviewSubmitButtonProps) {
  return (
    <Button
      variant="primary"
      size="lg"
      onClick={onClick}
      disabled={disabled || loading}
      fullWidth={fullWidth}
      leadingIcon={loading ? <Spinner size="sm" className="border-white/40 border-t-white" /> : undefined}
    >
      {loading ? 'Working…' : children}
    </Button>
  );
}
