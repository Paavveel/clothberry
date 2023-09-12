import { ReactNode, useCallback, useEffect, useRef } from 'react';

import cn from 'classnames';

import styles from './Modal.module.css';

interface ModalProps {
  className?: string;
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}

export const Modal = ({ open, onClose, children, className, ...props }: ModalProps) => {
  const modalRef = useRef<HTMLDialogElement>(null);

  const onClick = useCallback(
    ({ target }: { target: EventTarget }) => {
      const { current: el } = modalRef;
      if (target === el) onClose();
    },
    [onClose]
  );

  const onAnimEnd = useCallback(() => {
    const { current: el } = modalRef;
    if (el && !open) el.close();
  }, [open]);

  useEffect(() => {
    const { current: el } = modalRef;
    if (el && open) el.showModal();
  }, [open]);

  return (
    <dialog
      ref={modalRef}
      className={cn(className, styles.modal, { [styles['modal--closing']]: !open })}
      onClose={onClose}
      onClick={onClick}
      onAnimationEnd={onAnimEnd}
      {...props}
      aria-hidden='true'
    >
      <div className={styles.modal__container}>{children}</div>
    </dialog>
  );
};
