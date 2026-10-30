import React, { useState } from "react";
import Contenedor from "../../components/Contenedor";
import Footer from "../../components/Footer";
import Navegador from "../../components/Navegador";
import { Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faXmark } from "@fortawesome/free-solid-svg-icons";
import { verificarError } from "../../utils/funciones";
import { crearCategoria, obtenerCategoriaNombre } from "../../services/categorias";

export default function CrearCategoria() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
  });
  const [error, setError] = useState({
    nombre: false,
    descripcion: false,
    nombreIgual: false,
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
      nombreIgual: false
    });
  };

  const handleClick = async () => {
    setBotonPresionado(true);    
    const comprobarNombre =
      formData.nombre.length === 0 || formData.nombre.length > 30
        ? false
        : await obtenerCategoriaNombre(formData.nombre);

    const comprobacionError = {
      nombre: formData.nombre.length === 0 || formData.nombre.length > 30,
      descripcion: formData.descripcion.length === 0,
      nombreIgual: comprobarNombre,
    };

    setError(comprobacionError);
    const comprobacion = verificarError(comprobacionError);

    if (!comprobacion) {
      const resultado = await crearCategoria(formData);
      if (resultado) {
        navigate("/inicio/categorias", {
          state: { mensaje: "Categoria creada con éxito" },
        });
      }
    }
    setBotonPresionado(false);
  };

    return (
      <>
        <Navegador />
        <Contenedor>
          <>
            <h3>Crear Categoría</h3>
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
                placeholder="Ingrese el nombre de la categoría"
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
                    ? "no sea igual al de otra categoría"
                    : null}
                  .
                </Form.Text>
              )}
            </Form.Group>
            <Form.Group>
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingrese la descripción de la categoría"
                name="descripcion"
                onChange={handleChange}
                value={formData.descripcion}
                isInvalid={error.descripcion || error.descripcionIgual}
              />
              {(error.descripcion || error.descripcionIgual) && (
                <Form.Text className="text-danger">
                  Revise que la descripción{" "}
                  {formData.descripcion.length === 0
                    ? "no este vacio"
                    : null}
                  .
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
                navigate("/inicio/categorias");
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
