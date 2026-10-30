import React, { useState } from "react";
import Contenedor from "../../components/Contenedor";
import Footer from "./../../components/Footer";
import Navegador from "../../components/Navegador";
import { Button, Form } from "react-bootstrap";
import { useLoaderData } from "react-router-dom";
import {
  crearUsuario,
  obtenerUsuarioNombre,
  obtenerUsuariosCorreo,
} from "../../services/usuarios";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faXmark } from "@fortawesome/free-solid-svg-icons";
import { verificarCorreo, verificarError } from "../../utils/funciones";

export default function CrearUsuario() {
  const perfiles = useLoaderData();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre: "",
    correo: "",
    perfil: 1,
  });
  const [error, setError] = useState({
    nombre: false,
    correo: false,
    perfil: false,
    nombreIgual: false,
    correoIgual: false,
  });
  const [botonPresionado, setBotonPresionado] = useState(false);

  // Manejar cambios en los inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setError({
      ...error,
      [name]: false,
    });
  };

  const handleClick = async () => {
    setBotonPresionado(true);
    const comprobarNombre =
      formData.nombre.length === 0 || formData.nombre.length > 30
        ? false
        : await obtenerUsuarioNombre(formData.nombre);

    const comprobarCorreoBD =
      formData.correo.length === 0 ||
      !verificarCorreo(formData.correo) ||
      formData.correo.length > 64
        ? false
        : await obtenerUsuariosCorreo(formData.correo);

    const comprobacionError = {
      nombre: formData.nombre.length === 0 || formData.nombre.length > 30,
      correo:
        formData.correo.length === 0 ||
        !verificarCorreo(formData.correo) ||
        formData.correo.length > 64,
      perfil: formData.perfil == null || formData.perfil < 1,
      nombreIgual: comprobarNombre,
      correoIgual: comprobarCorreoBD,
    };

    setError(comprobacionError);
    const comprobacion = verificarError(comprobacionError);

    if (!comprobacion) {
      const resultado = await crearUsuario(formData);
      if(resultado){
        navigate("/inicio/usuarios", {state:{mensaje: "Usuario creado con éxito"}})
      }
    }
    setBotonPresionado(false);
  };

    return (
      <>
        <Navegador />
        <Contenedor>
          <>
            <h3>Crear Usuario</h3>
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
                    ? "no este vacío"
                    : formData.nombre.length > 30
                    ? "supera la longitud maxima (30 caracteres)"
                    : error.nombreIgual
                    ? "no sea igual al de otro usuario"
                    : null}
                  .
                </Form.Text>
              )}
            </Form.Group>
            <Form.Group>
              <Form.Label>Correo</Form.Label>
              <Form.Control
                type="email"
                placeholder="Ingrese el correo del usuario"
                name="correo"
                onChange={handleChange}
                value={formData.correo}
                isInvalid={error.correo || error.correoIgual}
              />
              {(error.correo || error.correoIgual) && (
                <Form.Text className="text-danger">
                  Revise que el correo{" "}
                  {formData.correo.length === 0
                    ? "no este vacio"
                    : !verificarCorreo(formData.correo)
                    ? "sea valido"
                    : formData.correo.length > 64
                    ? "supera la longitud maxima (64 caracteres)"
                    : error.correoIgual
                    ? "no sea igual al de otro usuario"
                    : null}
                  .
                </Form.Text>
              )}
            </Form.Group>
            <hr />
            <h4>Perfiles</h4>
            <Form.Group>
              {perfiles.map((item, key) => (
                <Form.Check
                  key={key}
                  type="radio"
                  name="perfil"
                  label={item.nombre}
                  value={item.id_perfil}
                  checked={item.id_perfil == formData.perfil}
                  onChange={handleChange}
                />
              ))}
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
                navigate("/inicio/usuarios");
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
  
}
