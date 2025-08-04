import { useState, ChangeEvent } from "react";
import ModalComponent from "@/components/Modal";
import { Input } from "@heroui/react";
import { useRecuperarContrasena } from "../../hooks/recuperaciones/useRecuperarContrasena";

interface SolicitarRecuperacionModalProps {
  onClose: () => void;
}

export const SolicitarRecuperacionModal = ({ onClose }: SolicitarRecuperacionModalProps) => {
  const [email, setEmail] = useState("");
  const { mutate, isPending, isSuccess, isError, error } = useRecuperarContrasena();

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleSubmit = () => {
    if (!email) {
      console.log("Por favor, ingresa un correo electrónico.");
      return;
    }

    mutate({ email }, {
      onSuccess: () => {
        setEmail("");
        onClose();
      }
    });
  };

  return (
    <ModalComponent
      isOpen={true}
      onClose={onClose}
      title="Recuperar contraseña"
      footerButtons={[
        {
          label: isPending ? "Enviando..." : "Enviar correo",
          color: "success",
          variant: "light",
          onClick: handleSubmit,
        },
      ]}
    >
      <div className="text-sm text-muted mb-4">
        Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.
      </div>

      <Input
        label="Correo electrónico"
        type="email"
        value={email}
        onChange={handleInputChange}
        required
      />

      {isSuccess && (
        <p className="text-green-600 text-sm mt-3">
          ¡Correo enviado con éxito! Revisa tu bandeja de entrada.
        </p>
      )}

      {isError && (
        <p className="text-red-600 text-sm mt-3">
          {(error as any)?.message || "Ocurrió un error. Intenta de nuevo."}
        </p>
      )}
    </ModalComponent>
  );
};
