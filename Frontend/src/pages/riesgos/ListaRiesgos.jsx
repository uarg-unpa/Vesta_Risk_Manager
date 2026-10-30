import React, { useEffect, useState } from "react";
import Contenedor from "../../components/Contenedor";
import NavegadorLider from "../../components/NavegadorLider";
import Footer from "../../components/Footer";
import {
  Alert,
  Button,
  Dropdown,
  DropdownButton,
  Figure,
  Modal,
  OverlayTrigger,
  Table,
  Tooltip,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faNetworkWired,
  faPenToSquare,
  faPlus,
  faTrashCan,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import {
  useLoaderData,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import { eliminarRiesgo, obtenerRiesgosProyectoPaginado } from "../../services/riesgos";
import "./../../styles/ListaRiesgo.css";
import { faClipboardList } from "@fortawesome/free-solid-svg-icons/faClipboardList";
import escudoAmarillo from "../../assets/img/Escudo_amarillo.png";
import escudoGris from "../../assets/img/Escudo_gris.png";
import escudoAzul from "../../assets/img/Escudo_azul.png";
import escudoRojo from "../../assets/img/Escudo_rojo.png";
import escudoCritico from "../../assets/img/Escudo_critico.png";
import escudoVerde from "../../assets/img/Escudo_verde.png";
import { formatearFecha } from "../../utils/funciones";
import Paginado from "../../components/Paginado";
import { useUsuario } from "../../context/usuarioContext";

export default function ListaRiesgos() {
  const { id_proyecto } = useParams();
  const { riesgos, totalPaginas, iteracion } = useLoaderData();
  
  const [eliminar, setEliminar] = useState(false)
  const [riesgoSeleccionado, setRiesgoSeleccionado] = useState(0)

  const [riesgosCargados, setRiesgosCargados] = useState(riesgos)
  
  const [paginaActual, setPaginaActual] = useState(localStorage.getItem("pagina_riesgo")??1)

  const [orden, setOrden] = useState(localStorage.getItem("orden_riesgo")??1)
  
  const location = useLocation();

  const navigate = useNavigate();
  const comprobacionLider = location.pathname.includes("lider");
  const proyecto = JSON.parse(localStorage.getItem("proyecto_seleccionado"));
  const [confirmarEdicion, setConfirmarEdicion] = useState({
    confirmar: false,
    riesgo: null,
  });

  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    obtenerRiesgosProyectoPaginado(proyecto.id_proyecto, paginaActual, orden).then((data)=>{
      const {riesgos, _} = data;
      setRiesgosCargados(riesgos)
    })
    
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

  const {usuario} = useUsuario()
    const comprobacionEspectador = usuario.nombre_perfil === "Espectador" || usuario.nombre_perfil === "Administrador";

  return (
    <>
      <NavegadorLider />
      {comprobacionEspectador ? (
        <Alert variant="primary" className="text-center">
          Usted es espectador del proyecto {proyecto.nombre}. Sólo se permite la visualización.
        </Alert>
      ) : null}
      {iteracion === null ? (
        <Alert variant="danger" className="text-center">
          No existe una iteración activa del proyecto. Sólo se permite
          visualizar.
        </Alert>
      ) : null}
      {mensaje ? (
        <Alert variant="success" className="text-center fs-4">
          {mensaje}
        </Alert>
      ) : null}
      <Contenedor>
        <>
          <h3>{proyecto.nombre} - Lista de riesgos</h3>
          {iteracion ? (
            <>
              <h4>
                {iteracion.nombre}
                {" - "}
                {formatearFecha(iteracion.fecha_inicio)}
                {" al "}
                {formatearFecha(iteracion.fecha_fin)}
              </h4>
            </>
          ) : null}
        </>
        <>
        <div className="d-flex justify-content-between">
          <Button
            variant="success"
            onClick={() => {
              navigate(
                `/inicio/proyecto/${
                  comprobacionLider ? "lider" : "desarrollador"
                }/${id_proyecto}/riesgo/crear`
              );
            }}
            disabled={iteracion === null || comprobacionEspectador}
          >
            <FontAwesomeIcon icon={faPlus} className="mx-1" />
            Nuevo Riesgo
          </Button>
          <DropdownButton variant="success" title="Ordenar según" disabled={iteracion === null}>
              <Dropdown.Item onClick={()=>{
                setOrden(2)
                setPaginaActual(1)
                localStorage.setItem("orden_riesgo", 2)
              }} className={orden == 2 ? "active" : ""}>Escudos</Dropdown.Item>
              <Dropdown.Item onClick={()=>{
                setOrden(1)
                setPaginaActual(1)
                localStorage.setItem("orden_riesgo", 1)
                }} className={orden == 1 ? "active" : ""}>Identificador</Dropdown.Item>
              <Dropdown.Item onClick={()=>{
                setOrden(3)
                setPaginaActual(1)
                localStorage.setItem("orden_riesgo", 3)
                }} className={orden == 3 ? "active" : ""}>Falta evaluación</Dropdown.Item>
          </DropdownButton>
        </div>
          <Table size="sm" hover className="mt-2" bordered>
            <thead className="cabecera">
              <tr>
                <th style={{ minWidth: "4em" }} className="th"></th>
                <th className="th">ID</th>
                <th className="th">Categoría</th>
                <th className="th">Descripción</th>
                <th style={{ maxWidth: "2em" }} className="th">
                  Responsable
                </th>
                <th style={{ maxWidth: "5em" }} className="th">
                  Factor de riesgo
                </th>
                <th className="th">Acciones</th>
              </tr>
            </thead>
            <tbody>
              { riesgosCargados.length > 0 ? (
                riesgosCargados.map((riesgo, key) => (
                  <tr key={key} style={{ textAlign: "center" }}>
                    <td className="td" style={{}}>
                      {riesgo.factor_riesgo === null || riesgo.evaluado <= 0 ? (
                      <OverlayTrigger
                        placement="top"
                        overlay={
                          <Tooltip id="tooltip-edit">
                            Evaluación pendiente.
                          </Tooltip>
                        }
                      >
                        <Figure.Image
                          src={escudoAmarillo}
                          style={(iteracion && !comprobacionEspectador) ? { cursor: "pointer" } : null}
                          onClick={() => {
                            if (iteracion && !comprobacionEspectador) {
                              navigate(
                                `/inicio/proyecto/${
                                  comprobacionLider ? "lider" : "desarrollador"
                                }/${id_proyecto}/riesgo/${riesgo.id_riesgo}/evaluacion/crear`
                              );
                            }
                          }}
                        />
                      </OverlayTrigger>
                    ) : riesgo.factor_riesgo < 9 ? (
                      <OverlayTrigger
                        placement="top"
                        overlay={
                          <Tooltip id="tooltip-edit">
                            No necesita realizarse ninguna acción.
                          </Tooltip>
                        }
                      >
                        <Figure.Image src={escudoGris} />
                      </OverlayTrigger>
                    ) : riesgo.factor_riesgo < 36 ? (
                      <OverlayTrigger
                        placement="top"
                        overlay={
                          <Tooltip id="tooltip-edit">
                            Será reevaluado en la siguiente iteración.
                          </Tooltip>
                        }
                      >
                        <Figure.Image src={escudoAzul} />
                      </OverlayTrigger>
                    ) : riesgo.factor_riesgo < 64 ? (
                      riesgo.planes_realizado.total_minimizacion == 0 &&
                      riesgo.planes_realizado.total_mitigacion == 0 ? (
                        <OverlayTrigger
                          placement="top"
                          overlay={
                            <Tooltip id="tooltip-edit">
                              Estrategia de mitigación o minimización necesaria.
                            </Tooltip>
                          }
                        >
                          <Figure.Image 
                            src={escudoRojo}
                            style={(iteracion && !comprobacionEspectador) ? { cursor: "pointer" } : null} 
                            onClick={() => {
                              if (iteracion && !comprobacionEspectador) {
                                navigate(
                                  `/inicio/proyecto/${
                                    comprobacionLider ? "lider" : "desarrollador"
                                  }/${id_proyecto}/riesgo/${riesgo.id_riesgo}/plan/crear`
                                );
                              }
                            }}
                          />
                        </OverlayTrigger>
                      ) : (
                        <OverlayTrigger
                          placement="top"
                          overlay={
                            <Tooltip id="tooltip-edit">
                              No necesita realizarse ninguna acción.
                            </Tooltip>
                          }
                        >
                          <Figure.Image 
                            src={escudoVerde} 
                          />
                        </OverlayTrigger>
                      )
                    ) : riesgo.planes_realizado.total_contingencia == 0 ||
                      (riesgo.planes_realizado.total_minimizacion == 0 &&
                        riesgo.planes_realizado.total_mitigacion == 0) ? (
                      <OverlayTrigger
                        placement="top"
                        overlay={
                          <Tooltip id="tooltip-edit">
                            Estrategia de contingencia y de
                            mitigación/minimización necesaria.
                          </Tooltip>
                        }
                      >
                        <Figure.Image
                          src={escudoCritico}
                          style={(iteracion && !comprobacionEspectador) ? { cursor: "pointer" } : null}
                          onClick={() => {
                            if (iteracion && !comprobacionEspectador) {
                              navigate(
                                `/inicio/proyecto/${
                                  comprobacionLider ? "lider" : "desarrollador"
                                }/${id_proyecto}/riesgo/${riesgo.id_riesgo}/plan/crear`
                              );
                            }
                          }}
                        />
                      </OverlayTrigger>
                    ) : (
                      <OverlayTrigger
                        placement="top"
                        overlay={
                          <Tooltip id="tooltip-edit">
                            No necesita realizarse ninguna acción.
                          </Tooltip>
                        }
                      >
                        <Figure.Image src={escudoVerde} />
                      </OverlayTrigger>
                    )}
                  </td>
                  <td className="td">
                    RK
                    {riesgo.id_riesgo < 10
                      ? `0${riesgo.id_riesgo}`
                      : riesgo.id_riesgo}
                  </td>
                  <td className="td">{riesgo.nombre_categoria}</td>
                  <td
                    style={{ maxWidth: "20em", textAlign: "justify" }}
                    className="td"
                  >
                    {riesgo.descripcion}
                  </td>
                  <td className="td" style={{ maxWidth: "8em" }}>
                    {riesgo.responsables}
                  </td>
                  <td className="td">
                    {riesgo.evaluado > 0 ? riesgo.factor_riesgo : null}
                  </td>
                  <td className="td">
                    {
                      comprobacionLider || comprobacionEspectador ? (
                        <>
                        <div className={`${comprobacionLider || comprobacionEspectador ? "" : "d-none"}`}>
                          <OverlayTrigger
                            placement="top"
                            overlay={<Tooltip id="tooltip-edit">Editar</Tooltip>}
                          >
                            <Button
                              variant="outline-warning"
                              disabled={iteracion === null || comprobacionEspectador}
                              onClick={() => {
                                if (riesgo.factor_riesgo) {
                                  setConfirmarEdicion({ confirmar: true, riesgo });
                                } else {
                                  navigate(
                                    `/inicio/proyecto/lider/${id_proyecto}/riesgo/modificar/${riesgo.id_riesgo}`
                                  );
                                }
                              }}
                            >
                              <FontAwesomeIcon icon={faPenToSquare} />
                            </Button>
                          </OverlayTrigger>
                          <OverlayTrigger
                            placement="top"
                            overlay={<Tooltip id="tooltip-edit">Eliminar</Tooltip>}
                          >
                            <Button
                              style={{ marginLeft: "5px" }}
                              variant="outline-danger"
                              disabled={iteracion === null || comprobacionEspectador} 
                              onClick={()=>{
                                setEliminar(true)
                                setRiesgoSeleccionado(riesgo.id_riesgo)
                              }}
                            >
                              <FontAwesomeIcon icon={faTrashCan} />
                            </Button>
                          </OverlayTrigger>
                      </div>
                      <br />
                        </>  
                      ) : null
                    }
                    
                    <div>
                      <OverlayTrigger
                        placement={comprobacionLider ? "bottom" : "top"}
                        overlay={<Tooltip id="tooltip-edit">Evaluar</Tooltip>}
                      >
                        <Button
                          variant="outline-primary"
                          disabled={iteracion === null || comprobacionEspectador || riesgo.evaluado > 0}
                          onClick={() => {
                            navigate(
                              `/inicio/proyecto/${
                                comprobacionLider ? "lider" : "desarrollador"
                              }/${id_proyecto}/riesgo/${riesgo.id_riesgo}/evaluacion/crear`
                            );
                          }}
                        >
                          <FontAwesomeIcon icon={faClipboardList} />
                        </Button>
                      </OverlayTrigger>
                      <OverlayTrigger
                        placement={comprobacionLider ? "bottom" : "top"}
                        overlay={
                          <Tooltip id="tooltip-edit">Planificar</Tooltip>
                        }
                      >
                        <Button
                          style={{ marginLeft: "5px" }}
                          variant="outline-success"
                          disabled={
                            iteracion === null ||
                            riesgo.factor_riesgo < 9 ||
                            riesgo.evaluado <= 0 || comprobacionEspectador
                          }
                          onClick={() => {
                            navigate(
                              `/inicio/proyecto/${
                                comprobacionLider ? "lider" : "desarrollador"
                              }/${id_proyecto}/riesgo/${riesgo.id_riesgo}/plan/crear`
                            );
                          }}
                        >
                          <FontAwesomeIcon icon={faNetworkWired} />
                        </Button>
                      </OverlayTrigger>
                    </div>
                  </td>
                </tr>
              ))) : (
                <tr>
                  <td colSpan="8" className="text-center">No hay riesgos cargados</td>
                </tr> 
              )}
            </tbody>
          </Table>
          <Paginado paginaActual={paginaActual} setPaginaActual={setPaginaActual} totalPaginas={totalPaginas} />

          <Modal
            show={confirmarEdicion.confirmar}
            onHide={() => {
              setConfirmarEdicion({ confirmar: false, riesgo: null });
            }}
          >
            <Modal.Header closeButton>
              <Modal.Title>¿Está seguro?</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p>
                El riesgo posee evaluaciones y/o planes asociados. Si se realiza
                alguna modificación podría generarse una inconsistencia.
              </p>
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="outline-success"
                onClick={() => {
                  navigate(
                    `/inicio/proyecto/lider/${id_proyecto}/riesgo/modificar/${confirmarEdicion.riesgo.id_riesgo}`
                  );
                }}
              >
                <FontAwesomeIcon
                  icon={faCheck}
                  style={{ marginRight: "5px" }}
                />
                Editar de todos modos
              </Button>
              <Button
                variant="outline-danger"
                onClick={() => {
                  setConfirmarEdicion({ confirmar: false, riesgo: null });
                }}
              >
                <FontAwesomeIcon
                  icon={faXmark}
                  style={{ marginRight: "5px" }}
                />
                Cancelar
              </Button>
            </Modal.Footer>
          </Modal>

          <Modal
            show={eliminar}
            onHide={() => {
              setEliminar(false)
              setRiesgoSeleccionado(0)
            }}
          >
            <Modal.Header closeButton>
              <Modal.Title>¿Está seguro?</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p>
                Una vez eliminado el riesgo, se eliminaran las evaluaciones, las planificaciones e incidencias.
              </p>
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="outline-success"
                onClick={async() => {
                  await eliminarRiesgo(id_proyecto, riesgoSeleccionado)
                  setPaginaActual(1)
                  localStorage.setItem("pagina_riesgo", 1)
                  navigate(0);
                  setEliminar(false)
                  setRiesgoSeleccionado(0)
                }}
              >
                <FontAwesomeIcon
                  icon={faCheck}
                  style={{ marginRight: "5px" }}
                />
                Eliminar
              </Button>
              <Button
                variant="outline-danger"
                onClick={() => {
                  setEliminar(false)
                  setRiesgoSeleccionado(0)
                }}
              >
                <FontAwesomeIcon
                  icon={faXmark}
                  style={{ marginRight: "5px" }}
                />
                Cancelar
              </Button>
            </Modal.Footer>
          </Modal>
        </>
      </Contenedor>
      <Footer />
    </>
  );
}
