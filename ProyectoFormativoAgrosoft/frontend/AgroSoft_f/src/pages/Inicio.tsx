import { useNavigate } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa"; // Importamos un ícono de flecha

export function Inicio() {
  const navigate = useNavigate();

  const handleRedirect = () => {
    navigate("/sensores");
  };

  return (
    <div className="relative h-full w-full overflow-hidden">
      {" "}
      {/* Añade overflow-hidden */}
      {/* Fondo con posición fixed */}
      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat -z-10"
        style={{
          backgroundImage: 'url("/ImagenHome.JPG")',
          backgroundAttachment: "fixed",
        }}
      >
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      </div>
      {/* Contenido */}
      <div className="relative h-full flex flex-col ">
        <header className="px-6 py-4">
          <div className="text-2xl font-bold text-white tracking-wide">
            AD<span className="text-[#327d45]">SO</span> 2846103
          </div>
        </header>

        <div className="flex-1 flex items-center justify-center px-6 pb-16 ">
          <div className="text-center text-white max-w-md ">
            <h1 className="text-4xl sm:text-5xl font-extrabold mt-9 mb-4 uppercase">
              Agro<span className="text-[#327d45]">Soft</span> Para El Campo
            </h1>
            <p className="text-gray-200 mb-8">
              Sistema integral para el desarrollo del campo con tecnología
            </p>
            <button
              onClick={handleRedirect}
              className="mx-auto flex items-center justify-center w-14 h-14 rounded-full text-white font-bold bg-[#327d45] hover:bg-[#286838] transition-all duration-300"
            >
              <FaArrowRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
