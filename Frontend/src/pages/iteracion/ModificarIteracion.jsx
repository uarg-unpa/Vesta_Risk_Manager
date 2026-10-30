/* eslint-disable react/display-name */
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import ModalPersonalizado from "../../components/ModalPersonalizado";
import { Button, Form, Modal } from "react-bootstrap";
import {
  comprobarFechasNuevaIteracion,
  verificarError,
} from "../../utils/funciones";
import { actualizarIteracion } from "../../services/iteraciones";
import { obtenerProyectosId } from "../../services/proyectos";

const ModificarIteracion = forwardRef(
  ({ navigate, iteraciones, iteracionSeleccionada }, ref) => {
    const [formDataIteracion, setFormDataIteracion] = useState(
      iteracionSeleccionada
    );
    const [botonPresionado, setBotonPresionado] = useState(false);
    const [modificarIteracion, setModificarIteracion] = useState(false);
    const [errorIteracion, setErrorIteracion] = useState({
      nombre: false,
      fecha_inicio: false,
      fecha_fin: false,
      fechasSuperpuestas: false,
      fechasFinAntes: false,
    });

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

    const comprobarIteracionAnterior = (fecha_inicio) => {
      const key = iteraciones.findIndex((item) => item.id_iteracion == formDataIteracion.id_iteracion)
      
      
      const iteracionAnterior = iteraciones[key - 1];
      
      if (iteracionAnterior !== undefined) {
        const fechaFinAnterior = new Date(iteracionAnterior.fecha_fin);
        
        if (fecha_inicio <= fechaFinAnterior) {
          return false;
        }
      }
      return true;
    };

    const comprobarIteracionSiguiente = (fecha_fin) => {
      const key = iteraciones.findIndex((item) => item.id_iteracion == formDataIteracion.id_iteracion)
      
      const iteracionSiguiente = iteraciones[key + 1];
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
    ) => {
      if (iteraciones.length <= 1) {
        return true;
      }
      
      const fechaInicioModificada = new Date(fecha_inicio);
      const fechaFinModificada = new Date(fecha_fin);
      

      const anterior = comprobarIteracionAnterior(
        fechaInicioModificada,
      );
      const siguiente = comprobarIteracionSiguiente(
        fechaFinModificada,
      );

      return anterior && siguiente;
    };

    const handleClickModificarIteracion = async () => {
      
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
        fechasSuperpuestas: !comprobarModificacionIteracion(
          formDataIteracion.fecha_inicio,
          formDataIteracion.fecha_fin,
        )
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
        const resultado = await actualizarIteracion(formDataIteracion.id_proyecto, formDataIteracion)
        const proyecto = await obtenerProyectosId(formDataIteracion.id_proyecto);
        localStorage.setItem("proyecto_seleccionado", JSON.stringify(proyecto))
        navigate(0)
        
      }
      setBotonPresionado(false);
    };

    useImperativeHandle(ref, () => ({
      abrir_modal: handleModificarIteracion,
    }));

    useEffect(() => {
      if (iteracionSeleccionada) {
        setFormDataIteracion(iteracionSeleccionada);
      }
    }, [iteracionSeleccionada]);
    return (
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
                  : errorIteracion.fechasSuperpuestas
                  ? "La iteración no debe superponerse con las demás iteraciones"
                  : ""}
                .
              </Form.Text>
            ) : null}
          </Form.Group>
        </Form>
      </ModalPersonalizado>
    );
  }
);

export default ModificarIteracion;
