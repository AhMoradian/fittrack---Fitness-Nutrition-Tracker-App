'use client';

import * as React from 'react';
import { Minus, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

type NumberStepperProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'type'
> & {
  wrapperClassName?: string;
  suffix?: React.ReactNode;
  onValueChange?: (value: string) => void;
};

export const NumberStepper = React.forwardRef<
  HTMLInputElement,
  NumberStepperProps
>(({ className, wrapperClassName, suffix, disabled, onValueChange, ...props }, forwardedRef) => {
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useImperativeHandle(forwardedRef, () => inputRef.current!);

  const changeByStep = (direction: -1 | 1) => {
    const input = inputRef.current;
    if (!input || disabled) return;

    input.blur();
    if (direction === 1) input.stepUp();
    else input.stepDown();

    onValueChange?.(input.value);
  };

  const stepAmount = props.step ?? 1;

  return (
    <div
      className={cn(
        'flex min-h-12 min-w-0 max-w-full items-center overflow-hidden rounded-xl border bg-white focus-within:ring-2 focus-within:ring-green-500',
        disabled && 'bg-slate-100 opacity-70',
        wrapperClassName,
      )}
    >
      <button
        type="button"
        onClick={() => changeByStep(-1)}
        disabled={disabled}
        className="grid h-12 w-12 shrink-0 touch-manipulation place-items-center border-r text-slate-600 transition hover:bg-slate-100 active:bg-slate-200 disabled:pointer-events-none"
        aria-label={`Decrease ${props['aria-label'] ?? props.name ?? 'value'} by ${stepAmount}`}
      >
        <Minus className="h-5 w-5" aria-hidden="true" />
      </button>
      <input
        ref={inputRef}
        type="number"
        disabled={disabled}
        className={cn(
          'number-stepper-input min-w-0 flex-1 bg-transparent px-2 py-2 text-center font-black outline-none',
          className,
        )}
        {...props}
      />
      {suffix ? (
        <span className="shrink-0 pr-2 text-sm font-black text-muted-foreground">
          {suffix}
        </span>
      ) : null}
      <button
        type="button"
        onClick={() => changeByStep(1)}
        disabled={disabled}
        className="grid h-12 w-12 shrink-0 touch-manipulation place-items-center border-l text-slate-600 transition hover:bg-slate-100 active:bg-slate-200 disabled:pointer-events-none"
        aria-label={`Increase ${props['aria-label'] ?? props.name ?? 'value'} by ${stepAmount}`}
      >
        <Plus className="h-5 w-5" aria-hidden="true" />
      </button>
    </div>
  );
});

NumberStepper.displayName = 'NumberStepper';
