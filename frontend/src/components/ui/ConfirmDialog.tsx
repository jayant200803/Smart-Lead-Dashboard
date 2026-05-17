import { Button } from './Button';
import { Modal } from './Modal';

export interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  isLoading?: boolean;
}

export const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  isLoading,
}: ConfirmDialogProps) => (
  <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="sm">
    <p className="text-sm text-slate-400 mb-5">{message}</p>
    <div className="flex gap-3 justify-end">
      <Button variant="secondary" onClick={onClose} disabled={isLoading}>
        Cancel
      </Button>
      <Button variant="danger" onClick={onConfirm} isLoading={isLoading}>
        Delete
      </Button>
    </div>
  </Modal>
);
