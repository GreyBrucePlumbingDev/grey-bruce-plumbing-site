import React from 'react';

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  fluid?: boolean;
  narrow?: boolean;
}

const Container: React.FC<ContainerProps> = ({ 
  children, 
  className = '',
  fluid = false,
  narrow = false
}) => {
  return (
    <div className={`
      mx-auto px-4 sm:px-6 lg:px-8 xl:px-10
      ${fluid ? 'w-full' : narrow ? 'max-w-5xl' : 'max-w-7xl'}
      ${className}
    `}>
      {children}
    </div>
  );
};

export default Container;