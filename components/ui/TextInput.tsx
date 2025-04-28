import React from 'react';

interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

export const TextInput: React.FC<TextInputProps> = ({ className, ...props }) => {
  return (
    <input
      type="text"
      className={`border rounded p-2 ${className}`}
      {...props}
    />
  );
};

export default TextInput;