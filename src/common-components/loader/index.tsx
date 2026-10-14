interface LoaderProps {
  size?: 'sm' | 'md' | 'lg';
  fullScreen?: boolean;
  className?: string;
}

const SIZE_CLASSES = {
  sm: 'h-3.5 w-3.5 border-2',
  md: 'h-6 w-6 border-2',
  lg: 'h-9 w-9 border-[3px]',
};

const Loader = ({ size = 'md', fullScreen = false, className = '' }: LoaderProps) => {
  const spinner = (
    <span
      role="status"
      aria-label="Loading"
      className={`inline-block animate-spin rounded-full border-current border-t-transparent ${SIZE_CLASSES[size]} ${className}`}
    />
  );

  if (!fullScreen) return spinner;

  return <div className="text-accent flex min-h-[60vh] items-center justify-center">{spinner}</div>;
};

export default Loader;
