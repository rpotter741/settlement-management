import {
  currentModal,
  currentModalKey,
  isModalOpen,
  modalPositionSx,
  modalProps,
  disableBackgroundClose,
} from '@/app/selectors/modalSelectors.js';
import { closeModal } from '@/app/slice/modalSlice.js';
import { AppDispatch } from '@/app/store.js';
import { modalMap } from '@/maps/modalMap.js';
import { Box, Modal } from '@mui/material';
import { Suspense } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';

export type ModalContent = {
  component: React.ElementType;
  props?: Record<string, any>;
} | null;

const GlobalModal = () => {
  const dispatch: AppDispatch = useDispatch();
  const modalOpen = useSelector(isModalOpen);
  const ModalComponent = useSelector(currentModal);
  const modalKey = useSelector(currentModalKey);
  const modalComponentProps = useSelector(modalProps);
  const modalPosition = useSelector(modalPositionSx);
  const disableClickaway = useSelector(disableBackgroundClose);

  console.log(disableClickaway);

  return (
    <>
      {modalOpen && (ModalComponent || modalKey) && (
        <Modal
          open={true}
          onClose={
            disableClickaway
              ? undefined
              : () => dispatch(closeModal({ autoNext: false }))
          }
        >
          <Box sx={{ ...modalPosition }}>
            <Suspense fallback={<Box>Loading...</Box>}>
              {(() => {
                const LazyComponent = modalKey
                  ? modalMap[modalKey]
                  : ModalComponent;

                return LazyComponent ? (
                  <LazyComponent {...modalComponentProps} />
                ) : null;
              })()}
            </Suspense>
          </Box>
        </Modal>
      )}
    </>
  );
};

export default GlobalModal;
