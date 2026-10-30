import React, { useState, useEffect } from "react";
import Contenedor from "../../components/Contenedor";
import Footer from "./../../components/Footer";
import Navegador from "../../components/Navegador";
import { Button, Form, Modal, OverlayTrigger, Table, Tooltip } from "react-bootstrap";
import { useLoaderData, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faMagnifyingGlass,
  faPenToSquare,
  faPlus,
  faTrashCan,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import "./../../styles/modal.css";
import {
  crearProyecto,
  obtenerParticipanteNombre,
} from "../../services/proyectos";
import {
  comprobarFechasNuevaIteracion,
  formatearFecha,
  verificarError
} from "../../utils/funciones";
import ModalPersonalizado from "../../components/ModalPersonalizado";
import Paginado from "../../components/Paginado";

export default function CrearProyecto() {
  // Solicita las categorías por defecto.
  const categorias = useLoaderData();
  
  const navigate = useNavigate();

  //Estados relacionados a mostrar el modal.
  const [mostrarParticipante, setMostrarParticipante] = useState(false);
  const [mostrarIteracion, setMostrarIteracion] = useState(false);
  const [modificarIteracion, setModificarIteracion] = useState(false);
  const [modificarParticipante, setModificarParticipante] = useState(false);
  const [seguro, setSeguro] = useState(false);

  // Estados relacionados a los errores.
  const [errorPrincipal, setErrorPrincipal] = useState({
    nombre: false,
    descripcion: false,
    categorias: false,
    nombreIgual: false,
  });
  const [errorParticipante, setErrorParticipante] = useState({
    nombre: false,
    usuarioElegido: false,
    rol: false,
  });
  const [errorIteracion, setErrorIteracion] = useState({
    nombre: false,
    fecha_inicio: false,
    fecha_fin: false,
    fechasSuperpuestas: false,
    fechasFinAntes: false,
    nombreIgual: false,
  });

  // Estados relacionados al formulario
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    estado: "Inactivo",
    participantes: [],
    iteraciones: [],
    categorias: categorias,
  });

  const [formDataParticipante, setFormDataParticipante] = useState({
    usuarioElegido: {},
    nombre: "",
    rol: "",
  });

  const [formDataIteracion, setFormDataIteracion] = useState({
    nombre: "",
    fecha_inicio: "",
    fecha_fin: "",
  });

  const [participantesTotal, setParticipantesTotal] = useState([]);
  const [participantesMostrado, setParticipantesMostrado] = useState([]);
  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState();
  const ITEMSPORPAGINA = 5; // Número de elementos por página

  const [botonPresionado, setBotonPresionado] = useState(false);

  // Manejar cambios en los inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setErrorPrincipal({ ...errorPrincipal, [name]: false });
  };

  const handleChangeParticipante = (e) => {
    let { name, value } = e.target;
    value = name === "usuarioElegido" ? JSON.parse(value) : value;

    setFormDataParticipante({
      ...formDataParticipante,
      [name]: value,
    });
    setErrorParticipante({ ...errorParticipante, [name]: false });
  };

  const handleChangeIteracion = (e) => {
    const { name, value } = e.target;
    setErrorIteracion({
      ...errorIteracion,
      [name]: false,
      ["fechasSuperpuestas"]: false,
      ["fechasFinAntes"]: false,
    });
    setFormDataIteracion({
      ...formDataIteracion,
      [name]: value,
    });
  };

  const handleMostrarParticipante = () => {
    setMostrarParticipante(!mostrarParticipante);
    setFormDataParticipante({
      nombre: "",
      rol: "",
    });
    setParticipantesTotal([]);
    setParticipantesMostrado([]);
    setErrorParticipante({
      nombre: false,
      usuarioElegido: false,
      rol: false,
    });
  };

  const handleMostrarIteracion = () => {
    setErrorIteracion({
      nombre: false,
      fecha_inicio: false,
      fecha_fin: false,
      fechasSuperpuestas: false,
      fechasFinAntes: false,
      nombreIgual: false,
    });
    setMostrarIteracion(!mostrarIteracion);
    setFormDataIteracion({
      nombre: "",
      fecha_inicio: "",
      fecha_fin: "",
    });
  };

  const handleModificarIteracion = () => {
    setErrorIteracion({
      nombre: false,
      fecha_inicio: false,
      fecha_fin: false,
      fechasSuperpuestas: false,
      fechasFinAntes: false,
      nombreIgual: false,
    });
    setModificarIteracion(!modificarIteracion);
  };

  const handleModificarParticipante = () => {
    setErrorParticipante({
      nombre: false,
      usuarioElegido: false,
      rol: false,
    })
    setModificarParticipante(!modificarParticipante);
  };

  const handleSeguro = () => {
    setSeguro(!seguro);
  };

  const comprobarNuevaIteracion = (fecha_inicio) => {
    if (formData.iteraciones.length > 0) {
      const ultimaIteracion =
        formData.iteraciones[formData.iteraciones.length - 1];
      let fechaNuevaIteracion = new Date(fecha_inicio);
      let fechaUltimaIteracion = new Date(ultimaIteracion.fecha_fin);
      const resultado = fechaNuevaIteracion - fechaUltimaIteracion;
      return resultado > 0;
    } else {
      return true;
    }
  };

  const comprobarIteracionAnterior = (fecha_inicio, identificador) => {
    const iteracionAnterior = formData.iteraciones[identificador - 1];
    if (iteracionAnterior !== undefined) {
      const fechaFinAnterior = new Date(iteracionAnterior.fecha_fin);

      if (fecha_inicio <= fechaFinAnterior) {
        return false;
      }
    }
    return true;
  };

  const comprobarIteracionSiguiente = (fecha_fin, identificador) => {
    const iteracionSiguiente = formData.iteraciones[identificador + 1];
    if (iteracionSiguiente !== undefined) {
      const fechaInicioSiguiente = new Date(iteracionSiguiente.fecha_inicio);

      if (fecha_fin >= fechaInicioSiguiente) {
        return false;
      }
    }
    return true;
  };

  const comprobarModificacionIteracion = (
    fecha_inicio,
    fecha_fin,
    identificador
  ) => {
    if (formData.iteraciones.length <= 1) {
      return true;
    }
    const fechaInicioModificada = new Date(fecha_inicio);
    const fechaFinModificada = new Date(fecha_fin);

    const anterior = comprobarIteracionAnterior(
      fechaInicioModificada,
      identificador
    );

    const siguiente = comprobarIteracionSiguiente(
      fechaFinModificada,
      identificador
    );

    return anterior && siguiente;
  };

  const comprobarEstado = (iteracion_inicio, iteracion_fin) => {
    const fecha_actual = new Date();
    const fecha_iteracion_inicio = new Date(iteracion_inicio);
    const fecha_iteracion_fin = new Date(iteracion_fin);
    const resultado_inicio = fecha_actual - fecha_iteracion_inicio;
    const resultado_fin = fecha_actual - fecha_iteracion_fin;
    return resultado_inicio > 0 && resultado_fin < 0 ? "Activo" : "Inactivo";
  };

  const handleClick = async () => {
    setBotonPresionado(true);
    const comprobacionError = {
      nombre: formData.nombre.length === 0 || formData.nombre.length > 30,
      descripcion: formData.descripcion.length === 0,
      categorias: formData.categorias.length === 0,
      nombreIgual: false,
    };

    setErrorPrincipal(comprobacionError);
    const comprobacion = verificarError(comprobacionError);
    if (!comprobacion) {
      if (formData.iteraciones.length > 0) {
        const primeraIteracion = formData.iteraciones[0];
        const ultimaIteracion =
          formData.iteraciones[formData.iteraciones.length - 1];
        formData.fecha_inicio = primeraIteracion.fecha_inicio;
        formData.fecha_fin = ultimaIteracion.fecha_fin;
        const estado = comprobarEstado(
          primeraIteracion.fecha_inicio,
          ultimaIteracion.fecha_fin
        );
        formData.estado = estado;
      }

      const resultado = await crearProyecto(formData);
      if (resultado) {
        setFormData({
          nombre: "",
          descripcion: "",
          estado: "Inactivo",
          participantes: [],
          iteraciones: [],
          categorias: categorias,
        });
        navigate("/inicio/proyectos", {
          state: { mensaje: "Proyecto creado con éxito" },
        });
      }
    }
    setBotonPresionado(false);
  };

  const handleClickParticipante = () => {
    setBotonPresionado(true);
    const comprobarError = {
      nombre: formDataParticipante.nombre.length === 0,
      usuarioElegido: formDataParticipante.usuarioElegido == null,
      rol: formDataParticipante.rol.length === 0,
    };

    setErrorParticipante(comprobarError);

    const comprobacion = verificarError(comprobarError);
    if (!comprobacion) {
      setErrorParticipante({
        nombre: false,
        usuarioElegido: false,
        rol: false,
      });
      formDataParticipante.usuarioElegido.rol = formDataParticipante.rol;
      setFormData((prevFormData) => {
        return {
          ...prevFormData,
          participantes: [
            ...prevFormData.participantes,
            formDataParticipante.usuarioElegido,
          ],
        };
      });
      setFormDataParticipante({
        nombre: "",
        rol: "",
      });
      setParticipantesTotal([]);
      setParticipantesMostrado([]);
      handleMostrarParticipante();
      setTotalPaginas(0);
      setPagina(1);
    }
    setBotonPresionado(false);
  };
   const handleClickModificarParticipante = () => {
    setBotonPresionado(true);
    const comprobarError = {
      rol: formDataParticipante.rol.length === 0,
    };

    setErrorParticipante(comprobarError);

    const comprobacion = verificarError(comprobarError);
    if (!comprobacion) {
      setErrorParticipante({
        nombre: false,
        usuarioElegido: false,
        rol: false,
      });
      setFormData((prevFormData) => {
        return {
          ...prevFormData,
          participantes: prevFormData.participantes.map((p)=> p.id_usuario == formDataParticipante.id_usuario ? formDataParticipante : p)
        };
      });
      setFormDataParticipante({
        nombre: "",
        rol: "",
      });
      setParticipantesTotal([]);
      setParticipantesMostrado([]);
      handleModificarParticipante();
    }
    setBotonPresionado(false);
  };

  const handlePageChange = (nuevaPagina) => {
    if (nuevaPagina > 0 && nuevaPagina <= totalPaginas) {
      setPagina(nuevaPagina);
    }
  };

  const handleClickIteracion = () => {
    setBotonPresionado(true);

    const comprobacionError = {
      nombre:
        formDataIteracion.nombre.length === 0 ||
        formDataIteracion.nombre.length > 60,
      fecha_inicio: formDataIteracion.fecha_inicio.length === 0,
      fecha_fin: formDataIteracion.fecha_fin.length === 0,
      fechasSuperpuestas: !comprobarNuevaIteracion(
        formDataIteracion.fecha_inicio
      ),
      fechasFinAntes: !comprobarFechasNuevaIteracion(
        formDataIteracion.fecha_inicio,
        formDataIteracion.fecha_fin
      ),
      nombreIgual: formData.iteraciones.some(
        (item) => item.nombre === formDataIteracion.nombre
      ),
    };
    setErrorIteracion(comprobacionError);
    const comprobacion = verificarError(comprobacionError);
    if (!comprobacion) {
      setErrorIteracion({
        nombre: false,
        fecha_inicio: false,
        fecha_fin: false,
        fechasSuperpuestas: false,
        fechasFinAntes: false,
        nombreIgual: false,
      });
      setFormData((prevFormData) => {
        return {
          ...prevFormData,
          iteraciones: [...prevFormData.iteraciones, formDataIteracion],
        };
      });
      setFormDataIteracion({
        nombre: "",
        fecha_inicio: "",
        fecha_fin: "",
      });
      handleMostrarIteracion();
    }
    setBotonPresionado(false);
  };

  const handleClickModificarIteracion = () => {
    setBotonPresionado(true);

    const comprobacionError = {
      nombre:
        formDataIteracion.nombre.length === 0 ||
        formDataIteracion.nombre.length > 60,
      fecha_inicio: formDataIteracion.fecha_inicio.length === 0,
      fecha_fin: formDataIteracion.fecha_fin.length === 0,
      fechasFinAntes: !comprobarFechasNuevaIteracion(
        formDataIteracion.fecha_inicio,
        formDataIteracion.fecha_fin
      ),
    };
    setErrorIteracion(comprobacionError);
    const comprobacion = verificarError(comprobacionError);
    if (!comprobacion) {
      setErrorIteracion({
        nombre: false,
        fecha_inicio: false,
        fecha_fin: false,
        fechasSuperpuestas: false,
        fechasFinAntes: false,
      });

      let iteracionesSuperpuestas = true;
      iteracionesSuperpuestas = comprobarModificacionIteracion(
        formDataIteracion.fecha_inicio,
        formDataIteracion.fecha_fin,
        formDataIteracion.key
      );

      if (iteracionesSuperpuestas) {
        setFormData((prevFormData) => {
          const iteracionesModificadas = prevFormData.iteraciones;
          const { key, ...resto } = formDataIteracion;
          iteracionesModificadas[key] = resto;

          return {
            ...prevFormData,
            iteraciones: iteracionesModificadas,
          };
        });
        setFormDataIteracion({
          nombre: "",
          fecha_inicio: "",
          fecha_fin: "",
        });
        handleModificarIteracion();
      } else {
        handleModificarIteracion();
        handleSeguro();
      }
    }
    setBotonPresionado(false);
  };

  const buscarParticipante = async () => {
    if (formDataParticipante.nombre.length === 0) {
      setErrorParticipante({
        ...errorParticipante,
        ["nombre"]: true,
      });
    } else {
      const data = await obtenerParticipanteNombre(
        formDataParticipante.nombre
      );
      const json = JSON.parse(data);
      // Crear un conjunto con los nombres en formData.participantes
      const nombresFormData = new Set(
        formData.participantes.map((item) => item.nombre_usuario)
      );

      const participantesFiltrados = json.filter(
        (item) => !nombresFormData.has(item.nombre_usuario)
      );

      setParticipantesTotal(participantesFiltrados);
      setParticipantesMostrado(
        participantesFiltrados.slice(pagina - 1, ITEMSPORPAGINA)
      );
      const cantidadPaginas = Math.ceil(
        participantesFiltrados.length / ITEMSPORPAGINA
      );
      setTotalPaginas(cantidadPaginas);
      setPagina(1);
    }
  }

  const confirmarSeguro = () => {
    setFormData((prevFormData) => {
      const nuevasIteraciones = [...prevFormData.iteraciones];

      const { key, ...resto } = formDataIteracion;
      // Modificar la iteración seleccionada
      nuevasIteraciones[key] = resto;

      const comprobacionAnterior = comprobarIteracionAnterior(
        new Date(resto.fecha_inicio),
        key
      );

      const comprobacionSiguiente = comprobarIteracionSiguiente(
        new Date(resto.fecha_fin),
        key
      );

      if (!comprobacionAnterior) {
        // Recalcular las fechas de las iteraciones anteriores
        for (let i = key - 1; i >= 0; i--) {
          const iteracionSiguiente = nuevasIteraciones[i + 1];
          const iteracionActual = nuevasIteraciones[i];

          // Calcular la nueva fecha de fin (fecha de inicio de la siguiente iteración - 1 día)
          const nuevaFechaFin = new Date(iteracionSiguiente.fecha_inicio);
          nuevaFechaFin.setDate(nuevaFechaFin.getDate() - 1);

          // Calcular la nueva fecha de inicio (mantener la misma duración)
          const duracion =
            new Date(iteracionActual.fecha_fin) -
            new Date(iteracionActual.fecha_inicio);
          const nuevaFechaInicio = new Date(nuevaFechaFin);
          nuevaFechaInicio.setDate(
            nuevaFechaInicio.getDate() - duracion / (1000 * 60 * 60 * 24)
          );

          // Actualizar la iteración actual
          nuevasIteraciones[i] = {
            ...iteracionActual,
            fecha_inicio: nuevaFechaInicio.toISOString().split("T")[0],
            fecha_fin: nuevaFechaFin.toISOString().split("T")[0],
          };
        }
      }

      if (!comprobacionSiguiente) {
        // Recalcular las fechas de las iteraciones siguientes
        for (let i = key + 1; i < nuevasIteraciones.length; i++) {
          const iteracionAnterior = nuevasIteraciones[i - 1];
          const iteracionActual = nuevasIteraciones[i];

          const nuevaFechaInicio = new Date(iteracionAnterior.fecha_fin);
          nuevaFechaInicio.setDate(nuevaFechaInicio.getDate() + 1);

          const duracion =
            new Date(iteracionActual.fecha_fin) -
            new Date(iteracionActual.fecha_inicio);
          const nuevaFechaFin = new Date(nuevaFechaInicio);
          nuevaFechaFin.setDate(
            nuevaFechaFin.getDate() + duracion / (1000 * 60 * 60 * 24)
          );

          nuevasIteraciones[i] = {
            ...iteracionActual,
            fecha_inicio: nuevaFechaInicio.toISOString().split("T")[0],
            fecha_fin: nuevaFechaFin.toISOString().split("T")[0],
          };
        }
      }

      return {
        ...prevFormData,
        iteraciones: nuevasIteraciones,
      };
    });

    handleSeguro();
  };

  useEffect(() => {
    if (!(participantesTotal.length === 0)) {
      setParticipantesMostrado(
        participantesTotal.slice(
          (pagina - 1) * ITEMSPORPAGINA,
          ITEMSPORPAGINA * pagina
        )
      );
    }
  }, [pagina]);

  return (
    <>
      <Navegador />
      <Contenedor>
        <>
          <h3>Crear Proyecto</h3>
          <p>
            Complete los campos a continuaci&oacute;n. Luego, presione el
            bot&oacute;n <b>Confirmar</b>.<br />
            Si desea cancelar, presione el bot&oacute;n <b>Cancelar</b>.
          </p>
        </>
        <Form onSubmit={(e)=>{e.preventDefault()}}>
          <h4>Propiedades</h4>
          <Form.Group>
            <Form.Label>Nombre</Form.Label>
            <Form.Control
              type="text"
              placeholder="Ingrese el nombre del proyecto"
              onChange={handleChange}
              name="nombre"
              value={formData.nombre}
              isInvalid={errorPrincipal.nombre || errorPrincipal.nombreIgual}
            />
            {(errorPrincipal.nombre || errorPrincipal.nombreIgual) && (
              <Form.Text className="text-danger">
                Revise que el nombre{" "}
                {formData.nombre.length === 0
                  ? "no este vacío"
                  : formData.nombre.length > 30
                  ? "no supere la cantidad maxima"
                  : errorPrincipal.nombreIgual
                  ? "no sea igual al de otro proyecto"
                  : null}
                .
              </Form.Text>
            )}
          </Form.Group>
          <Form.Group>
            <Form.Label>Descripción</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Ingrese la descripción del proyecto"
              name="descripcion"
              onChange={handleChange}
              value={formData.descripcion}
              isInvalid={errorPrincipal.descripcion}
            />
            {errorPrincipal.descripcion && (
              <Form.Text className="text-danger">
                Revise que la descripción no este vacía.
              </Form.Text>
            )}
          </Form.Group>
          <Form.Group>
            <Form.Label>
              <b>Participantes</b>
            </Form.Label>
            <br></br>
            <Button variant="success" onClick={handleMostrarParticipante}>
              <FontAwesomeIcon icon={faPlus} className="mx-1" />
              Agregar Participante
            </Button>
            <Table size="sm" hover className="mt-2">
              <thead className="table-info">
                <tr>
                  <th>Participantes</th>
                  <th>Rol</th>
                  <th>Opciones</th>
                </tr>
              </thead>
              <tbody>
                {formData.participantes && formData.participantes.length > 0
                  ? formData.participantes.map((item, key) => (
                      <tr key={key}>
                        <td>{item.nombre_usuario}</td>
                        <td>{item.rol}</td>
                        <td>
                          <OverlayTrigger
                            placement="top"
                            overlay={<Tooltip id="tooltip-edit">Editar</Tooltip>}
                          >
                            <Button
                                variant="outline-warning"
                                className="mx-1"
                                onClick={() => {
                                  
                                  setFormDataParticipante({...item, key:key});
                                  handleModificarParticipante();
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
                              variant="outline-danger"
                              className="mx-1"
                              onClick={() => {
                                setFormData((prevFormData) => {
                                  return {
                                    ...prevFormData,
                                    participantes:
                                      prevFormData.participantes.filter(
                                        (participante) =>
                                          participante.nombre_usuario !==
                                          item.nombre_usuario
                                      ),
                                  };
                                });
                              }}
                            >
                              <FontAwesomeIcon icon={faTrashCan} />
                            </Button>

                          </OverlayTrigger>
                        </td>
                      </tr>
                    ))
                  : null}
              </tbody>
            </Table>
          </Form.Group>

          <Form.Group>
            <Form.Label>
              <b>Iteraciones</b>
            </Form.Label>
            <br></br>
            <Button variant="success" onClick={handleMostrarIteracion}>
              <FontAwesomeIcon icon={faPlus} className="mx-1" />
              Agregar Iteración
            </Button>
            <Table size="sm" hover className="mt-2">
              <thead className="table-info">
                <tr>
                  <th>Nombre</th>
                  <th>Fecha de inicio</th>
                  <th>Fecha de finalización</th>
                  <th>Opciones</th>
                </tr>
              </thead>
              <tbody>
                {formData.iteraciones && formData.iteraciones.length > 0
                  ? formData.iteraciones.map((item, key) => (
                      <>
                        <tr key={key}>
                          <td>{item.nombre}</td>
                          <td>{formatearFecha(item.fecha_inicio)}</td>
                          <td>{formatearFecha(item.fecha_fin)}</td>
                          <td>
                            <OverlayTrigger
                              placement="top"
                              overlay={<Tooltip id="tooltip-edit">Editar</Tooltip>}
                            >
                              <Button
                                variant="outline-warning"
                                className="mx-1"
                                onClick={() => {
                                  setFormDataIteracion({ ...item, key: key });
                                  handleModificarIteracion();
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
                                variant="outline-danger"
                                className="mx-1"
                                onClick={() => {
                                  setFormData((prevFormData) => {
                                    return {
                                      ...prevFormData,
                                      iteraciones:
                                        prevFormData.iteraciones.filter(
                                          (iteracion) =>
                                            iteracion.nombre !== item.nombre
                                        ),
                                    };
                                  });
                                }}
                              >
                                <FontAwesomeIcon icon={faTrashCan} />
                              </Button>

                            </OverlayTrigger>
                          </td>
                        </tr>
                      </>
                    ))
                  : null}
              </tbody>
            </Table>
          </Form.Group>

          <Form.Group>
            <Form.Label>
              <b>Categorías</b>
            </Form.Label>
            <br></br>
            {/* <Button variant="success" onClick={() => {}}>
                <FontAwesomeIcon icon={faPlus} className="mx-1" />
                Agregar Categoria
              </Button> */}
            <Table size="sm" hover className="mt-2">
              <thead className="table-info">
                <tr>
                  <th>Nombre</th>
                  <th>Descripción</th>
                  {/* <th>Opciones</th> */}
                </tr>
              </thead>
              <tbody>
                {formData.categorias && formData.categorias.length > 0
                  ? formData.categorias.map((item, key) => (
                      <tr key={key}>
                        <td>{item.nombre}</td>
                        <td>{item.descripcion}</td>
                        {/* <td>
                            <Button
                              variant="outline-danger"
                              className="mx-1"
                              onClick={() => {
                                setFormData((prevFormData) => {
                                  return {
                                    ...prevFormData,
                                    categorias: prevFormData.categorias.filter(
                                      (categoria) =>
                                        categoria.nombre !== item.nombre
                                    ),
                                  };
                                });
                              }}
                            >
                              <FontAwesomeIcon icon={faTrashCan} />
                            </Button>
                          </td> */}
                      </tr>
                    ))
                  : null}
              </tbody>
            </Table>
          </Form.Group>
        </Form>
        <>
          <Button
            variant="outline-success"
            className="mx-1"
            onClick={handleClick}
            disabled={botonPresionado}
          >
            <FontAwesomeIcon icon={faCheck} style={{ marginRight: "5px" }} />
            Confirmar
          </Button>
          <Button
            variant="outline-danger"
            className="mx-1"
            onClick={() => {
              navigate("/inicio/proyectos");
            }}
          >
            <FontAwesomeIcon icon={faXmark} style={{ marginRight: "5px" }} />
            Cancelar
          </Button>
        </>
      </Contenedor>
      <Footer />

      <ModalPersonalizado
        title={"Añadir Participante"}
        show={mostrarParticipante}
        setShow={setMostrarParticipante}
        onConfirm={handleClickParticipante}
        datosDefecto={() => {
          setParticipantesTotal([]);
          setParticipantesMostrado([]);
          setPagina(1);
          setTotalPaginas(0);
          setFormDataParticipante({
            usuarioElegido: {},
            nombre: "",
            rol: "",
          });
          setErrorParticipante({
            nombre: false,
            usuarioElegido: false,
            rol: false,
          });
        }}
      >
        <Form onSubmit={(e)=>{e.preventDefault()}}>
          <h5>Buscar Participante</h5>
          <Form.Group className="d-flex align-items-center mb-2">
            <Form.Control
              type="text"
              placeholder="Ingrese el nombre del participante"
              className="w-75"
              name="nombre"
              onChange={(e) => {
                handleChangeParticipante(e);
                setParticipantesTotal([]);
                setParticipantesMostrado([]);
              }}
              onKeyDown={(e)=>{
                if (e.key == "Enter") {
                  buscarParticipante()
                }
              }}
              isInvalid={errorParticipante.nombre}
            />
            <FontAwesomeIcon
              icon={faMagnifyingGlass}
              color={errorParticipante.nombre ? "red" : "black"}
              style={{
                marginLeft: "10px",
                fontSize: "20px",
                cursor: "pointer",
              }}
              onClick={buscarParticipante}
            />
          </Form.Group>
          {errorParticipante.nombre && (
            <Form.Text className="text-danger">
              Revise que el campo no esta vacío.
            </Form.Text>
          )}
          <Form.Group>
            <h5>Participantes</h5>
            {participantesMostrado && participantesMostrado.length > 0 ? (
              participantesMostrado.map((item, key) => (
                <Form.Check
                  key={key}
                  label={`${item.nombre_usuario} - ${item.email}`}
                  value={JSON.stringify(item)}
                  name="usuarioElegido"
                  type="radio"
                  checked={
                    formDataParticipante.usuarioElegido
                      ? formDataParticipante.usuarioElegido.email === item.email
                      : false
                  }
                  onChange={handleChangeParticipante}
                  isInvalid={errorParticipante.usuarioElegido}
                />
              ))
            ) : (
              <p>No hay participantes disponibles.</p>
            )}
            {errorParticipante.usuarioElegido && (
              <Form.Text className="text-danger">
                Seleccione un participante.
              </Form.Text>
            )}
            <Paginado paginaActual={pagina} setPaginaActual={setPagina} totalPaginas={totalPaginas} />
          </Form.Group>
          <Form.Group>
            <h5>Rol</h5>
            <Form.Check
              type="radio"
              name="rol"
              label="Líder del proyecto"
              value="Lider del proyecto"
              onChange={handleChangeParticipante}
              isInvalid={errorParticipante.rol}
            />
            <Form.Check
              type="radio"
              name="rol"
              label="Desarrollador"
              value="Desarrollador"
              onChange={handleChangeParticipante}
              isInvalid={errorParticipante.rol}
            />
            {errorParticipante.rol && (
              <Form.Text className="text-danger">Seleccione un rol.</Form.Text>
            )}
          </Form.Group>
        </Form>
      </ModalPersonalizado>

      <ModalPersonalizado
        title={"Añadir Iteración"}
        show={mostrarIteracion}
        setShow={setMostrarIteracion}
        onConfirm={handleClickIteracion}
        datosDefecto={() => {
          setFormDataIteracion({
            nombre: "",
            fecha_inicio: "",
            fecha_fin: "",
          });
        }}
      >
        <Form onSubmit={(e)=>{e.preventDefault()}}>
          <Form.Group>
            <Form.Label>
              <b>Nombre</b>
            </Form.Label>
            <Form.Control
              type="text"
              name="nombre"
              placeholder="Ingrese el nombre de la iteración"
              className="w-75"
              value={formDataIteracion.nombre}
              onChange={handleChangeIteracion}
              isInvalid={errorIteracion.nombre || errorIteracion.nombreIgual}
            />
            {errorIteracion.nombre || errorIteracion.nombreIgual ? (
              <Form.Text className="text-danger">
                Revise que el nombre{" "}
                {formDataIteracion.nombre.length === 0
                  ? "no este vacío"
                  : formDataIteracion.nombre.length > 60
                  ? "no supere la cantidad maxima"
                  : "no sea igual al de otras iteraciones"}
                .
              </Form.Text>
            ) : null}
          </Form.Group>
          <Form.Group>
            <Form.Label>
              <b>Fecha de inicio</b>
            </Form.Label>
            <Form.Control
              type="date"
              min={
                formData.iteraciones.length > 0
                  ? new Date(
                      new Date(
                        formData.iteraciones[
                          formData.iteraciones.length - 1
                        ].fecha_fin
                      ).setDate(
                        new Date(
                          formData.iteraciones[
                            formData.iteraciones.length - 1
                          ].fecha_fin
                        ).getDate() + 1
                      )
                    )
                      .toISOString()
                      .split("T")[0]
                  : null
              }
              name="fecha_inicio"
              className="w-75"
              value={formDataIteracion.fecha_inicio}
              onChange={handleChangeIteracion}
              isInvalid={
                errorIteracion.fecha_inicio || errorIteracion.fechasSuperpuestas
              }
            />
            {errorIteracion.fecha_inicio ||
            errorIteracion.fechasSuperpuestas ? (
              <Form.Text className="text-danger">
                {errorIteracion.fecha_inicio
                  ? "Revise que la fecha de inicio de la iteración no este vacía"
                  : errorIteracion.fechasSuperpuestas
                  ? "La iteración no debe superponerse con las demás iteraciones"
                  : ""}
                .
              </Form.Text>
            ) : null}
          </Form.Group>
          <Form.Group>
            <Form.Label>
              <b>Fecha de finalización</b>
            </Form.Label>
            <Form.Control
              type="date"
              min={
                formData.iteraciones.length > 0
                  ? new Date(
                      new Date(
                        formData.iteraciones[
                          formData.iteraciones.length - 1
                        ].fecha_fin
                      ).setDate(
                        new Date(
                          formData.iteraciones[
                            formData.iteraciones.length - 1
                          ].fecha_fin
                        ).getDate() + 1
                      )
                    )
                      .toISOString()
                      .split("T")[0]
                  : null
              }
              name="fecha_fin"
              className="w-75"
              value={formDataIteracion.fecha_fin}
              onChange={handleChangeIteracion}
              isInvalid={
                errorIteracion.fecha_fin || errorIteracion.fechasFinAntes
              }
            />
            {errorIteracion.fecha_fin || errorIteracion.fechasFinAntes ? (
              <Form.Text className="text-danger">
                {errorIteracion.fecha_fin
                  ? "Revise que la fecha de finalización de la iteración no este vacía"
                  : errorIteracion.fechasFinAntes
                  ? "La fecha de finalización no puede estar antes que la fecha de inicio"
                  : ""}
                .
              </Form.Text>
            ) : null}
          </Form.Group>
        </Form>
      </ModalPersonalizado>

      <ModalPersonalizado
        title={"Modificar Iteración"}
        show={modificarIteracion}
        setShow={setModificarIteracion}
        onConfirm={handleClickModificarIteracion}
        datosDefecto={() => {
          setFormDataIteracion({
            nombre: "",
            fecha_inicio: "",
            fecha_fin: "",
          });
        }}
        modificado={true}
      >
        <Form>
          <Form.Group>
            <Form.Label>
              <b>Nombre</b>
            </Form.Label>
            <Form.Control
              type="text"
              name="nombre"
              placeholder="Ingrese el nombre de la iteración"
              className="w-75"
              value={formDataIteracion.nombre}
              onChange={handleChangeIteracion}
              isInvalid={errorIteracion.nombre || errorIteracion.nombreIgual}
            />
            {errorIteracion.nombre || errorIteracion.nombreIgual ? (
              <Form.Text className="text-danger">
                Revise que el nombre{" "}
                {formDataIteracion.nombre.length === 0
                  ? "no este vacío"
                  : formDataIteracion.nombre.length > 60
                  ? "no supere la cantidad maxima"
                  : "no sea igual al de otras iteraciones"}
                .
              </Form.Text>
            ) : null}
          </Form.Group>
          <Form.Group>
            <Form.Label>
              <b>Fecha de inicio</b>
            </Form.Label>
            <Form.Control
              type="date"
              name="fecha_inicio"
              className="w-75"
              value={formDataIteracion.fecha_inicio}
              onChange={handleChangeIteracion}
              isInvalid={
                errorIteracion.fecha_inicio || errorIteracion.fechasSuperpuestas
              }
            />
            {errorIteracion.fecha_inicio ||
            errorIteracion.fechasSuperpuestas ? (
              <Form.Text className="text-danger">
                {errorIteracion.fecha_inicio
                  ? "Revise que la fecha de inicio de la iteración no este vacía"
                  : errorIteracion.fechasSuperpuestas
                  ? "La iteración no debe superponerse con las demás iteraciones"
                  : ""}
                .
              </Form.Text>
            ) : null}
          </Form.Group>
          <Form.Group>
            <Form.Label>
              <b>Fecha de finalización</b>
            </Form.Label>
            <Form.Control
              type="date"
              name="fecha_fin"
              className="w-75"
              value={formDataIteracion.fecha_fin}
              onChange={handleChangeIteracion}
              isInvalid={
                errorIteracion.fecha_fin || errorIteracion.fechasFinAntes
              }
            />
            {errorIteracion.fecha_fin || errorIteracion.fechasFinAntes ? (
              <Form.Text className="text-danger">
                {errorIteracion.fecha_fin
                  ? "Revise que la fecha de finalización de la iteración no este vacía"
                  : errorIteracion.fechasFinAntes
                  ? "La fecha de finalización no puede estar antes que la fecha de inicio"
                  : ""}
                .
              </Form.Text>
            ) : null}
          </Form.Group>
        </Form>
      </ModalPersonalizado>

      <ModalPersonalizado
        title={"Modificar participante"}
        show={modificarParticipante}
        setShow={setModificarParticipante}
        onConfirm={handleClickModificarParticipante}
        datosDefecto={() => {
          setFormDataParticipante({
            usuarioElegido:{},
            nombre: "",
            rol: "",
          });
        }}
        modificado={true}
      >
        <Form>
          <Form.Group>
            <Form.Label>
              <b>Nombre del participante</b>
            </Form.Label>
            <Form.Control
              type="text"
              disabled
              placeholder="Ingrese el nombre de la iteración"
              className="w-75"
              value={formDataParticipante.nombre_usuario}
            />
          </Form.Group>
          <Form.Group>
            <h5>Rol</h5>
            <Form.Check
              type="radio"
              name="rol"
              label="Líder del proyecto"
              value="Lider del proyecto"
              checked={formDataParticipante.rol == "Lider del proyecto"}
              onChange={handleChangeParticipante}
              isInvalid={errorParticipante.rol}
            />
            <Form.Check
              type="radio"
              name="rol"
              label="Desarrollador"
              value="Desarrollador"
              checked={formDataParticipante.rol == "Desarrollador"}
              onChange={handleChangeParticipante}
              isInvalid={errorParticipante.rol}
            />
            {errorParticipante.rol && (
              <Form.Text className="text-danger">Seleccione un rol.</Form.Text>
            )}
          </Form.Group>
        </Form>
      </ModalPersonalizado>

      <Modal show={seguro} onHide={handleSeguro}>
        <Modal.Body>
          <>
            <h1>¿Está seguro?</h1>
            <p>
              Se ha detectado un solapamiento en las fechas de las iteraciones,
              lo que implicará que las iteraciones anteriores y posteriores sean
              modificadas.
            </p>
          </>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="outline-success"
            onClick={() => {
              setBotonPresionado(true);
              confirmarSeguro();
              setBotonPresionado(false);
            }}
            disabled={botonPresionado}
          >
            <FontAwesomeIcon icon={faCheck} style={{ marginRight: "5px" }} />
            Si
          </Button>
          <Button
            variant="outline-danger"
            onClick={() => {
              handleSeguro();
              handleModificarIteracion();
            }}
          >
            <FontAwesomeIcon icon={faXmark} style={{ marginRight: "5px" }} />
            No
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
