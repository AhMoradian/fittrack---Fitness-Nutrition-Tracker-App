import * as React from 'react';
import { cn } from '@/lib/utils';

export const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-motion-card
      className={cn('rounded-3xl border bg-card p-5 shadow-soft', className)}
      {...props}
    />
  ),
);

Card.displayName = 'Card';
