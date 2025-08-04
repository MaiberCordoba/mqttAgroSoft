import { useEffect, useState } from "react";
import { useGetPlantaciones } from "../Trazabilidad/hooks/plantaciones/useGetPlantaciones";
import { useGetCosechas } from "./hooks/cosechas/useGetCosechas";
import { CrearVentasModal } from "./components/ventas/CrearVentasModal";
import { Cosechas } from "./types";
import { useGetInsumos } from "./hooks/insumos/useGetInsumos";
import { useGetUnidadesMedida } from "./hooks/unidadesMedida/useGetUnidadesMedida";
import { useGetHerramientas } from "./hooks/herramientas/useGetHerramientas";
import CustomCard from "./CustomCard";
import { useAuth } from "@/hooks/UseAuth";
import { addToast } from "@heroui/toast";

export function CosechasResumenCard() {
  const [modalVentas, setModalVentas] = useState(false);
  const [cosechaSeleccionada, setCosechaSeleccionada] =
    useState<Cosechas | null>(null);

  const {
    data: cosechas = [],
    isLoading: loadingCosechas,
    isError,
  } = useGetCosechas();
  const { data: plantaciones = [], isLoading: loadingPlantaciones } =
    useGetPlantaciones();
  const { user } = useAuth();
  const userRole = user?.rol || null;

  // Función para mostrar alerta de acceso denegado
  const showAccessDenied = () => {
    addToast({
      title: "Acción no permitida",
      description: "No tienes permiso para realizar esta acción",
      color: "danger",
    });
  };

  // Función para manejar acciones con verificación de permisos
  const handleActionWithPermission = (
    action: () => void,
    requiredRoles: string[]
  ) => {
    if (requiredRoles.includes(userRole || "")) {
      action();
    } else {
      showAccessDenied();
    }
  };

  if (loadingCosechas || loadingPlantaciones) return <p>Cargando...</p>;
  if (isError) return <p>Hubo un error al cargar la información</p>;

  const handleVentaCosecha = (cosecha: Cosechas) => {
    handleActionWithPermission(() => {
      setCosechaSeleccionada(cosecha);
      setModalVentas(true);
    }, ["admin", "instructor", "pasante"]);
  };

  return (
    <div className="flex flex-wrap gap-4 mb-6">
      {cosechas.map((cosecha) => {
        const plantacion = plantaciones.find(
          (p) => p.id === cosecha.fk_Plantacion
        );

        if (!cosecha.cantidadTotal || cosecha.cantidadTotal <= 0) return null;

        const nombreCultivo = plantacion?.cultivo?.nombre ?? "Desconocido";
        const imagenEspecie = plantacion?.cultivo?.especies?.img;
        const nombreEspecie =
          plantacion?.cultivo?.especies?.nombre ?? "Desconocido";

        return (
          <CustomCard
            key={cosecha.id}
            title={nombreCultivo}
            image={imagenEspecie}
            data={{
              Especie: nombreEspecie,

              Cantidad: cosecha.cantidadTotal + "(g)",
              "Valor *(g)": cosecha.valorGramo,
              "Valor cosecha": `$${cosecha.valorTotal}`,
              "Fecha Cosecha": cosecha.fecha,
            }}
            backgroundColor="white"
            borderColor="green-500"
            textColor="green-800"
            footerButtons={[
              {
                label: "Vender",
                color: "primary",
                size: "sm",
                onPress: () => handleVentaCosecha(cosecha),
              },
            ]}
          />
        );
      })}
      {modalVentas && cosechaSeleccionada && (
        <CrearVentasModal
          onClose={() => setModalVentas(false)}
          onCreate={handleVentaCosecha}
          cosecha={cosechaSeleccionada}
        />
      )}
    </div>
  );
}
export function PlantacionesCard() {
  const {
    data: plantaciones = [],
    isLoading: loadingPlantaciones,
    isError,
  } = useGetPlantaciones();

  if (loadingPlantaciones) return <p>Cargando...</p>;
  if (isError) return <p>Error al cargar...</p>;

  return (
    <div className="flex flex-wrap gap-4 mb-6">
      {plantaciones.map((plantacion) => {
        // Manejo seguro de propiedades anidadas
        const nombreCultivo = plantacion?.cultivo?.nombre ?? "Desconocido";
        const estado =
          plantacion?.cultivo?.activo !== undefined
            ? plantacion.cultivo.activo
              ? "Activo"
              : "Inactivo"
            : "Estado desconocido";
        const fechaSiembra = plantacion.fechaSiembra || "Fecha no disponible";

        if (estado == "Inactivo") return null;


        return (
          <div
            key={plantacion.id}
            className="w-30 h-30 bg-white shadow-md rounded-md border p-2 text-sm flex flex-col justify-center"
          >
            <p>
              <strong>Cultivo</strong>: {nombreCultivo}
            </p>
            <p>
              <strong>Estado</strong>: {estado}
            </p>
            <p>
              <strong>Fecha de siembra</strong>: {fechaSiembra}
            </p>
          </div>
        );
      })}
    </div>
  );
}

export function InsumosCard() {
  const {
    data: insumos = [],
    isLoading: loadingInsumos,
    isError,
  } = useGetInsumos();
  const { data: unidades = [] } = useGetUnidadesMedida();
  const { user } = useAuth();
  const userRole = user?.rol || null;

  const {
    isOpen: isCreateModalOpen,
    closeModal: closeCreateModal,
    handleCrear,
  } = useCrearUsosInsumo();

  // Función para mostrar alerta de acceso denegado
  const showAccessDenied = () => {
    addToast({
      title: "Acción no permitida",
      description: "No tienes permiso para realizar esta acción",
      color: "danger",
    });
  };

  // Función para manejar acciones con verificación de permisos
  const handleActionWithPermission = (
    action: () => void,
    requiredRoles: string[]
  ) => {
    if (requiredRoles.includes(userRole || "")) {
      action();
    } else {
      showAccessDenied();
    }
  };

  const handleUsarInsumo = (idInsumo: number) => {
    handleActionWithPermission(() => {
      handleCrear({
        id: 0,
        fk_Insumo: idInsumo,
        fk_Actividad: 0,
        fk_Control: 0,
        fk_UnidadMedida: 0,
        cantidadProducto: 0,
        costoUsoInsumo: 0,
      });
    }, ["admin", "instructor", "pasante"]);
  };

  if (loadingInsumos) return <p>Cargando...</p>;
  if (isError) return <p>Error al cargar los insumos.</p>;

  return (
    <>
      <div className="flex flex-wrap gap-4 mb-6">
        {insumos.map((insumo) => {
          const unidad = unidades.find((p) => p.id === insumo.fk_UnidadMedida);

          return (
            <CustomCard
              key={insumo.id}
              image={insumo.fichaTecnica}
              title={insumo.nombre}
              data={{
                "Cantidad Disponible": insumo.cantidadGramos,
                "Compuesto Activo": insumo.compuestoActivo,
                "Contenido Unidad": insumo.contenido
                  ? `${insumo.contenido} ${unidad?.abreviatura || ""}`
                  : "No disponible",
              }}
              footerButtons={[
                {
                  label: "Usar",
                  color: "primary",
                  size: "sm",
                  onPress: () => handleUsarInsumo(insumo.id),
                },
              ]}
            />
          );
        })}
      </div>

      {isCreateModalOpen && (
        <CrearUsoInsumoModal
          onClose={closeCreateModal}
          onCreate={() => closeCreateModal()}
        />
      )}
    </>
  );
}

import { Wrench } from "lucide-react";
import { useGetTiempoActividadControl } from "./hooks/tiempoActividadControl/useGetTiempoActividadDesecho";
import { useGetUnidadesTiempo } from "./hooks/unidadesTiempo/useGetUnidadesTiempo";
import { useGetActividades } from "./hooks/actividades/useGetActividades";
import { useGetUsers } from "../Users/hooks/useGetUsers";
import { useGetControles } from "../Sanidad/hooks/controles/useGetControless";
import EditarTiempoActividadControlModal from "./components/tiempoActividadControl/EditarTiempoActividadControlModal";
import { useEditarTiempoActividadControl } from "./hooks/tiempoActividadControl/useEditarTiempoActividadDesecho";
import { useGetSalarios } from "./hooks/salarios/useGetSalarios";
import { useCrearUsosHerramienta } from "./hooks/usosHerramientas/useCrearUsosHerramientas";
import { CrearUsoHerramientaModal } from "./components/usosHerramientas/CrearUsosHerramientasModal";
import { useCrearUsosInsumo } from "./hooks/usoInsumos/useCrearUsoInsumos";
import { CrearUsoInsumoModal } from "./components/usoInsumos/CrearUsosInsumosModal";
import { color } from "framer-motion";
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@heroui/react";

export function HerramientasCard() {
  const {
    data: Herramientas,
    isLoading: loadingHerramientas,
    isError,
  } = useGetHerramientas();
  const { user } = useAuth();
  const userRole = user?.rol || null;

  const {
    isOpen: isCreateModalOpen,
    closeModal: closeCreateModal,
    handleCrear,
  } = useCrearUsosHerramienta();

  // Función para mostrar alerta de acceso denegado
  const showAccessDenied = () => {
    addToast({
      title: "Acción no permitida",
      description: "No tienes permiso para realizar esta acción",
      color: "danger",
    });
  };

  // Función para manejar acciones con verificación de permisos
  const handleActionWithPermission = (
    action: () => void,
    requiredRoles: string[]
  ) => {
    if (requiredRoles.includes(userRole || "")) {
      action();
    } else {
      showAccessDenied();
    }
  };

  const handleUsarHerramienta = (idHerramienta: number) => {
    handleActionWithPermission(() => {
      handleCrear({
        id: 0,
        fk_Herramienta: idHerramienta,
        fk_Actividad: 0,
        unidades: 0,
      });
    }, ["admin", "instructor", "pasante"]);
  };

  if (loadingHerramientas) return <p>Cargando...</p>;
  if (isError) return <p>Error al cargar herramientas...</p>;

  return (
    <>
      <div className="flex flex-wrap gap-4 mb-6">
        {Herramientas?.map((herramienta) => (
          <CustomCard
            key={herramienta.id}
            title={herramienta.nombre}
            icon={<Wrench size={40} className="text-gray-700" />}
            data={{ Unidades: herramienta.unidades }}
            footerButtons={[
              {
                label: "Usar",
                color: "primary",
                size: "sm",
                onPress: () => handleUsarHerramienta(herramienta.id),
              },
            ]}
          />
        ))}
      </div>

      {isCreateModalOpen && (
        <CrearUsoHerramientaModal
          onClose={closeCreateModal}
          onCreate={() => {
            closeCreateModal();
          }}
        />
      )}
    </>
  );
}

export function TiempoActividadCard() {
  const {
    data: tiempoActividad,
    isLoading,
    isError,
  } = useGetTiempoActividadControl();
  const { data: unidades = [] } = useGetUnidadesTiempo();
  const { data: Actividades = [] } = useGetActividades();
  const { data: usuarios = [] } = useGetUsers();
  const { data: controles = [] } = useGetControles();
  const { data: salarios = [] } = useGetSalarios();
  const { data: plantaciones = [] } = useGetPlantaciones();
  const { user } = useAuth();
  const userRole = user?.rol || null;

  const {
    isOpen: isEditModalOpen,
    closeModal: closeEditModal,
    tiempoActividadControlEditada,
    handleEditar,
  } = useEditarTiempoActividadControl();

  // Función para mostrar alerta de acceso denegado
  const showAccessDenied = () => {
    addToast({
      title: "Acción no permitida",
      description: "No tienes permiso para realizar esta acción",
      color: "danger",
    });
  };

  // Función para manejar acciones con verificación de permisos
  const handleActionWithPermission = (
    action: () => void,
    requiredRoles: string[]
  ) => {
    if (requiredRoles.includes(userRole || "")) {
      action();
    } else {
      showAccessDenied();
    }
  };

  if (isLoading) return <p>Cargando...</p>;
  if (isError) return <p>Error al cargar...</p>;

  return (
    <div className="flex flex-wrap gap-4 mb-6">
      {tiempoActividad?.map((tiempoAC) => {
        const unidad = unidades.find((p) => p.id === tiempoAC.fk_unidadTiempo);
        const actividad = Actividades.find(
          (p) => p.id === tiempoAC.fk_actividad
        );
        const usuario = usuarios.find((p) => p.id === actividad?.fk_Usuario);
        const control = controles.find((p) => p.id === tiempoAC?.fk_control);
        const salario = salarios.find((p) => p.id === tiempoAC?.fk_salario);
        const plantacion = plantaciones.find(
          (p) => p.id === actividad?.fk_Plantacion
        );

        return (
          <CustomCard
            key={tiempoAC.id}
            title={actividad?.titulo || control?.descripcion || "Sin nombre"}
            description={
              actividad?.cultivo?.nombre || plantacion?.cultivo?.nombre
            }
            data={{
              Termino: tiempoAC.fecha,
              Duración: `${tiempoAC.tiempo} ${unidad?.nombre}`,
              "Costo de la actividad": `$${tiempoAC.valorTotal}`,
              Realizo:
                usuario?.nombre || control?.usuario?.nombre || "No definido",
              Salario: salario?.nombre,
            }}
            footerButtons={[
              {
                label: "Editar",
                color: "primary",
                size: "sm",
                onPress: () =>
                  handleActionWithPermission(
                    () => handleEditar(tiempoAC),
                    ["admin", "instructor"]
                  ),
              },
            ]}
          />
        );
      })}

      {isEditModalOpen && tiempoActividadControlEditada && (
        <EditarTiempoActividadControlModal
          tiempoActividadControl={tiempoActividadControlEditada}
          onClose={closeEditModal}
        />
      )}
    </div>
  );
}

type PagoUsuario = {
  id: number;
  nombre: string;
  actividades: number;
  controles: number;
  total: number;
}

export function PagarActividades() {
  const { data: tiempoActividad, isLoading, isError } = useGetTiempoActividadControl();
  const { data: actividades = [] } = useGetActividades();
  const { data: controles = [] } = useGetControles();
  const { data: usuarios = [] } = useGetUsers();

  const [pagosRealizados, setPagosRealizados] = useState<PagoUsuario[]>(() => {
    const datosGuardados = localStorage.getItem("pagos_realizados");
    return datosGuardados ? JSON.parse(datosGuardados) : [];
  });

  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    localStorage.setItem("pagos_realizados", JSON.stringify(pagosRealizados));
  }, [pagosRealizados]);

  if (isLoading) return <p>Cargando...</p>;
  if (isError) return <p>Error al cargar los datos...</p>;

  const resumenPorUsuario: Record<
    string,
    { id: number; nombre: string; cantidadActividades: number; cantidadControles: number; totalCosto: number }
  > = {};

  tiempoActividad?.forEach((tiempoAC) => {
    const actividad = actividades.find((a) => a.id === tiempoAC.fk_actividad);
    const control = controles.find((c) => c.id === tiempoAC.fk_control);

    const usuario =
      usuarios.find((u) => u.id === actividad?.fk_Usuario) ||
      control?.usuario;

    if (!usuario) return;

    const idUsuario = usuario.id;

    if (!resumenPorUsuario[idUsuario]) {
      resumenPorUsuario[idUsuario] = {
        id: idUsuario,
        nombre: usuario.nombre,
        cantidadActividades: 0,
        cantidadControles: 0,
        totalCosto: 0,
      };
    }

    if (actividad) {
      resumenPorUsuario[idUsuario].cantidadActividades += 1;
    } else if (control) {
      resumenPorUsuario[idUsuario].cantidadControles += 1;
    }

    resumenPorUsuario[idUsuario].totalCosto += tiempoAC.valorTotal;
  });

  const marcarComoPagado = (resumen: any) => {
    const nuevoPago: PagoUsuario = {
      id: resumen.id,
      nombre: resumen.nombre,
      actividades: resumen.cantidadActividades,
      controles: resumen.cantidadControles,
      total: resumen.totalCosto,
    };

    const actualizados = [...pagosRealizados, nuevoPago];
    setPagosRealizados(actualizados);
    addToast({
      title: "Pagos",
      description: `Se realizó el pago a ${resumen.nombre}`,
      color: "primary",
    });
  };

  const totalPagado = pagosRealizados.reduce((acc, pago) => acc + pago.total, 0);

  return (
    <div>
      {/* Botón para mostrar el modal en la esquina superior derecha */}
      {pagosRealizados.length > 0 && (
        <div className="flex justify-end mb-4">
          <Button onPress={() => setModalVisible(true)} variant="solid" color="success" size="sm">
            Ver pagos realizados
          </Button>
        </div>
      )}

      {/* Tarjetas para usuarios NO pagados */}
      <div className="flex flex-wrap gap-4 mb-6">
        {Object.values(resumenPorUsuario)
          .filter((resumen) => !pagosRealizados.some((p) => p.id === resumen.id))
          .map((resumen) => (
            <CustomCard
              key={resumen.id}
              title={resumen.nombre}
              description="Resumen de actividades y controles"
              data={{
                "Cantidad de actividades": resumen.cantidadActividades,
                "Cantidad de controles": resumen.cantidadControles,
                "Total a pagar": `$${resumen.totalCosto.toFixed(2)}`,
              }}
              footerButtons={[
                {
                  label: "Marcar como pagado",
                  color: "success",
                  size: "sm",
                  onPress: () => marcarComoPagado(resumen),
                },
              ]}
            />
          ))}
      </div>

      {/* Modal para ver pagos realizados */}
      <Modal isOpen={modalVisible} onClose={() => setModalVisible(false)}>
        <ModalContent>
          <ModalHeader>Pagos realizados</ModalHeader>
          <ModalBody>
            {pagosRealizados.map((pago) => (
              <div key={pago.id} className="mb-2 border-b pb-2">
                <p className="font-semibold">{pago.nombre}</p>
                <p>Actividades: {pago.actividades}</p>
                <p>Controles: {pago.controles}</p>
                <p>Total pagado: ${pago.total.toFixed(2)}</p>
              </div>
            ))}
            <div className="mt-4 font-bold text-right">
              Total general pagado: ${totalPagado.toFixed(2)}
            </div>
          </ModalBody>
          <ModalFooter>
            <Button onPress={() => setModalVisible(false)} color="primary">Cerrar</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}