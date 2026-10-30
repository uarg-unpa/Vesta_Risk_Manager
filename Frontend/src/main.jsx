import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";

import Index from "./pages/Index.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
import Home from "./pages/Home.jsx";
import ListaUsuarios from "./pages/usuarios/ListaUsuarios.jsx";
import CrearUsuario from "./pages/usuarios/CrearUsuario.jsx";
import Salir from "./pages/Salir.jsx";
import CrearIncidencia from "./pages/Incidencia/CrearIncidencia.jsx";

import {
  obtenerPerfiles as perfilLoader,
} from "./services/usuarios.js";
import RutaProtegida from "./utils/RutaProtegida.jsx";
import VerUsuario from "./pages/usuarios/VerUsuario.jsx";
import ModificarUsuario from "./pages/usuarios/ModificarUsuario.jsx";
// import EliminarUsuario from "./pages/usuarios/EliminarUsuario.jsx";
import { UsuarioProvider } from "./context/usuarioContext.jsx";
import ListaPerfiles from "./pages/perfiles/ListaPerfiles.jsx";
// import CrearPerfil from "./pages/perfiles/CrearPerfil.jsx";
// import VerPerfil, { cargarPerfilId } from "./pages/perfiles/VerPerfil.jsx";
// import ModificarPerfil, {
//   cargarModificarPerfil,
// } from "./pages/perfiles/ModificarPerfil.jsx";
// import EliminarPerfil, {
//   cargarEliminarPerfil,
// } from "./pages/perfiles/EliminarPerfil.jsx";
import ListaProyecto from "./pages/proyecto/ListaProyecto.jsx";
import CrearProyecto from "./pages/proyecto/CrearProyecto.jsx";
import {
  obtenerCategoriaGeneral,
} from "./services/proyectos.js";
import VerProyecto from "./pages/proyecto/VerProyecto.jsx";
import ModificarProyecto from "./pages/proyecto/ModificarProyecto.jsx";
import ListaProyectoLider from "./pages/proyecto/client/ListaProyectoLider.jsx";
import VerProyectoLider from "./pages/proyecto/client/verProyectoLider.jsx";
import ListaProyectoDesarrollador from "./pages/proyecto/client/ListaProyectoDesarrollador.jsx";
import ListaRiesgos from "./pages/riesgos/ListaRiesgos.jsx";
import CrearRiesgo from "./pages/riesgos/CrearRiesgo.jsx";
import CrearEvaluacionLider from "./pages/evaluacion/lider/CrearEvaluacionLider.jsx";

import CrearEvaluacionDesarrollador from "./pages/evaluacion/desarrollador/CrearEvaluacionDesarrollador.jsx";
import CrearPlanLider from "./pages/plan/lider/CrearPlanLider.jsx";
import CrearPlanDesarrollador from "./pages/plan/desarrollador/CrearPlanDesarrollador.jsx";
import EditarRiesgo from "./pages/riesgos/EditarRiesgo.jsx";
import MonitoreoLider from "./pages/monitoreo/lider/MonitoreoLider.jsx";
import VerPlanesActuales from "./pages/plan/lider/VerPlanesActuales.jsx";
import EditarPlanLider from "./pages/plan/lider/EditarPlanLider.jsx";
import NoEncontrada from "./pages/NoEncontrada.jsx";
import VerCategoria from "./pages/categoria/VerCategoria.jsx";
import ListaCategorias from "./pages/categoria/ListaCategorias.jsx";
import ListaIncidencia from "./pages/Incidencia/lider/ListaIncidencia.jsx";
import ListaTarea from "./pages/tarea/ListaTarea.jsx";
import CrearCategoria from "./pages/categoria/CrearCategoria.jsx";
import ModificarCategoria from "./pages/categoria/ModificarCategoria.jsx";
import { obtenerCategorias } from "./services/categorias.js";
import VerEvaluacionesActuLider from "./pages/evaluacion/lider/VerEvaluacionesActuLider.jsx";
import VerEvaluacionesPasadasLider from "./pages/evaluacion/lider/VerEvaluacionesPasadasLider.jsx";
import MonitoreoDesarrollador from "./pages/monitoreo/desarrollador/MonitoreoDesarrollador.jsx";
import VerEvaluacionesActualesDesarrollador from "./pages/evaluacion/desarrollador/VerEvaluacionesActualesDesarrollador.jsx";
import VerEvaluacionesPasadasDesarrollador from "./pages/evaluacion/desarrollador/VerEvaluacionesPasadasDesarrollador.jsx";
import VerPlanesPasados from "./pages/plan/lider/VerPlanesPasados.jsx";
import SeguimientoRiesgo from "./pages/seguimiento/SeguimientoRiesgo.jsx";
import VerEvaluacion from "./pages/evaluacion/VerEvaluacion.jsx";
import Ayuda from "./pages/Ayuda.jsx";

import { 
  cargarUsuarios,
  cargarUsuario,  
  cargarModificarUsuario,
  cargarEliminarUsuario,
  cargarCategoria,
  cargarProyecto,
  cargarProyectos,
  obtenerListaProyectoLider,
  obtenerListaProyectoDesarrollador,
  dashboardLoader,
  riesgoLoaderPage,
  cargarRiesgo,
  seguimientoLoader,
  evaluacionesActualesLoader,
  evaluacionCreacionLoader,
  planesLoader,
  planLoader,
  planCreacionLoader,
  planesAntiguosLoader,
  TareaLoader,
  verTareaLoader,
  incidenciaLoader,
  verIncidenciaLoader,
  evaluacionesPasadasLoader,
  evaluacionLoader,
  iteracionLoader,
  evaluacionesActualesDesarrolladorLoader,
  evaluacionesPasadasDesarrolladorLoader,
  TareaDesarrolladorLoader,
  iteracionesLoader
} from "./utils/loaders.js";
import VerPlan from "./pages/plan/VerPlan.jsx";
import EditarEvaluacion from "./pages/evaluacion/lider/EditarEvaluacion.jsx";
import VerTarea from "./pages/tarea/VerTarea.jsx";
import VerIncidencia from "./pages/Incidencia/VerIncidencia.jsx";
import ListaIncidenciaDesarrollador from "./pages/Incidencia/desarrollador/ListaIncidenciaDesarrollador.jsx";
import ListaTareaDesarrollador from "./pages/tarea/desarrollador/ListaTareaDesarrollador.jsx";
import ListaIteraciones from "./pages/iteracion/ListaIteraciones.jsx";
const App = () => {
  const routerDesarrollador = [
    {
      path: "/inicio/proyectos/desarrollador",
      element: <RutaProtegida element={<ListaProyectoDesarrollador />} />,
      loader: obtenerListaProyectoDesarrollador,
    },
    {
      path: "/inicio/proyecto/desarrollador/:id_proyecto/riesgos",
      element: <RutaProtegida element={<ListaRiesgos />} />,
      loader: riesgoLoaderPage,
    },
    {
      path: "/inicio/proyecto/desarrollador/:id_proyecto/riesgo/crear",
      element: <RutaProtegida element={<CrearRiesgo />} />,
      loader: cargarProyecto,
    },
    {
      path: "/inicio/proyecto/desarrollador/:id_proyecto/riesgo/:id_riesgo/evaluacion/crear",
      element: <RutaProtegida element={<CrearEvaluacionDesarrollador />} />,
      loader: evaluacionCreacionLoader,
    },
    {
      path: "/inicio/proyecto/desarrollador/:id_proyecto/evaluaciones/actual",
      element: <RutaProtegida element={<VerEvaluacionesActualesDesarrollador />} />,
      loader: evaluacionesActualesDesarrolladorLoader
    },
    {
      path: "/inicio/proyecto/desarrollador/:id_proyecto/evaluaciones/pasada",
      element: <RutaProtegida element={<VerEvaluacionesPasadasDesarrollador />}/>,
      loader: evaluacionesPasadasDesarrolladorLoader
    },
    {
      path: "/inicio/proyecto/desarrollador/:id_proyecto/riesgo/:id_riesgo/plan/crear",
      element: <RutaProtegida element={<CrearPlanDesarrollador />} />,
      loader: planCreacionLoader,
    },
    {
      path: "/inicio/proyecto/desarrollador/:id_proyecto/monitoreo",
      element: <RutaProtegida element={<MonitoreoDesarrollador />} />,
      loader: iteracionLoader
    },
    {
      path: "/inicio/proyecto/desarrollador/:id_proyecto/monitoreo/evaluacion/:id_evaluacion",
      element: <RutaProtegida element={<VerEvaluacion />}/>,
      loader: evaluacionLoader
    },
    {
      path: "/inicio/proyecto/desarrollador/:id_proyecto/monitoreo/incidencias",
      element: <RutaProtegida element={<ListaIncidenciaDesarrollador />} />,
      loader: incidenciaLoader
    },
    {
      path: "/inicio/proyecto/desarrollador/:id_proyecto/monitoreo/incidencia/crear",
      element: <RutaProtegida element={<CrearIncidencia />} />,
      loader: iteracionLoader
    },
    {
      path: "/inicio/proyecto/desarrollador/:id_proyecto/monitoreo/incidencia/:id_incidencia",
      element: <RutaProtegida element={<VerIncidencia />} />,
      loader: verIncidenciaLoader,
    },
    {
      path: "/inicio/proyecto/desarrollador/:id_proyecto/monitoreo/:id_usuario/tareas",
      element: <RutaProtegida element={<ListaTareaDesarrollador />} />,
      loader: TareaDesarrolladorLoader
    },
    {
      path: "/inicio/proyecto/desarrollador/:id_proyecto/monitoreo/:id_usuario/tarea/:id_tarea",
      element: <RutaProtegida element={<VerTarea />} />,
      loader: verTareaLoader
    },
    {
      path: "/inicio/proyecto/desarrollador/:id_proyecto/ayuda",
      element: <RutaProtegida element={<Ayuda />} />
    },
  ]

  const routerLider = [
    {
      path: "/inicio/proyectos/lider",
      element: <RutaProtegida element={<ListaProyectoLider />} />,
      loader: obtenerListaProyectoLider,
    },
    
    {
      path: "/inicio/proyecto/lider/:id_proyecto",
      element: <RutaProtegida element={<VerProyectoLider />} />,
      loader: dashboardLoader
    },
    {
      path: "/inicio/proyecto/lider/:id_proyecto/iteraciones",
      element: <RutaProtegida element={<ListaIteraciones />} />,
      loader: iteracionesLoader
    },
    {
      path: "/inicio/proyecto/lider/:id_proyecto/riesgos",
      element: <RutaProtegida element={<ListaRiesgos />} />,
      loader: riesgoLoaderPage,
    },
    {
      path: "/inicio/proyecto/lider/:id_proyecto/riesgo/modificar/:id_riesgo",
      element: <RutaProtegida element={<EditarRiesgo />} />,
      loader: cargarRiesgo,
    },
    {
      path: "/inicio/proyecto/lider/:id_proyecto/monitoreo",
      element: <RutaProtegida element={<MonitoreoLider />} />,
      loader: iteracionLoader
    },
    {
      path: "/inicio/proyecto/lider/:id_proyecto/monitoreo/planes",
      element: <RutaProtegida element={<VerPlanesActuales />}/>,
      loader: planesLoader
    },
    {
      path: "/inicio/proyecto/lider/:id_proyecto/monitoreo/planes/pasados",
      element: <RutaProtegida element={<VerPlanesPasados />} />,
      loader: planesAntiguosLoader,
    },
    {
      path: "/inicio/proyecto/lider/:id_proyecto/monitoreo/incidencias",
      element: <RutaProtegida element={<ListaIncidencia />} />,
      loader: incidenciaLoader
    },
    {
      path: "/inicio/proyecto/lider/:id_proyecto/monitoreo/:id_usuario/tareas",
      element: <RutaProtegida element={<ListaTarea />} />,
      loader: TareaLoader
    },
    {
      path: "/inicio/proyecto/lider/:id_proyecto/monitoreo/:id_usuario/tarea/:id_tarea",
      element: <RutaProtegida element={<VerTarea />} />,
      loader: verTareaLoader
    },
    {
      path: "/inicio/proyecto/lider/:id_proyecto/monitoreo/plan/editar/:id_plan",
      element: <RutaProtegida element={<EditarPlanLider />} />,
      loader: planLoader,
    },
    {
      path: "/inicio/proyecto/lider/:id_proyecto/monitoreo/incidencia/crear",
      element: <RutaProtegida element={<CrearIncidencia />} />,
      loader: iteracionLoader
    },
    {
      path: "/inicio/proyecto/lider/:id_proyecto/monitoreo/incidencia/:id_incidencia",
      element: <RutaProtegida element={<VerIncidencia />} />,
      loader: verIncidenciaLoader,
    },
    {
      path: "/inicio/proyecto/lider/:id_proyecto/riesgo/crear",
      element: <RutaProtegida element={<CrearRiesgo />} />,
      loader: cargarProyecto,
    },
    {
      path: "/inicio/proyecto/lider/:id_proyecto/riesgo/:id_riesgo/evaluacion/crear",
      element: <RutaProtegida element={<CrearEvaluacionLider />} />,
      loader: evaluacionCreacionLoader,
    },
    {
      path: "/inicio/proyecto/lider/:id_proyecto/monitoreo/evaluacion/editar/:id_evaluacion",
      element: <RutaProtegida element={<EditarEvaluacion />}/>,
      loader: evaluacionLoader
    },
    {
      path: "/inicio/proyecto/lider/:id_proyecto/monitoreo/evaluacion/:id_evaluacion",
      element: <RutaProtegida element={<VerEvaluacion />}/>,
      loader: evaluacionLoader
    },
    {
      path: "/inicio/proyecto/lider/:id_proyecto/evaluaciones/actual",
      element: <RutaProtegida element={<VerEvaluacionesActuLider />} />,
      loader: evaluacionesActualesLoader,
    },
    {
      path: "/inicio/proyecto/lider/:id_proyecto/evaluaciones/pasada",
      element: <RutaProtegida element={<VerEvaluacionesPasadasLider />}/>,
      loader: evaluacionesPasadasLoader
    },
    {
      path: "/inicio/proyecto/lider/:id_proyecto/riesgo/:id_riesgo/plan/crear",
      element: <RutaProtegida element={<CrearPlanLider />} />,
      loader: planCreacionLoader,
    },
    {
      path: "/inicio/proyecto/lider/:id_proyecto/monitoreo/plan/:id_plan",
      element: <RutaProtegida element={<VerPlan />}/>,
      loader: planLoader
    },
    {
      path:"/inicio/proyecto/lider/:id_proyecto/monitoreo/seguimiento",
      element: <RutaProtegida element={<SeguimientoRiesgo />} />,
      loader: seguimientoLoader
    },
    {
      path: "/inicio/proyecto/lider/:id_proyecto/ayuda",
      element: <RutaProtegida element={<Ayuda />} />
    },
  ]

  const routerAdmin = [
    {
      path: "/inicio/usuarios",
      element: <RutaProtegida element={<ListaUsuarios />} isAdmin={true} />,
      loader: cargarUsuarios,
    },
    {
      path: "/inicio/usuario/crear",
      element: <RutaProtegida element={<CrearUsuario />} isAdmin={true} />,
      loader: perfilLoader,
    },
    {
      path: "/inicio/usuario/:id_usuario",
      element: <RutaProtegida element={<VerUsuario />} isAdmin={true} />,
      loader: cargarUsuario,
    },
    {
      path: "/inicio/usuario/modificar/:id_usuario",
      element: <RutaProtegida element={<ModificarUsuario />} isAdmin={true} />,
      loader: cargarModificarUsuario,
    },
    // {
    //   path: "/inicio/usuario/eliminar/:id_usuario",
    //   element: <RutaProtegida element={<EliminarUsuario />} isAdmin={true} />,
    //   loader: cargarEliminarUsuario,
    // },
    {
      path: "/inicio/perfiles",
      element: <RutaProtegida element={<ListaPerfiles />} isAdmin={true} />,
      loader: perfilLoader,
    },
    // {
    //   path: "/inicio/perfil/crear",
    //   element: <RutaProtegida element={<CrearPerfil />} isAdmin={true} />,
    //   loader: permisoLoader,
    // },
    // {
    //   path: "/inicio/perfil/:id_perfil",
    //   element: <RutaProtegida element={<VerPerfil />} isAdmin={true} />,
    //   loader: cargarPerfilId,
    // },
    // {
    //   path: "/inicio/perfil/modificar/:id_perfil",
    //   element: <RutaProtegida element={<ModificarPerfil />} isAdmin={true} />,
    //   loader: cargarModificarPerfil,
    // },
    // {
    //   path: "/inicio/perfil/eliminar/:id_perfil",
    //   element: <RutaProtegida element={<EliminarPerfil />} isAdmin={true} />,
    //   loader: cargarEliminarPerfil,
    // },
    {
      path: "/inicio/proyectos",
      element: <RutaProtegida element={<ListaProyecto />} isAdmin={true} />,
      loader: cargarProyectos,
    },

    {
      path: "/inicio/proyecto/crear",
      element: <RutaProtegida element={<CrearProyecto />} isAdmin={true} />,
      loader: obtenerCategoriaGeneral,
    },
    {
      path: "/inicio/proyecto/:id_proyecto",
      element: <RutaProtegida element={<VerProyecto />} isAdmin={true} />,
      loader: cargarProyecto,
    },
    {
      path: "/inicio/proyecto/modificar/:id_proyecto",
      element: <RutaProtegida element={<ModificarProyecto />} isAdmin={true} />,
      loader: cargarProyecto,
    },
    {
      path: "/inicio/categorias",
      element: <RutaProtegida element={<ListaCategorias />} isAdmin={true} />,
      loader: obtenerCategorias,
    },
    {
      path: "/inicio/categoria/crear",
      element: <RutaProtegida element={<CrearCategoria />} isAdmin={true} />,
    },
    {
      path: "/inicio/categoria/modificar/:id_categoria",
      element: <RutaProtegida element={<ModificarCategoria />} isAdmin={true} />,
      loader:cargarCategoria
    },
    {
      path: "/inicio/categoria/:id_categoria",
      element: <RutaProtegida element={<VerCategoria />} isAdmin={true} />,
      loader: cargarCategoria
    },
  ]
  const routerEspectador = [
    {
      path: "/inicio/espectador/proyectos",
      element: <RutaProtegida element={<ListaProyecto />} />,
      loader: cargarProyectos,
    },
    {
      path: "/inicio/espectador/proyecto/:id_proyecto",
      element: <RutaProtegida element={<VerProyectoLider />} />,
      loader: dashboardLoader
    },
    {
      path: "/inicio/proyecto/espectador/:id_proyecto/riesgos",
      element: <RutaProtegida element={<ListaRiesgos />} />,
      loader: riesgoLoaderPage,
    },
    {
      path: "/inicio/proyecto/espectador/:id_proyecto/monitoreo",
      element: <RutaProtegida element={<MonitoreoLider />} />,
      loader: iteracionLoader
    },
    {
      path: "/inicio/proyecto/espectador/:id_proyecto/monitoreo/planes",
      element: <RutaProtegida element={<VerPlanesActuales />}/>,
      loader: planesLoader
    },
    {
      path: "/inicio/proyecto/espectador/:id_proyecto/monitoreo/planes/pasados",
      element: <RutaProtegida element={<VerPlanesPasados />} />,
      loader: planesAntiguosLoader,
    },
    {
      path: "/inicio/proyecto/espectador/:id_proyecto/monitoreo/plan/:id_plan",
      element: <RutaProtegida element={<VerPlan />}/>,
      loader: planLoader
    },
    {
      path: "/inicio/proyecto/espectador/:id_proyecto/evaluaciones/actual",
      element: <RutaProtegida element={<VerEvaluacionesActuLider />} />,
      loader: evaluacionesActualesLoader,
    },
    {
      path: "/inicio/proyecto/espectador/:id_proyecto/evaluaciones/pasada",
      element: <RutaProtegida element={<VerEvaluacionesPasadasLider />}/>,
      loader: evaluacionesPasadasLoader
    },
    {
      path: "/inicio/proyecto/espectador/:id_proyecto/monitoreo/evaluacion/:id_evaluacion",
      element: <RutaProtegida element={<VerEvaluacion />}/>,
      loader: evaluacionLoader
    },
    {
      path: "/inicio/proyecto/espectador/:id_proyecto/monitoreo/incidencias",
      element: <RutaProtegida element={<ListaIncidencia />} />,
      loader: incidenciaLoader
    },
    {
      path: "/inicio/proyecto/espectador/:id_proyecto/monitoreo/incidencia/:id_incidencia",
      element: <RutaProtegida element={<VerIncidencia />} />,
      loader: verIncidenciaLoader,
    },
    {
      path:"/inicio/proyecto/espectador/:id_proyecto/monitoreo/seguimiento",
      element: <RutaProtegida element={<SeguimientoRiesgo />} />,
      loader: seguimientoLoader
    },
    {
      path: "/inicio/proyecto/espectador/:id_proyecto/monitoreo/:id_usuario/tareas",
      element: <RutaProtegida element={<ListaTarea />} />,
      loader: TareaLoader
    },
    {
      path: "/inicio/proyecto/espectador/:id_proyecto/monitoreo/:id_usuario/tarea/:id_tarea",
      element: <RutaProtegida element={<VerTarea />} />,
      loader: verTareaLoader
    },
    {
      path: "/inicio/proyecto/espectador/:id_proyecto/ayuda",
      element: <RutaProtegida element={<Ayuda />} />
    },
  ]

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Index />,
    },
    {
      path: "/inicio",
      element: <RutaProtegida element={<Home />} />,
    },
    {
      path: "/salir",
      element: <RutaProtegida element={<Salir />} />,
    },
    ...routerAdmin,
    ...routerEspectador,
    ...routerLider,
    ...routerDesarrollador,
    {
      path: "*",
      element: <NoEncontrada />,
    },
  ], {
    basename: "/frontend"
  });

  return <RouterProvider router={router}></RouterProvider>;
};

ReactDOM.createRoot(document.getElementById("root")).render(
    <UsuarioProvider>
      <GoogleOAuthProvider clientId="865850828899-d9raoavrfjenindu8qsunk4p0a3g37vf.apps.googleusercontent.com">
        <App />
      </GoogleOAuthProvider>
    </UsuarioProvider>
);
