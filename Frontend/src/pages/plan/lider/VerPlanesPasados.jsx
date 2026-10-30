import React, { useEffect, useState } from "react";
import NavegadorLider from "../../../components/NavegadorLider";
import Footer from "../../../components/Footer";
import Contenedor from "../../../components/Contenedor";
import { Alert, Button, OverlayTrigger, Table, Tooltip } from "react-bootstrap";
import { useLoaderData, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import BotonSalir from "../../../components/BotonSalir";
import { obtenerPlanesAnterioresProyectoPaginado } from "../../../services/planes";
import Paginado from "../../../components/Paginado";
import { formatearFecha } from "../../../utils/funciones";
import { useUsuario } from "../../../context/usuarioContext";

export default function VerPlanesPasados() {
  const proyecto = JSON.parse(localStorage.getItem("proyecto_seleccionado"));
  const navigate = useNavigate();

  const { planes, totalPaginas, iteracion } = useLoaderData();
  
  const [paginaActual, setPaginaActual] = useState(1);
  const [planesCargados, setPlanesCargados] = useState(planes);

  useEffect(() => {
    obtenerPlanesAnterioresProyectoPaginado(proyecto.id_proyecto, paginaActual).then(
      (data) => {
        setPlanesCargados(data.planes);
      }
    );
  }, [paginaActual]);  

  const {usuario} = useUsuario();
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
        
          <h3>{proyecto.nombre} - Planes pasados</h3>
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
                <th className="th" style={{ width: "6em" }}>
                  Riesgo
                </th>
                <th className="th" style={{ width: "8em" }}>
                  Factor de riesgo
                </th>
                <th className="th" style={{ width: "10em" }}>
                  Tipo
                </th>
                <th className="th" style={{ width: "28em" }}>
                  Descripción
                </th>
                <th className="th">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {planesCargados && planesCargados.length > 0
                ? planesCargados.map((plan, key) => (
                    <tr key={key}>
                      <td className="td">
                        RK
                        {plan.id_riesgo < 10
                          ? "0"
                          : ""}
                        {
                          plan.id_riesgo
                        }
                      </td>
                      <td className="td">{plan.factor_riesgo}</td>
                      <td className="td">{plan.tipo}</td>
                      <td className="td">{plan.descripcion}</td>
                      <td className="td">
                        <div>
                        <OverlayTrigger
                            placement="top"
                            overlay={<Tooltip id="tooltip-edit">Ver</Tooltip>}
                          >
                            <Button
                              variant="outline-primary"
                              onClick={() => {
                                navigate(
                                  `/inicio/proyecto/${comprobacionEspectador ? "espectador" : "lider"}/${proyecto.id_proyecto}/monitoreo/plan/${plan.id_plan}`,
                                  {
                                    state: {
                                      ruta: `/inicio/proyecto/${comprobacionEspectador ? "espectador" : "lider"}/${proyecto.id_proyecto}/monitoreo/planes/pasados`,
                                    },
                                  }
                                );
                              }}
                            >
                              <FontAwesomeIcon icon={faSearch} />
                            </Button>
                          </OverlayTrigger>
                        </div>
                      </td>
                    </tr>
                  ))
                :
                <tr>
                    <td colSpan="5" className="text-center fs-5">
                      No hay planes de riesgo registrados.
                    </td>
                  </tr> 
                }
            </tbody>
          </Table>
          <Paginado paginaActual={paginaActual} setPaginaActual={setPaginaActual} totalPaginas={totalPaginas} />
          <BotonSalir ruta={`/inicio/proyecto/${comprobacionEspectador ? "espectador" : "lider"}/${proyecto.id_proyecto}/monitoreo`} />
        </>
      </Contenedor>
      <Footer />
    </>
  );
}
