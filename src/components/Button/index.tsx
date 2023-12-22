import React from 'react';

export const Button: React.FC<{
  children: React.ReactNode;
  disabled?: boolean;
  loading?: boolean;
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
}> = ({ children, ...props }) => (
  <button className="" {...props}>
    {children}
  </button>
);
