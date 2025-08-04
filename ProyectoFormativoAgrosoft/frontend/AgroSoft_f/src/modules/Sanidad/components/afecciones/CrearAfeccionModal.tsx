
import { useState, useEffect } from "react"; // Necesitas useEffect para el preview
import { usePostAfeccion } from "../../hooks/afecciones/usePostAfecciones";
import ModalComponent from "@/components/Modal";
import { Button, Input, Select, SelectItem } from "@heroui/react";
import { useGetTipoAfecciones } from "../../hooks/tiposAfecciones/useGetTipoAfecciones";
import { CrearTipoAfeccionModal } from "../tipoafecciones/CrearTipoAfeccionModal";
import { Plus } from "lucide-react";
import { addToast } from "@heroui/toast";

interface CrearAfeccionModalProps {
  onClose: () => void;
  onCreate?: () => void;
}

export const CrearAfeccionModal = ({
  onClose,
  onCreate,
}: CrearAfeccionModalProps) => {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [fk_Tipo, setFk_Tipo] = useState<number | null>(null);
  const [img, setImagen] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const { data: tiposPlaga, refetch: refetchTiposPlaga } =
    useGetTipoAfecciones();
  const { mutate, isPending } = usePostAfeccion();

  const [mostrarModalTipoAfeccion, setMostrarModalTipoAfeccion] =
    useState(false);

  // --- Efecto para la vista previa de la imagen ---
  useEffect(() => {
    if (img instanceof File) {
      const objectUrl = URL.createObjectURL(img);
      setPreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl); // Limpieza de memoria
    } else {
      setPreview(null);
    }
  }, [img]);

  // --- Lógica de Envío con Validación Simple ---
  const handleSubmit = () => {
    // --- Validación de campos vacíos con un solo 'if' ---
    if (
      !nombre.trim() ||
      !descripcion.trim() ||
      fk_Tipo === null ||
      fk_Tipo === undefined ||
      !img
    ) {
      addToast({
        title: "error",
        description: "rellene campos obligatorios",
        color: "danger",
      });
      return;
    }

    // --- Si la validación pasa, procede con el FormData y la mutación ---
    const formData = new FormData();
    formData.append("nombre", nombre);
    formData.append("descripcion", descripcion);
    formData.append("img", img as File); // Usamos 'as File' porque la validación de 'if (!img)' ya garantiza que no es null.
    formData.append("fk_Tipo", fk_Tipo.toString()); // Convertimos a string. Usamos '!' para asegurar que no es null/undefined.

    mutate(formData, {
      onSuccess: () => {
        onClose();
        if (onCreate) onCreate();
        // Limpiar los estados después del éxito
        setNombre("");
        setDescripcion("");
        setImagen(null);
        setFk_Tipo(null);
        // El preview se limpiará automáticamente con setImagen(null) gracias al useEffect
      },
    });
  };

  const handleTipoAfeccionCreado = async (nuevoTipo: {
    id: number;
    nombre: string;
  }) => {
    await refetchTiposPlaga();
    setFk_Tipo(nuevoTipo.id);
    setMostrarModalTipoAfeccion(false);
  };

  return (
    <>
      <ModalComponent
        isOpen={true}
        onClose={onClose}
        title="Registro de afectaciones"
        footerButtons={[
          {
            label: isPending ? "Guardando..." : "Guardar",
            color: "success",
            onClick: handleSubmit, // Tu función handleSubmit original
          },
        ]}
      >
        <Input
          label="Nombre"
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required // Indicador visual de campo requerido
        />

        <Input
          label="Descripción"
          type="text"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          required
        />

        <div className="flex items-center gap-2 mt-4">
          <div className="flex-1">
            <Select
              label="Tipo de Afectacion"
              placeholder="Selecciona un tipo de afectación"
              selectedKeys={fk_Tipo !== null ? [fk_Tipo.toString()] : []} // Asegura que no sea null
              onSelectionChange={(keys) => {
                const selectedKey = Array.from(keys)[0];
                setFk_Tipo(selectedKey ? Number(selectedKey) : null); // Manejar el caso de que la selección sea vacía
              }}
              required
            >
              {(tiposPlaga || []).map((tipo) => (
                <SelectItem key={tipo.id.toString()}>{tipo.nombre}</SelectItem>
              ))}
            </Select>
          </div>

          <Button
            onPress={() => setMostrarModalTipoAfeccion(true)}
            color="success"
            title="Agregar nuevo tipo"
            radius="full"
            size="sm"
          >
            <Plus className="w-5 h-5 text-white" />
          </Button>
        </div>

        <div className="mt-4">
          <Button
            type="button" // Cambiar a 'button' para evitar submit accidental
            variant="solid"
            onPress={() => document.getElementById("imagenAfecciones")?.click()}
          >
            Seleccionar imagen
          </Button>

          <input
            id="imagenAfecciones"
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              setImagen(file || null); // Asegurarse de que sea File o null
            }}
            className="hidden"
          />
          {/* Aquí podrías mostrar un pequeño texto de error si deseas, pero no con isInvalid/errorMessage de HeroUI sin más lógica */}
          {/* {!img && <p className="text-red-500 text-xs mt-1">Debes seleccionar una imagen.</p>} */}
        </div>

        {preview && (
          <div className="mt-4">
            <img
              src={preview}
              alt="Vista previa"
              className="w-48 h-48 object-cover rounded-lg border border-gray-300"
            />
          </div>
        )}
      </ModalComponent>

      {/* Modal secundario de tipo de afectación */}
      {mostrarModalTipoAfeccion && (
        <CrearTipoAfeccionModal
          onClose={() => setMostrarModalTipoAfeccion(false)}
          onCreate={handleTipoAfeccionCreado}
        />
      )}
    </>
  );
};