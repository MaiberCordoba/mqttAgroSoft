import { useState } from "react";
import { HerramientasCard, InsumosCard } from "../CardFinanzas";
import { MovimientosList } from "../components/movimientosInventario/movimientosInventarioList";
import { CrearHerramientasModal } from "../components/herramientas/CrearHerramientasModal";
import { CrearInsumosModal } from "../components/insumos/CrearInsumosModal";
import { useGetInsumos } from "../hooks/insumos/useGetInsumos";
import { useGetHerramientas } from "../hooks/herramientas/useGetHerramientas";
import { Button } from "@heroui/react";
import { Package, Wrench, PlusCircle } from "lucide-react";
import { useAuth } from "@/hooks/UseAuth";

export function MovimientosInventario() {
  const [mostrarSeccion, setMostrarSeccion] = useState<
    "insumos" | "herramientas" | null
  >(null);
  const [herramientasModal, setHerramientasModal] = useState(false);
  const [insumosModal, setInsumosModal] = useState(false);
  const { user } = useAuth();
  const userRole = user?.rol || null;
  const canViewResources = ["admin", "instructor", "pasante"].includes(
    userRole || ""
  );

  const { refetch: refetchInsumos } = useGetInsumos();
  const { refetch: refetchHerramientas } = useGetHerramientas();

  const toggleInsumos = () =>
    setMostrarSeccion((prev) => (prev === "insumos" ? null : "insumos"));

  const toggleHerramientas = () =>
    setMostrarSeccion((prev) =>
      prev === "herramientas" ? null : "herramientas"
    );

  const handleCrearInsumo = () => {
    refetchInsumos();
    setInsumosModal(false);
  };

  const handleCrearHerramienta = () => {
    refetchHerramientas();
    setHerramientasModal(false);
  };

  return (
    <div className="p-4">
      {/* Fila de botones */}
      <div className="flex items-center gap-4 mb-4">
        {canViewResources && (
          <Button
            color={"warning"}
            size="sm"
            title="Insumos"
            onPress={toggleInsumos}
            startContent={<Package size={16} className="text-white" />}
          ></Button>
        )}

        {mostrarSeccion === "insumos" && (
          <Button
            color="success"
            title="Agregar Insumo"
            size="sm"
            onPress={() => setInsumosModal(true)}
            startContent={<PlusCircle size={16} />}
          ></Button>
        )}

        {canViewResources && (
          <Button
            color={"warning"}
            size="sm"
            title="Herramientas"
            onPress={toggleHerramientas}
            startContent={<Wrench size={16} className="text-white" />}
          ></Button>
        )}

        {mostrarSeccion === "herramientas" && (
          <Button
            color="success"
            size="sm"
            title="Agregar Herramienta"
            onPress={() => setHerramientasModal(true)}
            startContent={<PlusCircle size={16} className="text-white" />}
          ></Button>
        )}
      </div>

      {/* Contenido dinámico por sección */}
      <div className="mb-6">
        {mostrarSeccion === "insumos" && <InsumosCard />}
        {mostrarSeccion === "herramientas" && <HerramientasCard />}
      </div>

      {/* Lista de movimientos - debajo de todo */}
      <MovimientosList />

      {/* Modales */}
      {herramientasModal && (
        <CrearHerramientasModal
          onClose={() => setHerramientasModal(false)}
          onCreate={handleCrearHerramienta}
        />
      )}

      {insumosModal && (
        <CrearInsumosModal
          onClose={() => setInsumosModal(false)}
          onCreate={handleCrearInsumo}
        />
      )}
    </div>
  );
}
