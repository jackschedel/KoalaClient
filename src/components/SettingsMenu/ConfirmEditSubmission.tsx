import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import useStore from '@store/store';
import Toggle from '@components/Toggle';

const ConfirmEditSubmissionToggle = () => {
  const { t } = useTranslation();

  const setConfirmEditSubmission = useStore(
    (state) => state.setConfirmEditSubmission
  );

  const [isChecked, setIsChecked] = useState<boolean>(
    useStore.getState().confirmEditSubmission
  );

  useEffect(() => {
    setConfirmEditSubmission(isChecked);
  }, [isChecked]);

  return (
    <Toggle
      label={t('confirmEditSubmission') as string}
      isChecked={isChecked}
      setIsChecked={setIsChecked}
    />
  );
};

export default ConfirmEditSubmissionToggle;
