import React, { useState } from "react";
import Navegador from "../../components/Navegador";
import Footer from "../../components/Footer";
import Contenedor from "../../components/Contenedor";
import { eliminarUsuario } from "../../services/usuarios";
import { useLoaderData, useNavigate, useParams } from "react-router-dom";
import { Alert, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faTriangleExclamation,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import BotonSalir from "../../components/BotonSalir";


export default function EliminarUsuario() {
  const { usuario } = useLoaderData();
  const { id_usuario } = useParams();
  const navigate = useNavigate();
  const [eliminado, setEliminado] = useState(null);
  const [botonPresionado, setBotonPresionado] = useState(false);

  const handleClick = async () => {
    setBotonPresionado(true);
    const resultado = await eliminarUsuario(id_usuario);
    setEliminado(resultado);
    setBotonPresionado(false);
  };

  if (eliminado === null) {
    return (
      <>
        <Navegador />
        <Contenedor>
          <h3>Eliminar Usuario</h3>
          <>
            <Alert variant="warning">
              <FontAwesomeIcon
                icon={faTriangleExclamation}
                className="mx-2"
                style={{ fontSize: "22px" }}
              />
              ATENCIÓN. Esta operación no puede deshacerse.
            </Alert>
            <p>
              ¿Est&aacute; seguro que desea eliminar el usuario{" "}
              <b>{usuario.nombre_usuario}</b>?
            </p>
          </>
          <>
            <Button
              variant="outline-success"
              className="mx-1"
              onClick={handleClick}
              disabled={botonPresionado}
            >
              <FontAwesomeIcon icon={faCheck} style={{ marginRight: "5px" }} />
              Sí, deseo eliminar
            </Button>
            <Button
              variant="outline-danger"
              className="mx-1"
              onClick={() => {
                navigate("/inicio/usuarios");
              }}
            >
              <FontAwesomeIcon icon={faXmark} style={{ marginRight: "5px" }} />
              NO (Salir de esta pantalla)
            </Button>
          </>
        </Contenedor>
        <Footer />
      </>
    );
  } else {
    return (
      <>
        <Navegador />
        <Contenedor>
          <h3>Eliminar Usuario</h3>
          <>
            {eliminado ? (
              <Alert variant="success">Operación realizada con éxito.</Alert>
            ) : (
              <Alert variant="danger">Ha ocurrido un error.</Alert>
            )}
            <hr />
            <h5>Opciones</h5>
            <BotonSalir ruta={"/inicio/usuarios"} />
          </>
        </Contenedor>
      </>
    );
  }
}
