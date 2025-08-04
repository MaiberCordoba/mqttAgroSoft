import { useGetTiposEspecie } from "@/modules/Trazabilidad/hooks/tiposEspecie/useGetTiposEpecie";
import { CultivoResumenList } from "../components/finanzasCultivos/CultivoResumenList";
import { FiltrosCultivos } from "../components/finanzasCultivos/FiltrosCultivo";
import { useCultivoSelection } from "../hooks/finanzasCultivos/useCultivoSelection";
import { useResumenesEconomicos } from "../hooks/finanzasCultivos/useGetListResumenesEconomicos";
import { useGetEspecies } from "@/modules/Trazabilidad/hooks/especies/useGetEpecies";
import { useFiltrosCultivos } from "../hooks/finanzasCultivos/useFiltrosCultivo";
import { useFiltrarResumenes } from "../hooks/finanzasCultivos/usefitrarResumenes";
import { DetalleCultivoModal } from "../components/finanzasCultivos/DetalleCultivoModal";
import HistorialBeneficioCostoModal from "../components/finanzasCultivos/HistorialBeneficioCostoModal";
import { ResumenEconomicoListado } from "../types";
import { useState } from "react";

const ResumenFinancieroPage = () => {
  // Obtener datos
  const { data: resumenes, isLoading } = useResumenesEconomicos();
  const { data: tiposEspecie } = useGetTiposEspecie();
  const { data: especies } = useGetEspecies();

  // Manejar filtros
  const {
    tipoEspecieId,
    especieId,
    fechaInicio,
    fechaFin,
    handleTipoEspecieChange,
    handleEspecieChange,
    handleFechaChange,
    resetFiltros,
  } = useFiltrosCultivos();

  // Filtrar resúmenes
  const resumenesFiltrados = useFiltrarResumenes(
    resumenes || [],
    tipoEspecieId,
    especieId,
    fechaInicio,
    fechaFin
  );

  // Manejar selección de cultivo
  const { selectedCultivo, isModalOpen, handleSelectCultivo, closeModal } =
    useCultivoSelection();

  const [showHistorialGlobal, setShowHistorialGlobal] = useState(false);
  const [selectedCultivoHistorial, setSelectedCultivoHistorial] = useState<{
    id?: number;
    nombre?: string;
  } | null>(null);

  // Handler para abrir historial
  const handleOpenHistorial = (cultivo?: ResumenEconomicoListado) => {
    if (cultivo) {
      setSelectedCultivoHistorial({
        id: cultivo.id,
        nombre: cultivo.nombre,
      });
    } else {
      setSelectedCultivoHistorial({});
    }
    setShowHistorialGlobal(true);
  };

  return (
    <div className="pt-0 px-6 py-4 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">
          Resumen Financiero de Cultivos
        </h1>
      </div>

      {/* Filtros y botón */}
      <div className="bg-white shadow-sm rounded-lg p-6 mb-8">
        <FiltrosCultivos
          tiposEspecie={tiposEspecie || []}
          especies={especies || []}
          tipoEspecieId={tipoEspecieId}
          especieId={especieId}
          fechaInicio={fechaInicio}
          fechaFin={fechaFin}
          onTipoEspecieChange={handleTipoEspecieChange}
          onEspecieChange={handleEspecieChange}
          onFechaChange={handleFechaChange}
          onReset={resetFiltros}
          onOpenHistorial={() => handleOpenHistorial()}
        />
      </div>

      {/* Listado de cultivos */}
      <div className="grid gap-6">
        <CultivoResumenList
          resumenes={resumenesFiltrados}
          loading={isLoading}
          onSelectCultivo={handleSelectCultivo}
          onOpenHistorial={handleOpenHistorial}
        />
      </div>

      {/* Modal de detalle */}
      <DetalleCultivoModal
        isOpen={isModalOpen}
        onClose={closeModal}
        cultivo={selectedCultivo}
      />

      <HistorialBeneficioCostoModal
        isOpen={showHistorialGlobal}
        onClose={() => {
          setShowHistorialGlobal(false);
          setSelectedCultivoHistorial(null);
        }}
        cultivoId={selectedCultivoHistorial?.id}
        cultivoNombre={selectedCultivoHistorial?.nombre}
        key={selectedCultivoHistorial?.id || "global"}
      />
    </div>
  );
};

export default ResumenFinancieroPage;
