import React from "react";
import { Navigate } from "react-router-dom";
import { useUsuario } from "../context/usuarioContext";
/**
 * Componente que protege rutas en una aplicación React.
 * Permite el acceso solo a usuarios autenticados o administradores, según el caso.
 *
 * @param {ReactNode} element - El componente que se renderizará si el usuario tiene acceso.
 * @param {boolean} isAdmin - Indica si la ruta es exclusiva para administradores.
 * @returns {ReactNode} - El componente `element` si el usuario tiene acceso, o un componente `Navigate` para redirigir en caso contrario.
 */
export default function RutaProtegida({ element, isAdmin }) {
  const { usuario } = useUsuario();
  

  if (isAdmin) {
    return usuario && usuario.nombre_perfil == "Administrador" ? (
      element
    ) : (
      <Navigate to="/inicio" />
    );
  } else {
    return usuario ? element : <Navigate to="/" />;
  }
}
