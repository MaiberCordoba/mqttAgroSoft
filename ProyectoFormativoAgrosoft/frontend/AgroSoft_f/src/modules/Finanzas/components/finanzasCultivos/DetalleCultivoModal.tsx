import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Divider,
  Chip,
  Badge,
  Image,
} from "@heroui/react";
import { DetalleResumenEconomico } from "../../types";
import { useCultivoModals } from "../../hooks/finanzasCultivos/useCultivosModals";
import { CosechasModal } from "./CosechasDetallesModal";
import { VentasModal } from "./VentasDetallesModal";
import { ActividadesModal } from "./ActividadesDetallesModal";
import { ControlesModal } from "./ControlesDetallesModal";

interface DetalleCultivoModalProps {
  isOpen: boolean;
  onClose: () => void;
  cultivo: DetalleResumenEconomico | null;
}

export const DetalleCultivoModal = ({
  isOpen,
  onClose,
  cultivo,
}: DetalleCultivoModalProps) => {
  const { activeModal, openModal, closeModal } = useCultivoModals();

  if (!cultivo) return null;

  const beneficioColor = cultivo.beneficio >= 0 ? "success" : "danger";
  const relacionColor =
    cultivo.relacion_beneficio_costo >= 1 ? "success" : "warning";

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} size="md">
        <ModalContent className="max-h-[90vh] rounded-xl">
          <ModalHeader className="flex flex-col gap-2 px-6 pt-6 pb-2">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">
                {cultivo.nombre || "Cultivo sin nombre"}
              </h2>
              <Chip color={beneficioColor} variant="flat">
                {cultivo.beneficio >= 0 ? "RENTABLE" : "NO RENTABLE"}
              </Chip>
            </div>
            <p className="text-sm text-default-500">
              Siembra: {cultivo.fecha_siembra || "No registrada"} | Unidades:{" "}
              {cultivo.unidades}
            </p>
          </ModalHeader>

          <ModalBody className="p-0 overflow-y-auto">
            <div className="px-6 py-4 space-y-4">
              {/* Sección de resumen con botones para detalles */}
              <div className="grid grid-cols-2 gap-4">
                <DetailCard
                  title="Actividades"
                  count={cultivo.detalle.actividades.total}
                  onClick={() => openModal("actividades")}
                />
                <DetailCard
                  title="Controles"
                  count={cultivo.detalle.controles.total}
                  onClick={() => openModal("controles")}
                />
                <DetailCard
                  title="Cosechas"
                  count={cultivo.detalle.cosechas.total}
                  onClick={() => openModal("cosechas")}
                />
                <DetailCard
                  title="Ventas"
                  count={cultivo.detalle.ventas.total}
                  onClick={() => openModal("ventas")}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="space-y-4">
                  {/* Espacio para imagen */}
                  <div className="bg-default-100 rounded-lg overflow-hidden aspect-w-1 aspect-h-1">
                    <div className="flex items-center justify-center bg-default-200">
                      <span className="text-default-400 text-sm italic">
                        Imagen del cultivo
                      </span>
                      {/* {cultivo.imagen_url && <Image src={cultivo.imagen_url} alt="Imagen del cultivo" className="object-cover w-full h-full" />} */}
                    </div>
                  </div>
                </div>

                {/* Columna 2: Egresos, Ingresos y resumen */}
                <div className="space-y-4">
                  <div className="bg-danger-50 p-4 rounded-lg">
                    <h3 className="font-semibold mb-2 text-danger-600">
                      Egresos
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>Insumos:</span>
                        <span className="font-medium">
                          ${cultivo.total_insumos.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Mano de obra:</span>
                        <span className="font-medium">
                          ${cultivo.total_mano_obra.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Costo depreciación herramienta:</span>
                        <span className="font-medium">
                          ${cultivo.total_depreciacion.toLocaleString()}
                        </span>
                      </div>
                      <Divider />
                      <div className="flex justify-between font-bold">
                        <span>Total egresos:</span>
                        <span>${cultivo.total_costos.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-success-50 p-4 rounded-lg">
                    <h3 className="font-semibold mb-2 text-success-600">
                      Ingresos
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>Ventas totales:</span>
                        <span className="font-medium">
                          ${cultivo.total_ventas.toLocaleString()}
                        </span>
                      </div>
                      <Divider />
                      <div className="flex justify-between font-bold">
                        <span>Total ingresos:</span>
                        <span>${cultivo.total_ventas.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-primary-50 p-4 rounded-lg">
                    <h3 className="font-semibold mb-2">Resumen Financiero</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>Beneficio:</span>
                        <Chip color={beneficioColor} size="sm">
                          ${Math.abs(cultivo.beneficio).toLocaleString()}
                        </Chip>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Relación B/C:</span>
                        <Badge color={relacionColor} size="lg" variant="flat">
                          {cultivo.relacion_beneficio_costo.toFixed(2)}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </ModalBody>

          <ModalFooter className="px-6 pb-4 pt-2">
            <Button color="primary" onPress={onClose}>
              Cerrar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Submodales existentes */}
      <ActividadesModal
        isOpen={activeModal === "actividades"}
        onClose={closeModal}
        actividades={cultivo.detalle.actividades.actividades_detalladas}
      />
      <ControlesModal
        isOpen={activeModal === "controles"}
        onClose={closeModal}
        controles={cultivo.detalle.controles.controles_detallados}
      />
      <CosechasModal
        isOpen={activeModal === "cosechas"}
        onClose={closeModal}
        cosechas={cultivo.detalle.cosechas.cosechas_detalladas}
      />
      <VentasModal
        isOpen={activeModal === "ventas"}
        onClose={closeModal}
        ventas={cultivo.detalle.ventas.ventas_detalladas}
      />
    </>
  );
};

const DetailCard = ({
  title,
  count,
  onClick,
}: {
  title: string;
  count: number;
  onClick: () => void;
}) => (
  <div
    className="bg-default-100 p-4 rounded-lg cursor-pointer hover:bg-default-200 transition-colors"
    onClick={onClick}
  >
    <h3 className="font-semibold">{title}</h3>
    <p className="text-2xl font-bold mt-2">{count}</p>
    <Button size="sm" className="mt-2" variant="light">
      Ver detalles
    </Button>
  </div>
);
