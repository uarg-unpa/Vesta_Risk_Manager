import { useEffect, useState } from "react";
import Navegador from "../../../components/Navegador";
import Footer from "../../../components/Footer";
import { useLoaderData, useNavigate } from "react-router-dom";
import Contenedor from "../../../components/Contenedor";
import "./../../../styles/Home.css";
import { OverlayTrigger, ProjectRow, Tooltip } from "@/components/ui";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  obtenerProyectosId,
  obtenerProyectosUsuarioDesarrolladorPaginado,
} from "../../../services/proyectos";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import BotonSalir from "../../../components/BotonSalir";
import { useUsuario } from "../../../context/usuarioContext";
import Paginado from "../../../components/Paginado";



export default function ListaProyectoDesarrollador() {
  const navigate = useNavigate();
  const { proyectos, totalPaginas } = useLoaderData();
  const {usuario} = useUsuario();

  const [paginaActual, setPaginaActual] = useState(1);
  const [totalPaginasCargadas, setTotalPaginasCargadas] = useState(totalPaginas);
  const [proyectosCargados, setProyectosCargados] = useState(proyectos);

  useEffect(() => {
      obtenerProyectosUsuarioDesarrolladorPaginado(usuario.email, paginaActual).then(
        ({proyectos, totalPaginas: paginas}) => {
          setProyectosCargados(proyectos);
          setTotalPaginasCargadas(paginas);
      });
    }, [paginaActual, usuario.email]);

  const ingresarAlProyecto = async (idProyecto) => {
    const proyecto = await obtenerProyectosId(idProyecto);
    localStorage.setItem("proyecto_seleccionado", JSON.stringify(proyecto));
    navigate(`/inicio/proyecto/desarrollador/${idProyecto}/riesgos`);
  };

  useEffect(() => {
    localStorage.removeItem("pagina_riesgo")
    localStorage.removeItem("orden_riesgo")
    localStorage.removeItem("proyecto_seleccionado")
  }, [])

  return (
    <>
      <Navegador />
      <Contenedor>
        <h3>Proyectos de Desarrollador</h3>
        <div style={{ minHeight: "40vh" }}>
          {proyectosCargados && proyectosCargados.length > 0 ? (
            proyectosCargados.map((item, key) => (
              <ProjectRow
                key={key}
                className="boton_proyecto"
            >
              {item.nombre}
              <OverlayTrigger
                placement="top"
                overlay={<Tooltip id="tooltip-edit">Ingresar</Tooltip>}
                >
                  <FontAwesomeIcon
                    icon={faSearch}
                    className="font-bold text-2xl mr-2 icono"
                    aria-hidden="true"
                    onClick={() => ingresarAlProyecto(item.id_proyecto)}
                />
                
              </OverlayTrigger>
            </ProjectRow>
            ))
          ) : (
            <p className="text-center font-bold">No posee proyectos asignados</p>
          )}
          <Paginado
            paginaActual={paginaActual}
            totalPaginas={totalPaginasCargadas}
            setPaginaActual={setPaginaActual}
          />
          <BotonSalir ruta={"/inicio"} />

        </div>
      </Contenedor>
      <Footer />
    </>
  );
}
