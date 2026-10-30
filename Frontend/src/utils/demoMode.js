export const DEMO_MODE =
  import.meta.env.DEV && import.meta.env.VITE_DEMO_MODE !== "false";

export const DEMO_USERS = {
  Administrador: {
    id_usuario: 1,
    nombre_usuario: "Admin Demo",
    email: "admin.demo@vesta.local",
    nombre_perfil: "Administrador",
  },
  Lider: {
    id_usuario: 2,
    nombre_usuario: "Líder Demo",
    email: "lider.demo@vesta.local",
    nombre_perfil: "Líder",
  },
  Desarrollador: {
    id_usuario: 3,
    nombre_usuario: "Desarrollador Demo",
    email: "desarrollador.demo@vesta.local",
    nombre_perfil: "Desarrollador",
  },
  Espectador: {
    id_usuario: 4,
    nombre_usuario: "Espectador Demo",
    email: "espectador.demo@vesta.local",
    nombre_perfil: "Espectador",
  },
};

function encodeBase64(value) {
  return btoa(unescape(encodeURIComponent(value)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

export function createDemoToken(role) {
  const user = DEMO_USERS[role] ?? DEMO_USERS.Administrador;
  const header = encodeBase64(JSON.stringify({ alg: "none", typ: "JWT" }));
  const payload = encodeBase64(
    JSON.stringify({ ...user, demo: true, exp: Math.floor(Date.now() / 1000) + 86400 })
  );

  return `${header}.${payload}.demo`;
}
