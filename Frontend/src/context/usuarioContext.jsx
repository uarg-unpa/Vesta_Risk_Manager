import { jwtDecode } from "jwt-decode";
import React, { createContext, useContext, useState, useEffect } from "react";

const UsuarioContext = createContext();

/**
 * Proveedor del contexto de usuario.
 *
 * Este componente envuelve la aplicación (o parte de ella) y proporciona
 * el estado del usuario y funciones para iniciar y cerrar sesión.
 *
 * @param {ReactNode} children - Componentes hijos que tendrán acceso al contexto.
 * @returns {JSX.Element} - Proveedor del contexto de usuario.
 */
export function UsuarioProvider({ children }) {
  // Estado para almacenar los datos del usuario
  const [usuario, setUsuario] = useState(() => {
    const usuarioGuardado = localStorage.getItem("usuario");
    return usuarioGuardado ? jwtDecode(usuarioGuardado) : null;
  });

  /**
   * Función para iniciar sesión.
   *
   * @param {string} jwt
   */
  function iniciarSesion(jwt) {
    const usuarioData = jwtDecode(jwt);
    setUsuario(usuarioData);
    localStorage.setItem("usuario", jwt); 
  }

  /**
   * Función para cerrar sesión.
   *
   * Elimina los datos del usuario del estado y de localStorage.
   */
  function cerrarSesion() {
    setUsuario(null);
    localStorage.removeItem("usuario");
  }

  return (
    <UsuarioContext.Provider value={{ usuario, iniciarSesion, cerrarSesion }}>
      {children}
    </UsuarioContext.Provider>
  );
}

/**
 * Hook personalizado para usar el contexto de usuario.
 *
 * @returns {Object} - El contexto de usuario, que incluye:
 *   - usuario: Datos del usuario actual.
 *   - iniciarSesion: Función para iniciar sesión.
 *   - cerrarSesion: Función para cerrar sesión.
 */
export function useUsuario() {
  return useContext(UsuarioContext);
}
