import { useState } from "react";
import { login, getUser } from "@/api/Auth";
import { useAuth } from "@/hooks/UseAuth";
import { useNavigate } from "react-router-dom";
import FormComponent from "@/components/Form";
import logo from "../../public/logoAgrosoft.png";
import { Link } from "@heroui/react";
import { CrearUsersModal } from "@/modules/Users/components/CrearUsersModal";
import { SolicitarRecuperacionModal } from "@/modules/Users/components/recuperaciones/solicitarRecuperacion";
import { addToast } from "@heroui/toast";

const Login = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const { login: authLogin } = useAuth();
  const navigate = useNavigate();

  const [registerModalUsers, setRegisterModalUsers] = useState(false);
  const [solicitarRecuperacion, setSolicitarRecuperacion] = useState(false);

  const handleSubmit = async (data: Record<string, any>) => {
    setErrorMessage("");
    try {
      const response = await login({
        email: data.email,
        password: data.password,
      });
      const userData = await getUser(response.access);
      console.log("Login exitoso, token:", response.access, "user:", userData);
      if (userData.estado === "inactivo") {
        addToast({
          title: "Cuenta inactiva",
          description: "Tu cuenta está inactiva. Contacta al administrador.",
          color: "danger",
        });
        return;
      }
      localStorage.setItem("token", response.access);
      localStorage.setItem("user", JSON.stringify(userData));
      authLogin(response.access, userData);
      navigate("/home");
    } catch (error) {
      console.error("Error de autenticación:", error);
      setErrorMessage("Correo o contraseña incorrectos. Inténtalo de nuevo.");
    }
  };

  return (
    <>
      <div
        className="h-screen w-full flex items-center justify-center"
        style={{ backgroundColor: "#f3f8f9" }}
      >
        <div className="flex items-center justify-center w-[400px] min-h-[500px] rounded-xl shadow-lg bg-white p-10 border border-gray-200">
          <div className="w-full flex flex-col items-center">
            <img src={logo} alt="Logo SENA" className="w-36 mb-8" />

            <p className="text-sm mb-4 text-gray-600 text-center">
              Por favor, introduce tus credenciales
            </p>

            <FormComponent
              fields={[
                {
                  name: "email",
                  label: "Correo",
                  type: "email",
                  required: true,
                },
                {
                  name: "password",
                  label: "Contraseña",
                  type: "password",
                  required: true,
                },
              ]}
              onSubmit={handleSubmit}
              submitLabel="Iniciar"
            />

            <div className="flex justify-end w-full mt-2 text-xs">
              <Link
                onPress={() => setSolicitarRecuperacion(true)}
                underline="hover"
                className="text-[#327d45] hover:underline"
                size="sm"
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </div>

            {errorMessage && (
              <p className="text-red-500 text-sm font-semibold text-center mt-3">
                {errorMessage}
              </p>
            )}

            <button
              type="submit"
              onClick={() =>
                document
                  .querySelector("form")
                  ?.dispatchEvent(
                    new Event("submit", { cancelable: true, bubbles: true })
                  )
              }
              className="mt-6 w-full bg-[#327d45] text-white py-2 rounded-md hover:bg-opacity-90 transition"
            >
              Iniciar sesión
            </button>

            <p className="mt-4 text-center text-xs text-gray-600">
              ¿No tienes una cuenta?{" "}
              <Link
                onPress={() => setRegisterModalUsers(true)}
                underline="hover"
                className="text-[#327d45] hover:underline"
              >
                Regístrate aquí
              </Link>
            </p>
          </div>
        </div>
      </div>

      {registerModalUsers && (
        <CrearUsersModal onClose={() => setRegisterModalUsers(false)} />
      )}
      {solicitarRecuperacion && (
        <SolicitarRecuperacionModal
          onClose={() => setSolicitarRecuperacion(false)}
        />
      )}
    </>
  );
};

export default Login;
