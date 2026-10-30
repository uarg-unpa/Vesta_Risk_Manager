import React from "react";
import NavegadorLider from "../../../components/NavegadorLider";
import Footer from "../../../components/Footer";
import Contenedor from "../../../components/Contenedor";
import { Alert, Button } from "react-bootstrap";
import { useLoaderData, useNavigate, useParams } from "react-router-dom";
import { useUsuario } from "../../../context/usuarioContext";
import { formatearFecha } from "../../../utils/funciones";

export default function MonitoreoDesarrollador() {
  const proyecto = JSON.parse(localStorage.getItem("proyecto_seleccionado"));
  const navigate = useNavigate();
  const { id_proyecto } = useParams();
  const { iteracion } = useLoaderData();
  
  const { usuario } = useUsuario();  
  

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
                  `/inicio/proyecto/desarrollador/${id_proyecto}/evaluaciones/actual`
                );
              }}
            >
              Evaluaciones actuales
            </Button>
            <Button 
              className="boton_2"
              onClick={() => {
                navigate(
                  `/inicio/proyecto/desarrollador/${id_proyecto}/evaluaciones/pasada`
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
                `/inicio/proyecto/desarrollador/${id_proyecto}/monitoreo/incidencias`
              );
            }
            }>Incidencias</Button>
            <Button className="boton_2" onClick={()=>{
              navigate(
                `/inicio/proyecto/desarrollador/${id_proyecto}/monitoreo/${usuario.id_usuario}/tareas`
              );
            }
            }>Tareas a realizar</Button>
          </div>
        </div>
      </Contenedor>
      <Footer />
    </>
  );
}
