/* eslint-disable react/display-name */
import React, { forwardRef, useImperativeHandle, useState } from "react";
import { comprobarFechasNuevaIteracion, verificarError } from "../../utils/funciones";
import ModalPersonalizado from "../../components/ModalPersonalizado";
import { Form } from "react-bootstrap";
import { crearIteracion } from "../../services/iteraciones";
import { obtenerProyectosId } from "../../services/proyectos";

const CrearIteracion = forwardRef(({iteraciones, id_proyecto, navigate}, ref) => {
    const [formDataIteracion, setFormDataIteracion] = useState({
      nombre: "",
      fecha_inicio: "",
      fecha_fin: "",
    });
    
    
    const [errorIteracion, setErrorIteracion] = useState({
        nombre: false,
        fecha_inicio: false,
        fecha_fin: false,
        fechasSuperpuestas: false,
        fechasFinAntes: false,
        nombreIgual: false,
      });
    
      const [botonPresionado, setBotonPresionado] = useState(false)
      const [mostrarIteracion, setMostrarIteracion] = useState(false)
    
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
    
    
    const comprobarNuevaIteracion = (fecha_inicio) => {
    if (iteraciones.length > 0) {
      const ultimaIteracion =
        iteraciones[iteraciones.length - 1];
      let fechaNuevaIteracion = new Date(fecha_inicio);
      let fechaUltimaIteracion = new Date(ultimaIteracion.fecha_fin);
      const resultado = fechaNuevaIteracion - fechaUltimaIteracion;
      return resultado > 0;
    } else {
      return true;
    }
  };
    
    
    const handleClickIteracion = async() => {
        setBotonPresionado(true);
    
        const comprobacionError = {
          nombre:
            formDataIteracion.nombre.length === 0 ||
            formDataIteracion.nombre.length > 60,
          fecha_inicio: formDataIteracion.fecha_inicio.length === 0,
          fecha_fin: formDataIteracion.fecha_fin.length === 0,
          fechasSuperpuestas: !comprobarNuevaIteracion(
            formDataIteracion.fecha_inicio,
          ),
          fechasFinAntes: !comprobarFechasNuevaIteracion(
            formDataIteracion.fecha_inicio,
            formDataIteracion.fecha_fin
          ),
          nombreIgual: iteraciones.some(
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
          const result = await crearIteracion(id_proyecto, formDataIteracion);
          const proyecto = await obtenerProyectosId(id_proyecto);
          localStorage.setItem("proyecto_seleccionado", JSON.stringify(proyecto))
          navigate(0)
          setFormDataIteracion({
            nombre: "",
            fecha_inicio: "",
            fecha_fin: "",
          });
          handleMostrarIteracion();
        }
        setBotonPresionado(false);
      };

      useImperativeHandle(ref, () => ({
            abrir_modal: handleMostrarIteracion
        }));

      return  <ModalPersonalizado
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
                      iteraciones.length > 0
                        ? new Date(
                            new Date(
                              iteraciones[
                                iteraciones.length - 1
                              ].fecha_fin
                            ).setDate(
                              new Date(
                                iteraciones[
                                  iteraciones.length - 1
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
                      iteraciones.length > 0
                        ? new Date(
                            new Date(
                              iteraciones[
                                iteraciones.length - 1
                              ].fecha_fin
                            ).setDate(
                              new Date(
                                iteraciones[
                                  iteraciones.length - 1
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
      ;
})


export default CrearIteracion