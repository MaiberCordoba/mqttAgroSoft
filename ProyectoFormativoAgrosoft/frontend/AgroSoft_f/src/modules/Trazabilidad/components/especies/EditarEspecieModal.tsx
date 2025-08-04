import React, { useState } from "react";
import ModalComponent from "@/components/Modal";
import { usePatchEspecies } from "../../hooks/especies/usePatchEspecies";
import { Especies } from "../../types";
import { Input, Textarea, Select, SelectItem, Button } from "@heroui/react";
import { useGetTiposEspecie } from "../../hooks/tiposEspecie/useGetTiposEpecie";
import { addToast } from "@heroui/toast";

interface EditarEspecieModalProps {
  especie: Especies;
  onClose: () => void;
}

const opcionesCrecimiento = [
  { value: "perennes", label: "Perennes" },
  { value: "semiperennes", label: "Semiperennes" },
  { value: "transitorio", label: "Transitorio" },
];

const EditarEspecieModal: React.FC<EditarEspecieModalProps> = ({ especie, onClose }) => {
  const [nombre, setNombre] = useState<string>(especie.nombre);
  const [descripcion, setDescripcion] = useState<string>(especie.descripcion);
  const [img, setImg] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(especie.img || null);
  const [tiempocrecimiento, setTiempocrecimiento] = useState<string>(especie.tiempocrecimiento as string);
  const [fk_tipoespecie, setFk_TipoEspecie] = useState<number>(especie.fk_tipoespecie ?? 0);

  const { mutate, isPending } = usePatchEspecies();
  const { data: tiposEspecie, isLoading: isLoadingTiposEspecie } = useGetTiposEspecie();

  const handleSubmit = () => {
    if (!nombre.trim() || !descripcion.trim() || !tiempocrecimiento || !fk_tipoespecie) {
      addToast({
        title: "Campos Obligatorios",
        description: "Completa todos los campos antes de guardar.",
        color: "danger",
      });
      return;
    }

    const formData = new FormData();
    formData.append("nombre", nombre);
    formData.append("descripcion", descripcion);
    formData.append("tiempocrecimiento", tiempocrecimiento);
    formData.append("fk_tipoespecie", String(fk_tipoespecie));
    if (img) {
      formData.append("img", img);
    }

    mutate(
      {
        id: especie.id,
        data: formData,
      },
      {
        onSuccess: () => {
          onClose();
        },
      }
    );
  };

  return (
    <ModalComponent
      isOpen={true}
      onClose={onClose}
      title="Editar Especie"
      footerButtons={[
        {
          label: isPending ? "Guardando..." : "Guardar",
          color: "success",
          variant: "solid",
          onClick: handleSubmit,
        },
      ]}
    >
      <Input
        value={nombre}
        label="Nombre"
        type="text"
        onChange={(e) => setNombre(e.target.value)}
        size="sm"
      />

      <Textarea
        value={descripcion}
        label="Descripción"
        onChange={(e) => setDescripcion(e.target.value)}
      />

      <Select
        label="Tiempo de Crecimiento"
        placeholder="Selecciona una opción"
        size="sm"
        selectedKeys={tiempocrecimiento ? [tiempocrecimiento] : []}
        onSelectionChange={(keys) => {
          const selected = Array.from(keys)[0];
          setTiempocrecimiento(String(selected));
        }}
      >
        {opcionesCrecimiento.map((op) => (
          <SelectItem key={op.value}>{op.label}</SelectItem>
        ))}
      </Select>

      {isLoadingTiposEspecie ? (
        <p>Cargando tipos de especie...</p>
      ) : (
        <Select
          label="Tipo de Especie"
          placeholder="Selecciona un tipo"
          size="sm"
          selectedKeys={fk_tipoespecie ? [fk_tipoespecie.toString()] : []}
          onSelectionChange={(keys) => {
            const selectedKey = Array.from(keys)[0];
            setFk_TipoEspecie(Number(selectedKey));
          }}
        >
          {(tiposEspecie || []).map((tipo) => (
            <SelectItem key={tipo.id.toString()}>{tipo.nombre}</SelectItem>
          ))}
        </Select>
      )}

      <div className="mt-4">
        <Button
          type="button"
          variant="solid"
          onPress={() => document.getElementById("imgInputEdit")?.click()}
        >
          Seleccionar nueva imagen
        </Button>

        <input
          id="imgInputEdit"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              setImg(file);
              setPreview(URL.createObjectURL(file));
            }
          }}
        />
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
  );
};

export default EditarEspecieModal;
