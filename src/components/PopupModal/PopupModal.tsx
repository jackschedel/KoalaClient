import React from 'react';
import ReactDOM from 'react-dom';
import { useTranslation } from 'react-i18next';

import CrossIcon2 from '@icon/CrossIcon2';

const PopupModal = ({
  title = 'Information',
  message,
  setIsModalOpen,
  handleConfirm,
  handleClose,
  handleClickBackdrop,
  cancelButton = true,
  children,
}: {
  title?: string;
  message?: string;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleConfirm?: () => void;
  handleClose?: () => void;
  handleClickBackdrop?: () => void;
  cancelButton?: boolean;
  children?: React.ReactElement;
}) => {
  const modalRoot = document.getElementById('modal-root');
  const { t } = useTranslation();

  const _handleClose = () => {
    handleClose && handleClose();
    setIsModalOpen(false);
  };

  const _handleBackdropClose = () => {
    if (handleClickBackdrop) handleClickBackdrop();
    else _handleClose();
  };

  if (modalRoot) {
    return ReactDOM.createPortal(
      <div className='fixed top-0 left-0 z-[999] w-full p-4 overflow-x-hidden overflow-y-auto h-full flex justify-center items-center'>
        <div className='relative z-2 max-w-2xl md:h-auto flex justify-center max-h-full'>
          <div className='relative bg-neutral-base rounded-lg shadow max-h-full overflow-x-auto'>
            <div className='flex items-center justify-between p-2 border-b rounded-t'>
              <h3 className='ml-2 text-lg font-semibold text-custom-white'>
                {title}
              </h3>
              <button
                type='button'
                className='text-custom-white bg-transparent hover:bg-custom-white hover:text-neutral-dark rounded-lg text-sm p-1.5 ml-auto inline-flex items-center'
                onClick={_handleClose}
                aria-label='close modal'
              >
                <CrossIcon2 />
              </button>
            </div>

            {message && (
              <div className='p-6 border-b border-custom-white'>
                <div className='min-w-fit text-custom-white text-sm my-3'>
                  {message}
                </div>
              </div>
            )}

            {children}
            {(handleConfirm || cancelButton) && (
              <div className='flex items-center justify-center p-4 gap-4'>
                {handleConfirm && (
                  <button
                    type='button'
                    className='btn btn-primary'
                    onClick={handleConfirm}
                    aria-label='confirm'
                  >
                    {t('confirm')}
                  </button>
                )}
                {cancelButton && (
                  <button
                    type='button'
                    className='btn btn-neutral'
                    onClick={_handleClose}
                    aria-label='cancel'
                  >
                    {t('cancel')}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
        <div
          className='bg-neutral-dark/90 absolute top-0 left-0 h-full w-full z-[-1]'
          onClick={_handleBackdropClose}
        />
      </div>,
      modalRoot
    );
  } else {
    return null;
  }
};

export default PopupModal;
