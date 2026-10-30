import { URL } from "../utils/funciones";

export const obtenerInformeIncidencia = async (id_incidencia) => {
  const token = localStorage.getItem("usuario");
  const respuesta = await fetch(`${URL}/incidencia/${id_incidencia}/informe`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  const json = await respuesta.json();

  return json;
};

export const obtenerDatosInformeSeguimiento = async (id_proyecto) => {
  const token = localStorage.getItem("usuario");
  const respuesta = await fetch(
    `${URL}/proyecto/${id_proyecto}/riesgos/informe`,
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
