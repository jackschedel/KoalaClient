import React from 'react';

const BaseButton = ({
   onClick,
   icon,
}: {
   onClick: React.MouseEventHandler<HTMLButtonElement>;
   icon: React.ReactElement;
}) => {
   return (
      <div className='text-gray-400 flex self-end lg:self-center justify-center gap-3 md:gap-3  visible'>
         <button
            className='p-1.5 border-t-[1px] border-l-[1px] border-gray-700 rounded-md hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200 disabled:dark:hover:text-gray-400 md:invisible md:group-hover:visible'
            onClick={onClick}
         >
            {icon}
         </button>
      </div>
   );
};

export default BaseButton;
