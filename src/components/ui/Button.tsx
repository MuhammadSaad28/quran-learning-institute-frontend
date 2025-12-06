import { ButtonHTMLAttributes, ReactNode } from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'gold' | 'outline' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  children: ReactNode;
}

const variants = {
  primary: 'btn-primary',
  gold: 'btn-gold',
  outline: 'btn-outline',
  danger: 'bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-full font-semibold transition-all',
  ghost: 'hover:bg-gray-100 dark:hover:bg-gray-700 px-4 py-2 rounded-lg transition-colors',
};

const sizes = { sm: 'px-4 py-2 text-sm', md: 'px-6 py-3', lg: 'px-8 py-4 text-lg' };

export const Button = ({ variant = 'primary', size = 'md', loading, children, className = '', disabled, ...props }: ButtonProps) => (
  <button
    className={`${variants[variant]} ${sizes[size]} ${className} inline-flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed`}
    disabled={disabled || loading}
    {...props}
  >
    {loading && <Loader2 className="w-4 h-4 animate-spin" />}
    {children}
  </button>
);
