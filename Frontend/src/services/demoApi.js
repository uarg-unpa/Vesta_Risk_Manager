import { DEMO_MODE } from "../utils/demoMode";

const demoProject = {
  id_proyecto: 1,
  nombre: "Proyecto demo Vesta",
  descripcion: "Proyecto de demostración para revisar la interfaz.",
  estado: "activo",
  fecha_inicio: "2026-01-01",
  fecha_fin: "2026-12-31",
  participantes: [],
  iteraciones: [],
  categorias: [],
};

const demoIteration = {
  id_iteracion: 1,
  nombre: "Iteración demo",
  fecha_inicio: "2026-01-01",
  fecha_fin: "2026-12-31",
};

demoProject.iteraciones = [demoIteration];
demoProject.categorias = [{
  id_categoria: 1,
  nombre: "Compromiso del Cliente",
  descripcion: "Riesgos asociados al nivel de involucramiento y apoyo del cliente en el proyecto, lo que puede afectar su desarrollo y entrega.",
}];

const demoRisk = {
  id_riesgo: 1,
  factor_riesgo: 0,
  descripcion: "Riesgo de indisponibilidad durante una operación crítica.",
  estado: "Abierto",
  prioridad: "Media",
  impacto: 5,
  probabilidad: 4,
  evaluado: 0,
  responsables: "Desarrollador Demo",
  nombre_categoria: "Operativo",
  planes_realizado: {
    total_minimizacion: 0,
    total_mitigacion: 0,
    total_contingencia: 0,
  },
};

const demoData = {
  proyectos: [demoProject],
  riesgos: [demoRisk],
  iteraciones: [demoIteration],
  evaluaciones: [],
  planes: [],
  tareas: [],
  incidencias: [],
  usuarios: [
    {
      id_usuario: 1,
      nombre_usuario: "Admin Demo",
      nombre: "Admin Demo",
      email: "admin.demo@vesta.local",
      nombre_perfil: "Administrador",
    },
  ],
  perfiles: [
     { id_perfil: 1, nombre_perfil: "Administrador", nombre: "Administrador" },
     { id_perfil: 2, nombre_perfil: "Líder", nombre: "Líder" },
     { id_perfil: 3, nombre_perfil: "Desarrollador", nombre: "Desarrollador" },
     { id_perfil: 4, nombre_perfil: "Espectador", nombre: "Espectador" },
  ],
  categorias: [{
    id_categoria: 1,
    nombre: "Compromiso del Cliente",
    descripcion: "Riesgos asociados al nivel de involucramiento y apoyo del cliente en el proyecto, lo que puede afectar su desarrollo y entrega.",
  }],
};

const demoDashboard = {
  datos_proyecto: {
    riesgos_activos: 1,
    evaluaciones_pendientes: 1,
    planes_accion: 0,
    riesgos_atencion: 1,
  },
  iteraciones: demoData.iteraciones,
  categorias: demoData.categorias,
  datos_evaluacion: [[{ cantidad: 1 }, { cantidad: 0 }, { cantidad: 0 }, { cantidad: 0 }]],
  evaluacion_tongji: [{ x: 1, y: 1, label: 1 }],
  datos_telaraña: [{ total_riesgo: 1 }],
};

function paginated(key) {
  return { [key]: demoData[key], totalPaginas: 1 };
}

function getDemoResponse(url, method) {
  const { pathname } = new URL(url, window.location.origin);
  const path = pathname.replace(/^\/Vesta/, "");

  if (path === "/login") return { jwt: localStorage.getItem("usuario") };
  if (path.startsWith("/proyectos/lider")) return paginated("proyectos");
  if (path.startsWith("/proyectos/desarrollador")) return paginated("proyectos");
  if (path.startsWith("/proyectos/")) return paginated("proyectos");
  if (path === "/proyectos") return demoData.proyectos;
  if (path === "/proyecto/categorias") return demoData.categorias;
  if (/^\/proyecto\/\d+\/iteracion$/.test(path)) return demoIteration;
  if (/^\/proyecto\/\d+\/riesgos$/.test(path)) return demoData.riesgos;
  if (/^\/proyecto\/\d+\/riesgos\/\d+/.test(path)) return paginated("riesgos");
  if (/^\/proyecto\/\d+\/riesgo$/.test(path)) return demoDashboard;
  if (/^\/proyecto\/\d+\/evaluaciones/.test(path)) return paginated("evaluaciones");
  if (/^\/proyecto\/\d+\/planes/.test(path)) return paginated("planes");
  if (/^\/proyecto\/\d+\/incidencias/.test(path)) return paginated("incidencias");
  if (/^\/proyecto\/\d+\/iteraciones/.test(path)) return paginated("iteraciones");
  if (/^\/proyecto\/\d+$/.test(path)) return demoProject;
  if (/^\/proyecto\/\d+\/riesgo\/\d+$/.test(path)) return demoRisk;
  if (/^\/riesgo\/\d+/.test(path)) return demoRisk;
  if (/^\/incidencia\/\d+/.test(path)) return {};
  if (/^\/tarea\/\d+/.test(path)) return {};
  if (path.startsWith("/usuarios")) return paginated("usuarios");
  if (/^\/usuario\/\d+/.test(path)) return demoData.usuarios[0];
  if (path === "/perfiles") return demoData.perfiles;
  if (path === "/permisos") return [];
  if (path.startsWith("/perfil")) return demoData.perfiles[0];
  if (path.startsWith("/categoria/generales")) return paginated("categorias");
  if (path.startsWith("/categoria/")) return demoData.categorias[0];
  if (path === "/categoria") return paginated("categorias");
  if (path.includes("/informe")) return { riesgos: demoData.riesgos };

  return method === "GET" ? {} : { ok: true };
}

export function installDemoApi() {
  if (!DEMO_MODE || globalThis.__vestaDemoApiInstalled) return;

  const originalFetch = globalThis.fetch;
  globalThis.__vestaDemoApiInstalled = true;
  globalThis.fetch = async (input, init = {}) => {
    const url = typeof input === "string" ? input : input.url;
    const method = (init.method ?? "GET").toUpperCase();
    const body = getDemoResponse(url, method);

    if (!url.includes("/Vesta")) return originalFetch(input, init);

    return new Response(JSON.stringify(body), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  };
}
