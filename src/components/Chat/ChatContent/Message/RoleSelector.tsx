import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import useStore from '@store/store';

import DownChevronArrow from '@icon/DownChevronArrow';
import { ChatInterface, Role, roles } from '@type/chat';

import useHideOnOutsideClick from '@hooks/useHideOnOutsideClick';

const RoleSelector = React.memo(
  ({
    role,
    messageIndex,
    sticky,
  }: {
    role: Role;
    messageIndex: number;
    sticky?: boolean;
  }) => {
    const { t } = useTranslation();
    const setInputRole = useStore((state) => state.setInputRole);
    const setChats = useStore((state) => state.setChats);
    const currentChatIndex = useStore((state) => state.currentChatIndex);

    const [dropDown, setDropDown, dropDownRef] = useHideOnOutsideClick();

    return (
      <div className='prose relative'>
        <button
          className={`btn btn-neutral btn-small flex gap-1 ${
            messageIndex%2 ? '' : 'bg-neutral-base'
          }`}
          aria-label={t(role) as string}
          type='button'
          onClick={() => setDropDown((prev) => !prev)}
        >
          {t(role)}
          <DownChevronArrow />
        </button>
        <div
          ref={dropDownRef}
          id='dropdown'
          className={`${
            dropDown ? '' : 'hidden'
          } absolute top-100 bottom-100 z-10 bg-white rounded-lg shadow-xl border-b border-black/10/50 text-gray-800 group opacity-90`}
        >
          <ul
            className='text-sm text-gray-700 p-0 m-0'
            aria-labelledby='dropdownDefaultButton'
          >
            {roles.map((r) => (
              <li
                className='px-4 py-2 hover:bg-gray-100 cursor-pointer'
                onClick={() => {
                  if (!sticky) {
                    const updatedChats: ChatInterface[] = JSON.parse(
                      JSON.stringify(useStore.getState().chats)
                    );
                    updatedChats[currentChatIndex].messages[messageIndex].role =
                      r;
                    setChats(updatedChats);
                  } else {
                    setInputRole(r);
                  }
                  setDropDown(false);
                }}
                key={r}
              >
                {t(r)}
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }
);
export default RoleSelector;
