import React from "react";
import logoVesta from "../assets/img/Logo-VestaRiskManager2.png";
import { Navbar, Container, Figure, Nav, NavDropdown } from "@/components/ui";
import "../styles/GradientBorderComponent.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHouse,
  faArrowRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { useUsuario } from "../context/usuarioContext";
import { faCircleQuestion } from "@fortawesome/free-regular-svg-icons";
import { URL_BASE } from "../utils/funciones";

/**
 * Componente NavegadorLider
 *
 * Este componente renderiza una barra de navegación específica para líderes y desarrolladores de proyectos.
 * Incluye opciones para navegar al dashboard, lista de riesgos, monitoreo y cerrar sesión.
 *
 * @returns {JSX.Element} - Barra de navegación personalizada para líderes y desarrolladores.
 */
export default function NavegadorLider() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id_proyecto: idProyectoRuta } = useParams();
  const comprobacionLider = location.pathname.includes("lider");

  const { usuario } = useUsuario();
  const proyecto = JSON.parse(localStorage.getItem("proyecto_seleccionado"));
  const idProyecto = proyecto?.id_proyecto ?? idProyectoRuta;
  if (usuario.nombre_perfil === "Espectador" || usuario.nombre_perfil === "Administrador") {
    return (
    <Navbar
      expand="lg"
      bg="dark"
      variant="dark"
       className="gradient-border-bottom px-3"
    >
      <Container className="flex items-center">
        <Navbar.Brand href="/inicio" className="flex items-center">
           <Figure.Image src={logoVesta} width={60} className="mr-2 self-center" />
          Vesta Risk Manager
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse>
          <Nav className="ml-auto" >
            <Nav.Link 
              href={`${URL_BASE}/inicio/espectador/proyecto/${idProyecto}`}
            >
              <FontAwesomeIcon icon={faHouse} className="mx-2" />
              Inicio
            </Nav.Link>
            <Nav.Link
              href={`${URL_BASE}/inicio/proyecto/espectador/${idProyecto}/riesgos`}
            >
              Lista de Riesgos
            </Nav.Link>
            <Nav.Link
              href={`${URL_BASE}/inicio/proyecto/espectador/${idProyecto}/monitoreo`}
            >
              Monitoreo
            </Nav.Link>

            <Nav.Link
              href={`${URL_BASE}/inicio/proyecto/espectador/${idProyecto}/ayuda`}
            >
              <FontAwesomeIcon icon={faCircleQuestion} className="mx-2" />
              Ayuda
            </Nav.Link>

            <Nav.Link href={usuario.nombre_perfil == "Administrador" ? `${URL_BASE}/inicio/proyecto/${idProyecto}` : `${URL_BASE}/inicio/espectador/proyectos`}>
              <FontAwesomeIcon
                icon={faArrowRightFromBracket}
                className="mx-2"
              />
              Salir
            </Nav.Link>

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
  }else {
    return (
      <Navbar
        expand="lg"
        bg="dark"
        variant="dark"
       className="gradient-border-bottom px-3"
      >
        <Container className="flex items-center">
          <Navbar.Brand href={`${URL_BASE}/inicio`} className="flex items-center">
             <Figure.Image src={logoVesta} width={60} className="mr-2 self-center" />
            Vesta Risk Manager
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse>
            <Nav className="ml-auto" >
              <Nav.Link 
              style={comprobacionLider ? {} : {display: "none"}}
                href={`${URL_BASE}/inicio/proyecto/lider/${idProyecto}`}
              >
                <FontAwesomeIcon icon={faHouse} className="mx-2" />
                Inicio
              </Nav.Link>
              <Nav.Link
                href={`${URL_BASE}/inicio/proyecto/${
                  comprobacionLider ? "lider" : "desarrollador"
                }/${idProyecto}/riesgos`}
              >
                Lista de Riesgos
              </Nav.Link>
              <Nav.Link
                href={`${URL_BASE}/inicio/proyecto/${
                  comprobacionLider ? "lider" : "desarrollador"
                }/${idProyecto}/monitoreo`}
              >
                Monitoreo
              </Nav.Link>
              <Nav.Link 
              style={comprobacionLider ? {} : {display: "none"}}
                href={`${URL_BASE}/inicio/proyecto/lider/${idProyecto}/iteraciones`}
              >
                Iteraciones
              </Nav.Link>

              <Nav.Link
              href={`${URL_BASE}/inicio/proyecto/${
                  comprobacionLider ? "lider" : "desarrollador"
                }/${idProyecto}/ayuda`}
            >
              <FontAwesomeIcon icon={faCircleQuestion} className="mx-1" />
              Ayuda
            </Nav.Link>
  
              <Nav.Link href={`${URL_BASE}/inicio/proyectos/${comprobacionLider ? "lider" : "desarrollador"}`}>
                <FontAwesomeIcon
                  icon={faArrowRightFromBracket}
                  className="mx-2"
                />
                Salir
              </Nav.Link>
  
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
  }
}
