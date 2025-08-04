  import {
      Modal,
      ModalContent,
      ModalHeader,
      ModalBody,
      ModalFooter,
    } from "@heroui/react";
    import { ReactNode } from "react";
    
    interface ModalGlobalProps {
      isOpen: boolean;
      onClose: () => void;
      title?: string;
      children: ReactNode;
      footerActions?: ReactNode;
    }
    
    const ModalGlobal = ({ isOpen, onClose, title, children, footerActions }: ModalGlobalProps) => {
      return (
        <Modal isOpen={isOpen} onOpenChange={onClose}>
          <ModalContent>
            {() => (
              <>
                {title && <ModalHeader>{title}</ModalHeader>}
                <ModalBody className="overflow-auto max-h-[80vh]">{children}</ModalBody>
                {footerActions && <ModalFooter>{footerActions}</ModalFooter>}
              </>
            )}
          </ModalContent>
        </Modal>
      );
    };
    
    export default ModalGlobal;
    