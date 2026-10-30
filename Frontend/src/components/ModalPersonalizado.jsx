import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import "./../styles/modal.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faXmark } from "@fortawesome/free-solid-svg-icons";

/**
 * Componente ModalPersonalizado
 *
 * Este componente renderiza un modal personalizado con un título, contenido personalizado
 * y botones para confirmar o cancelar una acción.
 *
 * @param {string} title - Título del modal.
 * @param {ReactNode} children - Contenido personalizado que se mostrará en el cuerpo del modal.
 * @param {boolean} show - Estado que controla si el modal está visible o no.
 * @param {Function} setShow - Función para actualizar el estado `show`.
 * @param {Function} onConfirm - Función que se ejecuta al confirmar la acción.
 * @param {Function} datosDefecto - Función que se ejecuta al abrir o cerrar el modal.
 *
 * @returns {JSX.Element} - Un modal personalizado con título, contenido y botones de acción.
 */
export default function ModalPersonalizado({
  title,
  children,
  show,
  setShow,
  onConfirm,
  datosDefecto,
  modificado,
}) {
  // Estado para controlar si el botón de confirmación ha sido presionado
  const [botonPresionado, setBotonPresionado] = useState(false);

  /**
   * Función para alternar la visibilidad del modal.
   * También ejecuta la función `datosDefecto` para restablecer valores predeterminados.
   */
  const handleShow = () => {
    setShow(!show);
    datosDefecto();
  };

  return (
    <Modal show={show} onHide={handleShow} size="xl">
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{children}</Modal.Body>
      <Modal.Footer>
        <Button
          variant="outline-success"
          onClick={() => {
            setBotonPresionado(true);
            onConfirm();
            setBotonPresionado(false);
          }}
          disabled={botonPresionado}
        >
          <FontAwesomeIcon icon={faCheck} style={{ marginRight: "5px" }} />
          {modificado ? "Modificar" : "Añadir"}
        </Button>
        <Button variant="outline-danger" onClick={handleShow}>
          <FontAwesomeIcon icon={faXmark} style={{ marginRight: "5px" }} />
          Cancelar
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
