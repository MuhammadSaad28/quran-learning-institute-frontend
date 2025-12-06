import { TextareaHTMLAttributes, forwardRef } from 'react';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(({ label, error, className = '', ...props }, ref) => (
  <div className="space-y-1">
    {label && <label className="label">{label}</label>}
    <textarea ref={ref} className={`input min-h-[100px] ${error ? 'border-red-500' : ''} ${className}`} {...props} />
    {error && <p className="text-sm text-red-500">{error}</p>}
  </div>
));

Textarea.displayName = 'Textarea';
