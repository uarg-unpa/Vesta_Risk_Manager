import React, { useState } from "react";
import { Alert } from "@/components/ui";
import { GoogleLogin } from "@react-oauth/google";
import Contenedor from "../components/Contenedor";
import Navegador from "../components/Navegador";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { login, obtenerUsuariosCorreo } from "../services/usuarios";
import { useUsuario } from "../context/usuarioContext";
import { createDemoToken, DEMO_MODE, DEMO_USERS } from "../utils/demoMode";


export default function Index() {
  const [error, setError] = useState(false);
  const [demoRole, setDemoRole] = useState("Administrador");
  const { iniciarSesion } = useUsuario();
  const navigation = useNavigate();

  return (
    <>
      <Navegador />
      <Contenedor>
        <h3>Vesta Risk Manager - Login</h3>
        <>
          <h5>Bienvenido</h5>
          <p>
            Estimado usuario: Bienvenido a la aplicaci&oacute;n Vesta Risk
            Manager, una aplicaci&oacute;n desarrollada en la UARG - UNPA.
          </p>
          <Alert variant="danger">
            <strong>Importante:</strong> Para acceder al sistema es necesario
            disponer de un correo de{" "}
            <a href="http://www.gmail.com" target="_blank">
              Gmail
            </a>
          </Alert>
          <hr />
          <h5>Ingreso al Sistema</h5>
          <p>
            Ud. puede ingresar el sistema si est&aacute; conectado a su e-mail.
            Por favor haga click en el bot&oacute;n a continuaci&oacute;n y
            elija su cuenta o realice el login.
          </p>
          {error && (
            <Alert variant="danger">
              Usuario ingresado no registrado. Solicite ser registrado por un
              administrador del sistema e intentelo de nuevo.
            </Alert>
          )}
          <GoogleLogin
            onSuccess={async (credentialResponse) => {
              const decode = jwtDecode(credentialResponse.credential);
              const {jwt} = await login({correo:decode.email})
              if (!jwt) {
                setError(true)
              }
              iniciarSesion(jwt)
              navigation("/inicio");
              setError(false);

              

              // obtenerUsuariosCorreo(decode.email).then((item) => {
              //   if (item) {
              //     localStorage.setItem("jwt", credentialResponse.credential);
              //     iniciarSesion(
              //       item.id_usuario,
              //       item.nombre_usuario,
              //       item.email,
              //       item.nombre_perfil
              //     );
              //   } else {
              //     setError(true);
              //   }
              // });
            }}
            onError={() => {
              setError(true);
            }}
          />
          {DEMO_MODE && (
            <section aria-labelledby="demo-login-title" className="mt-4 border rounded p-3">
              <h6 id="demo-login-title">Acceso visual local</h6>
              <p className="mb-2">
                Permite recorrer la interfaz sin levantar el backend. Solo está disponible en desarrollo.
              </p>
              <label htmlFor="demo-role" className="block text-sm font-medium text-slate-700">
                Perfil de demostración
              </label>
              <select
                id="demo-role"
                className="block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 mb-2"
                value={demoRole}
                onChange={(event) => setDemoRole(event.target.value)}
              >
                {Object.keys(DEMO_USERS).map((role) => (
                  <option key={role} value={role}>
                    {DEMO_USERS[role].nombre_perfil}
                  </option>
                ))}
              </select>
              <button
                type="button"
                className="inline-flex items-center justify-center gap-2 rounded-md border border-blue-600 px-4 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-50"
                onClick={() => {
                  iniciarSesion(createDemoToken(demoRole));
                  navigation("/inicio");
                }}
              >
                Entrar al modo demo
              </button>
            </section>
          )}
        </>
      </Contenedor>
      {/* <Container className="pt-4 pb-5">
        <Card>
          <Card.Header>
            <h3>Vesta Risk Manager - Login</h3>
          </Card.Header>
          <Card.Body>
            <h5>Bienvenido</h5>
            <p>
              Estimado usuario: Bienvenido a la aplicaci&oacute;n Vesta Risk
              Manager, una aplicaci&oacute;n desarrollada en la UARG - UNPA.
            </p>
            <Alert variant="danger">
              <strong>Importante:</strong> Para acceder al sistema es necesario
              disponer de un correo de{" "}
              <a href="http://www.gmail.com" target="_blank">
                Gmail
              </a>
            </Alert>
            <hr />
            <h5>Ingreso al Sistema</h5>
            <p>
              Ud. puede ingresar el sistema si est&aacute; conectado a su
              e-mail. Por favor haga click en el bot&oacute;n a
              continuaci&oacute;n y elija su cuenta o realice el login.
            </p>
            {error && (
              <Alert variant="danger">
                Usuario ingresado no registrado. Solicite ser registrado por un
                administrador del sistema e intentelo de nuevo.
              </Alert>
            )}
            <GoogleLogin
              onSuccess={(credentialResponse) => {
                console.log(credentialResponse);
              }}
              onError={() => {
                console.log("Login Failed");
              }}
            />
          </Card.Body>
        </Card>
      </Container> */}
      <Footer></Footer>
    </>
  );
}
