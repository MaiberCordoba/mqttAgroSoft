import React from "react";
import { TablaReutilizable } from "@/components/ui/table/TablaReutilizable";
import { Chip, User } from "@heroui/react";
import { AccionesTabla } from "@/components/ui/table/AccionesTabla"; // Importa AccionesTabla aquí

const App = () => {
  // Datos de ejemplo
  const datos = [
    {
      id: 1,
      nombre: "Tony Reichert",
      rol: "CEO",
      equipo: "Management",
      estado: "activo",
      avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
      email: "tony.reichert@example.com",
    },
    {
      id: 1,
      nombre: "Tony Reichert",
      rol: "CEO",
      equipo: "Management",
      estado: "inactivo",
      avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
      email: "tony.reichert@example.com",
    },
    {
      id: 1,
      nombre: "Tony Reichert",
      rol: "CEO",
      equipo: "Management",
      estado: "activo",
      avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
      email: "tony.reichert@example.com",
    },
    {
      id: 1,
      nombre: "Tony Reichert",
      rol: "CEO",
      equipo: "Management",
      estado: "activo",
      avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
      email: "tony.reichert@example.com",
    },
    {
      id: 1,
      nombre: "Tony Reichert",
      rol: "CEO",
      equipo: "Management",
      estado: "inactivo",
      avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
      email: "tony.reichert@example.com",
    },
    {
      id: 1,
      nombre: "Tony Reichert",
      rol: "CEO",
      equipo: "Management",
      estado: "activo",
      avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
      email: "tony.reichert@example.com",
    },
    {
      id: 1,
      nombre: "Tony Reichert",
      rol: "CEO",
      equipo: "Management",
      estado: "activo",
      avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
      email: "tony.reichert@example.com",
    },
    {
      id: 1,
      nombre: "Tony Reichert",
      rol: "CEO",
      equipo: "Management",
      estado: "inactivo",
      avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
      email: "tony.reichert@example.com",
    },
    {
      id: 1,
      nombre: "Tony Reichert",
      rol: "CEO",
      equipo: "Management",
      estado: "activo",
      avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
      email: "tony.reichert@example.com",
    },
    {
      id: 1,
      nombre: "Tony Reichert",
      rol: "CEO",
      equipo: "Management",
      estado: "activo",
      avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
      email: "tony.reichert@example.com",
    },
    {
      id: 1,
      nombre: "Tony Reichert",
      rol: "CEO",
      equipo: "Management",
      estado: "inactivo",
      avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
      email: "tony.reichert@example.com",
    },
    {
      id: 1,
      nombre: "Tony Reichert",
      rol: "CEO",
      equipo: "Management",
      estado: "activo",
      avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
      email: "tony.reichert@example.com",
    },
    
    // Más datos...
  ];

  // Columnas de la tabla
  const columnas = [
    { name: "ID", uid: "id", sortable: true },
    { name: "Nombre", uid: "nombre", sortable: true },
    { name: "Rol", uid: "rol", sortable: true },
    { name: "Equipo", uid: "equipo" },
    { name: "Estado", uid: "estado", sortable: true },
    { name: "Acciones", uid: "acciones" },
  ];

  // Opciones de estado para el dropdown
  const opcionesEstado = [
    { uid: "activo", nombre: "Activo" },
    { uid: "inactivo", nombre: "Inactivo" },
  ];

  // Función para renderizar las celdas
  const renderCell = (item: any, columnKey: React.Key) => {
    switch (columnKey) {
      case "nombre":
        return (
          <User
            avatarProps={{ radius: "lg", src: item.avatar }}
            description={item.email}
            name={item.nombre}
          >
            {item.email}
          </User>
        );
      case "estado":
        return (
          <Chip
            className="capitalize"
            color={item.estado === "activo" ? "success" : "danger"}
            size="sm"
            variant="flat"
          >
            {item.estado}
          </Chip>
        );
      case "acciones":
        return (
          <AccionesTabla
            onEditar={() => console.log("Editar", item)}
            onEliminar={() => console.log("Eliminar", item)}
          />
        );
      default:
        return item[columnKey];
    }
  };

  const handleCrearNuevo = () => {
    console.log("Crear otro elemento");
    // Aquí puedes agregar la lógica para crear un nuevo elemento
    // Por ejemplo, abrir un modal, hacer una petición API, etc.
  };

  return (
    <TablaReutilizable
      datos={datos}
      columnas={columnas}
      claveBusqueda="nombre"
      opcionesEstado={opcionesEstado}
      renderCell={renderCell}
      onCrearNuevo={handleCrearNuevo}
    />
  );
};

export default App;