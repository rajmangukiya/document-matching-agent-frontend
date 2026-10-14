import type { ButtonHTMLAttributes, ReactNode } from 'react';
import Loader from '../loader';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'quiet';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  fullWidth?: boolean;
  children: ReactNode;
}

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary: 'border-transparent bg-accent text-white hover:bg-accent-600',
  secondary: 'border-line bg-paper text-ink hover:border-mute hover:bg-wash',
  ghost: 'border-transparent text-accent hover:bg-accent-soft',
  danger: 'border-transparent bg-flag text-white hover:brightness-95',
  quiet: 'border-transparent text-ink-45 hover:bg-wash hover:text-ink',
};

const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: 'h-7 px-2.5 text-[12.5px]',
  md: 'h-[34px] px-3.5 text-[13.5px]',
  lg: 'h-10 px-4 text-sm',
};

const Button = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  fullWidth = false,
  disabled,
  className = '',
  type = 'button',
  children,
  ...rest
}: ButtonProps) => (
  <button
    type={type}
    disabled={disabled || isLoading}
    className={`focus-visible:outline-accent inline-flex shrink-0 cursor-pointer items-center justify-center gap-1.5 rounded-md border font-medium whitespace-nowrap transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-default disabled:opacity-45 ${VARIANT_CLASSES[variant]} ${SIZE_CLASSES[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
    {...rest}
  >
    {isLoading && <Loader size="sm" />}
    {children}
  </button>
);

export default Button;
