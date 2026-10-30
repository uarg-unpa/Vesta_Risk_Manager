import React, { useEffect, useState } from "react";
import NavegadorLider from "../../../components/NavegadorLider";
import Footer from "../../../components/Footer";
import Contenedor from "../../../components/Contenedor";
import {
  Alert,
  Button,
  OverlayTrigger,
  Table,
  Tooltip,
} from "react-bootstrap";
import { useLoaderData, useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch} from "@fortawesome/free-solid-svg-icons";
import BotonSalir from "../../../components/BotonSalir";
import { formatearFecha, modificarImpacto, modificarProbabilidad } from "../../../utils/funciones";
import Paginado from "../../../components/Paginado";
import { obtenerEvaluacionesActualesProyectoDesarrolladorPaginado } from "../../../services/evaluacion";
import { useUsuario } from "../../../context/usuarioContext";

export default function VerEvaluacionesActualesDesarrollador() {
  const proyecto = JSON.parse(localStorage.getItem("proyecto_seleccionado"));
  const location = useLocation();
  const navigate = useNavigate();
  const { usuario } = useUsuario();
  
  
  const { evaluaciones, totalPaginas, iteracion } = useLoaderData();
  const [paginaActual, setPaginaActual] = useState(1);
  const [evaluacionesCargadas, setEvaluacionesCargadas] = useState(evaluaciones);

  useEffect(() => {
    obtenerEvaluacionesActualesProyectoDesarrolladorPaginado(proyecto.id_proyecto, usuario.id_usuario, paginaActual).then(
      (data) => {
        setEvaluacionesCargadas(data.evaluaciones);
      }
    );
  }, [paginaActual]);

  const [mensaje, setMensaje] = useState("")

  useEffect(() => {
    if (location.state?.mensaje) {
      window.scrollTo(0, 0);
      setMensaje(location.state.mensaje);

      // Limpiar el mensaje después de unos segundos
      const timeoutId = setTimeout(() => {
        setMensaje("");
      }, 3000); // Mostrar el mensaje durante 3 segundos

      // Limpiar el timeout si el componente se desmonta
      return () => clearTimeout(timeoutId);
    }
  }, [location.state]);

  return (
    <>
      <NavegadorLider />
      {mensaje ? (
        <Alert variant="success" className="text-center fs-4">
          {mensaje}
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

          <h3>{proyecto.nombre} - Evaluaciones Actuales</h3>
          
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
              <th style={{ width: "5em" }} className="th">Riesgo</th>
              <th style={{ width: "10em" }} className="th">Impacto</th>
              <th style={{ width: "10em" }} className="th">Probabilidad</th>
              <th style={{ maxWidth: "20em" }} className="th">Justificaci&oacute;n</th>
              <th style={{ width: "14em" }} className="th">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {evaluacionesCargadas.length > 0 ? evaluacionesCargadas.map((evaluacion, key) => (
              <tr key={key} style={{ textAlign: "center" }}>
                <td style={{ textWrap: "wrap" }}>{evaluacion.id_riesgo < 10 ? "RK0" : "RK" }{evaluacion.id_riesgo}</td>
                <td>{modificarImpacto(evaluacion.impacto)}</td>
                <td>{modificarProbabilidad(evaluacion.probabilidad)}</td>
                <td style={{ textWrap: "wrap" }}>{evaluacion.descripcion}</td>
                <td className="td">

                  <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip id="tooltip-edit">Ver</Tooltip>}
                  >
                    <Button
                      variant="outline-primary"
                      onClick={() => {
                        navigate(`/inicio/proyecto/desarrollador/${proyecto.id_proyecto}/monitoreo/evaluacion/${evaluacion.id_evaluacion}`, {
                          state: { ruta: `/inicio/proyecto/desarrollador/${proyecto.id_proyecto}/evaluaciones/actual` }
                        })
                      }}
                    >
                      <FontAwesomeIcon icon={faSearch} />
                    </Button>
                  </OverlayTrigger>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="5" style={{ textAlign: "center" }}>No hay evaluaciones</td>
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