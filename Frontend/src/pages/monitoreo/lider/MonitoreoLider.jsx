import React from "react";
import NavegadorLider from "../../../components/NavegadorLider";
import Footer from "../../../components/Footer";
import Contenedor from "../../../components/Contenedor";
import { Alert, Button } from "react-bootstrap";
import { useLoaderData, useNavigate, useParams } from "react-router-dom";
import { useUsuario } from "../../../context/usuarioContext";
import { formatearFecha } from "../../../utils/funciones";

export default function MonitoreoLider() {
  const proyecto = JSON.parse(localStorage.getItem("proyecto_seleccionado"));
  const navigate = useNavigate();
  const { iteracion } = useLoaderData();
  const { id_proyecto } = useParams();
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
        <h3>{proyecto.nombre} - Monitoreo</h3>
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
        <div style={{ minHeight: "50vh" }}>
          <p>Seleccione una de las siguientes opciones:</p>
          <div className="d-flex gap-3" style={{ minHeight: "10vh" }}>
            <Button
              className="boton_2"
              onClick={() => {
                navigate(
                  `/inicio/proyecto/${comprobacionEspectador ? "espectador" : "lider"}/${id_proyecto}/monitoreo/planes`
                );
              }}
            >
              Planes actuales
            </Button>
            <Button 
              className="boton_2"
              onClick={() => {
                navigate(
                  `/inicio/proyecto/${comprobacionEspectador ? "espectador" : "lider"}/${id_proyecto}/monitoreo/planes/pasados`
                );
              }}
            >
              Planes pasados
            </Button>
            <Button 
              className="boton_2"
              onClick={() => {
                navigate(
                  `/inicio/proyecto/${comprobacionEspectador ? "espectador" : "lider"}/${id_proyecto}/evaluaciones/actual`
                );
              }}
            >
              Evaluaciones actuales
            </Button>
            <Button 
              className="boton_2"
              onClick={() => {
                navigate(
                  `/inicio/proyecto/${comprobacionEspectador ? "espectador" : "lider"}/${id_proyecto}/evaluaciones/pasada`
                );
              }}
            >
              Evaluaciones anteriores
            </Button>
          </div>
          <hr ></hr>
          <p>Informes:</p>
          <div className="d-flex gap-3" style={{ minHeight: "10vh" }}>
            <Button className="boton_2" onClick={() =>{
              navigate(
                `/inicio/proyecto/${comprobacionEspectador ? "espectador" : "lider"}/${id_proyecto}/monitoreo/incidencias`
              );
            }
            }>Incidencias</Button>
            <Button className="boton_2" onClick={()=>{
              navigate(
                `/inicio/proyecto/${comprobacionEspectador ? "espectador" : "lider"}/${id_proyecto}/monitoreo/${usuario.id_usuario}/tareas`
              );
            }
            }>Tareas a realizar</Button>
            <Button className="boton_2" onClick={() => {
                navigate(
                  `/inicio/proyecto/${comprobacionEspectador ? "espectador" : "lider"}/${id_proyecto}/monitoreo/seguimiento`
                );
              }
            }>Seguimiento de riesgo</Button>
          </div>
        </div>
      </Contenedor>
      <Footer />
    </>
  );
}
