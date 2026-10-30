import { faArrowRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
/**
 * Componente BotonSalir
 *
 * Este componente renderiza un botón que, al hacer clic, redirige al usuario a una ruta específica.
 *
 * @param {string} ruta - La ruta a la que se redirigirá al usuario al hacer clic en el botón.
 *
 * @returns {JSX.Element} - Un botón con un ícono de salida que redirige al usuario.
 */
export default function BotonSalir({ ruta }) {
    const navigate = useNavigate();

    return (
      <Button
        onClick={() => {
        navigate(ruta);
      }}
    >
      <FontAwesomeIcon icon={faArrowRightFromBracket} className="mx-1" />
      Volver
    </Button>
  );
}
