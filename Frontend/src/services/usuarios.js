import { URL } from "../utils/funciones";

export async function login(formData) {
  const respuesta = await fetch(`${URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });
  const json = await respuesta.json();

  return json;
}

export async function obtenerUsuarios(pagina) {
  let paginaUsada = pagina ? pagina : 1;

  const token = localStorage.getItem("usuario");
  const respuesta = await fetch(`${URL}/usuarios/${paginaUsada}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  const json = await respuesta.json();
  
  return json;
}

export async function obtenerUsuariosCorreo(correo) {
  const token = localStorage.getItem("usuario");

  const respuesta = await fetch(`${URL}/usuario/${correo}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  if(!respuesta.ok) return
  const json = await respuesta.json();  
  return json;
}

export async function obtenerUsuariosId(id) {
  const token = localStorage.getItem("usuario");

  const respuesta = await fetch(`${URL}/usuario/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  const json = await respuesta.json();
  return json;
}

export async function obtenerUsuarioNombre(nombre) {
  const token = localStorage.getItem("usuario");

  const respuesta = await fetch(`${URL}/usuario/comprobar/${nombre}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  const json = await respuesta.json();

  return json;
}

export async function crearUsuario(formData) {
  const token = localStorage.getItem("usuario");
  const respuesta = await fetch(`${URL}/usuario`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(formData),
  });
  const json = await respuesta.json();

  return json;
}

export async function actualizarUsuario(id, formData) {
  const token = localStorage.getItem("usuario");
  const respuesta = await fetch(`${URL}/usuario/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(formData),
  });
  const json = await respuesta.json();

  return json;
}

export async function eliminarUsuario(id) {
  const token = localStorage.getItem("usuario");

  const respuesta = await fetch(`${URL}/usuario/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  const json = await respuesta.json();

  return json;
}

export async function obtenerPerfiles() {
  const token = localStorage.getItem("usuario");
  const respuesta = await fetch(`${URL}/perfiles`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  const json = await respuesta.json();
  return json;
}

export async function obtenerPermisos() {
  const token = localStorage.getItem("usuario");
  const respuesta = await fetch(`${URL}/permisos`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  const json = await respuesta.json();
  return json;
}

export async function crearPerfil(formData) {
  const token = localStorage.getItem("usuario");
  const respuesta = await fetch(`${URL}/perfil`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(formData),
  });
  const json = await respuesta.json();

  return json;
}

export async function obtenerPerfilId(id) {
  const token = localStorage.getItem("usuario");
  const respuesta = await fetch(`${URL}/perfil/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  const json = await respuesta.json();
  return json;
}

export async function actualizarPerfil(id, formData) {
  const token = localStorage.getItem("usuario");
  const respuesta = await fetch(`${URL}/perfil/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(formData),
  });
  const json = await respuesta.json();

  return json;
}

export async function eliminarPerfil(id) {
  const token = localStorage.getItem("usuario");
  const respuesta = await fetch(`${URL}/perfil/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  const json = await respuesta.json();

  return json;
}

export async function obtenerPerfilNombre(nombre) {
  const token = localStorage.getItem("usuario");
  const respuesta = await fetch(`${URL}/perfil/comprobar/${nombre}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  const json = await respuesta.json();
  return json;
}
