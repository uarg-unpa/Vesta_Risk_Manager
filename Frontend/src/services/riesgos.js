import { URL } from "../utils/funciones";

export const obtenerRiesgosProyecto = async (id_proyecto) => {
  const token = localStorage.getItem("usuario");

  const respuesta = await fetch(`${URL}/proyecto/${id_proyecto}/riesgos`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  const json = await respuesta.json();

  return json;
};

export const obtenerRiesgosProyectoPaginado = async (
  id_proyecto,
  pagina,
  orden
) => {
  const token = localStorage.getItem("usuario");

  let paginaUsada = pagina ? pagina : 1;
  const respuesta = await fetch(
    `${URL}/proyecto/${id_proyecto}/riesgos/${paginaUsada}/${orden}`,
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

export const crearRiesgo = async (id_proyecto, data) => {
  const token = localStorage.getItem("usuario");

  const respuesta = await fetch(`${URL}/proyecto/${id_proyecto}/riesgo`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  const json = await respuesta.json();

  return json;
};

export const modificarRiesgo = async (id_proyecto, id_riesgo, data) => {
  const token = localStorage.getItem("usuario");

  const respuesta = await fetch(
    `${URL}/proyecto/${id_proyecto}/riesgo/${id_riesgo}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    }
  );
  const json = await respuesta.json();

  return json.modificado;
};

export const eliminarRiesgo = async (id_proyecto, id_riesgo) => {
  const token = localStorage.getItem("usuario");

  const respuesta = await fetch(
    `${URL}/proyecto/${id_proyecto}/riesgo/${id_riesgo}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  const json = await respuesta.json();

  return json;
};

export const obtenerRiesgoId = async (id_proyecto, id_riesgo) => {
  const token = localStorage.getItem("usuario");

  const respuesta = await fetch(
    `${URL}/proyecto/${id_proyecto}/riesgo/${id_riesgo}`,
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

export const obtenerDatosRiesgos = async (id_proyecto) => {
  const token = localStorage.getItem("usuario");

  const respuesta = await fetch(`${URL}/proyecto/${id_proyecto}/riesgo`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  const json = await respuesta.json();

  return json;
};
