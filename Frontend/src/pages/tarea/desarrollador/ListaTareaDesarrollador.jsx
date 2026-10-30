import React, { useEffect, useState } from "react";
import Contenedor from "../../../components/Contenedor";
import NavegadorLider from "../../../components/NavegadorLider";
import Footer from "../../../components/Footer";
import {
  Alert,
  Button,
  Modal,
  OverlayTrigger,
  Table,
  Tooltip,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faCheck,
  faXmark
} from "@fortawesome/free-solid-svg-icons";
import {
  useLoaderData,
  useNavigate,
} from "react-router-dom";
import { formatearFecha } from "../../../utils/funciones";
import { useUsuario } from "../../../context/usuarioContext";
import { completarTarea, obtenerTareasDesarrolladorProyectoPaginado } from "../../../services/planes";
import BotonSalir from "../../../components/BotonSalir";
import "./../../../styles/ListaRiesgo.css";
import Paginado from "../../../components/Paginado";

export default function ListaTareaDesarrollador() {
  const { tareas,totalPaginas, iteracion } = useLoaderData();
  
  const navigate = useNavigate();
  const proyecto = JSON.parse(localStorage.getItem("proyecto_seleccionado"));
  const { usuario } = useUsuario();  

  const [completar, setCompletar] = useState(false)
  const [tareaSeleccionada, setTareaSeleccionada] = useState(0)

  const [tareasCargadas, setTareasCargadas] = useState(tareas)
  const [paginaActual, setPaginaActual] = useState(1)

  useEffect(() => {
    obtenerTareasDesarrolladorProyectoPaginado(proyecto.id_proyecto, usuario.id_usuario, paginaActual).then((data) => {
      const {tareas, _} = data;
      setTareasCargadas(tareas)
    })
  }, [paginaActual])
  

  return (
    <>
      <NavegadorLider />
      {iteracion === null ? (
        <Alert variant="danger" className="text-center">
          No existe una iteración activa del proyecto. Sólo se permite
          visualizar.
        </Alert>
      ) : null}
      <Contenedor>
        <>
          <h3>{proyecto.nombre} - Tareas a Realizar</h3>
          {iteracion ? (
            <>
              <h4>
                {iteracion.nombre}
                {" - "}
                {formatearFecha(iteracion.fecha_inicio)}
                {" al "}
                {formatearFecha(iteracion.fecha_fin)}
              </h4>
            </>
          ) : null}
        </>
        <>
          <Table size="sm" hover className="mt-2" bordered>
            <thead className="cabecera">
              <tr>
                <th style={{ maxWidth: "5em" }} className="th">Nombre</th>
                <th style={{ width: "20em" }} className="th">Descripción</th>
                <th style={{ width: "10em" }} className="th">
                  Fecha de inicio
                </th>
                <th style={{ width: "10em" }} className="th">
                  Fecha de fin
                </th>
                <th style={{ maxWidth: "5em" }} className="th">Estado</th>
                <th className="th">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {tareasCargadas && tareasCargadas.length > 0 ? tareasCargadas.map((tarea, key) => (
                <tr key={key} style={{textAlign:"center"}}>
                  <td>{tarea.nombre}</td>
                  <td style={{textWrap:"wrap"}}>{tarea.descripcion}</td>
                  <td>{formatearFecha(tarea.fecha_inicio)}</td>
                  <td>{formatearFecha(tarea.estado == '0' ? tarea.fecha_fin : tarea.fecha_fin_real)}</td>
                  <td>{tarea.estado == '0' ? "Pendiente" : "Completado"}</td>
                  <td className="td">
                    <OverlayTrigger
                        placement="top"
                        overlay={<Tooltip id="tooltip-edit">Completar</Tooltip>}
                      >
                        <Button
                          style={{ marginRight: "5px" }}
                          variant="outline-success"
                          onClick={()=>{
                            setCompletar(true)
                            setTareaSeleccionada(tarea.id_tarea)
                          }}
                          className={tarea.estado == '1' ? "d-none":""}
                        >
                          <FontAwesomeIcon icon={faCheck} />
                        </Button>
                      </OverlayTrigger>
                      <OverlayTrigger
                        placement="top"
                        overlay={<Tooltip id="tooltip-edit">Ver</Tooltip>}
                      >
                        <Button
                          variant="outline-primary"
                          onClick={() => {
                            navigate(`/inicio/proyecto/desarrollador/${proyecto.id_proyecto}/monitoreo/${usuario.id_usuario}/tarea/${tarea.id_tarea}`, {
                              state: {
                                ruta: "/inicio/proyecto/desarrollador/" + proyecto.id_proyecto + "/monitoreo/" + usuario.id_usuario + "/tareas"
                              }
                            })
                          }}
                        >
                          <FontAwesomeIcon icon={faSearch} />
                        </Button>
                      </OverlayTrigger>
                      
                      
                  </td>
                </tr>
              )) : 
              <tr>
                <td colSpan="6" className="text-center fs-5">
                  No hay tareas registradas.
                </td>
              </tr>
              }
            </tbody>
          </Table>
          <Paginado paginaActual={paginaActual} setPaginaActual={setPaginaActual} totalPaginas={totalPaginas} />
          <BotonSalir ruta={"/inicio/proyecto/desarrollador/" + proyecto.id_proyecto + "/monitoreo"} />
          <Modal
            show={completar}
            onHide={() => {
              setCompletar(false);
              setTareaSeleccionada(0)
            }}
          >
            <Modal.Header closeButton>
              <Modal.Title>¿Está seguro?</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p>
                La tarea será marcada como completada y no se podrá revertir la acción.
              </p>
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="outline-success"
                onClick={async () => {
                  await completarTarea(tareaSeleccionada)
                  setCompletar(false);
                  navigate(0)
                }}
              >
                <FontAwesomeIcon
                  icon={faCheck}
                  style={{ marginRight: "5px" }}
                />
                Marcar como completado
              </Button>
              <Button
                variant="outline-danger"
                onClick={() => {
                  setCompletar(false);
                  setTareaSeleccionada(0)
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
      </Contenedor>
      <Footer />
    </>
  );
}
