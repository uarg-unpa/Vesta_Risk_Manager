import React, { useEffect, useState } from "react";
import Navegador from "../../components/Navegador";
import Footer from "../../components/Footer";
import Contenedor from "../../components/Contenedor";
import { useLoaderData, useLocation } from "react-router-dom";
import { Table, Button, Alert, Modal, OverlayTrigger, Tooltip } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faTrashCan,
  faPlus,
  faCheck,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { faPenToSquare } from "@fortawesome/free-regular-svg-icons";
import { useNavigate } from "react-router-dom";
import { useUsuario } from "../../context/usuarioContext";
import { eliminarUsuario, obtenerUsuarios } from "../../services/usuarios";
import BotonSalir from "../../components/BotonSalir";
import Paginado from "../../components/Paginado";

export default function ListaUsuarios() {
  const { usuario } = useUsuario();
  const {usuarios, totalPaginas} = useLoaderData();
  const [usuariosCargados, setUsuariosCargados] = useState(usuarios);
  const [paginaActual, setPaginaActual] = useState(1)
  const navigate = useNavigate();
  const location = useLocation();
  const [mensaje, setMensaje] = useState("")
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(0);
  const [eliminar, setEliminar] = useState(false)

  useEffect(() => {
    obtenerUsuarios(paginaActual).then((data)=>{
      const {usuarios, _} = data;
      setUsuariosCargados(usuarios)
    })

  }, [paginaActual])
  
  useEffect(() => {
        if (location.state?.mensaje) {
          window.scrollTo(0, 0);
          setMensaje(location.state.mensaje);
    
          const timeoutId = setTimeout(() => {
            setMensaje("");
          }, 3000); 
    
          return () => clearTimeout(timeoutId);
        }
      }, [location.state]);
  
  return (
    <>
      <Navegador />
      {mensaje ? (
                    <Alert variant="success" className="text-center fs-4">
                      {mensaje}
                    </Alert>
                  ) : null}
      <Contenedor>
        <h3>Usuarios</h3>
        <>
          <Button
            variant="success"
            onClick={() => {
              navigate("/inicio/usuario/crear");
            }}
          >
            <FontAwesomeIcon icon={faPlus} className="mx-1" />
            Nuevo usuario
          </Button>
          <Table size="sm" hover className="mt-2">
            <thead className="table-info">
              <tr>
                <th>Usuarios</th>
                <th>Opciones</th>
              </tr>
            </thead>
            <tbody>
              {usuariosCargados.map((item, key) => (
                <tr key={key}>
                  <td>
                    {item.nombre}
                    <br />
                    {item.email}
                  </td>
                  <td>
                    <OverlayTrigger
                      placement="top"
                      overlay={<Tooltip id="tooltip-edit">Ver</Tooltip>}
                    >
                      <Button
                        variant="outline-primary"
                        className="mx-1"
                        onClick={() => {
                          navigate(`/inicio/usuario/${item.id_usuario}`);
                        }}
                      >
                        <FontAwesomeIcon icon={faSearch} />
                      </Button>
                    </OverlayTrigger>
                    <OverlayTrigger
                      placement="top"
                      overlay={<Tooltip id="tooltip-edit">Editar</Tooltip>}
                    >
                      <Button
                        variant="outline-warning"
                        className="mx-1"
                        onClick={() => {
                          navigate(
                            `/inicio/usuario/modificar/${item.id_usuario}`
                          );
                        }}
                      >
                        <FontAwesomeIcon icon={faPenToSquare} />
                      </Button>

                    </OverlayTrigger>
                    <OverlayTrigger
                      placement="top"
                      overlay={<Tooltip id="tooltip-edit">Eliminar</Tooltip>}
                    >
                    <Button
                      variant="outline-danger"
                      className="mx-1"
                      disabled={usuario.email == item.email}
                      onClick={() => {
                        setEliminar(true)
                        setUsuarioSeleccionado(item.id_usuario)
                      }}
                    >
                      <FontAwesomeIcon icon={faTrashCan} />
                    </Button>

                    </OverlayTrigger>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Paginado paginaActual={paginaActual} setPaginaActual={setPaginaActual} totalPaginas={totalPaginas} />
          <BotonSalir ruta={"/inicio"} />

        </>
      </Contenedor>
      <Footer />
      <Modal
        show={eliminar}
        onHide={() => {
          setEliminar(false)
          setUsuarioSeleccionado(0)
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>¿Está seguro?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
          Una vez eliminado el usuario, no podrá acceder nuevamente al sistema.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="outline-success"
            onClick={async() => {
              await eliminarUsuario(usuarioSeleccionado)
              navigate(0)
            }}
          >
            <FontAwesomeIcon
              icon={faCheck}
              style={{ marginRight: "5px" }}
            />
            Eliminar
          </Button>
          <Button
            variant="outline-danger"
            onClick={() => {
              setEliminar(false)
              setUsuarioSeleccionado(0)
            }}
          >
            <FontAwesomeIcon
              icon={faXmark}
              style={{ marginRight: "5px" }}
            />
            Cancelar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
