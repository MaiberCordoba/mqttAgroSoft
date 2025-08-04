import { useGetEspecies } from "../../hooks/especies/useGetEpecies";

interface FiltroEspeciesProps {
  selectedEspecie: string;
  onEspecieChange: (especieId: string) => void;
}

export const FiltroEspecies = ({ selectedEspecie, onEspecieChange }: FiltroEspeciesProps) => {
  const { data: especies } = useGetEspecies();

  return (
    <div className="mb-4 max-w-md">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Filtrar por cultivo:
      </label>
      <select
        value={selectedEspecie}
        onChange={(e) => onEspecieChange(e.target.value)}
        className="w-full p-2 border rounded-md"
      >
        <option value="">Todos los cultivos</option>
        {especies?.map((especie) => (
          <option key={especie.id} value={especie.id}>
            {especie.nombre}
          </option>
        ))}
      </select>
    </div>
  );
};