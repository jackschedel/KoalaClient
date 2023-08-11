import React from 'react';
import useStore from '@store/store';

import SettingsMenu from '@components/SettingsMenu';
import CollapseOptions from './CollapseOptions';
import GoogleSync from '@components/GoogleSync';
import { TotalTokenCostDisplay } from '@components/SettingsMenu/TotalTokenCost';
import isElectron from '@utils/electron';
import GithubLink from './GithubLink';
import DesktopLink from './DesktopLink';

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || undefined;

const MenuOptions = () => {
  const hideMenuOptions = useStore((state) => state.hideMenuOptions);
  const countTotalTokens = useStore((state) => state.countTotalTokens);
  return (
    <>
      <div
        className={`${
          hideMenuOptions ? 'max-h-0' : 'max-h-full'
        } overflow-hidden transition-all`}
      >
        {!isElectron() && googleClientId && <GoogleSync clientId={googleClientId} />}
        {!isElectron() && <DesktopLink />}
        <GithubLink />
        <SettingsMenu />
      </div>
    </>
  );
};

export default MenuOptions;
