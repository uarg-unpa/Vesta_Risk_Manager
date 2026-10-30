import React from "react";
import { useLocation } from "react-router-dom";
import { useUsuario } from "./../context/usuarioContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";

/**
 * Componente Footer
 *
 * Este componente renderiza un pie de pagina general.
 * Si el usuario inicio sesion, se modifica el pie de pagina.
 *
 * @returns {JSX.Element} - Pie de pagina dependiendo si el usuario inicio sesion o no.
 */

export default function Footer() {
  const location = useLocation();
  const { usuario } = useUsuario();

  if (location.pathname.includes("inicio")) {
    return (
      <footer
        style={{
          minHeight: 100,
          borderTop: "5px solid transparent",
          backgroundImage:
            "linear-gradient(90deg, rgba(53,127,217,1) 0%, rgba(220,49,50,1) 100%)",
          backgroundClip: "padding-box, border-box",
          backgroundOrigin: "padding-box, border-box",
          backgroundRepeat: "no-repeat",
          backgroundSize: "100% 5px",
        }}
        className="bg-dark d-flex justify-content-center align-items-center h-25"
      >
        <p className="text-white">
          <FontAwesomeIcon
            icon={faUser}
            style={{ marginRight: "5px", fontSize: "20px" }}
          />
          {usuario.nombre_usuario + " "}
          <a
            href="/frontend"
            onClick={() => {
              localStorage.removeItem("usuario");
            }}
          >
            Cerrar Sesión
          </a>
        </p>
      </footer>
    );
  } else {
    return (
      <footer
        style={{
          minHeight: 80,
          borderTop: "5px solid transparent",
          backgroundImage:
            "linear-gradient(90deg, rgba(53,127,217,1) 0%, rgba(220,49,50,1) 100%)",
          backgroundClip: "padding-box, border-box",
          backgroundOrigin: "padding-box, border-box",
          backgroundRepeat: "no-repeat",
          backgroundSize: "100% 5px",
        }}
        className="bg-dark d-block h-25"
      ></footer>
    );
  }
}
