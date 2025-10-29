interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  color?: 'blue' | 'white' | 'gray';
}

export default function LoadingSpinner({
  size = 'md',
  className = '',
  color = 'blue'
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-2',
    lg: 'h-12 w-12 border-[3px]'
  };

  const colorClasses = {
    blue: 'border-blue-600 dark:border-blue-400',
    white: 'border-white',
    gray: 'border-gray-600 dark:border-gray-300'
  };

  return (
    <output
      className={`animate-spin rounded-full border-b-2 h-8 w-8  ${colorClasses[color]} ${className}`}
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </output>
  );
}