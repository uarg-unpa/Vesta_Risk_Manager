import React, { useEffect, useRef, useState } from 'react'
import NavegadorLider from '../../components/NavegadorLider'
import Contenedor from '../../components/Contenedor'
import { Alert, Button, OverlayTrigger, Table, Tooltip } from 'react-bootstrap';
import { useNavigate, useLoaderData } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faPlus, faSearch } from '@fortawesome/free-solid-svg-icons';
import { formatearFecha } from "../../utils/funciones.js"
import Paginado from '../../components/Paginado';
import { obtenerIteracionesPaginada } from '../../services/iteraciones.js';
import CrearIteracion from './CrearIteracion.jsx';
import ModificarIteracion from "./ModificarIteracion.jsx"
import Footer from '../../components/Footer.jsx';

export default function ListaIteraciones() {
    const navigate = useNavigate();
    const proyecto = JSON.parse(localStorage.getItem("proyecto_seleccionado"));
    
    const { iteraciones, totalPaginas, iteracion } = useLoaderData();
    const [paginaActual, setPaginaActual] = useState(1)
    const [iteracionesCargadas, setIteracionesCargadas] = useState(iteraciones);
    const [iteracionSeleccionada, setIteracionSeleccionada] = useState({
        nombre: "",
        fecha_inicio:"",
        fecha_fin: ""
    })

    useEffect(() => {
      obtenerIteracionesPaginada(proyecto.id_proyecto, paginaActual).then(
        (data) =>{
            setIteracionesCargadas(data.iteraciones)
        }
      )
    }, [paginaActual])

    const crearIteracionRef = useRef()
    const modificarIteracionRef = useRef()


  return (
    <>
        <NavegadorLider />
        {iteracion === null ? (
        <Alert variant="danger" className="text-center">
          No existe una iteración activa del proyecto. Sólo se permite
          visualizar.
        </Alert>
      ) : null}
        <Contenedor>
            <>
              <h3>{proyecto.nombre} - Lista de iteraciones</h3>
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
                <div>
                    <CrearIteracion ref={crearIteracionRef} iteraciones={proyecto.iteraciones} id_proyecto={proyecto.id_proyecto} navigate={navigate} />  
                    <ModificarIteracion ref={modificarIteracionRef} iteraciones={proyecto.iteraciones} id_proyecto={proyecto.id_proyecto} navigate={navigate} iteracionSeleccionada={iteracionSeleccionada} />
                    <Button
                        variant="success"
                        onClick={() => {
                            crearIteracionRef.current.abrir_modal()                            
                        }}
                    >
                        <FontAwesomeIcon icon={faPlus} className="mx-1" />
                        Nueva Iteración
                    </Button>
                </div>
                <Table size="sm" hover className="mt-2" bordered>
                    <thead className="cabecera">
                        <tr>
                        <th style={{ width: "10em" }} className="th">Nombre</th>
                        <th style={{ width: "10em" }} className="th">Fecha de Inicio</th>
                        <th style={{ width: "10em" }} className="th">Fecha de Finalización</th>
                        <th style={{ width: "14em" }} className="th">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {iteracionesCargadas.length > 0 ? iteracionesCargadas.map((iteracionCargada, key) => (
                        <tr key={key} style={{ textAlign: "center" }}>
                            <td style={{ textWrap: "wrap" }}>{iteracionCargada.nombre}</td>
                            <td style={{ textWrap: "wrap" }}>{formatearFecha(iteracionCargada.fecha_inicio)}</td>
                            <td style={{ textWrap: "wrap" }}>{formatearFecha(iteracionCargada.fecha_fin)}</td>
                            <td className="td">

                            {/* <OverlayTrigger
                                placement="top"
                                overlay={<Tooltip id="tooltip-edit">Ver</Tooltip>}
                            >
                                <Button
                                variant="outline-primary"
                                onClick={() => {
                                }}
                                >
                                <FontAwesomeIcon icon={faSearch} />
                                </Button>
                            </OverlayTrigger> */}
                            <OverlayTrigger
                                placement="top"
                                overlay={<Tooltip id="tooltip-edit">Editar</Tooltip>}
                            >
                                <Button
                                // disabled={iteracion === null || comprobacionEspectador}
                                variant="outline-warning"
                                style={{ marginLeft: "5px" }}

                                onClick={() => {
                                    setIteracionSeleccionada(iteracionCargada)
                                    modificarIteracionRef.current.abrir_modal()
                                }}
                                >
                                <FontAwesomeIcon icon={faPenToSquare} />
                                </Button>
                            </OverlayTrigger>
                            {/* <OverlayTrigger
                                placement="top"
                                overlay={
                                <Tooltip id="tooltip-edit">Eliminar</Tooltip>
                                }
                            >
                                <Button
                                style={{ marginLeft: "5px" }}
                                onClick={()=>{
                                    // setEliminar(true)
                                    // setPlanSeleccionado(plan.id_plan)
                                }}
                                variant="outline-danger"
                                >
                                <FontAwesomeIcon icon={faTrashCan} />
                                </Button>
                            </OverlayTrigger> */}

                            </td>
                        </tr>
                        )) : (
                        <tr>
                            <td colSpan="5" style={{ textAlign: "center" }}>No hay iteraciones disponibles</td>
                        </tr>
                        )}
                    </tbody>
                    </Table>
                    <Paginado paginaActual={paginaActual} setPaginaActual={setPaginaActual} totalPaginas={totalPaginas} />
            </> 
        </Contenedor>
        <Footer />
    </>
  )
}
