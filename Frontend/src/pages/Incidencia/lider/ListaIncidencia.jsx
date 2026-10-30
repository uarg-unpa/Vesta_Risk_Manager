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
  faPlus,
  faTrashCan,
  faFilePdf,
  faCheck,
  faXmark
} from "@fortawesome/free-solid-svg-icons";
import {
  useLoaderData,
  useNavigate,
} from "react-router-dom";
import { formatearFecha, formatearFechaHora, filtrarYFormatear } from "../../../utils/funciones";
import { informeIncidencia } from "../../informes/incidencia";
import { obtenerInformeIncidencia } from "../../../services/informes";
import BotonSalir from "../../../components/BotonSalir";
import "./../../../styles/ListaRiesgo.css";
import { eliminarIncidencia, obtenerIncidenciasProyectoPaginado } from "../../../services/incidencia";
import Paginado from "../../../components/Paginado";
import { useUsuario } from "../../../context/usuarioContext";

export default function ListaIncidencia() {
  const { incidencias, totalPaginas, iteracion } = useLoaderData();
  
  
  const navigate = useNavigate();
  const proyecto = JSON.parse(localStorage.getItem("proyecto_seleccionado"));
  const [paginaActual, setPaginaActual] = useState(1);
  const [incidenciasCargadas, setIncidenciasCargadas] = useState(incidencias);
  const [eliminar, setEliminar] = useState(false);
  const [incidenciaSeleccionada, setIncidenciaSeleccionada] = useState(0);

  useEffect(() => {
    obtenerIncidenciasProyectoPaginado(proyecto.id_proyecto, paginaActual).then(
      (data) => {
        setIncidenciasCargadas(data.incidencias);
      }
    );
  }, [paginaActual]);

  const { usuario } = useUsuario();
  const comprobacionEspectador = usuario.nombre_perfil === "Espectador" || usuario.nombre_perfil === "Administrador";
  return (
    <>
      <NavegadorLider />
      {comprobacionEspectador ? (
              <Alert variant="primary" className="text-center">
                Usted es espectador del proyecto {proyecto.nombre}. Sólo se permite la visualización.
              </Alert>
            ) : null}
      {iteracion === null ? (
        <Alert variant="danger" className="text-center">
          No existe una iteración activa del proyecto. Sólo se permite
          visualizar.
        </Alert>
      ) : null}
      <Contenedor>
        <>
          <h3>{proyecto.nombre} - Incidencias ocurridas</h3>
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
          <Button
            variant="success"
            onClick={() => {
              navigate(`/inicio/proyecto/lider/${proyecto.id_proyecto}/monitoreo/incidencia/crear`,
                {
                  state:{ruta: `/inicio/proyecto/lider/${proyecto.id_proyecto}/monitoreo/incidencias`}
                }
              );
            }}
            disabled={iteracion === null || comprobacionEspectador} 
          >
            <FontAwesomeIcon icon={faPlus} className="mx-1" />
            Nueva incidencia
          </Button>
          <Table size="sm" hover className="mt-2" bordered>
            <thead className="cabecera">
              <tr>
                <th style={{width: "5em" }} className="th">Identificador del riesgo</th>
                <th className="th" style={{ maxWidth: "5em" }}>Descripción</th>
                <th className="th">Responsable</th>
                <th style={{ width: "4em" }} className="th">
                  Gravedad
                </th>
                <th style={{ maxWidth: "4em" }} className="th">
                  Fecha
                </th>
                <th className="th" style={{ width: "10em" }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {incidenciasCargadas && incidenciasCargadas.length > 0 ? incidenciasCargadas.map((incidencia, key) => (
                <tr key={key} style={{textAlign:"center"}}>
                  <td>RK
                    {incidencia.id_riesgo < 10
                      ? `0${incidencia.id_riesgo}`: incidencia.id_riesgo}</td>
                  <td>{incidencia.descripcion}</td>
                  <td>{incidencia.responsable_nombre}</td>
                  <td style={{color: incidencia.gravedad === "Alta" ? "red" : incidencia.gravedad === "Media" ? "yellow":"gray", fontWeight:"bold"}}>{incidencia.gravedad}</td>
                  <td>{formatearFechaHora(new Date(incidencia.fecha_ocurrencia))}</td>
                  <td className="td">
                      <OverlayTrigger
                        placement="top"
                        overlay={<Tooltip id="tooltip-edit">Ver</Tooltip>}
                      >
                        <Button
                          variant="outline-primary"
                          onClick={() => {
                            navigate(`/inicio/proyecto/${comprobacionEspectador ? "espectador":"lider"}/${proyecto.id_proyecto}/monitoreo/incidencia/${incidencia.id_incidencia}`, {state: {ruta: `/inicio/proyecto/${comprobacionEspectador ? "espectador":"lider"}/${proyecto.id_proyecto}/monitoreo/incidencias`}})
                          }}
                        >
                          <FontAwesomeIcon icon={faSearch} />
                        </Button>
                      </OverlayTrigger>
                      <OverlayTrigger
                        placement="top"
                        overlay={<Tooltip id="tooltip-edit">Descargar</Tooltip>}
                      >
                        <Button
                          style={{ marginLeft: "5px" }}
                          variant="outline-dark"
                          disabled={comprobacionEspectador}
                          onClick={async() => {
                            const respuesta = await obtenerInformeIncidencia(incidencia.id_incidencia) 
                            const iteracionExiste = iteracion ? iteracion : {}                                          
                            const datos = {
                              id_riesgo: `RK${incidencia.id_riesgo < 10 ? '0':''}${incidencia.id_riesgo}`,
                              iteracion_nombre: iteracionExiste.nombre ? iteracionExiste.nombre : null,
                              responsable: incidencia.responsable_nombre,
                              responsable_correo: respuesta.responsable_email,
                              responsable_rol: respuesta.responsable_rol,
                              nombre_proyecto: proyecto.nombre,
                              descripcion_riesgo: respuesta.descripcion_riesgo,
                              responsable_riesgo: respuesta.responsable_riesgo,
                              tipo_riesgo: respuesta.tipo_riesgo,
                              fecha_incidencia: formatearFechaHora(new Date(incidencia.fecha_ocurrencia)),
                              descripcion_incidencia: incidencia.descripcion,
                              observaciones_incidencia: incidencia.gravedad,
                              lideres_proyecto: filtrarYFormatear(proyecto.participantes, "Lider del proyecto"),
                              desarrolladores_proyecto: filtrarYFormatear(proyecto.participantes, "Desarrollador")
                            }
                            informeIncidencia(datos)
                          }}
                        >
                          <FontAwesomeIcon icon={faFilePdf} />
                        </Button>
                      </OverlayTrigger>
                      <OverlayTrigger
                        placement="top"
                        overlay={<Tooltip id="tooltip-edit">Eliminar</Tooltip>}
                      >
                        <Button
                          style={{ marginLeft: "5px" }}
                          variant="outline-danger"
                          disabled={iteracion === null || comprobacionEspectador}
                          onClick={() => {
                            setEliminar(true)
                            setIncidenciaSeleccionada(incidencia.id_incidencia)
                          }}
                        >
                          <FontAwesomeIcon icon={faTrashCan} />
                        </Button>
                      </OverlayTrigger>
                      
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: "center" }}>No hay incidencias</td>
                </tr>
              )}
            </tbody>
          </Table>
          <Paginado paginaActual={paginaActual} setPaginaActual={setPaginaActual} totalPaginas={totalPaginas} />
          <BotonSalir ruta={`/inicio/proyecto/${comprobacionEspectador ? "espectador": "lider"}/${proyecto.id_proyecto}/monitoreo`} />
        </>
      </Contenedor>

      <Modal
        show={eliminar}
        onHide={() => {
          setEliminar(false)
          setIncidenciaSeleccionada(0)
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>¿Está seguro?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Una vez eliminada la incidencia, será irrecuperable.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button
            type="button"
            variant="outline-success"
            onClick={async() => {
              await eliminarIncidencia(incidenciaSeleccionada)
              navigate(0);
              setEliminar(false)
              setIncidenciaSeleccionada(0)
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
              setIncidenciaSeleccionada(0)
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
      <Footer />
    </>
  );
}
