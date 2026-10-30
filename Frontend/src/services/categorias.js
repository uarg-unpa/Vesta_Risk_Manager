import { URL } from "../utils/funciones";

export async function obtenerCategorias(pagina) {
  const token = localStorage.getItem("usuario");

  let paginaUsada = pagina ? pagina : 1;
  const respuesta = await fetch(`${URL}/categoria/generales/${paginaUsada}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  const json = await respuesta.json();
  return json;
}

export async function obtenerCategoriaId(id) {
  const token = localStorage.getItem("usuario");

  const respuesta = await fetch(`${URL}/categoria/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  const json = await respuesta.json();
  return json;
}

export const crearCategoria = async (data) => {
  const token = localStorage.getItem("usuario");

  const respuesta = await fetch(`${URL}/categoria`, {
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

export const actualizarCategoria = async (id_categoria, data) => {
  const token = localStorage.getItem("usuario");

  const respuesta = await fetch(`${URL}/categoria/${id_categoria}`, {
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

export const eliminarCategoria = async (id_categoria) => {
  const token = localStorage.getItem("usuario");

  const respuesta = await fetch(`${URL}/categoria/${id_categoria}/eliminar`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  const json = await respuesta.json();

  return json;
};

export async function obtenerCategoriaNombre(nombre) {
  const token = localStorage.getItem("usuario");

  const respuesta = await fetch(`${URL}/categoria/comprobar/${nombre}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  const json = await respuesta.json();

  return json;
}
