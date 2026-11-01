import React from "react";
import logoVesta from "../assets/img/Logo-VestaRiskManager2.png";
import { Navbar, Container, Figure, Nav, NavDropdown } from "@/components/ui";
import "../styles/GradientBorderComponent.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHouse,
  faUser,
  faUserGear,
  faArrowRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";
import { useLocation } from "react-router-dom";
import { useUsuario } from "../context/usuarioContext";
import { URL_BASE } from "../utils/funciones"; 

/**
 * Componente Navegador
 *
 * Este componente renderiza una barra de navegación para usuarios que iniciaron sesion y los que no.
 * Incluye opciones para navegar a la página de inicio, administrar usuarios y perfiles (solo para administradores),
 * y cerrar sesión.
 *
 * @returns {JSX.Element} - Barra de navegación personalizada.
 */
export default function Navegador() {
  const location = useLocation();
  const { usuario } = useUsuario();
  if (location.pathname.includes("inicio")) {
    return (
      <Navbar
        expand="lg"
        bg="dark"
        variant="dark"
        className="gradient-border-bottom"
      >
        <Container className="flex items-center">
          <Navbar.Brand href={`${URL_BASE}/inicio`} className="flex items-center">
            <Figure.Image src={logoVesta} width={60} className="mr-2 self-center" />
            Vesta Risk Manager
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse>
            <Nav className="ml-auto">
              <Nav.Link href={`${URL_BASE}/inicio`}>
                <FontAwesomeIcon icon={faHouse} className="mx-2" />
                Inicio
              </Nav.Link>
              {usuario?.nombre_perfil === "Administrador" && (
                <NavDropdown
                  title="Administrar acceso"
                  id="basic-nav-dropdown"
                  menuVariant="dark"
                  menuClassName="!border-white/15 !bg-[#212529]"
                  className="border-0 bg-transparent px-4 py-2 text-base text-white/55 hover:border-0 hover:bg-transparent hover:text-white"
                >
                  <NavDropdown.Item className="!text-white hover:!bg-white/10 hover:!text-white" href={`${URL_BASE}/inicio/usuarios`}>
                    <FontAwesomeIcon icon={faUser} className="mx-2" />
                    Usuarios
                  </NavDropdown.Item>
                  <NavDropdown.Item className="!text-white hover:!bg-white/10 hover:!text-white" href={`${URL_BASE}/inicio/perfiles`}>
                    <FontAwesomeIcon icon={faUserGear} className="mx-2" />
                    Perfiles
                  </NavDropdown.Item>
                </NavDropdown>
              )}
              <Nav.Link href={`${URL_BASE}/salir`}>
                <FontAwesomeIcon
                  icon={faArrowRightFromBracket}
                  className="mx-2"
                />
                Cerrar Sesión
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    );
  } else {
    return (
      <Navbar
        expand="lg"
        bg="dark"
        variant="dark"
        className="gradient-border-bottom"
      >
          <Container className="flex items-center">
          <Navbar.Brand href={`${URL_BASE}/`} className="flex items-center">
            <Figure.Image src={logoVesta} width={80} className="mr-2 self-center" />
            Vesta Risk Manager
          </Navbar.Brand>
        </Container>
      </Navbar>
    );
  }
}
