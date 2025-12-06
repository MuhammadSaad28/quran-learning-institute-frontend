import { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({ label, error, className = '', ...props }, ref) => (
  <div className="space-y-1">
    {label && <label className="label">{label}</label>}
    <input ref={ref} className={`input ${error ? 'border-red-500 focus:ring-red-500' : ''} ${className}`} {...props} />
    {error && <p className="text-sm text-red-500">{error}</p>}
  </div>
));

Input.displayName = 'Input';
