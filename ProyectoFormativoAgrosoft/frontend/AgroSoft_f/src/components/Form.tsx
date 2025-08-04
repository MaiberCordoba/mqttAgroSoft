import React, { useState } from "react";
import { Form, Input, Button, Select, SelectItem } from "@heroui/react";

interface FormField {
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  errorMessage?: string;
  options?: string; // Añadido para manejar opciones del select
}

interface FormComponentProps {
  fields: FormField[];
  onSubmit: (data: Record<string, any>) => void;
  submitLabel?: string;
  extraContent?: React.ReactNode;
}

const FormComponent: React.FC<FormComponentProps> = ({
  fields,
  onSubmit,
  submitLabel = "Enviar",
  extraContent,
}) => {
  const [formValues, setFormValues] = useState<Record<string, any>>({});

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);
    onSubmit(data);
  };

  const handleSelectChange = (name: string, value: boolean) => {
    setFormValues((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <Form
      className="w-full max-w-xs flex flex-col gap-4"
      onSubmit={handleSubmit}
    >
      {fields.map((field) => {
        if (field.options) {
          // Aquí manejamos el caso del Select con valores booleanos
          const options = [
            { key: "true", label: "True", value: true },
            { key: "false", label: "False", value: false },
          ];

          return (
            <Select
              key={field.name}
              label={field.label}
              name={field.name}
              isRequired={field.required}
              onChange={(e) =>
                handleSelectChange(field.name, e.target.value === "true")
              }
            >
              {options.map((option) => (
                <SelectItem key={option.key}>{option.label}</SelectItem>
              ))}
            </Select>
          );
        } else {
          // Esto mantiene el comportamiento actual para los Inputs
          return (
            <Input
              size="sm"
              key={field.name}
              isRequired={field.required}
              errorMessage={field.errorMessage}
              label={field.label}
              labelPlacement="inside"
              name={field.name}
              placeholder={field.placeholder}
              type={field.type || "text"}
            />
          );
        }
      })}

      {extraContent && <div className="mt-4">{extraContent}</div>}
    </Form>
  );
};

export default FormComponent;
