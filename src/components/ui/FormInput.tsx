
import React from 'react';
import { Input } from './input';
import { Label } from './label';

interface FormInputProps {
  label: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
}

export const FormInput: React.FC<FormInputProps> = ({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  error
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor={label} className="text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </Label>
      <Input
        id={label}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full ${error ? 'border-red-500' : ''}`}
        required={required}
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
};
