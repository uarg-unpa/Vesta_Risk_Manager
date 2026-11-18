export function puedeModificarTarea(perfil, iteracion) {
  return iteracion != null && perfil !== 'Espectador' && perfil !== 'Administrador';
}

export function puedeCompletarTarea(perfil, iteracion, tarea) {
  return puedeModificarTarea(perfil, iteracion) && tarea?.estado == 0;
}
