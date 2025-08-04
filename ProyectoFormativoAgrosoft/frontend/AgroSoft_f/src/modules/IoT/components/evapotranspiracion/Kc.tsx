import  { useState } from 'react';
import { 
  Leaf, Carrot, Sprout, LeafyGreen, Wheat, Banana, ChevronDown, ChevronUp,
  Citrus
} from 'lucide-react';

const CropKCoefficientTable = () => {
  const [expandedCategory, setExpandedCategory] = useState<string | null>('leafy');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Categorías y cultivos con sus coeficientes Kc
const cropCategories = [
    {
        id: 'leafy',
        name: 'Hortalizas de Hoja',
        icon: <Leaf style={{ color: "#22c55e" }} size={24} />,
        crops: [
            { name: 'Lechuga', stages: [{ kc: 0.4, duration: '1-20' }, { kc: 0.8, duration: '21-40' }, { kc: 1.05, duration: '41-60' }, { kc: 0.9, duration: '61-75' }], totalDays: 75 },
            { name: 'Acelga', stages: [{ kc: 0.4, duration: '1-25' }, { kc: 0.8, duration: '26-50' }, { kc: 1.05, duration: '51-70' }, { kc: 0.9, duration: '71-85' }], totalDays: 85 },
            { name: 'Espinaca', stages: [{ kc: 0.4, duration: '1-20' }, { kc: 0.7, duration: '21-40' }, { kc: 1.0, duration: '41-55' }, { kc: 0.8, duration: '56-65' }], totalDays: 65 },
            { name: 'Repollo', stages: [{ kc: 0.5, duration: '1-30' }, { kc: 0.9, duration: '31-60' }, { kc: 1.15, duration: '61-85' }, { kc: 0.95, duration: '86-100' }], totalDays: 100 },
            { name: 'Repollo morado', stages: [{ kc: 0.5, duration: '1-30' }, { kc: 0.9, duration: '31-60' }, { kc: 1.15, duration: '61-85' }, { kc: 0.95, duration: '86-100' }], totalDays: 100 },
            { name: 'Col rizada', stages: [{ kc: 0.5, duration: '1-30' }, { kc: 0.9, duration: '31-60' }, { kc: 1.15, duration: '61-85' }, { kc: 0.95, duration: '86-100' }], totalDays: 100 },
            { name: 'Cebolla', stages: [{ kc: 0.5, duration: '1-30' }, { kc: 0.8, duration: '31-70' }, { kc: 1.10, duration: '71-100' }, { kc: 0.75, duration: '101-130' }], totalDays: 130 },        
        ]
    },
    {
        id: 'roots',
        name: 'Raíces y Tubérculos',
        icon: <Carrot style={{ color: "#F97316" }} size={24} />,
        crops: [
            { name: 'Zanahoria', stages: [{ kc: 0.4, duration: '1-30' }, { kc: 0.8, duration: '31-70' }, { kc: 1.10, duration: '71-100' }, { kc: 0.95, duration: '101-130' }], totalDays: 130 },
            { name: 'Remolacha', stages: [{ kc: 0.4, duration: '1-25' }, { kc: 0.8, duration: '26-60' }, { kc: 1.10, duration: '61-90' }, { kc: 0.95, duration: '91-110' }], totalDays: 110 },
            { name: 'Rábano', stages: [{ kc: 0.4, duration: '1-15' }, { kc: 0.7, duration: '16-30' }, { kc: 1.0, duration: '31-45' }, { kc: 0.8, duration: '46-55' }], totalDays: 55 },
            { name: 'Papa', stages: [{ kc: 0.45, duration: '1-30' }, { kc: 0.85, duration: '31-60' }, { kc: 1.15, duration: '61-90' }, { kc: 0.75, duration: '91-120' }], totalDays: 120 },
            { name: 'Arracacha', stages: [{ kc: 0.5, duration: '1-60' }, { kc: 0.9, duration: '61-150' }, { kc: 1.10, duration: '151-220' }, { kc: 0.95, duration: '221-270' }], totalDays: 270 },
        ]
    },
    {
        id: 'fruits',
        name: 'Frutas y Hortalizas de Fruto',
        icon: <Citrus  style={{ color: "#EF4444" }} size={24} />,
        crops: [
            { name: 'Tomate', stages: [{ kc: 0.5, duration: '1-30' }, { kc: 0.8, duration: '31-60' }, { kc: 1.20, duration: '61-110' }, { kc: 0.80, duration: '111-140' }], totalDays: 140 },
            { name: 'Pepino', stages: [{ kc: 0.5, duration: '1-25' }, { kc: 0.8, duration: '26-50' }, { kc: 1.10, duration: '51-80' }, { kc: 0.85, duration: '81-100' }], totalDays: 100 },
            { name: 'Sandía', stages: [{ kc: 0.5, duration: '1-30' }, { kc: 0.8, duration: '31-60' }, { kc: 1.10, duration: '61-90' }, { kc: 0.85, duration: '91-110' }], totalDays: 110 },
            { name: 'Auyama', stages: [{ kc: 0.5, duration: '1-35' }, { kc: 0.8, duration: '36-70' }, { kc: 1.05, duration: '71-100' }, { kc: 0.85, duration: '101-130' }], totalDays: 130 },
            { name: 'Melón', stages: [{ kc: 0.5, duration: '1-30' }, { kc: 0.8, duration: '31-65' }, { kc: 1.10, duration: '66-95' }, { kc: 0.85, duration: '96-115' }], totalDays: 115 },
            { name: 'Pimentón', stages: [{ kc: 0.5, duration: '1-30' }, { kc: 0.8, duration: '31-60' }, { kc: 1.15, duration: '61-120' },{ kc: 0.85, duration: '121-150' }], totalDays: 150}
        ]
    },
    {
        id: 'legumes',
        name: 'Leguminosas',
        icon: <Sprout style={{ color: "#059669" }} size={24} />,
        crops: [
            { name: 'Frijol', stages: [{ kc: 0.4, duration: '1-20' }, { kc: 0.8, duration: '21-45' }, { kc: 1.10, duration: '46-70' }, { kc: 0.7, duration: '71-85' }], totalDays: 85 },
            { name: 'Arveja', stages: [{ kc: 0.4, duration: '1-25' }, { kc: 0.8, duration: '26-50' }, { kc: 1.10, duration: '51-75' }, { kc: 0.7, duration: '76-90' }], totalDays: 90 },
            { name: 'Lenteja', stages: [{ kc: 0.4, duration: '1-25' }, { kc: 0.8, duration: '26-55' }, { kc: 1.10, duration: '56-85' }, { kc: 0.7, duration: '86-100' }], totalDays: 100 },
            { name: 'Garbanzo', stages: [{ kc: 0.4, duration: '1-30' }, { kc: 0.8, duration: '31-70' }, { kc: 1.10, duration: '71-110' }, { kc: 0.7, duration: '111-130' }], totalDays: 130 },
        ]
    },
    {
        id: 'herbs',
        name: 'Hierbas y Condimentos',
        icon: <LeafyGreen style={{ color: "#84cc16" }} size={24} />,
        crops: [
            { name: 'Cilantro', stages: [{ kc: 0.35, duration: '1-15' }, { kc: 0.70, duration: '16-35' }, { kc: 1.00, duration: '36-50' }, { kc: 0.75, duration: '51-60' }], totalDays: 60 },
            { name: 'Perejil', stages: [{ kc: 0.40, duration: '1-20' }, { kc: 0.75, duration: '21-45' }, { kc: 1.05, duration: '46-65' }, { kc: 0.85, duration: '66-80' }], totalDays: 80 },
            { name: 'Albahaca', stages: [{ kc: 0.45, duration: '1-20' }, { kc: 0.85, duration: '21-50' }, { kc: 1.15, duration: '51-80' }, { kc: 0.95, duration: '81-100' }], totalDays: 100 },
            { name: 'Menta', stages: [{ kc: 0.50, duration: '1-30' }, { kc: 0.95, duration: '31-70' }, { kc: 1.20, duration: '71-110' }, { kc: 1.05, duration: '111-150' }], totalDays: 150 },
            { name: 'Orégano', stages: [{ kc: 0.40, duration: '1-30' }, { kc: 0.75, duration: '31-70' }, { kc: 1.00, duration: '71-110' }, { kc: 0.65, duration: '111-150' }], totalDays: 150 },
            { name: 'Romero', stages: [{ kc: 0.35, duration: '1-40' }, { kc: 0.65, duration: '41-100' }, { kc: 0.90, duration: '101-160' }, { kc: 0.60, duration: '161-200' }], totalDays: 200 },
            { name: 'Tomillo', stages: [{ kc: 0.30, duration: '1-30' }, { kc: 0.60, duration: '31-80' }, { kc: 0.85, duration: '81-130' }, { kc: 0.55, duration: '131-170' }], totalDays: 170 },
            { name: 'Salvia', stages: [{ kc: 0.40, duration: '1-25' }, { kc: 0.80, duration: '26-60' }, { kc: 1.10, duration: '61-100' }, { kc: 0.85, duration: '101-130' }], totalDays: 130 },
            { name: 'Eneldo', stages: [{ kc: 0.40, duration: '1-20' }, { kc: 0.85, duration: '21-50' }, { kc: 1.10, duration: '51-80' }, { kc: 0.70, duration: '81-100' }], totalDays: 100 },
            { name: 'Laurel', stages: [{ kc: 0.35, duration: '1-50' }, { kc: 0.70, duration: '51-120' }, { kc: 0.95, duration: '121-200' }, { kc: 0.75, duration: '201-300' }], totalDays: 300 }
        ]
    },
    {
        id: 'cereals',
        name: 'Cereales y Granos',
        icon: <Wheat style={{ color: "#F59E42" }} size={24} />,
        crops: [
            { name: 'Maíz', stages: [{ kc: 0.4, duration: '1-25' }, { kc: 0.8, duration: '26-60' }, { kc: 1.20, duration: '61-100' }, { kc: 0.70, duration: '101-130' }], totalDays: 130 },
            { name: 'Trigo', stages: [{ kc: 0.3, duration: '1-30' }, { kc: 0.7, duration: '31-70' }, { kc: 1.15, duration: '71-100' }, { kc: 0.5, duration: '101-130' }], totalDays: 130 },
            { name: 'Arroz', stages: [{ kc: 1.1, duration: '1-20' }, { kc: 1.2, duration: '21-50' }, { kc: 1.25, duration: '51-90' }, { kc: 1.0, duration: '91-120' }], totalDays: 120 },
            { name: 'Cebada', stages: [{ kc: 0.3, duration: '1-25' }, { kc: 0.7, duration: '26-60' }, { kc: 1.15, duration: '61-95' }, { kc: 0.45, duration: '96-120' }], totalDays: 120 }
        ]
    },
    {
        id: 'tropical',
        name: 'Cultivos Tropicales',
        icon: <Banana style={{ color: "#F1C40F" }} size={24} />,
        crops: [
            { name: 'Plátano', stages: [{ kc: 0.6, duration: '1-120' }, { kc: 1.0, duration: '121-300' }, { kc: 1.20, duration: '301-450' }, { kc: 1.10, duration: '451-540' }], totalDays: 540 },
            { name: 'Banano', stages: [{ kc: 0.6, duration: '1-120' }, { kc: 1.0, duration: '121-300' }, { kc: 1.20, duration: '301-450' }, { kc: 1.10, duration: '451-540' }], totalDays: 540 },
            { name: 'Piña', stages: [{ kc: 0.5, duration: '1-180' }, { kc: 0.8, duration: '181-360' }, { kc: 1.0, duration: '361-480' }, { kc: 0.9, duration: '481-600' }], totalDays: 600 },
            { name: 'Mango', stages: [{ kc: 0.6, duration: '1-365' }, { kc: 0.9, duration: '366-730' }, { kc: 1.1, duration: '731-1095' }, { kc: 1.0, duration: '1096-1460' }], totalDays: 1460 },
        ]
    },
];

  const filteredCategories = cropCategories
    .map(category => ({
      ...category,
      crops: category.crops.filter(crop => 
        crop.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }))
    .filter(category => category.crops.length > 0);

  const toggleCategory = (categoryId: string) => {
    setExpandedCategory(expandedCategory === categoryId ? null : categoryId);
  };

  return (
    <div
      className="min-h-screen p-4 md:p-6"
      style={{
        background: 'rgba(224, 242, 254, 0.35)',
        borderRadius: '0.75rem',
        boxShadow: '0 6px 24px 0 rgba(16, 185, 129, 0.10)',
        border: '1px solid #bbf7d0',
        color: '#166534',
        fontWeight: 500,
        fontSize: 14,
        padding: 24,
      }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-emerald-900 flex items-center gap-2">
              Coeficientes de Cultivo (Kc)
            </h1>
            <p className="text-emerald-700 mt-2 max-w-2xl">
              Tabla de referencia para determinar los coeficientes de cultivo en diferentes etapas fenológicas
            </p>
          </div>
        </div>

        <div className="mb-6 flex items-center gap-2">
            <div className="relative">
            <input
              type="text"
              placeholder="Buscar cultivo..."
              className="w-44 md:w-56 pl-12 pr-3 py-2 border border-emerald-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400 text-sm"
              value={searchTerm}
              onChange={e => {
              const value = e.target.value;
              setSearchTerm(value);

              if (value.trim() === "") {
                setExpandedCategory('leafy');
              } else {
                const foundCategory = cropCategories.find(category =>
                category.crops.some(crop =>
                  crop.name.toLowerCase().includes(value.toLowerCase())
                )
                );
                setExpandedCategory(foundCategory ? foundCategory.id : null);
              }
              }}
              style={{ paddingLeft: 20, paddingRight: 12 }}
            />
            </div>
        </div>
        <br/>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCategories.map((category) => (
            <div 
              key={category.id} 
              className="bg-white rounded-xl shadow-lg overflow-hidden border-2 border-emerald-300 transition-all duration-300 hover:shadow-xl mb-4"
              style={{ marginBottom: '1rem', borderRadius: '1rem' }}
            >
              <div 
              className={`p-5 cursor-pointer flex items-center justify-between transition-all ${
              expandedCategory === category.id 
              ? 'bg-emerald-600 text-white' 
              : 'bg-gradient-to-r from-emerald-50 to-green-50'
              } rounded-t-xl`} 
              onClick={() => toggleCategory(category.id)}
              style={{ borderBottom: expandedCategory === category.id ? '2px solid #059669' : '2px solid #bbf7d0', borderTopLeftRadius: 16, borderTopRightRadius: 16 }}
              >
              <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-100 rounded-lg">
              {category.icon}
              </div>
              <div>
              <h2 className="text-lg font-bold">{category.name}</h2>
              <p className="text-sm opacity-80">{category.crops.length} cultivos</p>
              </div>
              </div>
              <span className="ml-2 flex items-center">
              {expandedCategory === category.id ? (
              <ChevronUp className="text-emerald-700" />
              ) : (
              <ChevronDown className="text-emerald-700" />
              )}
              </span>
              </div>
              
              {expandedCategory === category.id && (
            <div className="p-4 bg-emerald-50 rounded-b-xl">
              <div className="mb-4">
              </div>
              <div className="grid grid-cols-1 gap-4">
              {category.crops.map((crop) => (
              <div key={crop.name} className="bg-white rounded-lg p-4 border border-emerald-200">
              <div className="flex justify-between items-center mb-3">
              <h3 className="font-bold text-emerald-700">{crop.name}</h3>
              <span className="bg-emerald-100 text-emerald-800 text-xs px-2 py-1 rounded-full">
              {crop.totalDays} días
              </span>
              </div>
              
              <div className="grid grid-cols-4 gap-2">
              {crop.stages.map((stage, index) => (
              <div key={index} className="text-center">
                <div className="bg-gradient-to-b from-white to-emerald-50 rounded p-2 border border-emerald-200">
              <div className="text-xs text-gray-600 mb-1">Etapa {index + 1}</div>
              <div className="text-xl font-bold text-emerald-700">{stage.kc}</div>
              <div className="text-xs text-gray-500 mt-1">{stage.duration} días</div>
                </div>
              </div>
              ))}
              </div>
              </div>
              ))}
              </div>
            </div>
              )}
            </div>
          ))}
        </div>

        </div>
    </div>
  );
};

export default CropKCoefficientTable;