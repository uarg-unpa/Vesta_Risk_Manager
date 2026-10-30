import { URL } from "../utils/funciones";

export const crearIncidencia = async (id_proyecto, data) => {
  const token = localStorage.getItem("usuario");
  const respuesta = await fetch(`${URL}/proyecto/${id_proyecto}/incidencia`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  const json = await respuesta.json();

  return json.creacion;
};

export const obtenerIncidenciasProyecto = async (id_proyecto) => {
  const token = localStorage.getItem("usuario");
  const respuesta = await fetch(`${URL}/proyecto/${id_proyecto}/incidencias`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  const json = await respuesta.json();

  return json;
};

export const obtenerIncidenciasProyectoPaginado = async (
  id_proyecto,
  pagina
) => {
  const token = localStorage.getItem("usuario");
  const paginaActual = pagina ? pagina : 1;
  const respuesta = await fetch(
    `${URL}/proyecto/${id_proyecto}/incidencias/${paginaActual}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  const json = await respuesta.json();

  return json;
};

export const obtenerIncidenciaId = async (id_incidencia) => {
  const token = localStorage.getItem("usuario");
  const respuesta = await fetch(`${URL}/incidencia/${id_incidencia}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  const json = await respuesta.json();

  return json;
};

export const eliminarIncidencia = async (id_incidencia) => {
  const token = localStorage.getItem("usuario");
  const respuesta = await fetch(`${URL}/incidencia/${id_incidencia}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  const json = await respuesta.json();

  return json;
};
