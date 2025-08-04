import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  ModalProps,
} from "@heroui/react";

interface ModalsProps extends ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footerButtons?: {
    label: string;
    color?: "primary" | "danger" | "secondary" | "success";
    variant?: "light" | "solid";
    onClick?: () => void;
  }[];
}

const ModalComponent = ({
  isOpen,
  onClose,
  title,
  children,
  footerButtons,
}: ModalsProps) => {
  return (
    <>
      <Modal
        isOpen={isOpen}
        onOpenChange={onClose}
        className="overflow-hidden max-w-sm mx-auto"
      >
        <ModalContent className="max-h-[90vh] overflow-hidden">
          <>
            <ModalHeader className="flex flex-col gap-1 text-center">
              {title}
            </ModalHeader>

            <ModalBody className="overflow-y-auto max-h-[60vh]">
              <div className="px-5 space-y-4">{children}</div>
            </ModalBody>

            <ModalFooter>
              {footerButtons?.map((button, index) => (
                <Button
                  key={index}
                  color={button.color || "success"}
                  variant={button.variant}
                  onPress={button.onClick}
                >
                  {button.label}
                </Button>
              ))}
              <Button color="danger" variant="solid" onPress={onClose}>
                Cerrar
              </Button>
            </ModalFooter>
          </>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ModalComponent;
