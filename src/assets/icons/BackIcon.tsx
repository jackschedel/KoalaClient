import React from 'react';

const BackIcon = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      fill='currentColor'
      height='24'
      viewBox='0 -960 960 960'
      width='24'
      {...props}
    >
      <path d='M400-80 0-480l400-400 71 71-329 329 329 329-71 71Z' />
    </svg>
  );
};

export default BackIcon;
