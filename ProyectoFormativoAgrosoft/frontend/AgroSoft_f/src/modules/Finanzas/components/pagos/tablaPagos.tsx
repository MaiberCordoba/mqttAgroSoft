import React, { useState, useEffect, useCallback } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Chip,
  Select,
  SelectItem,
} from "@heroui/react";
import apiClient from "@/api/apiClient";
import { TiempoActividadControl } from "../../types";
import { useGetUsers } from "@/modules/Users/hooks/useGetUsers";
import { addToast } from "@heroui/toast";

interface TablaPagosProps {
  onUsuarioChange?: (usuarioId: string) => void;
}

const TablaPagos: React.FC<TablaPagosProps> = ({ onUsuarioChange }) => {
  const [registros, setRegistros] = useState<TiempoActividadControl[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [usuarioId, setUsuarioId] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [pendingRequests, setPendingRequests] = useState<Set<number>>(
    new Set()
  ); // Track pending requests

  const {
    data: usuarios = [],
    isLoading: loadingUsuarios,
    error: errorUsuarios,
  } = useGetUsers();

  // Load registros
  useEffect(() => {
    const url = usuarioId
      ? `/tiempoActividadesControles/?usuario_id=${usuarioId}`
      : "/tiempoActividadesControles/";
    setLoading(true);
    apiClient
      .get<TiempoActividadControl[]>(url)
      .then((response) => {
        setRegistros(response.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error al cargar registros:", err);
        setError("No se pudieron cargar los registros");
        setLoading(false);
      });
  }, [usuarioId]);

  const handleMarcarPago = useCallback(
    async (id: number, nuevoEstado: "PENDIENTE" | "PAGADO") => {
      if (pendingRequests.has(id)) return; // Prevent multiple clicks

      setPendingRequests((prev) => new Set(prev).add(id)); // Mark request as pending

      // Optimistic update
      setRegistros((prevRegistros) =>
        prevRegistros.map((reg) =>
          reg.id === id ? { ...reg, estado_pago: nuevoEstado } : reg
        )
      );

      try {
        const response = await apiClient.patch<TiempoActividadControl>(
          `/tiempoActividadesControles/${id}/marcar-pago/`,
          { estado_pago: nuevoEstado }
        );
        setRegistros((prevRegistros) =>
          prevRegistros.map((reg) => (reg.id === id ? response.data : reg))
        );
      } catch (error) {
        console.error("Error al marcar pago:", error);
        // Revert optimistic update on error
        setRegistros((prevRegistros) =>
          prevRegistros.map((reg) =>
            reg.id === id
              ? {
                  ...reg,
                  estado_pago:
                    nuevoEstado === "PAGADO" ? "PENDIENTE" : "PAGADO",
                }
              : reg
          )
        );
        addToast({
          title: "Error",
          description: "Error al actualizar el estado del pago",
          color: "danger",
        });
      } finally {
        setPendingRequests((prev) => {
          const newSet = new Set(prev);
          newSet.delete(id);
          return newSet;
        });
      }
    },
    [pendingRequests]
  );

  const handlePagarTodo = async () => {
    if (!usuarioId) {
      addToast({
        title: "Denegado",
        description: "Por favor selecciona un usuario",
        color: "warning",
      });
      return;
    }
    try {
      const response = await apiClient.post<{
        message: string;
        total_pagado: number;
      }>("/pagar-todo-pendiente/", { usuario_id: usuarioId });
      addToast({
        title: "Éxito",
        description: response.data.message,
        color: "success",
      });
      // Reload registros
      const url = `/tiempoActividadesControles/?usuario_id=${usuarioId}`;
      const newData = await apiClient.get<TiempoActividadControl[]>(url);
      setRegistros(newData.data);
    } catch (error) {
      console.error("Error al pagar todo:", error);
      addToast({
        title: "Error",
        description: "Error al realizar el pago masivo",
        color: "danger",
      });
    }
  };

  const renderCell = (
    item: TiempoActividadControl,
    columnKey: keyof TiempoActividadControl | "tipo" | "acciones"
  ) => {
    switch (columnKey) {
      case "usuario":
        return (
          <span>
            {item.actividad?.usuario?.nombre}{" "}
            {item.actividad?.usuario?.apellidos}
            {item.control?.usuario?.nombre} {item.control?.usuario?.apellidos}
          </span>
        );
      case "fecha":
        return new Date(item.fecha).toLocaleDateString();
      case "valorTotal":
        return `$${item.valorTotal}`;
      case "tipo":
        return item.fk_actividad ? "Actividad" : "Control";
      case "estado_pago":
        return (
          <Chip
            color={item.estado_pago === "PAGADO" ? "success" : "warning"}
            size="sm"
          >
            {item.estado_pago}
          </Chip>
        );
      case "acciones":
        return (
          <Button
            size="sm"
            color={item.estado_pago === "PAGADO" ? "warning" : "success"}
            onPress={() =>
              handleMarcarPago(
                item.id,
                item.estado_pago === "PAGADO" ? "PENDIENTE" : "PAGADO"
              )
            }
            className="h-9"
            isDisabled={pendingRequests.has(item.id)} // Disable button during request
          >
            {item.estado_pago === "PAGADO"
              ? "Marcar Pendiente"
              : "Marcar Pagado"}
          </Button>
        );
      default:
        return String(item[columnKey as keyof TiempoActividadControl]);
    }
  };

  const columns = [
    { uid: "usuario", name: "Usuario", sortable: true },
    { uid: "fecha", name: "Fecha", sortable: true },
    { uid: "valorTotal", name: "Valor Total", sortable: true },
    { uid: "tipo", name: "Tipo" },
    { uid: "estado_pago", name: "Estado", sortable: true },
    { uid: "acciones", name: "Acciones" },
  ];

  return (
    <div className="w-full max-w-[1075px] flex flex-col gap-3 mx-auto p-4 bg-white rounded-lg shadow mt-6">
      {error && <div className="text-red-500 mb-4">{error}</div>}
      {errorUsuarios && (
        <div className="text-red-500 mb-4">Error al cargar usuarios</div>
      )}
      <div className="flex flex-col sm:flex-row justify-between gap-4 items-center">
        <div className="w-full sm:w-[200px]">
          <Select
            label="Filtrar por usuario"
            placeholder={
              loadingUsuarios ? "Cargando usuarios..." : "Selecciona un usuario"
            }
            selectedKeys={usuarioId ? [usuarioId] : []}
            onSelectionChange={(keys) => {
              const newUsuarioId = Array.from(keys)[0]?.toString() ?? "";
              setUsuarioId(newUsuarioId);
              onUsuarioChange?.(newUsuarioId);
            }}
            size="sm"
            className="h-9"
            isDisabled={loadingUsuarios}
          >
            {usuarios.map((user) => (
              <SelectItem key={user.id}>
                {`${user.nombre} ${user.apellidos}`}
              </SelectItem>
            ))}
          </Select>
        </div>
        <div className="w-full sm:w-auto flex gap-3">
          <Button
            size="sm"
            color="success"
            onPress={handlePagarTodo}
            className="text-white h-9"
            isDisabled={!usuarioId}
          >
            Pagar Todo Pendiente
          </Button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <Table aria-label="Tabla de Pagos" className="min-w-[600px]">
          <TableHeader columns={columns}>
            {(column) => (
              <TableColumn
                key={column.uid}
                align={column.uid === "acciones" ? "center" : "start"}
                allowsSorting={column.sortable}
                className="bg-[#e6f1ed]"
              >
                {column.name}
              </TableColumn>
            )}
          </TableHeader>
          <TableBody
            items={registros}
            emptyContent={loading ? "Cargando..." : "No hay registros"}
          >
            {(item) => (
              <TableRow
                key={item.id}
                className="hover:bg-gray-50 transition-colors"
              >
                {(columnKey) => (
                  <TableCell className="py-3 px-4 border-b text-gray-700">
                    {renderCell(
                      item,
                      columnKey as
                        | keyof TiempoActividadControl
                        | "tipo"
                        | "acciones"
                    )}
                  </TableCell>
                )}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default TablaPagos;
