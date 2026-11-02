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
        className="flex shrink-0 items-center justify-center bg-[#212529] dark:bg-[#374151]"
      >
        <p className="text-white">
          <FontAwesomeIcon
            icon={faUser}
            style={{ marginRight: "5px", fontSize: "20px" }}
          />
          {usuario.nombre_usuario + " "}
          <a
            href="/"
            className="text-blue-600 underline hover:text-blue-800 dark:text-blue-300 dark:hover:text-blue-200"
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
        className="block shrink-0 bg-[#212529] dark:bg-[#374151]"
      ></footer>
    );
  }
}
