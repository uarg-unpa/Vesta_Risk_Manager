import { URL } from "../utils/funciones";

export async function obtenerIteracionesPaginada(id_proyecto, pagina) {
  const token = localStorage.getItem("usuario");
  const paginaActual = pagina ? pagina : 1;
  const respuesta = await fetch(
    `${URL}/proyecto/${id_proyecto}/iteraciones/${paginaActual}`,
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
}

export const crearIteracion = async (id_proyecto, data) => {
  const token = localStorage.getItem("usuario");
  const respuesta = await fetch(`${URL}/proyecto/${id_proyecto}/iteraciones`, {
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

export const actualizarIteracion = async (id_proyecto, data) => {
  const token = localStorage.getItem("usuario");
  const respuesta = await fetch(`${URL}/proyecto/${id_proyecto}/iteraciones`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  const json = await respuesta.json();

  return json;
};
