import React, { useEffect, useState } from "react";
import Navegador from "../../components/Navegador";
import Footer from "../../components/Footer";
import { useLoaderData, useNavigate } from "react-router-dom";
import Contenedor from "../../components/Contenedor";
import "./../../styles/Home.css";
import { Alert, Button, Dropdown, DropdownButton, OverlayTrigger, ProjectRow, Tooltip } from "@/components/ui";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faPlus, faSearch } from "@fortawesome/free-solid-svg-icons";
import { useLocation } from "react-router-dom";
import BotonSalir from "../../components/BotonSalir";
import Paginado from "../../components/Paginado";
import { obtenerProyectosId, obtenerProyectosPaginado } from "../../services/proyectos";

export default function ListaProyecto() {
  
  const navigate = useNavigate();
  const {proyectos, totalPaginas} = useLoaderData();
  const location = useLocation();
  const comprobacionEspectador = location.pathname.includes("espectador");

  const [paginaActual, setPaginaActual] = useState(1);
  const [proyectosCargados, setProyectosCargados] = useState(proyectos);

  const [mensaje, setMensaje] = useState("");
  const [orden, setOrden] = useState(localStorage.getItem("orden_proyecto")??1)

  useEffect(() => {
    obtenerProyectosPaginado(paginaActual, orden).then(
      ({proyectos, _}) => {
        setProyectosCargados(proyectos);
      }
    )
  }, [paginaActual, orden])
  

  useEffect(() => {
    if (location.state?.mensaje) {
      window.scrollTo(0, 0);
      setMensaje(location.state.mensaje);

      // Limpiar el mensaje después de unos segundos
      const timeoutId = setTimeout(() => {
        setMensaje("");
      }, 3000); // Mostrar el mensaje durante 3 segundos

      // Limpiar el timeout si el componente se desmonta
      return () => clearTimeout(timeoutId);
    }
  }, [location.state]);
  return (
    <>
      <Navegador />
      {mensaje ? (
        <Alert variant="success" className="text-center text-xl">
          {mensaje}
        </Alert>
      ) : null}
      <Contenedor>
        <h3>Proyectos</h3>
        <div style={{ minHeight: "40vh" }}>
          <div className="flex justify-between items-center mb-3">
{
            !comprobacionEspectador && (
              <Button
                variant="success"
                onClick={() => {
                  navigate("/inicio/proyecto/crear");
                }}
              >
                <FontAwesomeIcon icon={faPlus} className="mx-1" />
                Nuevo Proyecto
              </Button>
            )
          }
          <DropdownButton variant="success" title="Estado del proyecto">
              <Dropdown.Item onClick={()=>{
                setOrden(1)
                setPaginaActual(1)
                localStorage.setItem("orden_proyecto", 1)
               }} className={orden == 1 ? "bg-blue-600 text-white hover:bg-blue-700" : ""}>Activos</Dropdown.Item>
              <Dropdown.Item onClick={()=>{
                setOrden(2)
                setPaginaActual(1)
                localStorage.setItem("orden_proyecto", 2)
                 }} className={orden == 2 ? "bg-blue-600 text-white hover:bg-blue-700" : ""}>Inactivos</Dropdown.Item>
                <Dropdown.Item onClick={()=>{
                setOrden(3)
                setPaginaActual(1)
                localStorage.setItem("orden_proyecto", 3)
                 }} className={orden == 3 ? "bg-blue-600 text-white hover:bg-blue-700" : ""}>Abandonados</Dropdown.Item>
              <Dropdown.Item onClick={()=>{
                setOrden(4)
                setPaginaActual(1)
                localStorage.setItem("orden_proyecto", 4)
                 }} className={orden == 4 ? "bg-blue-600 text-white hover:bg-blue-700" : ""}>Finalizados</Dropdown.Item>
          </DropdownButton>
          </div>
          
          {proyectosCargados && proyectosCargados.length > 0 ? (
            proyectosCargados.map((item, key) => (
              <ProjectRow
                key={key}
                className={`${item.estado == "activo" ? "boton_proyecto": item.estado == "inactivo"? "boton_proyecto_inactivo": item.estado == "finalizado" ? "boton_proyecto_finalizado": "boton_proyecto_abandonado"}`}
            >
              {item.nombre}
              <div className="w-1/4 flex justify-end gap-1 items-center">
                <OverlayTrigger
                      placement="top"
                      overlay={<Tooltip id="tooltip-edit">{comprobacionEspectador ? "Espectear" : "Ver"}</Tooltip>}
                    >
                <FontAwesomeIcon
                  icon={faSearch}
                  className="font-bold text-2xl mr-2 icono"
                  onClick={async() => {
                    const proyecto = await obtenerProyectosId(item.id_proyecto);
                    localStorage.setItem(
                        "proyecto_seleccionado",
                        JSON.stringify(proyecto)
                      );
                    navigate(comprobacionEspectador? `/inicio/espectador/proyecto/${item.id_proyecto}`:`/inicio/proyecto/${item.id_proyecto}`);
                  }}
                />
                      
                    </OverlayTrigger>
                {(!comprobacionEspectador && orden != 4) && (
                  <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip id="tooltip-edit">Editar</Tooltip>}
                  >
                    <FontAwesomeIcon
                      icon={faPenToSquare}
                      className="font-bold text-2xl mr-2 icono"
                      onClick={() => {
                        navigate(`/inicio/proyecto/modificar/${item.id_proyecto}`);
                      }}
                    />
                  </OverlayTrigger>
                )
                }
                
              </div>
            </ProjectRow>
          ))
          ) : (
            <p className="text-center font-bold">No posee proyectos en esta categoria</p>
          )}
          <Paginado
            paginaActual={paginaActual}
            totalPaginas={totalPaginas}
            setPaginaActual={setPaginaActual}
          />
          <BotonSalir ruta={"/inicio"} />
        </div>
      </Contenedor>
      <Footer />
    </>
  );
}
