import { SelectHTMLAttributes, forwardRef } from 'react';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(({ label, error, options, className = '', ...props }, ref) => (
  <div className="space-y-1">
    {label && <label className="label">{label}</label>}
    <select ref={ref} className={`input ${error ? 'border-red-500' : ''} ${className}`} {...props}>
      <option value="">Select...</option>
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
    {error && <p className="text-sm text-red-500">{error}</p>}
  </div>
));

Select.displayName = 'Select';
