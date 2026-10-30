import React from "react";
import logoVesta from "../assets/img/Logo-VestaRiskManager2.png";
import { Navbar, Container, Figure, Nav, NavDropdown } from "react-bootstrap";
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
        <Container className="d-flex align-items-center">
          <Navbar.Brand href={`${URL_BASE}/inicio`} className="d-flex align-items-center">
            <Figure.Image src={logoVesta} width={60} />
            Vesta Risk Manager
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse>
            <Nav className="me-auto">
              <Nav.Link href={`${URL_BASE}/inicio`}>
                <FontAwesomeIcon icon={faHouse} className="mx-2" />
                Inicio
              </Nav.Link>
              <NavDropdown
                title="Administrar acceso"
                id="basic-nav-dropdown"
                menuVariant="dark"
                className={usuario.nombre_perfil == "Administrador" ? "" : "d-none"}
              >
                <NavDropdown.Item href={`${URL_BASE}/inicio/usuarios`}>
                  <FontAwesomeIcon icon={faUser} className="mx-2" />
                  Usuarios
                </NavDropdown.Item>
                <NavDropdown.Item href={`${URL_BASE}/inicio/perfiles`}>
                  <FontAwesomeIcon icon={faUserGear} className="mx-2" />
                  Perfiles
                </NavDropdown.Item>
              </NavDropdown>
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
        <Container>
          <Navbar.Brand href={`${URL_BASE}/`} className="d-flex align-items-center">
            <Figure.Image src={logoVesta} width={100} />
            Vesta Risk Manager
          </Navbar.Brand>
        </Container>
      </Navbar>
    );
  }
}
