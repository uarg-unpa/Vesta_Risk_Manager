import React from "react";
import Footer from "../../components/Footer";
import Contenedor from "../../components/Contenedor";
import NavegadorLider from "../../components/NavegadorLider";
import BotonSalir from "../../components/BotonSalir";
import { useLoaderData, useLocation } from "react-router-dom";
import { formatearFecha, formatearFechaHora, modificarImpacto, modificarProbabilidad } from "../../utils/funciones";
import { Alert } from "react-bootstrap";
import { useUsuario } from "../../context/usuarioContext";

export default function VerEvaluacion() {
  const location = useLocation();
  const ruta = location.state?.ruta;
  const { evaluacion, iteracion } = useLoaderData();
  const proyecto = JSON.parse(localStorage.getItem("proyecto_seleccionado"));

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
          <h3>{proyecto.nombre} - Evaluacion del riesgo {evaluacion.id_riesgo > 9 ? "RK" : "RK0"}{evaluacion.id_riesgo}</h3>
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
          <h4>Descripción del riesgo {evaluacion.id_riesgo > 9 ? "RK" : "RK0"}{evaluacion.id_riesgo}</h4>
          <p>{evaluacion.descripcion_riesgo}</p>
          <hr />
          <h4>Descripción de la evaluación</h4>
          <p>{evaluacion.descripcion}</p>
          <hr />
          <h4>Responsable</h4>
          <p>{evaluacion.nombre_usuario ? evaluacion.nombre_usuario : "No posee responsable"}</p>
          <hr />
          <h4>Impacto</h4>
          <p>{modificarImpacto(evaluacion.impacto)}</p>
          <hr />
          <h4>Probabilidad</h4>
          <p>{modificarProbabilidad(evaluacion.probabilidad)}</p>
          <hr />
          <h4>Fecha de creación</h4>
          <p>{formatearFechaHora(new Date(evaluacion.fecha_realizacion))}</p>
          <hr />
          <h5>Opciones</h5>
          <BotonSalir ruta={ruta} />
        </>
      </Contenedor>
      <Footer />
    </>
  );
}