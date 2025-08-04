import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Select,
  SelectItem,
  Checkbox,
} from "@heroui/react";

interface FormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Record<string, any>) => void;
  title: string;
  size?: "sm" | "md" | "lg";
  fields: Array<{
    name: string;
    label: string;
    type: "text" | "email" | "password" | "select" | "checkbox" | "date" | "number" | "boolean";
    options?: { label: string; value: string }[];
  }>;
  initialValues?: Record<string, any>;
}

const FormModal: React.FC<FormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  title,
  size = "lg",
  fields,
  initialValues = {},
}) => {
  const [formData, setFormData] = React.useState<Record<string, any>>(initialValues);

  const handleChange = (name: string, value: any) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    onSubmit(formData);
    onClose();
  };

  // Definir el número de columnas según la cantidad de campos
  const gridCols = fields.length > 6 ? "grid-cols-3" : fields.length > 3 ? "grid-cols-2" : "grid-cols-1";

  return (
    <Modal isOpen={isOpen} onOpenChange={onClose} placement="top-center">
      <ModalContent className={`max-w-${size} w-full rounded-lg shadow-lg`}>
        {() => (
          <>
            <ModalHeader className="text-xl font-bold">{title}</ModalHeader>
            <ModalBody>
              <div className={`grid ${gridCols} gap-4`}>
                {fields.map((field) => (
                  <div key={field.name} className="w-full">
                    {field.type === "text" || field.type === "email" || field.type === "password" || field.type === "date" || field.type === "number" ? (
                      <Input
                        type={field.type}
                        label={field.label}
                        labelPlacement="inside" // ✅ Esto arregla la posición del label dentro del input
                        value={formData[field.name] || ""}
                        onChange={(e) => handleChange(field.name, e.target.value)}
                        variant="bordered"
                      />
                    ) : field.type === "select" && field.options ? (
                      <Select
                        label={field.label}
                        value={formData[field.name] || ""}
                        onChange={(value) => handleChange(field.name, value)}
                      >
                        {field.options?.map((option) => (
                          <SelectItem key={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </Select>
                    ) : field.type === "checkbox" || field.type === "boolean" ? (
                      <Checkbox
                        isSelected={!!formData[field.name]}
                        onChange={(e) => handleChange(field.name, e.target.checked)}
                      >
                        {field.label}
                      </Checkbox>
                    ) : null}
                  </div>
                ))}
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="flat" onPress={onClose}>
                Cancelar
              </Button>
              <Button color="primary" onPress={handleSubmit}>
                Guardar
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default FormModal;
