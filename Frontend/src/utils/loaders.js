import { obtenerCategoriaId } from "../services/categorias";
import { obtenerDatosInformeSeguimiento } from "../services/informes";
import { obtenerIteracionActual, obtenerProyectosId, obtenerProyectosPaginado, obtenerProyectosUsuarioDesarrollador, obtenerProyectosUsuarioDesarrolladorPaginado, obtenerProyectosUsuarioLider, obtenerProyectosUsuarioLiderPaginado } from "../services/proyectos";
import { obtenerDatosRiesgos, obtenerRiesgoId, obtenerRiesgosProyecto, obtenerRiesgosProyectoPaginado} from "../services/riesgos";
import { obtenerEvaluacionesActualesProyecto, obtenerEvaluacionesActualesProyectoDesarrolladorPaginado, obtenerEvaluacionesActualesProyectoPaginado, obtenerEvaluacionesAnterioresDesarrolladorProyectoPaginado, obtenerEvaluacionesAnterioresProyecto, obtenerEvaluacionesAnterioresProyectoPaginado, obtenerEvaluacionId} from "../services/evaluacion"
import {obtenerCantidadPlanTipo, obtenerDatosTareaId, obtenerPlanesAnterioresProyecto, obtenerPlanesAnterioresProyectoPaginado, obtenerPlanesProyecto, obtenerPlanesProyectoPaginado, obtenerPlanId, obtenerTareasDesarrolladorProyectoPaginado, obtenerTareasProyecto, obtenerTareasProyectoPaginado} from "../services/planes"
import { obtenerIncidenciaId, obtenerIncidenciasProyecto, obtenerIncidenciasProyectoPaginado } from "../services/incidencia";
import { obtenerPerfiles, obtenerUsuarios, obtenerUsuariosId } from "../services/usuarios";
import { obtenerIteracionesPaginada } from "../services/iteraciones";
import { jwtDecode } from "jwt-decode";

// Loaders de Usuarios
export async function cargarUsuarios(){
  const usuarios = await obtenerUsuarios(1)
  return usuarios
}

export async function cargarUsuario({ params }) {
  const usuario = await obtenerUsuariosId(params.id_usuario);
  return { usuario };
}

export async function cargarModificarUsuario({ params }) {
  const usuario = await obtenerUsuariosId(params.id_usuario);
  const perfiles = await obtenerPerfiles();
  return { usuarioLoader: usuario, perfiles };
}

export async function cargarEliminarUsuario({ params }) {
  const usuario = await obtenerUsuariosId(params.id_usuario);
  return { usuario };
}

// Loaders de Categorias
export async function cargarCategoria({ params }) {
  const categoria = await obtenerCategoriaId(params.id_categoria);
  return { categoria };
}


// Loaders de Proyectos
export async function cargarProyecto({ params }) {
  const proyecto = await obtenerProyectosId(params.id_proyecto);
  const iteracion = await obtenerIteracionActual(params.id_proyecto);
  return { proyecto, iteracion};
}

export async function cargarProyectos() {  
  const {proyectos, totalPaginas} = await obtenerProyectosPaginado(1, localStorage.getItem("orden_proyecto")??1);
  return { proyectos, totalPaginas };
}

export const obtenerListaProyectoLider = async () => {
  const usuario = jwtDecode(localStorage.getItem("usuario"));
  const {proyectos, totalPaginas} = await obtenerProyectosUsuarioLiderPaginado(usuario.email);
  return { proyectos, totalPaginas };
};

export const obtenerListaProyectoDesarrollador = async () => {
  const usuario = jwtDecode(localStorage.getItem("usuario"));
  const {proyectos, totalPaginas} = await obtenerProyectosUsuarioDesarrolladorPaginado(usuario.email);
  return { proyectos, totalPaginas };
};


// Loaders de Riesgos
export const dashboardLoader = async ({ params }) => {
  
  const datosRiesgos = await obtenerDatosRiesgos(params.id_proyecto);
  const iteracion = await obtenerIteracionActual(params.id_proyecto);
  return {datosRiesgos, iteracion};
};

export const riesgoLoader = async ({ params }) => {
  const riesgos = await obtenerRiesgosProyecto(params.id_proyecto);
  const iteracion = await obtenerIteracionActual(params.id_proyecto);

  return { riesgos, iteracion };
};

export const riesgoLoaderPage = async ({ params }) => {
  const {riesgos, totalPaginas} = await obtenerRiesgosProyectoPaginado(params.id_proyecto, localStorage.getItem("pagina_riesgo")??1, localStorage.getItem("orden_riesgo")??1);
  const iteracion = await obtenerIteracionActual(params.id_proyecto);

  return { riesgos, totalPaginas, iteracion };
};

export async function cargarRiesgo({ params }) {
  const id_riesgo= params.id_riesgo
  const proyecto = await obtenerProyectosId(params.id_proyecto);
  const iteracion = await obtenerIteracionActual(params.id_proyecto);
  const riesgo = await obtenerRiesgoId(params.id_proyecto, id_riesgo);
  return { proyecto, riesgo, iteracion };
}

export const seguimientoLoader = async ({params}) =>{
    const resultado = await obtenerDatosInformeSeguimiento(params.id_proyecto)
    const iteracion_actual = await obtenerIteracionActual(params.id_proyecto)
    resultado["iteracion_actual"] = iteracion_actual
    return resultado;
}

//Loader de Evaluaciones
export const evaluacionesActualesLoader = async ({ params }) => {
  const {evaluaciones, totalPaginas} = await obtenerEvaluacionesActualesProyectoPaginado(params.id_proyecto);
  const iteracion = await obtenerIteracionActual(params.id_proyecto);
  return { evaluaciones, totalPaginas, iteracion };
};

export const evaluacionesActualesDesarrolladorLoader = async ({ params }) => {
  const usuario = jwtDecode(localStorage.getItem("usuario"));
  const {evaluaciones, totalPaginas} = await obtenerEvaluacionesActualesProyectoDesarrolladorPaginado(params.id_proyecto, usuario.id_usuario);
  const iteracion = await obtenerIteracionActual(params.id_proyecto);
  return { evaluaciones, totalPaginas, iteracion };
};

export const evaluacionesPasadasLoader = async ({ params }) => {
  const {evaluaciones, totalPaginas} = await obtenerEvaluacionesAnterioresProyectoPaginado(params.id_proyecto);  
  const iteracion = await obtenerIteracionActual(params.id_proyecto);
  return { evaluaciones, totalPaginas, iteracion };
};

export const evaluacionesPasadasDesarrolladorLoader = async ({ params }) => {
  const usuario = jwtDecode(localStorage.getItem("usuario"));
  const {evaluaciones, totalPaginas} = await obtenerEvaluacionesAnterioresDesarrolladorProyectoPaginado(params.id_proyecto, usuario.id_usuario);
  const iteracion = await obtenerIteracionActual(params.id_proyecto);
  return { evaluaciones, totalPaginas, iteracion };
};

export const iteracionesLoader = async ({ params }) => {
  const {iteraciones, totalPaginas} = await obtenerIteracionesPaginada(params.id_proyecto);
  const iteracion = await obtenerIteracionActual(params.id_proyecto);
  return { iteraciones, totalPaginas, iteracion };
};



export const evaluacionLoader = async ({ params }) => {
  const evaluacion = await obtenerEvaluacionId(params.id_proyecto, params.id_evaluacion);
  const iteracion = await obtenerIteracionActual(params.id_proyecto);
  return { evaluacion, iteracion };
};

export const evaluacionCreacionLoader = async ({ params }) => {
  const id_riesgo = params.id_riesgo
  const riesgo = await obtenerRiesgoId(params.id_proyecto, id_riesgo);
  const iteracion = await obtenerIteracionActual(params.id_proyecto);
  return { riesgo, iteracion };
};

// Loader de Planes
export const planesLoader = async ({ params }) => {
  const {planes, totalPaginas} = await obtenerPlanesProyectoPaginado(params.id_proyecto);
  const iteracion = await obtenerIteracionActual(params.id_proyecto);
  return { planes, totalPaginas, iteracion };
};

export const planCreacionLoader = async ({ params }) => {
  const id_riesgo = params.id_riesgo;

  const riesgo = await obtenerRiesgoId(params.id_proyecto, id_riesgo);
  const iteracion = await obtenerIteracionActual(params.id_proyecto);
  const planes = await obtenerCantidadPlanTipo(
    params.id_proyecto,
    id_riesgo,
    iteracion.id_iteracion
  );
  return { riesgo, iteracion, planes };
};

export const planLoader = async ({ params }) => {
  const id_plan= params.id_plan;
  const iteracion = await obtenerIteracionActual(params.id_proyecto);
  const plan = await obtenerPlanId(params.id_proyecto, id_plan);

  return { iteracion, plan };
};

export const planesAntiguosLoader = async ({ params }) => {
  const {planes, totalPaginas} = await obtenerPlanesAnterioresProyectoPaginado(params.id_proyecto);
  const iteracion = await obtenerIteracionActual(params.id_proyecto);
  return { planes, totalPaginas, iteracion };
};

export const TareaLoader = async ({ params }) => {
  const {tareas, totalPaginas} = await obtenerTareasProyectoPaginado(params.id_proyecto, params.id_usuario, 1);
  const iteracion = await obtenerIteracionActual(params.id_proyecto);
  return { tareas, totalPaginas, iteracion};
};

export const TareaDesarrolladorLoader = async ({ params }) => {
  const {tareas, totalPaginas} = await obtenerTareasDesarrolladorProyectoPaginado(params.id_proyecto, params.id_usuario, 1);
  const iteracion = await obtenerIteracionActual(params.id_proyecto);
  return { tareas, totalPaginas, iteracion};
};

export const verTareaLoader = async ({ params }) => {
  const tarea = await obtenerDatosTareaId(params.id_tarea);
  const iteracion = await obtenerIteracionActual(params.id_proyecto);
  return { tarea, iteracion };
};

// Loader de Incidencias
export const incidenciaLoader = async ({ params }) => {
  const {incidencias, totalPaginas} = await obtenerIncidenciasProyectoPaginado(params.id_proyecto);
  const iteracion = await obtenerIteracionActual(params.id_proyecto);
  return { incidencias, totalPaginas, iteracion};
};


export async function verIncidenciaLoader({ params }) {
  const incidencia = await obtenerIncidenciaId(params.id_incidencia);
  const iteracion = await obtenerIteracionActual(params.id_proyecto);
  return { incidencia, iteracion };
}

// Loader de Iteraciones
export const iteracionLoader = async ({ params }) => {
  const iteracion = await obtenerIteracionActual(params.id_proyecto);
  return { iteracion };
};


