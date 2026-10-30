import React, { useState } from "react";
import Contenedor from "../../components/Contenedor";
import Footer from "../../components/Footer";
import Navegador from "../../components/Navegador";
import { Button, Form } from "react-bootstrap";
import { useLoaderData, useNavigate, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faXmark } from "@fortawesome/free-solid-svg-icons";
import { verificarError } from "../../utils/funciones";
import { actualizarIncidencia } from "../../services/informes";

export default function ModificarIncidencia() {
  const { incidencia } = useLoaderData();
  const { id_incidencia } = useParams();

  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    descripcion: incidencia.descripcion,
    gravedad: incidencia.gravedad,
  });
  const [error, setError] = useState({
    descripcion: false,
    gravedad: false,
  });
  const [botonPresionado, setBotonPresionado] = useState(false);

  // Manejar cambios en los inputs

  const handleClick = async () => {
    setBotonPresionado(true);
    const comprobacionError = {
      descripcion: formData.descripcion.length === 0,
    };

    setError(comprobacionError);
    const comprobacion = verificarError(comprobacionError);

    if (!comprobacion) {
      const resultado = await actualizarIncidencia(id_incidencia, formData);
      if (resultado) {
        navigate(`/inicio/proyecto/lider/${proyecto.id_proyecto}/monitoreo/incidencias`, {
          state: { mensaje: "Incidencia modificada con éxito" },
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
          <h3>Actualizar Incidencia</h3>
          <p>
            Complete los campos a continuaci&oacute;n. Luego, presione el
            bot&oacute;n <b>Confirmar</b>.<br />
            Si desea cancelar, presione el bot&oacute;n <b>Cancelar</b>.
          </p>
        </>
        <Form>
          <h4>Propiedades</h4>
          <Form.Group>
            <Form.Label>Descripci&oacute;n</Form.Label>
            <Form.Control
              type="text"
              onChange={handleChange}
              placeholder="Ingrese la descripción de la incidencia"
              name="descripcion"
              value={formData.descripcion}
              isInvalid={error.descripcion || error.descripcionIgual}
            />
            {(error.descripcion || error.descripcionIgual) && (
              <Form.Text className="text-danger">
                Revise que la descripci&oacute;n{" "}
                {formData.descripcion.length === 0
                  ? "no este vacia"
                  : null}
                .
              </Form.Text>
            )}
          </Form.Group>
          <Form.Group>
            <Form.Label>Gravedad</Form.Label>
            <Form.Select
              name="gravedad"
              value={formData.gravedad}
              onChange={handleChangeSelect}
              isInvalid={errorPrincipal.gravedad}
            >
              <option value={""}>Seleccione la gravedad de la incidencia</option>
              <option value={"baja"}>Baja</option>
              <option value={"intermedia"}>Intermedia</option>
              <option value={"alta"}>Alta</option>
            </Form.Select>
            {errorPrincipal.gravedad && (
              <Form.Text className="text-danger">
                Seleccione la gravedad de la incidencia.
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
              navigate(`/inicio/proyecto/lider/${proyecto.id_proyecto}/monitoreo/incidencias`);
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
