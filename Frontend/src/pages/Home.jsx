import React from "react";
import Navegador from "../components/Navegador";
import Footer from "../components/Footer";
import Contenedor from "../components/Contenedor";
import { useUsuario } from "../context/usuarioContext";
import { Button } from "react-bootstrap";
import "./../styles/Home.css";
import { useNavigate } from "react-router-dom";
export default function Home() {
  const { usuario } = useUsuario();
  
  const navigate = useNavigate();
  return (
    <>
      <Navegador />
      <Contenedor>
        <h3>Bienvenido</h3>
        {usuario && (usuario.nombre_perfil === "Administrador" || usuario.nombre_perfil === "Espectador") ? (
          <div style={{ minHeight: "40vh" }}>
            <p>
              Le damos la bienvenida a Vesta Risk Manager. Seleccione una de las
              siguientes opciones:
            </p>
            <Button
              className="px-4 py-3 me-2 boton_1"
              onClick={() => {
                navigate(usuario.nombre_perfil === "Espectador"? "/inicio/espectador/proyectos" : "/inicio/proyectos");
              }}
            >
              Ver Proyectos
            </Button>
            {
              usuario.nombre_perfil === "Administrador" && (
                <Button
                  className="px-4 py-3 me-2 boton_2"
                  onClick={() => {
                    navigate("/inicio/categorias");
                  }}
                >
                  Ver Categorías
                </Button>
              )
            }
          </div>
        ) : (
          <div style={{ minHeight: "40vh" }}>
            <p>
              Le damos la bienvenida a Vesta Risk Manager. En caso de tener
              proyectos activos seleccione una de las siguientes opciones para
              visualizar su proyecto:
            </p>
            <Button
              className="px-4 py-3 me-2 boton_1"
              onClick={() => {
                navigate("/inicio/proyectos/lider");
              }}
            >
              Proyectos de Líder
            </Button>
            <Button
              className="px-4 py-3 me-2 boton_2"
              onClick={() => {
                navigate("/inicio/proyectos/desarrollador");
              }}
            >
              Proyectos de Desarrollador
            </Button>
          </div>
        )}
      </Contenedor>
      <Footer />
    </>
  );
}
