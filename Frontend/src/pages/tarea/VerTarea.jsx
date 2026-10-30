import React from 'react'
import NavegadorLider from '../../components/NavegadorLider'
import Footer from '../../components/Footer'
import Contenedor from '../../components/Contenedor'
import { useLoaderData, useLocation } from 'react-router-dom';
import BotonSalir from '../../components/BotonSalir';
import { formatearFecha } from '../../utils/funciones';

export default function VerTarea() {
    const location = useLocation();
    const { tarea, iteracion } = useLoaderData();
    const ruta = location.state?.ruta;
    const proyecto = JSON.parse(localStorage.getItem("proyecto_seleccionado"));
    
  return (
    <>
    <NavegadorLider/>
    <Contenedor>
        <>
            <h3>{proyecto.nombre} - Tarea del plan de {tarea.tipo_plan} del Riesgo {tarea.id_riesgo < 10 ? "RK0" + tarea.id_riesgo : "RK" + tarea.id_riesgo}</h3>
            <h4>{iteracion.nombre} - {formatearFecha(iteracion.fecha_inicio)} al {formatearFecha(iteracion.fecha_fin)}</h4>
        </>
        <>
        <h4>Nombre de la tarea</h4>
        <p>{tarea.nombre}</p>
        <hr />
        <h4>Descripción de la tarea</h4>
        <p>{tarea.descripcion}</p>
        <hr />
        <h4>Fecha de inicio</h4>
        <p>{formatearFecha(tarea.fecha_inicio)}</p>
        <hr />
        <h4>Fecha de fin</h4>
        <p>{formatearFecha(tarea.estado == 0 ? tarea.fecha_fin : tarea.fecha_fin_real)}</p>
        <hr />
        <h4>Estado</h4>
        <p>{tarea.estado == 0 ? "Pendiente" : "Completado"}</p>
        <hr />
        <h4>Responsable</h4>
        <p>{tarea.responsables}</p>
        <hr />
        <h4>Opciones</h4>
        <BotonSalir ruta={ruta}/>
        </>
    </Contenedor>
    <Footer />
    </>
  )
}
