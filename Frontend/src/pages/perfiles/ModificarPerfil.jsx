import React, { useState } from "react";
import Contenedor from "../../components/Contenedor";
import Footer from "./../../components/Footer";
import Navegador from "../../components/Navegador";
import { Alert, Button, Form } from "react-bootstrap";
import { useLoaderData } from "react-router-dom";
import {
  actualizarPerfil,
  obtenerPerfilId,
  obtenerPerfilNombre,
  obtenerPermisos,
} from "../../services/usuarios";
import { useNavigate, useParams } from "react-router-dom";
import BotonSalir from "../../components/BotonSalir";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faXmark } from "@fortawesome/free-solid-svg-icons";
import { verificarError } from "../../utils/funciones";

export async function cargarModificarPerfil({ params }) {
  const perfil = await obtenerPerfilId(params.id_perfil);
  const permisos = await obtenerPermisos();
  return { perfil, permisos };
}

export default function ModificarPerfil() {
  const { perfil, permisos } = useLoaderData();

  const { id_perfil } = useParams();

  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre: perfil.nombre,
    permisos: perfil.permisos.map((item) => {
      return item.id_permiso + "";
    }),
  });
  const [error, setError] = useState({
    nombre: false,
    permisos: false,
    nombreIgual: false,
  });
  const [botonPresionado, setBotonPresionado] = useState(false);
  const [modificado, setModificado] = useState(null);

  // Manejar cambios en los inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setError({ ...error, [name]: false });
  };

  const handleCheckboxChange = (event) => {
    const { value, checked } = event.target;
    setError({ ...error, ["permisos"]: false });
    setFormData((prevFormData) => {
      if (checked) {
        // Agrega el permiso si está seleccionado
        return {
          ...prevFormData,
          permisos: [...prevFormData.permisos, value],
        };
      } else {
        // Elimina el permiso si está desmarcado
        return {
          ...prevFormData,
          permisos: prevFormData.permisos.filter(
            (permiso) => permiso !== value
          ),
        };
      }
    });
  };

  const handleClick = async () => {
    setBotonPresionado(true);
    const comprobarNombre =
      perfil.nombre === formData.nombre ||
      formData.nombre.length === 0 ||
      formData.nombre.length > 30
        ? false
        : await obtenerPerfilNombre(formData.nombre);

    const comprobacionError = {
      nombre: formData.nombre.length === 0 || formData.nombre.length > 30,
      permisos: formData.permisos.length === 0,
      nombreIgual: comprobarNombre,
    };
    setError(comprobacionError);

    const comprobacion = verificarError(comprobacionError);
    if (!comprobacion) {
      const resultado = await actualizarPerfil(id_perfil, formData);
      setModificado(resultado);
    }

    setBotonPresionado(false);
  };

  if (modificado === null) {
    return (
      <>
        <Navegador />
        <Contenedor>
          <>
            <h3>Actualizar Perfil</h3>
            <p>
              Complete los campos a continuaci&oacute;n. Luego, presione el
              bot&oacute;n <b>Confirmar</b>.<br />
              Si desea cancelar, presione el bot&oacute;n <b>Cancelar</b>.
            </p>
          </>
          <Form>
            <h4>Propiedades</h4>
            <Form.Group>
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingrese el nombre del usuario"
                onChange={handleChange}
                name="nombre"
                value={formData.nombre}
                isInvalid={error.nombre || error.nombreIgual}
              />
              {(error.nombre || error.nombreIgual) && (
                <Form.Text className="text-danger">
                  Revise que el nombre{" "}
                  {formData.nombre.length === 0
                    ? "no este vacio"
                    : formData.nombre.length > 30
                    ? "no supere la cantidad maxima"
                    : error.nombreIgual
                    ? "no sea igual al de otro perfil"
                    : null}
                  .
                </Form.Text>
              )}
            </Form.Group>
            <hr />
            <h4>Permisos</h4>
            <Form.Group>
              {permisos.map((item, key) => (
                <Form.Check
                  key={key}
                  type="checkbox"
                  name="permisos"
                  label={item.nombre}
                  value={item.id_permiso}
                  checked={formData.permisos.some(
                    (permiso) => permiso == item.id_permiso
                  )}
                  onChange={handleCheckboxChange}
                  isInvalid={error.permisos}
                />
              ))}
              {error.permisos && (
                <Form.Text className="text-danger">
                  Seleccione al menos un permiso.
                </Form.Text>
              )}
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
                navigate("/inicio/perfiles");
              }}
            >
              <FontAwesomeIcon icon={faXmark} style={{ marginRight: "5px" }} />
              Cancelar
            </Button>
          </>
        </Contenedor>
        <Footer />
      </>
    );
  } else {
    return (
      <>
        <Navegador />
        <Contenedor>
          <h3>Actualizar Perfil</h3>
          <>
            {modificado ? (
              <Alert variant="success">Operación realizada con éxito.</Alert>
            ) : (
              <Alert variant="danger">Ha ocurrido un error.</Alert>
            )}
            <hr />
            <h5>Opciones</h5>
            <BotonSalir ruta={"/inicio/perfiles"} />
          </>
        </Contenedor>
      </>
    );
  }
}
