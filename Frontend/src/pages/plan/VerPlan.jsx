import React from "react";
import Footer from "../../components/Footer";
import Contenedor from "../../components/Contenedor";
import { useLoaderData, useLocation } from "react-router-dom";
import BotonSalir from "../../components/BotonSalir";
import { formatearFecha } from "../../utils/funciones";
import NavegadorLider from "../../components/NavegadorLider";
import { Alert } from "react-bootstrap";
import { useUsuario } from "../../context/usuarioContext";

export default function VerPlan() {
  const {  iteracion, plan  } = useLoaderData();
  const location = useLocation();
  const ruta = location.state?.ruta;
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
        <h3>{proyecto.nombre} - Plan de {plan.tipo} del riesgo {plan.id_riesgo > 9 ? "RK" : "RK0"}{plan.id_riesgo}</h3>
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

          <h4>Descripción del riesgo</h4>
          <p>{plan.riesgo.descripcion}</p>
          <hr />
          <h4>Descripción del plan</h4>
          <p>{plan.descripcion}</p>
          <hr />
          <h4>Tareas del plan</h4>
          <ul>
            {plan.tareas.map((tarea) => (
              <li key={tarea.id_tarea}>
                <h5>{tarea.nombre} </h5>
                <ul>
                  <li><b>Descripción:</b> {tarea.descripcion}</li>
                  <li><b>Responsables:</b> {tarea.responsables.map((responsable) => responsable.nombre).join(", ")}</li>
                  <li><b>Estado:</b> {tarea.estado == 0 ? "Pendiente" : "Completada"}</li>
                  <li><b>Fecha de inicio:</b> {formatearFecha(tarea.fecha_inicio)}</li>
                  <li><b>Fecha de fin:</b> {formatearFecha(tarea.fecha_fin)}</li>
                </ul>
              </li>
            ))}
          </ul>
          <hr />
          <h5>Opciones</h5>
          <BotonSalir ruta={ruta} />
        </>
      </Contenedor>
      <Footer />
    </>
  );
}