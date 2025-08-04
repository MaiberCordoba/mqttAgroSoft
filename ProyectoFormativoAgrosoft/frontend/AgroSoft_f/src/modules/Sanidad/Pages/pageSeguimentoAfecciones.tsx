// ✅ Page - ControlesPage
import { useControles } from "@/modules/Sanidad/hooks/seguimientoafecciones/useControlDetails";
import ListaControles from "@/modules/Sanidad/components/seguimientoAfeccionnes/ControlDetails";

const ControlesPage = () => {
  const { data, isLoading, isError } = useControles();

  if (isLoading) return <p>Cargando controles...</p>;
  if (isError || !data) return <p>Error al cargar controles</p>;

  return (
    <div className="max-w-4xl mx-auto mt-8">
      <ListaControles controles={data} />
    </div>
  );
};

export default ControlesPage;
