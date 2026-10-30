import React, { useEffect, useState } from "react";
import Contenedor from "../../../components/Contenedor";
import NavegadorLider from "../../../components/NavegadorLider";
import Footer from "../../../components/Footer";
import {
  Alert,
  Button,
  OverlayTrigger,
  Table,
  Tooltip,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import {
  useLoaderData,
  useNavigate,
} from "react-router-dom";
import { formatearFecha, formatearFechaHora } from "../../../utils/funciones";
import BotonSalir from "../../../components/BotonSalir";
import "./../../../styles/ListaRiesgo.css";
import { obtenerIncidenciasProyectoPaginado } from "../../../services/incidencia";
import Paginado from "../../../components/Paginado";

export default function ListaIncidenciaDesarrollador() {
  const { incidencias, totalPaginas, iteracion } = useLoaderData();
  
  
  const navigate = useNavigate();
  const proyecto = JSON.parse(localStorage.getItem("proyecto_seleccionado"));
  const [paginaActual, setPaginaActual] = useState(1);
  const [incidenciasCargadas, setIncidenciasCargadas] = useState(incidencias);

  useEffect(() => {
    obtenerIncidenciasProyectoPaginado(proyecto.id_proyecto, paginaActual).then(
      (data) => {
        setIncidenciasCargadas(data.incidencias);
      }
    );
  }, [paginaActual]);
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
              navigate(`/inicio/proyecto/desarrollador/${proyecto.id_proyecto}/monitoreo/incidencia/crear`, {
                state: {ruta: `/inicio/proyecto/desarrollador/${proyecto.id_proyecto}/monitoreo/incidencias`}
              });
            }}
            disabled={iteracion === null}
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
                <th className="th" style={{ width: "5em" }}>Acciones</th>
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
                            navigate(`/inicio/proyecto/desarrollador/${proyecto.id_proyecto}/monitoreo/incidencia/${incidencia.id_incidencia}`, {state: {ruta: "/inicio/proyecto/desarrollador/" + proyecto.id_proyecto + "/monitoreo/incidencias"}})
                          }}
                        >
                          <FontAwesomeIcon icon={faSearch} />
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
          <BotonSalir ruta={"/inicio/proyecto/desarrollador/" + proyecto.id_proyecto + "/monitoreo"} />
        </>
      </Contenedor>
      <Footer />
    </>
  );
}
