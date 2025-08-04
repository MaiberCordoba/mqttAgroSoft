import React, { useRef, useState } from 'react';
import * as XLSX from 'xlsx';
import { addToast } from "@heroui/react";
import apiClient from '@/api/apiClient';
import ModalComponent from '@/components/Modal';

interface RegistroMasivoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const RegistroMasivoModal: React.FC<RegistroMasivoModalProps> = ({ isOpen, onClose }) => {
  const inputFileRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Plantilla actualizada con solo 3 campos
  const usuariosTemplate = [
    { nombre: 'Ej: Carlos', apellido: 'Ej: Rojas', identificacion: 123456789 },
    { nombre: 'Ej: Ana', apellido: 'Ej: Méndez', identificacion: 987654321 }
  ];

  const handleSeleccionarArchivo = () => {
    inputFileRef.current?.click();
  };

  const handleArchivoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const archivo = e.target.files?.[0];
    if (!archivo) return;

    setIsLoading(true);
    const formData = new FormData();
    formData.append('archivo', archivo);

    try {
      // Asegúrate de que esta ruta coincida con tu backend
      const response = await apiClient.post('usuarios/carga-masiva/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      console.log('Respuesta del servidor:', response.data);
      
      // Mensaje basado en la nueva estructura de respuesta
      const successMessage = response.data.errores > 0
        ? `Registro parcial: ${response.data.exitosos} éxitos, ${response.data.errores} errores`
        : `¡Éxito! ${response.data.exitosos} usuarios registrados`;

      addToast({
        title: response.data.errores > 0 ? "Advertencia" : "Éxito",
        description: successMessage,
        timeout: 5000,
        color: response.data.errores > 0 ? "warning" : "success",
      });

      // Mostrar detalles de errores si existen
      if (response.data.errores > 0 && response.data.detalle_errores) {
        console.error('Errores detallados:', response.data.detalle_errores);
        
        // Opcional: Mostrar un toast adicional con el primer error
        const primerError = response.data.detalle_errores[0];
        addToast({
          title: "Error en fila",
          description: `Fila ${primerError.fila}: ${primerError.errores}`,
          timeout: 6000,
          color: "danger",
        });
      }

      onClose();
    } catch (error: any) {
      console.error('Error al enviar el archivo:', error);
      
      // Manejo mejorado de errores
      const errorMessage = error.response?.data?.error 
        || error.response?.data?.mensaje 
        || "Error desconocido al procesar el archivo";

      addToast({
        title: "Error",
        description: errorMessage,
        timeout: 5000,
        color: "danger",
      });
    } finally {
      setIsLoading(false);
      // Limpiar input para permitir nueva selección
      if (inputFileRef.current) inputFileRef.current.value = '';
    }
  };

  const exportarAExcel = () => {
    try {
      // Solo exportar los 3 campos necesarios
      const hoja = usuariosTemplate.map(user => ({
        nombre: user.nombre,
        apellido: user.apellido,
        identificacion: user.identificacion
      }));

      const libro = XLSX.utils.book_new();
      const hojaExcel = XLSX.utils.json_to_sheet(hoja);
      XLSX.utils.book_append_sheet(libro, hojaExcel, 'Usuarios');
      XLSX.writeFile(libro, 'plantilla_registro_usuarios.xlsx');
      
      addToast({
        title: "Plantilla descargada",
        description: "El archivo de plantilla se descargó correctamente",
        timeout: 3000,
        color: "success",
      });
    } catch (error) {
      console.error("Error al exportar Excel:", error);
      addToast({
        title: "Error",
        description: "No se pudo generar la plantilla",
        timeout: 3000,
        color: "danger",
      });
    }
  };

  return (
    <ModalComponent
  isOpen={isOpen}
  onClose={onClose}
  title="Registro Masivo de Usuarios"
  footerButtons={[
    {
      label: isLoading ? "Subiendo..." : "Subir Excel",
      color: "success",
      variant: "solid",
      onClick: handleSeleccionarArchivo,
    },
    {
      label: "Descargar Plantilla",
      color: "success",
      variant: "solid",
      onClick: exportarAExcel,
    },
  ]}
>
  <div className="bg-gray-100 p-4 rounded-md border border-gray-300">
    <p className="text-sm text-gray-700 mb-2">
      El archivo Excel debe contener solo estas 3 columnas:
    </p>
    <ul className="list-disc pl-5 text-sm text-gray-800 space-y-1">
      <li><strong>nombre</strong> (texto)</li>
      <li><strong>apellido</strong> (texto)</li>
      <li><strong>identificacion</strong> (número)</li>
    </ul>
  </div>

  <input
    type="file"
    accept=".xlsx, .xls"
    ref={inputFileRef}
    onChange={handleArchivoChange}
    className="hidden"
    disabled={isLoading}
  />

  {isLoading && (
    <div className="text-center text-sm text-gray-600 mt-2">
      Procesando archivo, por favor espera...
    </div>
  )}
</ModalComponent>

  );
};

export default RegistroMasivoModal;