import { useState } from "react";
import { useResetearContrasena } from "../../hooks/recuperaciones/useResetearContrasena";
import { useSearchParams, useNavigate } from "react-router-dom";
import { FaLock } from "react-icons/fa";

const ResetearContrasena = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");
  const id = searchParams.get("id");

  const [password, setPassword] = useState("");
  const { mutate, isPending, isSuccess, isError, error } = useResetearContrasena();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !id) {
      alert("El enlace es inválido o ha expirado. Intenta nuevamente.");
      return;
    }
    mutate({ token, id, password });
    navigate("/login");
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gradient-to-br from-rose-100 via-blue-100 to-violet-100 px-4">


      <div className="relative w-full max-w-4xl bg-white shadow-xl rounded-large overflow-hidden border border-pink-200 flex flex-col md:flex-row">
      {/* Logo en la parte superior derecha */}
        <img
          src="/sena.png"
          alt="Logo AgroSena"
          className="absolute w-20 h-20 right-0 top-0 p-6 box-content"
        />
        
        {/* Columna izquierda: Formulario */}
        <div className="w-full md:w-1/2 p-10 bg-white">
          <div className="text-center mb-6">
            <div className="flex justify-center items-center mb-4 text-pink-500">
              <FaLock className="text-4xl" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800">Restablecer Contraseña</h2>
            <p className="text-gray-600 mt-1 text-sm">
              Ingresa tu nueva contraseña para continuar.
            </p>
          </div>

          {!token || !id ? (
            <div className="text-red-500 text-center font-medium">
              Enlace inválido o expirado. Solicita otro correo de recuperación.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Nueva Contraseña</label>
                <input
                  type="password"
                  placeholder="••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 bg-white shadow-sm"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-pink-500 hover:bg-pink-600 transition-colors font-semibold rounded-xl shadow-md text-black"
                disabled={isPending}
              >
                {isPending ? "Restableciendo..." : "Restablecer Contraseña"}
              </button>
            </form>
          )}

          {isSuccess && (
            <p className="text-green-600 text-center mt-4 font-medium">
              ¡Contraseña actualizada con éxito!
            </p>
          )}
          {isError && (
            <p className="text-red-600 text-center mt-4 font-medium">
              {(error as any)?.message || "Ocurrió un error inesperado."}
            </p>
          )}
        </div>

        {/* Columna derecha: Imagen decorativa o espacio vacío */}
        <div className="w-full md:w-1/2 bg-pink-50 flex items-center justify-center p-10">
          {/* Puedes dejar este espacio para alguna imagen adicional o eliminarlo */}
        </div>
      </div>
    </div>
  );
};

export default ResetearContrasena;
