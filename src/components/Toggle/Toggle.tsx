import React from 'react';

const Toggle = ({
  label,
  isChecked,
  setIsChecked,
}: {
  label: string;
  isChecked: boolean;
  setIsChecked: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  return (
    <label className='relative flex items-center cursor-pointer'>
      <input
        type='checkbox'
        className='sr-only peer'
        checked={isChecked}
        onChange={() => {
          setIsChecked((prev) => !prev);
        }}
      />
      <div className="w-9 h-5 bg-custom-white/20 rounded-full peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-custom-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-accent-base"></div>
      <span className='ml-3 text-sm font-medium text-custom-white'>
        {label}
      </span>
    </label>
  );
};

export default Toggle;
