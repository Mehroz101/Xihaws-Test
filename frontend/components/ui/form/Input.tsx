'use client';

import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface InputProps {
  type?: 'text' | 'email' | 'password' | 'number';
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  icon?: React.ReactNode;
  className?: string;
}

export default function Input({
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  icon,
  className = ''
}: InputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';

  return (
    <div className="relative group">
      {icon && (
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-colors group-focus-within:text-blue-600">
          {icon}
        </div>
      )}

      <input
        type={isPassword && showPassword ? 'text' : type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className={`block w-full ${icon ? 'pl-10' : 'pl-4'} ${isPassword ? 'pr-12' : 'pr-4'
          } py-3 bg-white/50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-lg placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-200 text-gray-900 dark:text-white backdrop-blur-sm ${className}`}
        placeholder={placeholder}
      />

      {isPassword && (
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
        >
          {showPassword ? (
            <EyeOff className="h-5 w-5" />
          ) : (
            <Eye className="h-5 w-5" />
          )}
        </button>
      )}
    </div>
  );
}