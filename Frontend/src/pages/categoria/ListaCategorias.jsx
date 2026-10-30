import React, { useEffect, useState } from "react";
import Navegador from "../../components/Navegador";
import Footer from "../../components/Footer";
import Contenedor from "../../components/Contenedor";
import { useLoaderData, useLocation } from "react-router-dom";
import { Table, Button, Modal, Alert, OverlayTrigger, Tooltip } from "react-bootstrap";
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
import { eliminarCategoria, obtenerCategorias } from "../../services/categorias";
import BotonSalir from "../../components/BotonSalir";
import Paginado from "../../components/Paginado";

export default function ListaCategorias() {
  const {categorias, totalPaginas} = useLoaderData();
  const navigate = useNavigate();
  const location = useLocation();
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(0);
  const [eliminar, setEliminar] = useState(false)
  const [mensaje, setMensaje] = useState("")
  const [categoriasCargadas, setCategoriasCargadas] = useState(categorias);
  const [paginaActual, setPaginaActual] = useState(1)

  useEffect(() => {
      obtenerCategorias(paginaActual).then((data)=>{
        const {categorias, _} = data;
        setCategoriasCargadas(categorias)
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
        <h3>Categorías</h3>
        <>
          <Button
            variant="success"
            onClick={() => {
              navigate("/inicio/categoria/crear");
            }}
          >
            <FontAwesomeIcon icon={faPlus} className="mx-1" />
            Nueva categoría
          </Button>
          <Table size="sm" hover className="mt-2">
            <thead className="table-info">
              <tr>
                <th className="text-center">Nombre</th>
                <th className="text-center">Descripción</th>
                <th className="text-center" style={{ minWidth: "12em" }}>
                  Opciones
                </th>
              </tr>
            </thead>
            <tbody>
              {categoriasCargadas.map((item, key) => (
                <tr key={key}>
                  <td>{item.nombre}</td>
                  <td>{item.descripcion}</td>
                  <td style={{ minWidth: "12em", textAlign: "center" }}>
                    <OverlayTrigger
                      placement="top"
                      overlay={<Tooltip id="tooltip-edit">Ver</Tooltip>}
                    >
                      <Button
                        variant="outline-primary"
                        className="mx-1"
                        onClick={() => {
                          navigate(`/inicio/categoria/${item.id_categoria}`);
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
                            `/inicio/categoria/modificar/${item.id_categoria}`
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
                        disabled={null}
                        onClick={() => {
                          setCategoriaSeleccionada(item.id_categoria)
                          setEliminar(true)
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
              setCategoriaSeleccionada(0)
            }}
          >
            <Modal.Header closeButton>
              <Modal.Title>¿Está seguro?</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p>
                Una vez eliminada la categoría no se podra utilizar en futuros proyectos.
              </p>
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="outline-success"
                onClick={async() => {
                  await eliminarCategoria(categoriaSeleccionada)
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
                  setCategoriaSeleccionada(0)
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
